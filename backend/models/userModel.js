const pool = require('./db');
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
async function createUser(username, email, password, role = 'user') {
  console.log('Creating user with:', { username, email, password, role });

  if (!username || !email || !password) {
    throw new Error('All fields (username, email, password) are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
      [username, email, hashedPassword, role]
    );
    return newUser.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Database error during user creation');
  }
}

// Encontrar un usuario por nombre de usuario y contraseña
async function findUser(username, password) {
  if (!username || !password) {
    throw new Error('Both username and password are required');
  }

  try {
    const user = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username = $1',
      [username]
    );

    if (user.rows.length > 0) {
      const isValid = await bcrypt.compare(password, user.rows[0].password);
      if (isValid) {
        return {
          id: user.rows[0].id,
          username: user.rows[0].username,
          role: user.rows[0].role
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding user:', error);
    throw new Error('Database error during user search');
  }
}

module.exports = {
  createUser,
  findUser
};
