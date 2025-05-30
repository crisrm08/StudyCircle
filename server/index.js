import express from 'express'; 
import cors from 'cors';
import axios from 'axios';
import pg from 'pg';
import dotenv from 'dotenv';
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.get('/subjects', async (req, res) => {
  try {    
    // Fetch all subjects
    const getSubjects = await db.query('SELECT * FROM subjects');
    const subjects = getSubjects.rows.map(subject => ({
      id: subject.subject_id,
      name: subject.subject_name
    }));

    // Fetch all topics
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
    console.log("Subjects with topics: ", subjectsWithTopics);
    res.json(subjectsWithTopics);
  } catch (error) {
    console.error('Error fetching subjects: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/student-signup', async (req, res) => {
    try {
      const { name, last_name, email, password, career, subject_weak, subject_strong, institution, year } = req.body;
      console.log("Received student data:", name, last_name, email, password);
      
      const checkEmail = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (checkEmail.rows.length > 0) {
        return res.send("Correo ya registrado");
      } else { 
        const newStudent = await db.query(
          'INSERT INTO users (name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, last_name, email, password]
        );
        console.log(newStudent);
      }
      
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
      
    }
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
