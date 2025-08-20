import { supabase } from "../config/supabase";

export const makeTutorshipRequest = async (req, res, next) => {
    try {
        const { tutorshipRequestDetails } = req.body;
        const {
        student_id,
        tutor_id,
        tutorship_subject,
        tutorship_topic,
        tutorship_mode,
        tutorship_hour,
        tutorship_day,
        tutorship_request_message
        } = tutorshipRequestDetails;

        console.log("detalles de la solicitud: " + student_id, tutor_id, tutorship_subject, tutorship_topic, tutorship_mode, tutorship_hour, tutorship_day, tutorship_request_message);
        const { data: newTutorshipRequest, error: insertErr } = await supabase
        .from('tutorship_requests')
        .insert({tutor_id, student_id, tutorship_mode, tutorship_subject, tutorship_topic, tutorship_mode, tutorship_hour, tutorship_day, tutorship_request_message})
        .select('tutorship_request_id')
        .single();

        if (insertErr) {
        console.error("Error insertando solicitud:", insertErr);
        return res.status(500).json({ error: insertErr.message });
        }

        res.status(201).json({ message: "Solicitud enviada con éxito" });
    }
    catch(error){
        next(error);
    }
}

export const getTutorshipRequests = async (req, res, next) => {
    try {
        const tutorId = parseInt(req.query.tutor_id, 10);

        const { data: requests, error } = await supabase
        .from('tutorship_requests')
        .select(`
            *, 
            student:users!tutorship_requests_student_id_fkey (
            user_id,
            profile_image_url
            )
        `)
        .eq('tutor_id', tutorId)
        .eq('status', 'pending');

        if (error) throw error;

        const enriched = requests.map(r => {
        const stu = r.student;
        let avatarUrl;
        if (stu.profile_image_url && /^https?:\/\//.test(stu.profile_image_url)) {
            avatarUrl = stu.profile_image_url;
        } else {
            const { data: { publicUrl } } = supabase.storage.from('profile.images')
            .getPublicUrl(stu.profile_image_url || `user_${stu.user_id}.jpg`);
            avatarUrl = publicUrl + `?t=${Date.now()}`;
        }
        return {
            ...r,
            student_avatar: avatarUrl
        };
        });

        res.json({ requests: enriched });
    } catch (err) {
        next(err);
    }
}

export const getTutorshipRequestStatus = async (req, res) => {
    const { data, error } = await supabase.from('tutorship_requests').select('student_closed, tutor_closed')
    .eq('tutorship_request_id', req.params.id).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
}

export const cancelTutorshipRequest = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!id) return res.status(400).json({ error: "ID inválido" });

        const { error } = await supabase
        .from('tutorship_requests').delete().eq('tutorship_request_id', id);

        if (error) throw error;
        res.json({ message: "Solicitud cancelada correctamente" });
    } catch (err) {
        next(err);
    }
}

export const acceptTutorshipRequest = async (req, res) => {
    await supabase
        .from('tutorship_requests')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('tutorship_request_id', req.params.id);
    res.sendStatus(200);
}

export const rejectTutorshipRequest = async (req, res) => {
    await supabase
        .from('tutorship_requests')
        .update({ status: 'rejected' })
        .eq('tutorship_request_id', req.params.id);
    res.sendStatus(200);
}

export const closeTutorship = async (req, res) => {
    const { by } = req.body; 
    const field = by === 'student' ? 'student_closed' : 'tutor_closed';
    await supabase
        .from('tutorship_requests')
        .update({ [field]: true })
        .eq('tutorship_request_id', req.params.id);

    const { data: row } = await supabase
        .from('tutorship_requests')
        .select('student_closed,tutor_closed')
        .eq('tutorship_request_id', req.params.id)
        .single();
    if (row.student_closed && row.tutor_closed) {
    await supabase
        .from('tutorship_requests')
        .update({ status: 'finished' })
        .eq('tutorship_request_id', req.params.id);
    }

    res.sendStatus(200);
}

export const rateTutorship = async (req, res) => {
    const { rater_id, ratee_id, rating, comment } = req.body;
    const { data } = await supabase
        .from('session_ratings')
        .insert({ tutorship_request_id: req.params.id, rater_id, ratee_id, rating, comment })
        .single();
    res.json({ rating: data });
}

export const readMessage = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;
    const { user_role } = req.body;
    const col = user_role === 'student' ? 'student_last_read_at' : 'tutor_last_read_at';
    const { error } = await supabase.from("tutorship_requests")
        .update({ [col]: new Date().toISOString() }).eq("tutorship_request_id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.sendStatus(204);
}

