const express = require('express');
const {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../models/userModel');
const { getCountries } = require('../models/countryModel');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        console.log('Users sent in response:', users);
        res.json(users);
    } catch (error) {
        console.error('Error in /api/admin route:', error);
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { username, email, password, fullname, countryId, role } = req.body;

    try {
        const newUser = await createUser(username, email, password, fullname, countryId, role);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password, fullname, countryId, role } = req.body;

    try {
        const updatedUser = await updateUser(id, username, email, password, fullname, countryId, role);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Borrar un usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await deleteUser(id);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener todos los países
router.get('/countries', async (req, res) => {
    try {
        const countries = await getCountries();
        res.json(countries);
    } catch (error) {
        console.error("Error fetching countries:", error);
        res.status(500).json({ message: 'Server error fetching countries' });
    }
});

module.exports = router;
