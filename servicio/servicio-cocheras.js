
// services/cocheras.service.js
const pool = require('../db/db.js');

// Extraemos la lógica de base de datos a funciones puras

// 1. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM cocheras');
    return rows;
};

module.exports = {
    obtenerTodos
};































































