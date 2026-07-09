// services/vehiculos.service.js
const pool = require('../db/db.js');
// 2. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM vehiculos');
    return rows;
};

// 2. GET ÚNICO
const VerVehiculo = async (id) => {
    const { rows } = await pool.query('SELECT * FROM vehiculos WHERE id = $1', [id]);
    return rows[0]; // Retorna el vehículo o undefined si no existe
};

module.exports = {
    obtenerTodos,
    VerVehiculo
};
