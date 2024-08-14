const pool = require('./db');
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
async function createUser(username, email, password, fullname, countryId, role = 'user') {
  if (!username || !email || !password || !fullname || !countryId) {
    throw new Error('Todos los campos (username, email, password, fullname, countryId) son requeridos');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, full_name, country_id, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, full_name, country_id, role',
      [username, email, hashedPassword, fullname, countryId, role]
    );
    return newUser.rows[0];
  } catch (error) {
    console.error('Error creando el usuario:', error);
    throw new Error('Error en la base de datos durante la creación del usuario');
  }
}

// Encontrar un usuario por nombre de usuario y contraseña
async function findUser(username, password) {
  if (!username || !password) {
    throw new Error('Both username and password are required');
  }

  try {
    const result = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return {
          id: user.id,
          username: user.username,
          role: user.role
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
    const result = await pool.query('SELECT id, username, email, full_name, country_id, role FROM users');
    console.log('Users retrieved from database:', result.rows); // Depuración
    return result.rows;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw new Error('Database error during users retrieval');
  }
}

// Actualizar un usuario
async function updateUser(id, username, email, password, fullname, countryId, role) {
  if (!id || !username || !email || !fullname || !countryId || !role) {
    throw new Error('ID, username, email, fullname, country_id, y role son requeridos');
  }

  let queryParams = [username, email, fullname, countryId, role, id];
  let updateQuery = `
    UPDATE users
    SET username = $1, email = $2, full_name = $3, country_id = $4, role = $5`;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateQuery += `, password = $6`;
    queryParams = [username, email, fullname, countryId, role, hashedPassword, id];
  }

  updateQuery += ` WHERE id = $${queryParams.length} RETURNING id, username, email, full_name, country_id, role`;

  try {
    const result = await pool.query(updateQuery, queryParams);
    return result.rows[0];
  } catch (error) {
    console.error('Error actualizando el usuario:', error);
    throw new Error('Error en la base de datos durante la actualización del usuario');
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
