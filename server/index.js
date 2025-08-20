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
import tutorshipRoutes from "./src/routes/tutorships.routes.js" 

const PORT = ENV.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", studentsRoutes);
app.use("/api", tutorRoutes);
app.use("/api", paymentsRoutes);
app.use("/api", tutorshipRoutes);

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
