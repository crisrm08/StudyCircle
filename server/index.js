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
const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);
const upload = multer({ storage: multer.memoryStorage() });

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
    const idPhotoFile = req.files['id_photo']?.[0];
    const selfiePhotoFile = req.files['selfie_photo']?.[0];
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
      const { name, last_name, email, profile_type, career, subject_weak, subject_strong, institution, year, supabase_user_id } = req.body;
      // Insert user
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
        return res.status(500).json({ error: insertErr.message });
      }
      const userId = newStudent.user_id;
      // Insert weak topics
      const weakTopics = Array.isArray(JSON.parse(subject_weak)) ? JSON.parse(subject_weak) : [];
      if (weakTopics.length > 0) {
        const weakRows = weakTopics.map(topic => ({ user_id: userId, topic_id: topic.value, type: 'weak' }));
        const { error: weakErr } = await supabase.from('user_topics').insert(weakRows);
        if (weakErr) return res.status(500).json({ error: weakErr.message });
      }
      // Insert strong topics
      const strongTopics = Array.isArray(JSON.parse(subject_strong)) ? JSON.parse(subject_strong) : [];
      if (strongTopics.length > 0) {
        const strongRows = strongTopics.map(topic => ({ user_id: userId, topic_id: topic.value, type: 'strong' }));
        const { error: strongErr } = await supabase.from('user_topics').insert(strongRows);
        if (strongErr) return res.status(500).json({ error: strongErr.message });
      }
      res.send("Usuario registrado exitosamente");
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/tutor-signup', upload.fields([
  { name: 'id_photo', maxCount: 1 },
  { name: 'selfie_photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const idPhotoFile = req.files['id_photo']?.[0];
    const selfiePhotoFile = req.files['selfie_photo']?.[0];
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
      // Insert tutor
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
      // Insert teaches topics
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
