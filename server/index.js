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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
