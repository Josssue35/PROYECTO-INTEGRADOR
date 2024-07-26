const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const scoresRouter = require('./routes/scores');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/scores', scoresRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
