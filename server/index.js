import express from 'express'; 
import cors from 'cors';
import axios from 'axios';
import pg from 'pg';
import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";
import AWS from 'aws-sdk';
import multer from 'multer';

dotenv.config();


AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const rekognition = new AWS.Rekognition();

const app = express();
const PORT = 5000;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

app.use(cors());
app.use(express.json());


const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.get('/api/check-email', async (req, res) => {
  const { email } = req.query;
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const exists = data.users.some(u => u.email === email);
  return res.json({ exists });
});

app.post('/student-link-supabase', async (req, res) => {
  const { email, supabase_user_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET supabase_user_id = $1 WHERE email = $2 RETURNING user_id',
      [supabase_user_id, email]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando supabase_user_id:', error);
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/student-signup', upload.fields([ { name: 'id_photo', maxCount: 1 }, { name: 'selfie_photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const idPhotoFile = req.files['id_photo']?.[0];
    const selfiePhotoFile = req.files['selfie_photo']?.[0];

    const params = {
      SourceImage: { Bytes: idPhotoFile.buffer },
      TargetImage: { Bytes: selfiePhotoFile.buffer },
      SimilarityThreshold:90 
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

      const { name, last_name, email, profile_type, career, subject_weak, subject_strong, institution, year, supabase_user_id} = req.body;

      const newStudentResult = await db.query(
        'INSERT INTO users (name, last_name, email, profile_type, career, institution, year_of_enrollment, supabase_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id',
        [name, last_name, email, profile_type, career, institution, year, supabase_user_id]
      );
      const userId = newStudentResult.rows[0].user_id;

      if (Array.isArray(JSON.parse(subject_weak))) {
        for (const topic of JSON.parse(subject_weak)) {
          await db.query(
            'INSERT INTO user_topics (user_id, topic_id, type) VALUES ($1, $2, $3)',
            [userId, topic.value, 'weak']
          );
        }
      }
      
      if (Array.isArray(JSON.parse(subject_strong))) {
        for (const topic of JSON.parse(subject_strong)) {
          await db.query(
            'INSERT INTO user_topics (user_id, topic_id, type) VALUES ($1, $2, $3)',
            [userId, topic.value, 'strong']
          );
        }
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
    const getSubjects = await db.query('SELECT * FROM subjects');
    const subjects = getSubjects.rows.map(subject => ({
      id: subject.subject_id,
      name: subject.subject_name
    }));

  
    const getTopics = await db.query('SELECT * FROM topics');
    const topicsBySubject = {};
    getTopics.rows.forEach(topic => {
      if (!topicsBySubject[topic.subject_id]) topicsBySubject[topic.subject_id] = [];
      topicsBySubject[topic.subject_id].push({
        id: topic.topic_id,
        name: topic.topic_name
      });
    });
  
    const subjectsWithTopics = subjects.map(subject => ({
      ...subject,
      topics: topicsBySubject[subject.id] || []
    }));
    res.json(subjectsWithTopics);
  } catch (error) {
    console.error('Error fetching subjects: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/careers', async (req, res) => {
  try {
    const getCareers = await db.query('SELECT * FROM careers');
    
    const careers = getCareers.rows.map(career => ({
      id: career.career_id,
      name: career.career_name, 
    }));

    res.json(careers);
  } catch (error) {
    console.error('Error fetching careers: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
