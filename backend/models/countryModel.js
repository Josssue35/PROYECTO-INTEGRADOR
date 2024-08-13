const pool = require('./db'); 

exports.getCountries = async function() {
    const { rows } = await pool.query('SELECT id, name FROM countries');
    return rows;
};
