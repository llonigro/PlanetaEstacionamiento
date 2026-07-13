// /registro.servicio.js
const pool = require('../db/db.js');

// Extraemos la lógica de base de datos a funciones puras


// 1. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM registros');
    return rows;
};

// 2. GET ÚNICO
const VerRegistro = async (id) => {
    const { rows } = await pool.query('SELECT * FROM registros WHERE id = $1', [id]);
    return rows[0]; 
};

module.exports = {
    obtenerTodos,
    VerRegistro
};