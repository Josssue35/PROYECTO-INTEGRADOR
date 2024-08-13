const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT users.username, scorespop.points FROM scorespop JOIN users ON scorespop.user_id = users.id ORDER BY scorespop.points DESC LIMIT 5'
        );
        res.json(result.rows);
    }
    catch (err) {
        console.error("Error fetching scores:", err.message)
        res.status(500).json({ message: 'Server error fetching scores' });
    }
});

router.post('/', async (req, res) => {
    const { user_id, points } = req.body;
    try {
        const result = await pool.query('INSERT INTO scorespop (user_id, points) VALUES ($1, $2) RETURNING *', [user_id, points]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error("Error saving score:", err.message);
        res.status(500).json({ message: 'Server error saving score' });
    }
})

module.exports = router;