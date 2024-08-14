const express = require('express');
const router = express.Router();
const { getCountries } = require('../models/countryModel');

router.get('/', async (req, res) => {
    try {
        const countries = await getCountries();
        res.json(countries);
    } catch (error) {
        console.error("Error fetching countries:", error);
        res.status(500).json({ message: 'Server error fetching countries' });
    }
});

module.exports = router;