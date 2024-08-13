const pool = require('./db');
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
async function createUser(username, email, password, role = 'user') {
  if (!username || !email || !password) {
    throw new Error('All fields (username, email, password) are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
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

// Obtener todos los usuarios
async function getAllUsers() {
  try {
    const result = await pool.query('SELECT id, username, email, created_at, role FROM users');
    return result.rows;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw new Error('Database error during users retrieval');
  }
}

// Actualizar un usuario
async function updateUser(id, username, email, password, role) {
  if (!id || !username || !email || !role) {
    throw new Error('ID, username, email, and role are required');
  }

  const queryParams = [username, email, role, id];
  let updateQuery = `
    UPDATE users
    SET username = $1, email = $2, role = $3`;

  // Solo incluye el campo `password` en la consulta si se proporciona un nuevo password
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateQuery += `, password = $4`;
    queryParams.splice(3, 0, hashedPassword); // Inserta el password hasheado en la posición correcta
  }

  updateQuery += ` WHERE id = $${queryParams.length} RETURNING id, username, email, role`;

  try {
    const result = await pool.query(updateQuery, queryParams);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Database error during user update');
  }
}

// Borrar un usuario
async function deleteUser(id) {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Database error during user deletion');
  }
}

module.exports = {
  createUser,
  findUser,
  getAllUsers,
  updateUser,
  deleteUser
};
