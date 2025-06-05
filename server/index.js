import express from 'express'; 
import cors from 'cors';
import axios from 'axios';
import pg from 'pg';
import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
const PORT = 5000;
const supabase= createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

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
  const { data, error } = await supabase.auth.admin.listUsers({ email });
  if (error) return res.status(500).json({ error: error.message });
  if (data.users.length > 0) {
    return res.json({ exists: true });
  }
  return res.json({ exists: false });
});

app.post('/student-signup', async (req, res) => {
    try {
      const { name, last_name, email, profile_type, career, subject_weak, subject_strong, institution, year, supabase_user_id } = req.body;
      console.log("Received student data:", name, last_name, profile_type, career, subject_weak, subject_strong, institution, year, supabase_user_id);
      
      const checkUser = await db.query('SELECT * FROM users WHERE supabase_user_id = $1', [supabase_user_id]);
      if (checkUser.rows.length > 0) {
        return res.send("Usuario ya registrado");
      } else { 
        const newStudentResult = await db.query(
          'INSERT INTO users (name, last_name, email, profile_type, career, institution, year_of_enrollment, supabase_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id',
          [name, last_name, email, profile_type, career, institution, year, supabase_user_id]
        );
        const userId = newStudentResult.rows[0].user_id;
        if (Array.isArray(subject_weak)) {
          for (const topic of subject_weak) {
            await db.query(
              'INSERT INTO user_topics (user_id, topic_id, type) VALUES ($1, $2, $3)',
              [userId, topic.value, 'weak']
            );
          }
        }
        if (Array.isArray(subject_strong)) {
          for (const topic of subject_strong) {
            await db.query(
              'INSERT INTO user_topics (user_id, topic_id, type) VALUES ($1, $2, $3)',
              [userId, topic.value, 'strong']
            );
          }
        }
        res.send("Usuario registrado exitosamente");
      }
      
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
