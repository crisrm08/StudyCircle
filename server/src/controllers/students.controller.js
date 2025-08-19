import { supabase } from "../config/supabase.js";
import { rekognition } from "../config/aws.js";

export const signup = async (req, res, next) => {
    try {
    console.log("Signup request recibido");
    const idPhotoFile = req.files['id_photo']?.[0];
    const selfiePhotoFile = req.files['selfie_photo']?.[0];

    if (!idPhotoFile || !selfiePhotoFile) {
        console.error("Missing image files", { idPhotoFile, selfiePhotoFile });
        return res.status(400).json({ error: "Both ID and selfie photos are required." });
    }

    const params = {
        SourceImage: { Bytes: idPhotoFile.buffer },
        TargetImage: { Bytes: selfiePhotoFile.buffer },
        SimilarityThreshold: 90
    };

    rekognition.compareFaces(params, async (err, data) => {
        if (err) {
            console.error('Error de AWS Rekognition:', err);
            return res.status(500).json({ error: 'Error comparing faces', details: err.message });
        }

        const match = data.FaceMatches && data.FaceMatches.length > 0;
        console.log('Face comparison result:', match);

        if (!match) {
            return res.status(400).json({ error: 'Las imágenes no coinciden.' });
        }

        const { name, last_name, email, profile_type, career, subject_weak, subject_strong, institution, year, supabase_user_id } = req.body;

        console.log("Form data received:", {
            name, last_name, email, profile_type, career, institution, year, supabase_user_id
        });

        const { data: newStudent, error: insertErr } = await supabase
        .from('users')
        .insert({
            name,
            last_name,
            email,
            profile_type,
            career,
            institution,
            year_of_enrollment: year,
            supabase_user_id
        })
        .select('user_id')
        .maybeSingle();

        if (insertErr) {
            console.error("Error insertando user:", insertErr);
            return res.status(500).json({ error: insertErr.message });
        }

        const userId = newStudent.user_id;
        console.log("User inserted with ID:", userId);

        let weakTopics;
        try {
            weakTopics = JSON.parse(subject_weak);
        } catch (e) {
            console.error("Error parsing subject_weak:", e);
            return res.status(400).json({ error: "Invalid subject_weak format" });
        }

        if (Array.isArray(weakTopics) && weakTopics.length > 0) {
        const weakRows = weakTopics.map(topic => ({ user_id: userId, topic_id: topic.value, type: 'weak' }));
        const { error: weakErr } = await supabase.from('user_topics').insert(weakRows);
        if (weakErr) {
            console.error("Error inserting weak topics:", weakErr);
            return res.status(500).json({ error: weakErr.message });
        }
        console.log("Weak topics inserted");
        }

        let strongTopics;
        try {
            strongTopics = JSON.parse(subject_strong);
        } catch (e) {
            console.error("Error parsing subject_strong:", e);
            return res.status(400).json({ error: "Invalid subject_strong format" });
        }

        if (Array.isArray(strongTopics) && strongTopics.length > 0) {
        const strongRows = strongTopics.map(topic => ({ user_id: userId, topic_id: topic.value, type: 'strong' }));
        const { error: strongErr } = await supabase.from('user_topics').insert(strongRows);
        if (strongErr) {
            console.error("Error inserting strong topics:", strongErr);
            return res.status(500).json({ error: strongErr.message });
        }
        console.log("Strong topics inserted");
        }

        console.log("Signup completed for user:", email);
        res.send("Usuario registrado exitosamente");
    });
    } catch (err) {
        next(err);
    }
}

export const saveOrUpdate = async (req, res, next) => {
    try {
        const { name, last_name, institution, career, full_description, short_description, strong_topics, weak_topics, user_id, file_path } = req.body;
        const file = req.file;

        const { data: updatedUser, error: updateErr } = await supabase.from('users')
        .update({name, last_name, institution, career, full_description, short_description
        }).eq('user_id', user_id).select('*').maybeSingle();

        if (updateErr) {
            console.error("Error updating user:", updateErr);
            return res.status(500).json({ error: updateErr.message });
        }

        const path = file_path || `user_${user_id}.jpg`;
        if (file) {
        const { error: storageErr } = await supabase.storage.from('profile.images').upload(path,file.buffer,{ upsert: true, contentType: file.mimetype });
        if (storageErr) throw storageErr;
        }

        await supabase.from('user_topics').delete().eq('user_id', user_id);
        const topicUpdates = [];
        JSON.parse(strong_topics || '[]').forEach(id =>
        topicUpdates.push({ user_id, topic_id: id, type: 'strong' })
        );
        JSON.parse(weak_topics || '[]').forEach(id =>
        topicUpdates.push({ user_id, topic_id: id, type: 'weak' })
        );
        if (topicUpdates.length) {
        const { error: topicErr } = await supabase.from('user_topics').insert(topicUpdates);
        if (topicErr) throw topicErr;
        }

        res.json(updatedUser);
    } catch (err) {
        next(err);
    }
}

export const getStudentById = async (req, res, next) => {
    try {
        const student_id = parseInt(req.params.id, 10);
        if (!student_id) return res.status(400).json({ error: "student_id inválido" });

        const { data: user, error: userErr } = await supabase.from('users')
        .select(`user_id, name, last_name, institution, career, short_description, full_description, rating_avg, report_count, profile_image_url`)
        .eq('profile_type','student').eq('user_id', student_id).maybeSingle();
        if (userErr) throw userErr;
        if (!user) return res.status(404).json({ error: "Estudiante no encontrado" });

        const { data: topics, error: topicsErr } = await supabase
        .from('user_topics').select('topic_id, type').eq('user_id', student_id);
        if (topicsErr) throw topicsErr;

        const strongIds = topics.filter(t => t.type === 'strong').map(t => t.topic_id);
        const weakIds   = topics.filter(t => t.type === 'weak').map(t => t.topic_id);
    
        const { data: topicList } = await supabase.from('topics').select('topic_id, topic_name').in('topic_id', [...strongIds, ...weakIds]);
        const nameMap = Object.fromEntries(topicList.map(t => [t.topic_id, t.topic_name]));

        const strengths = strongIds.map(id => nameMap[id]).filter(Boolean);
        const weaknesses = weakIds.map(id => nameMap[id]).filter(Boolean);

        let imageUrl;
        if (user.profile_image_url && /^https?:\/\//.test(user.profile_image_url)) {
        imageUrl = user.profile_image_url;
        } else {
        const { data: { publicUrl } } = supabase.storage.from('profile.images')
        .getPublicUrl(user.profile_image_url || `user_${student_id}.jpg`);
        imageUrl = publicUrl + `?t=${Date.now()}`;
        }

        res.json({
        student: {
            id: user.user_id,
            name: user.name,
            last_name: user.last_name,
            institution: user.institution,
            degree: user.career,      
            strengths,
            weaknesses,
            rating: user.rating_avg,
            description: user.full_description,
            reports: user.report_count,
            image: imageUrl
        }
        });
    } catch (err) {
        next(err);
    }
}