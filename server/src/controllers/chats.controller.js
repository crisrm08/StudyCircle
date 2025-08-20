import { supabase } from "../config/supabase";

export const getActiveTutorships = async (req, res) => {
   const userId = parseInt(req.query.user_id,10);

    // 1) Traer todas las solicitudes activas (≠ 'finished'):
    const { data: requests } = await supabase
        .from('tutorship_requests')
        .select('*')
        .or(`tutor_id.eq.${userId},student_id.eq.${userId}`)

    const previews = await Promise.all(
        requests.map(async r => {
        const otherId = r.student_id === userId ? r.tutor_id : r.student_id;
        // a) Datos del otro usuario
        const { data: other } = await supabase
            .from('users')
            .select('user_id, name, last_name, profile_image_url')
            .eq('user_id', otherId)
            .maybeSingle();
        // b) URL de su avatar (bucket o externo)
        let avatarUrl;
        if (other.profile_image_url?.startsWith('http')) {
            avatarUrl = other.profile_image_url;
        } else {
            const { data: { publicUrl } } = supabase
            .storage
            .from('profile.images')
            .getPublicUrl(
                other.profile_image_url || `user_${other.user_id}.jpg`
            );
            avatarUrl = publicUrl + `?t=${Date.now()}`;
        }
        // c) Último mensaje
        const { data: lastMsgs } = await supabase
            .from('chat_messages')
            .select('content, created_at')
            .eq('tutorship_request_id', r.tutorship_request_id)
            .order('created_at', { ascending: false })
            .limit(1);
        const lastMessage = lastMsgs.length ? lastMsgs[0].content : null;
        const lastMessageCreatedAt = lastMsgs.length ? lastMsgs[0].created_at : null;

        // d) Revisar si ha calificado
        const { count, error: err2 } = await supabase.from('session_ratings').select('*', { count: 'exact' })
            .eq('tutorship_request_id', r.tutorship_request_id).eq('rater_id', userId);
        if (err2) return res.status(500).json({ error: err2.message });

        // e) Revisar si hay mensaje nuevo
        const lastReadAt = r.student_id === userId? r.student_last_read_at : r.tutor_last_read_at;
        const hasNewMessage = lastMessageCreatedAt && (!lastReadAt || new Date(lastMessageCreatedAt) > new Date(lastReadAt));

        return {
            id:           r.tutorship_request_id,
            status:       r.status,
            subject:      r.tutorship_subject,
            topic:        r.tutorship_topic,
            mode:         r.tutorship_mode,
            otherUser: {
            userId: other.user_id,
            name:   `${other.name} ${other.last_name}`.trim(),
            avatar: avatarUrl
            },
            hasNewMessage,
            lastMessage,
            hasRated: count > 0  
        };
        })
    );

    res.json({ chats: previews });
}

export const getChatMessages = async (req, res) => {
    const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('tutorship_request_id', req.params.id)
        .order('created_at', { ascending: true });
    res.json({ messages });
}

export const sendMessage = async (req, res) => {
    const { sender_id, content } = req.body;
    const reqId = parseInt(req.params.id,10);

    const { data: reqRow } = await supabase
        .from('tutorship_requests').select('status,tutor_id').eq('tutorship_request_id', reqId)
        .maybeSingle();

    if (reqRow.status === 'pending' && reqRow.tutor_id === sender_id) {
        await supabase.from('tutorship_requests').update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('tutorship_request_id', reqId);
    }

    const { data: msg, error: msgErr } = await supabase
        .from('chat_messages')
        .insert({ tutorship_request_id: reqId, sender_id, content })
        .select('*')          
        .single();

    if (msgErr || !msg) {
        console.error("Error inserting message:", msgErr);
        return res.status(500).json({ error: msgErr?.message || "No message returned" });
    }
    res.json({ message: msg });
}
