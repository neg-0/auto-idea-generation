import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import ideaRoutes from './routes/ideaRoutes.js';
import morgan from 'morgan';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/ideas', ideaRoutes);

app.listen(PORT, () => {
  console.log(`Idea Storage Service running on port ${PORT}`);
});