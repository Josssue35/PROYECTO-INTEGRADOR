const express = require('express');
const router = express.Router();
const { createUser, findUser } = require('../models/userModel'); // Importar correctamente

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { username, email, password, full_name, country_id } = req.body;
  try {
    if (!username || !email || !password || !full_name || !country_id) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const user = await createUser(username, email, password, full_name, country_id); // Usar createUser directamente
    res.status(201).json(user);
  } catch (error) {
    console.error('Error en el registro del usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Se requieren usuario y contraseña' });
    }

    const user = await findUser(username, password); // Usar findUser directamente
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
});

module.exports = router;
