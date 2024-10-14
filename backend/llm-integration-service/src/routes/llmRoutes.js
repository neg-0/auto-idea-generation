import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_API_URL = process.env.LLM_API_URL;

async function generateLLMResponse(prompt) {
  try {
    const response = await axios.post(LLM_API_URL, {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${LLM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw new Error('Failed to generate response from LLM');
  }
}

router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generateLLMResponse(prompt);
    res.json({ title: response, description: "Generated idea description" });
  } catch (err) {
    res.status(500).json({ error: 'Error generating idea' });
  }
});

router.post('/generate-title', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generateLLMResponse(prompt);
    res.json({ title: response });
  } catch (err) {
    res.status(500).json({ error: 'Error generating title' });
  }
});

router.post('/research', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generateLLMResponse(prompt);
    res.json(response.split(',').map(competitor => competitor.trim()));
  } catch (err) {
    res.status(500).json({ error: 'Error researching competitors' });
  }
});

router.post('/refine', async (req, res) => {
  try {
    const { prompt, idea } = req.body;
    const response = await generateLLMResponse(`${prompt}\nOriginal idea: ${idea.title}`);
    res.json({ title: response, description: "Refined idea description" });
  } catch (err) {
    res.status(500).json({ error: 'Error refining idea' });
  }
});

router.post('/generate-goals', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generateLLMResponse(prompt);
    res.json(response.split('.').map(goal => goal.trim()).filter(goal => goal.length > 0));
  } catch (err) {
    res.status(500).json({ error: 'Error generating goals' });
  }
});

router.post('/generate-artifacts', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generateLLMResponse(prompt);
    res.json(response.split(',').map(artifact => artifact.trim()));
  } catch (err) {
    res.status(500).json({ error: 'Error generating artifacts' });
  }
});

export default router;