import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ideaGenerationRoutes from './routes/ideaGenerationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api/generate', ideaGenerationRoutes);

app.listen(PORT, () => {
  console.log(`Idea Generation Service running on port ${PORT}`);
});