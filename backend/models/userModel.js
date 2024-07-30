const pool = require('./db');
const bcrypt = require('bcryptjs');

async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword]
  );
  return newUser.rows[0];
}

async function findUser(username, password) {
  const user = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (user.rows.length > 0) {
    const isValid = await bcrypt.compare(password, user.rows[0].password);
    if (isValid) {
      return { id: user.rows[0].id, username: user.rows[0].username };
    }
  }
  return null; 
}

module.exports = {
  createUser,
  findUser
};
