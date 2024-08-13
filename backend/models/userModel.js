const pool = require('./db');
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
async function createUser(username, email, password, full_name, country_id, role = 'user') {
  console.log('Creating user with:', { username, email, password, full_name, country_id, role });

  if (!username || !email || !password || !full_name || !country_id) {
    throw new Error('Todos los campos (username, email, password, full_name, country_id) son requeridos');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, full_name, country_id, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, role',
      [username, email, hashedPassword, full_name, country_id, role]
    );
    return newUser.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === '23505') { // Código de error para violación de restricción única
      throw new Error('El username o email ya está en uso.');
    }
    throw new Error('Error en la base de datos durante la creación de usuario');
  }
}

// Encontrar un usuario por nombre de usuario y contraseña
async function findUser(username, password) {
  if (!username || !password) {
    throw new Error('Tanto username como password son requeridos');
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
    throw new Error('Error en la base de datos durante la búsqueda de usuario');
  }
}

module.exports = {
  createUser,
  findUser
};
