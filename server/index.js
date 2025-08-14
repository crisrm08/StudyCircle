import express from 'express'; 
import cors from 'cors';
import { ENV } from "./src/config/env.js";
import { supabase } from "./src/config/supabase.js";
import { upload } from "./src/config/multer.js";
import authRoutes from "./src/routes/auth.routes.js";
import catalogRoutes from "./src/routes/catalog.routes.js";
import studentsRoutes from "./src/routes/students.routes.js";
import tutorRoutes from "./src/routes/tutors.routes.js";

const PORT = ENV.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", studentsRoutes);
app.use("/api", tutorRoutes);

app.post('/student-payment-methods/:id', async (req, res) => {
  const studentId = req.params.id;
  const { card_number, card_holder, expiration_date, security_code, paypal_email } = req.body;

  const { data, error } = await supabase.from('student_payment_methods').upsert({
    student_id: studentId,
    card_number,
    card_holder,
    expiration_date,
    security_code,
    paypal_email
  });

  if (error) {
    console.error("Error saving student payment method:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get('/student-payment-methods/:id', async (req, res) => {
  const studentId = req.params.id;

  const { data, error } = await supabase.from('student_payment_methods').select('*').eq('student_id', studentId).maybeSingle();

  if (error) {
    console.error("Error fetching student payment method:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/tutor-cashing-methods/:id', async (req, res) => {
  const tutorId = req.params.id;
  const { bank_name, account_holder, account_number, account_type, paypal_email } = req.body;

  console.log(bank_name, account_holder, account_number, account_type, paypal_email);

  const { data: existing, error: findErr } = await supabase.from('tutor_cashing_methods').select('*').eq('tutor_id', tutorId).maybeSingle();  
  if (findErr) {
    console.error("Error finding existing cashing methods:", findErr);
    return res.status(500).json({ error: findErr.message });
  }

  if (existing) {
    const { data, error } = await supabase.from('tutor_cashing_methods').update({
      bank_name,
      account_holder,
      account_number,
      account_type,
      paypal_email
    }).eq('tutor_id', tutorId);

    if (error) {
      console.error("Error updating tutor cashing methods:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: "Cashing methods updated successfully", data });
  }
  else {
    const { data, error } = await supabase.from('tutor_cashing_methods').insert({
      tutor_id: tutorId,
      bank_name,
      account_holder,
      account_number,
      account_type,
      paypal_email
    });
    if (error) {
      console.error("Error inserting tutor cashing methods:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: "Cashing methods created successfully", data });
  }
});

app.get('/tutor-cashing-methods/:id', async (req, res) => {
  const tutorId = req.params.id;

  const { data, error } = await supabase.from('tutor_cashing_methods').select('*').eq('tutor_id', tutorId).maybeSingle();

  if (error) {
    console.error("Error fetching tutor cashing methods:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get('/tutor-availability', async (req, res) => {
  try {
    const tutor_id = parseInt(req.query.tutor_id, 10);
    if (!tutor_id) return res.status(400).json({ error: "tutor_id requerido" });

    const { data, error } = await supabase.from('tutor_availability').select('day_of_week, start_time, end_time').eq('tutor_id', tutor_id);

    if (error) throw error;

    res.json({ availability: data });  
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/tutors', async (req, res) => {
  try {
    const { topic, day, hour } = req.query;
    let tutorIds = null;

    // — 1. Filtrar por tópico, si viene
    if (topic) {
      // 1a. Busca el topic_id
      const { data: topicRec, error: topicErr } = await supabase
        .from('topics').select('topic_id').eq('topic_name', topic).maybeSingle();
      if (topicErr) throw topicErr;
      if (!topicRec) return res.json({ tutors: [] });

      // 1b. Lista de tutores que enseñan ese topic
      const { data: uts } = await supabase
        .from('user_topics').select('user_id').eq('type', 'teaches').eq('topic_id', topicRec.topic_id);
      const ids = uts.map(u => u.user_id);
      if (ids.length === 0) return res.json({ tutors: [] });
      tutorIds = ids;
    }

    // — 2. Filtrar por disponibilidad, si viene day/hour
    if (day || hour) {
      let availQ = supabase.from('tutor_availability').select('tutor_id');
      if (day)  availQ = availQ.eq('day_of_week', day);
      if (hour) {
        const time = `${hour.padStart(2,'0')}:00:00`;
        availQ = availQ.lte('start_time', time).gte('end_time', time);
      }
      const { data: avails } = await availQ;
      const availIds = avails.map(a => a.tutor_id);
      if (tutorIds) {
        tutorIds = tutorIds.filter(id => availIds.includes(id));
      } else {
        tutorIds = availIds;
      }
      if (tutorIds.length === 0) return res.json({ tutors: [] });
    }

    // — 3. Consulta base de datos de tutores
    let usersQ = supabase
      .from('users').select(`user_id, name, last_name, occupation, short_description, hourly_fee, rating_avg, profile_image_url`)
      .eq('profile_type','tutor');
    if (tutorIds) usersQ = usersQ.in('user_id', tutorIds);

    const { data: tutors, error: usersErr } = await usersQ;
    if (usersErr) throw usersErr;

    // — 4. Traducir occupation_id → ocupation_name
    // Obtén el set único de IDs (numéricos)
    const occIds = [...new Set(tutors.map(t => parseInt(t.occupation, 10)).filter(n => !isNaN(n)))];
    let occMap = {};
    if (occIds.length) {
      const { data: occList } = await supabase
        .from('ocupations').select('ocupation_id, ocupation_name').in('ocupation_id', occIds);
      occMap = Object.fromEntries(
        occList.map(o => [o.ocupation_id, o.ocupation_name])
      );
    }

    // — 5. Armar el array final, con nombre de ocupación
    const result = tutors.map(t => {
      // 1) Si profile_image_url es un URL absoluto (dummy), úsalo tal cual
      let imageUrl;
      if (t.profile_image_url && /^https?:\/\//.test(t.profile_image_url)) {
        imageUrl = t.profile_image_url;
      } else {
        // 2) Si no, cae al bucket de Supabase
        const { data: { publicUrl }} = supabase.storage
          .from('profile.images').getPublicUrl(
            t.profile_image_url || `user_${t.user_id}.jpg`
          );
        imageUrl = publicUrl + `?t=${Date.now()}`;
      }

      return {
        id:           t.user_id,
        name:         `${t.name} ${t.last_name}`.trim(),
        occupation:   occMap[parseInt(t.occupation, 10)] || null,
        description:  t.short_description,
        pricePerHour: t.hourly_fee,
        rating:       t.rating_avg,
        image:        imageUrl,
        specialties:  [] 
      };
    });

    // 5. Obtener specialties (user_topics → topics)
    const tutorIdsFinal = result.map(t => t.id);
    const { data: utsAll } = await supabase
      .from('user_topics').select('user_id, topic_id').eq('type', 'teaches').in('user_id', tutorIdsFinal);
    const topicIds = [...new Set(utsAll.map(u => u.topic_id))];
    const { data: topicList } = await supabase
      .from('topics').select('topic_id, topic_name').in('topic_id', topicIds);

    // 5b. Mapear specialties por tutor
    const specMap = {};
    utsAll.forEach(({ user_id, topic_id }) => {
      const name = topicList.find(t => t.topic_id === topic_id)?.topic_name;
      if (!specMap[user_id]) specMap[user_id] = [];
      if (name) specMap[user_id].push(name);
    });
    result.forEach(t => {
      t.specialties = specMap[t.id] || [];
    });

    res.json({ tutors: result });
  } catch (err) {
    console.error("Error en GET /tutors:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/tutors/:id', async (req, res) => {
  try {
    const tutor_id = parseInt(req.params.id, 10);
    if (!tutor_id) return res.status(400).json({ error: "tutor_id inválido" });

    const { data: user, error: userErr } = await supabase
      .from('users').select(`user_id, name, last_name, institution, occupation, academic_level, short_description, full_description, hourly_fee, rating_avg, report_count, profile_image_url`)
      .eq('profile_type','tutor').eq('user_id', tutor_id).maybeSingle();
    if (userErr) throw userErr;
    if (!user) return res.status(404).json({ error: "Tutor no encontrado" });

    const [{ data: [occ] = [] }, { data: [lvl] = [] }] = await Promise.all([
      supabase.from('ocupations').select('ocupation_name').eq('ocupation_id', user.occupation),
      supabase.from('academic_levels').select('academic_level_name').eq('academic_level_id', user.academic_level)
    ]);
    
    const { data: usertopics, error: userTopcisErr } = await supabase.from('user_topics').select('topic_id').eq('type','teaches').eq('user_id', tutor_id);
    if (userTopcisErr) throw userTopcisErr;

    const topicIds = usertopics.map(u => u.topic_id);
    const { data: topicList } = await supabase.from('topics').select('topic_name').in('topic_id', topicIds);

    const { data: avail } = await supabase.from('tutor_availability').select('day_of_week, start_time, end_time').eq('tutor_id', tutor_id);

    let imageUrl;
    if (user.profile_image_url && /^https?:\/\//.test(user.profile_image_url)) {
      imageUrl = user.profile_image_url;
    } else {
      const { data: { publicUrl } } = supabase.storage.from('profile.images').getPublicUrl(user.profile_image_url || `user_${tutor_id}.jpg`);
      imageUrl = publicUrl + `?t=${Date.now()}`;
    }

    res.json({
      tutor: {
        id: user.user_id,
        name: user.name,
        lastName: user.last_name,
        institution: user.institution,
        occupation: occ?.ocupation_name || null,
        academicLevel: lvl?.academic_level_name || null,
        shortDescription: user.short_description,
        fullDescription: user.full_description,
        pricePerHour: user.hourly_fee,
        rating: user.rating_avg,
        image: imageUrl,
        reports: user.report_count,
        specialties: topicList.map(t => t.topic_name),
        availability: avail.map(a => ({
          day:   a.day_of_week,
          from:  a.start_time.slice(0,5),
          to:    a.end_time.slice(0,5)
        }))
      }
    });
  } catch (err) {
    console.error("GET /tutors/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

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
