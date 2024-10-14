import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ideas ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching ideas' });
  }
});

// Get a single idea by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM ideas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching idea' });
  }
});

// Create a new idea
router.post('/', async (req, res) => {
  try {
    const { title, description, iterations, competitors, goals, artifacts } = req.body;
    const result = await pool.query(
      'INSERT INTO ideas (title, description, iterations, competitors, goals, artifacts) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, JSON.stringify(iterations), JSON.stringify(competitors), JSON.stringify(goals), JSON.stringify(artifacts)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error creating idea' });
  }
});

// Update an existing idea
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, iterations, competitors, goals, artifacts } = req.body;
    const result = await pool.query(
      'UPDATE ideas SET title = $1, description = $2, iterations = $3, competitors = $4, goals = $5, artifacts = $6 WHERE id = $7 RETURNING *',
      [title, description, JSON.stringify(iterations), JSON.stringify(competitors), JSON.stringify(goals), JSON.stringify(artifacts), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating idea' });
  }
});

// Delete an idea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM ideas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json({ message: 'Idea deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting idea' });
  }
});

export default router;