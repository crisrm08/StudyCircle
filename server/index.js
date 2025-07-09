import express from 'express'; 
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";
import AWS from 'aws-sdk';
import multer from 'multer';
import jwt from "jsonwebtoken";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const rekognition = new AWS.Rekognition();
const app = express();
const PORT = 5000;
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

app.use(cors());
app.use(express.json());

app.post("/api/login", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).send({ error: "No auth header" });
    const token = auth.replace("Bearer ", "");

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr) return res.status(401).send({ error: authErr.message });

    const { data: profile, error: profErr } = await supabase
      .from("users")
      .select("*")
      .eq("supabase_user_id", user.id)
      .maybeSingle();
    if (profErr) return res.status(500).send({ error: profErr.message });
    if (!profile) return res.status(404).send({ error: "Perfil no encontrado" });

    res.json(profile);

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error interno" });
  }
});

app.get('/api/check-email', async (req, res) => {
  const { email } = req.query;
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const exists = data.users.some(user => user.email === email);
  return res.json({ exists });
});

app.post('/user-link-supabase', async (req, res) => {
  const { email, supabase_user_id } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ supabase_user_id })
      .eq('email', email)
      .select('user_id')
      .maybeSingle();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando supabase_user_id:', error);
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
});

app.post('/student-signup', upload.fields([
  { name: 'id_photo', maxCount: 1 },
  { name: 'selfie_photo', maxCount: 1 }
]), async (req, res) => {
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
  } catch (error) {
    console.error('Error during signup (outer catch):', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.post('/student-save-update', upload.single("user_image"), async (req, res) => {
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
  } catch (error) {
    console.error('Error saving student update:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
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

app.post('/tutor-save-update', upload.single("user_image"), async (req, res) => {
  try {
    const { name, last_name, institution, full_description, short_description, occupation, academic_level, teached_topics, user_id, file_path} = req.body;
    const file = req.file;

    const { data: updatedUser, error: updateErr } = await supabase.from('users')
      .update({ name, last_name, institution, full_description, short_description, occupation, academic_level
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
     console.error('Error saving tutor update:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.post('/tutor-signup', upload.fields([
  { name: 'id_photo', maxCount: 1 },
  { name: 'selfie_photo', maxCount: 1 }
]), async (req, res) => {
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
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/subjects-topics', async (req, res) => {
  try {
    const { data: subjects, error: subjErr } = await supabase.from('subjects').select('*');
    if (subjErr) return res.status(500).json({ error: subjErr.message });
    const formattedSubjects = subjects.map(subject => ({
      id: subject.subject_id,
      name: subject.subject_name
    }));
    const { data: topics, error: topErr } = await supabase.from('topics').select('*');
    if (topErr) return res.status(500).json({ error: topErr.message });
    const topicsBySubject = {};
    topics.forEach(topic => {
      if (!topicsBySubject[topic.subject_id]) topicsBySubject[topic.subject_id] = [];
      topicsBySubject[topic.subject_id].push({
        id: topic.topic_id,
        name: topic.topic_name
      });
    });
    const subjectsWithTopics = formattedSubjects.map(subject => ({
      ...subject,
      topics: topicsBySubject[subject.id] || []
    }));
    res.json(subjectsWithTopics);
  } catch (error) {
    console.error('Error fetching subjects: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user-topics', async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const { data, error } = await supabase
      .from('user_topics')
      .select('type, topics(topic_name)')
      .eq('user_id', user_id);

    if (error) {
      console.error("Error fetching user topics:", error);
      return res.status(500).json({ error: error.message });
    }

    const result = { weak: [], strong: [], teaches: []};

    data.forEach(d => {
      if (d.type === 'weak' && d.topics) result.weak.push(d.topics.topic_name);
      if (d.type === 'strong' && d.topics) result.strong.push(d.topics.topic_name);
      if (d.type === 'teaches' && d.topics) result.teaches.push(d.topics.topic_name);
    });
    res.json(result);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/ocupations-academic-levels', async (req, res) => {
  try {
    const { data: ocupations, error: occErr } = await supabase.from('ocupations').select('*');
    if (occErr) return res.status(500).json({ error: occErr.message });
    const { data: academicLevels, error: lvlErr } = await supabase.from('academic_levels').select('*');
    if (lvlErr) return res.status(500).json({ error: lvlErr.message });
    const formattedOcupations = ocupations.map(ocupation => ({
      value: ocupation.ocupation_id,
      label: ocupation.ocupation_name
    }));
    const formattedAcademicLevels = academicLevels.map(level => ({
      value: level.academic_level_id,
      label: level.academic_level_name
    }));
    res.json({ ocupations: formattedOcupations, academicLevels: formattedAcademicLevels });
  } catch (error) {
    console.error('Error fetching ocupations or academic levels: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/careers', async (req, res) => {
  try {
    const { data: careers, error: carErr } = await supabase.from('careers').select('*');
    if (carErr) return res.status(500).json({ error: carErr.message });
    const formattedCareers = careers.map(career => ({
      id: career.career_id,
      name: career.career_name
    }));
    res.json(formattedCareers);
  } catch (error) {
    console.error('Error fetching careers: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
