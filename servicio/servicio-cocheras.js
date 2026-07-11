
// services/cocheras.service.js
const pool = require('../db/db.js');

// Extraemos la lógica de base de datos a funciones puras

// 1. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM cocheras');
    return rows;
};

// 2. GET ÚNICO
const VerCochera = async (id) => {
    const { rows } = await pool.query('SELECT * FROM cocheras WHERE id = $1', [id]);
    return rows[0]; // Retorna la cochería o undefined si no existe
};

module.exports = {
    obtenerTodos,
    VerCochera
};































































