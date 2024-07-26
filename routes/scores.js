const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT username, score FROM scores ORDER BY score DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching scores:", err.message);
    res.status(500).json({ message: 'Server error fetching scores' });
  }
});

module.exports = router;
