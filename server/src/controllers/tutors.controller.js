import { supabase } from "../config/supabase.js";
import { rekognition } from "../config/aws.js";

export const signup = async (req, res, next) => {
    try {
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
            console.error('Rekognition error:', err);
            return res.status(500).json({ error: 'Error comparing faces.' });
        }
        const match = data.FaceMatches && data.FaceMatches.length > 0;
        console.log('Face comparison result:', match);
        if (!match) {
            return res.status(400).json({ error: 'La imagen de la cédula y la selfie subida no coinciden' });
        }
        const { name, last_name, email, profile_type, academic_level, subject_teach, institution, occupation, hourly_fee, supabase_user_id } = req.body;

        const { data: newTutor, error: insertErr } = await supabase
        .from('users')
        .insert({
            name,
            last_name,
            email,
            profile_type,
            academic_level,
            institution,
            occupation,
            hourly_fee,
            supabase_user_id
        })
        .select('user_id')
        .maybeSingle();
        if (insertErr) {
            return res.status(500).json({ error: insertErr.message });
        }
        const userId = newTutor.user_id;

        const teachTopics = Array.isArray(JSON.parse(subject_teach)) ? JSON.parse(subject_teach) : [];
        if (teachTopics.length > 0) {
            const teachRows = teachTopics.map(topic => ({ user_id: userId, topic_id: topic.value, type: 'teaches' }));
            const { error: teachErr } = await supabase.from('user_topics').insert(teachRows);
            if (teachErr) return res.status(500).json({ error: teachErr.message });
        }
        res.send("Usuario registrado exitosamente");
    });
    } catch (error) {
        next(error);
    }
}

export const saveOrUpdate = async (req, res, next) => {
    try {
        const { name, last_name, institution, full_description, short_description, hourly_fee, occupation, academic_level, teached_topics, user_id, file_path} = req.body;
        const file = req.file;

        const { data: updatedUser, error: updateErr } = await supabase.from('users')
        .update({ name, last_name, institution, full_description, short_description,  hourly_fee, occupation, academic_level
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
        JSON.parse(teached_topics || '[]').forEach(id =>
        topicUpdates.push({ user_id, topic_id: id, type: 'teaches' })
        );
        if (topicUpdates.length) {
        const { error: topicErr } = await supabase.from('user_topics').insert(topicUpdates);
        if (topicErr) throw topicErr;
        }
    
        const scheduleObj = JSON.parse(req.body.schedule || "{}");
        await supabase.from('tutor_availability').delete().eq('tutor_id', user_id);

        const availUpdates = [];
        for (const [day, times] of Object.entries(scheduleObj)) {
        if (times && times.from && times.to) {
            availUpdates.push({
            tutor_id: user_id,
            day_of_week: day,
            start_time: times.from + ":00",  
            end_time:   times.to   + ":00"
            });
        }
        }

        if (availUpdates.length) {
        const { error: availErr } = await supabase.from('tutor_availability').insert(availUpdates);
        if (availErr) throw availErr;
        }
        res.json(updatedUser);
    }
    catch (error) {
        next(error);
    }
}