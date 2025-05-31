import express from 'express'; 
import cors from 'cors';
import axios from 'axios';
import pg from 'pg';
import dotenv from 'dotenv';
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.post('/student-signup', async (req, res) => {
    try {
      const { name, last_name, email, password, career, subject_weak, subject_strong, institution, year } = req.body;
      console.log(`Received data: ${JSON.stringify(req.body)}`);
      
      const checkEmail = await db.query('SELECT * FROM students WHERE email = $1', [email]);
      if (checkEmail.rows.length > 0) {
        return res.send("Correo ya registrado");
      } else { 
        const newStudent = await db.query(
          'INSERT INTO users (name, last_name, email, password, career, university, year_of_enrollment) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [name, last_name, email, password, career, institution, year]
        );
        console.log(newStudent);
      }
      
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
      
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
