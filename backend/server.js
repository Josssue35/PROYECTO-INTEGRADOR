const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const scoresRouter = require('./routes/scores');
const scoresPopRouter = require('./routes/scorespop');
const adminRoutes = require('./routes/admin');
const countryRoutes = require('./routes/countries');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRouter);
app.use('/api/scoreskalm', scoresRouter);
app.use('/api/scorespop', scoresPopRouter);
app.use('/api/countries', countryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
