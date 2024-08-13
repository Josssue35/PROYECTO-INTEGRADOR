const express = require('express');
const {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../models/userModel');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const newUser = await createUser(username, email, password, role);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    try {
        const updatedUser = await updateUser(id, username, email, password, role);
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
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
