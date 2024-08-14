const router = require('express').Router();
const { client } = require('../models/mongoDB');

router.post('/session', async (req, res) => {
  const { userId, duration, score } = req.body;
  const collection = client.db("myProjectDB").collection("gameSessions");

  try {
    await collection.insertOne({ userId, duration, score, timestamp: new Date() });
    res.status(201).send({ message: "Session saved successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to save session", error });
  }
});

module.exports = router;
