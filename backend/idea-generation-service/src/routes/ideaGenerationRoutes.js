import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

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

    // Generate idea title
    const ideaTitle = await generateIdeaTitle(refinedIdea);

    // Store the idea
    const storedIdea = await storeIdea(ideaTitle, refinedIdea, competitors, goals, artifacts);

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

async function generateIdeaTitle(idea) {
  const response = await axios.post(`${LLM_SERVICE_URL}/generate-title`, {
    prompt: `Generate a title for the following idea: ${idea.description}. The title should be a short, concise, and compelling phrase that captures the essence of the idea.`
  });

  console.log("idea title response");
  console.log(response.data);

  // Remove the "Title: " prefix if it exists
  const title = response.data.title.replace('Title: ', '');

  // Cut off at 255 characters
  return title.slice(0, 255);
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

async function storeIdea(ideaTitle, idea, competitors, goals, artifacts) {
  console.log(idea, competitors, goals, artifacts);
  const response = await axios.post(`${IDEA_STORAGE_URL}/ideas`, {
    title: ideaTitle,
    description: idea.description,
    iterations: [idea],
    competitors,
    goals,
    artifacts
  });
  return response.data;
}

export default router;