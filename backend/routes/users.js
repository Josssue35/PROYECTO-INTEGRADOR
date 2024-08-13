const express = require('express');
const router = express.Router();
const { createUser, findUser, getUserDetails } = require('../models/userModel'); // Asumiendo que tienes estas funciones en userModel.js

// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, email, password, full_name, country_id } = req.body;
  try {
    // Aquí puedes incluir validaciones adicionales si son necesarias
    const newUser = await createUser(username, email, password, full_name, country_id);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await findUser(username, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Ruta para obtener detalles del usuario
router.get('/details/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userDetails = await getUserDetails(userId);
    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: 'Server error fetching user details', error: error.message });
  }
});

module.exports = router;
