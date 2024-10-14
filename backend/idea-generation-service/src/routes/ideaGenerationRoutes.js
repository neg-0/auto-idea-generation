import express from 'express';
import axios from 'axios';

const router = express.Router();

const LLM_SERVICE_URL = process.env.LLM_SERVICE_URL;
const IDEA_STORAGE_URL = process.env.IDEA_STORAGE_URL;

// Generate a new idea
router.post('/', async (req, res) => {
  try {
    // Generate initial idea using LLM
    const initialIdea = await generateIdea();

    // Research competitors
    const competitors = await researchCompetitors(initialIdea);

    // Refine the idea based on competitor research
    const refinedIdea = await refineIdea(initialIdea, competitors);

    // Generate goals and artifacts
    const goals = await generateGoals(refinedIdea);
    const artifacts = await generateArtifacts(refinedIdea, goals);

    // Store the idea
    const storedIdea = await storeIdea(refinedIdea, competitors, goals, artifacts);

    res.status(201).json(storedIdea);
  } catch (err) {
    console.error('Error generating idea:', err);
    res.status(500).json({ error: 'Error generating idea' });
  }
});

async function generateIdea() {
  const response = await axios.post(`${LLM_SERVICE_URL}/generate`, {
    prompt: 'Generate a unique SaaS, app, or startup idea'
  });
  return response.data;
}

async function researchCompetitors(idea) {
  const response = await axios.post(`${LLM_SERVICE_URL}/research`, {
    prompt: `Research potential competitors for the following idea: ${idea.title}`
  });
  return response.data;
}

async function refineIdea(idea, competitors) {
  const response = await axios.post(`${LLM_SERVICE_URL}/refine`, {
    prompt: `Refine the following idea considering these competitors: ${JSON.stringify(competitors)}`,
    idea: idea
  });
  return response.data;
}

async function generateGoals(idea) {
  const response = await axios.post(`${LLM_SERVICE_URL}/generate-goals`, {
    prompt: `Generate goals for the following idea: ${idea.title}`
  });
  return response.data;
}

async function generateArtifacts(idea, goals) {
  const response = await axios.post(`${LLM_SERVICE_URL}/generate-artifacts`, {
    prompt: `Generate artifacts for the following idea and goals: ${idea.title}, ${JSON.stringify(goals)}`
  });
  return response.data;
}

async function storeIdea(idea, competitors, goals, artifacts) {
  const response = await axios.post(`${IDEA_STORAGE_URL}/api/ideas`, {
    title: idea.title,
    description: idea.description,
    iterations: [idea],
    competitors,
    goals,
    artifacts
  });
  return response.data;
}

export default router;