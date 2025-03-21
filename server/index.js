import express from 'express'; 
import cors from 'cors';
import axios from 'axios';
import pg from 'pg';
import dotenv from 'dotenv';
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
