// /registro.servicio.js
const pool = require('../db/db.js');

// Extraemos la lógica de base de datos a funciones puras


// 1. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM servicios');
    return rows;
};

// 2. GET ÚNICO
const VerServicio = async (id) => {
    const { rows } = await pool.query('SELECT * FROM servicios WHERE id = $1', [id]);
    return rows[0]; 
};

module.exports = { obtenerTodos, VerServicio };