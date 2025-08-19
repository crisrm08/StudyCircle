import express from 'express'; 
import cors from 'cors';
import { ENV } from "./src/config/env.js";
import { supabase } from "./src/config/supabase.js";
import { upload } from "./src/config/multer.js";
import authRoutes from "./src/routes/auth.routes.js";
import catalogRoutes from "./src/routes/catalog.routes.js";
import studentsRoutes from "./src/routes/students.routes.js";
import tutorRoutes from "./src/routes/tutors.routes.js";
import paymentsRoutes from "./src/routes/payments.routes.js";  

const PORT = ENV.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", studentsRoutes);
app.use("/api", tutorRoutes);
app.use("/api", paymentsRoutes);


app.get('/students/:id', async (req, res) => {
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
    console.error("GET /students/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/tutorship/request', async (req, res) => {
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
    console.error('Error saving saving tutorship request:', error);
    res.status(500).json({ error: 'Server error saving tutorship request', details: error.message });
  }
});

app.get('/tutorship/requests', async (req, res) => {
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
    console.error("Error fetching tutorship requests:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/tutorship/requests/:id', async (req, res) => {
  const { data, error } = await supabase.from('tutorship_requests').select('student_closed, tutor_closed').
  eq('tutorship_request_id', req.params.id).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/tutorship/request/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const { error } = await supabase
      .from('tutorship_requests').delete().eq('tutorship_request_id', id);

    if (error) throw error;
    res.json({ message: "Solicitud rechazada correctamente" });
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/tutorship/requests/:id/accept', async (req, res) => {
  await supabase
    .from('tutorship_requests')
    .update({ status: 'accepted', accepted_at: new Date().toISOString() })
    .eq('tutorship_request_id', req.params.id);
  res.sendStatus(200);
});
 
app.patch('/tutorship/requests/:id/reject', async (req, res) => {
  await supabase
    .from('tutorship_requests')
    .update({ status: 'rejected' })
    .eq('tutorship_request_id', req.params.id);
  res.sendStatus(200);
});

app.get('/chats', async (req, res) => {
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
});

app.get('/chats/:id/messages', async (req, res) => {
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('tutorship_request_id', req.params.id)
    .order('created_at', { ascending: true });
  res.json({ messages });
});

app.post('/chats/:id/messages', async (req, res) => {
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
});

app.patch('/tutorship/requests/:id/close', async (req, res) => {
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
});

app.post('/tutorship/requests/:id/rate', async (req, res) => {
  const { rater_id, ratee_id, rating, comment } = req.body;
  const { data } = await supabase
    .from('session_ratings')
    .insert({ tutorship_request_id: req.params.id, rater_id, ratee_id, rating, comment })
    .single();
  res.json({ rating: data });
});

app.patch("/tutorship/requests/:id/read", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  const { user_role } = req.body;
  const col = user_role === 'student' ? 'student_last_read_at' : 'tutor_last_read_at';
  const { error } = await supabase.from("tutorship_requests")
    .update({ [col]: new Date().toISOString() }).eq("tutorship_request_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.sendStatus(204);
});

app.post('/user/report/:id',upload.array('evidence', 5),async (req, res) => {
    try {
      const reportedId = parseInt(req.params.id, 10);
      const { reporter_user_id, report_motive, report_description, tutorship_request_id } = req.body;

      const { data: report, error: insertErr } = await supabase.from('user_reports')
        .insert({ reported_user_id: reportedId, reporter_user_id,report_motive,report_description})
        .select()
        .single();
      if (insertErr) throw insertErr;

      const paths = [];
      for (const file of req.files) {
        const filePath = `tutorship_reported_${tutorship_request_id}/${reportedId}/${Date.now()}_${file.originalname}`;
        const { error: storageErr } = await supabase.storage.from('report.evidence')
          .upload(filePath, file.buffer, {upsert: true, contentType: file.mimetype});
        if (storageErr) throw storageErr;
        paths.push(filePath);
      }

      const { error: updateErr } = await supabase.from('user_reports')
        .update({ evidence_paths: paths }).eq('report_id', report.report_id);
      if (updateErr) throw updateErr;

      const { data: userRec } = await supabase.from('users')
      .select('report_count').eq('user_id', reportedId).single();
      const current = Number(userRec?.report_count) || 0;
      await supabase.from('users').update({ report_count: current + 1 }).eq('user_id', reportedId);

      res.json({ report, evidence: paths });
    } catch (err) {
      console.error('Error reporting user:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

app.get('/user/reports', async (req, res) => {
  const { data: reports, error } = await supabase
    .from('user_reports')
    .select(`report_id, reported_user_id, reporter_user_id,
             report_motive, report_description, evidence_paths`)
    .order('report_id', { ascending: true });
  if (error) throw error;

  const bucket = supabase.storage.from('report.evidence');
  const reportsWithUrls = reports.map(r => ({
    ...r,
    evidence: (r.evidence_paths || []).map(path => {
      const { data: { publicUrl } } = bucket.getPublicUrl(path);
      return publicUrl;
    })
  }));

  res.json(reportsWithUrls);
});

app.delete('/user/report/:id', async (req, res) => {
  const reportId = parseInt(req.params.id, 10);

  try {
    const { data: report, error: fetchErr } = await supabase.from('user_reports')
      .select('reported_user_id, evidence_paths').eq('report_id', reportId).single();
    if (fetchErr) throw fetchErr;
    if (!report) return res.status(404).json({ error: 'Reporte no encontrado' });

    const { reported_user_id, evidence_paths = [] } = report;
    if (evidence_paths.length > 0) {
      const { error: delErr } = await supabase.storage.from('report.evidence').remove(evidence_paths);
      if (delErr) {
        console.warn('No se pudieron borrar todas las evidencias:', delErr);
      }
    }

    const { error: deleteErr } = await supabase.from('user_reports').delete().eq('report_id', reportId);
    if (deleteErr) throw deleteErr;

    const { data: userRow, error: userFetchErr } = await supabase.from('users').select('report_count')
      .eq('user_id', reported_user_id).single();
    if (userFetchErr) throw userFetchErr;
    const newCount = Math.max(0, (userRow.report_count || 0) - 1);

    const { error: userUpdateErr } = await supabase.from('users').update({ report_count: newCount }).eq('user_id', reported_user_id);
    if (userUpdateErr) throw userUpdateErr;

    res.json({ message: 'Reporte descartado', newReportCount: newCount });
  } catch (err) {
    console.error('Error al descartar reporte:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/user/suspend/:id', async (req, res) => {
  const reportedUserId = parseInt(req.params.id, 10);
  try {
    const { error } = await supabase.from('users').update({ suspended: true }).eq('user_id', reportedUserId);

    if (error) throw error;
    console.log("suspended");
    
    res.json({ message: `Usuario ${reportedUserId} suspendido` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
