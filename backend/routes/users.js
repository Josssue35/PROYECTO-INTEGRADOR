const express = require('express');
const router = express.Router();
const { createUser, findUser } = require('../models/userModel');

// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields (username, email, password) are required' });
    }

    const user = await createUser(username, email, password);
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Both username and password are required' });
    }

    const user = await findUser(username, password);
    if (user) {
      res.json({ id: user.id, username: user.username }); // Devuelve el ID y el nombre de usuario del usuario autenticado
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
