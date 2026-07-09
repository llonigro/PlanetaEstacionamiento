// services/vehiculos.service.js
const pool = require('../db/db.js');

const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM usuarios');
    return rows;
};

module.exports = {
    obtenerTodos,
}