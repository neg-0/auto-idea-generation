import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import llmRoutes from './routes/llmRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/api', llmRoutes);

app.listen(PORT, () => {
  console.log(`LLM Integration Service running on port ${PORT}`);
});