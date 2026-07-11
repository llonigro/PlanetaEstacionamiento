
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

// 3. POST
const crear = async (datosCocheras) => {
    const { numero, tipo, estado, libre, clima } = datosCocheras;
    // Es buena práctica usar RETURNING * para devolver el usuario recién creado
    const { rows } = await pool.query(
        'INSERT INTO cocheras (numero, tipo, estado, libre, clima) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [numero, tipo, estado, libre, clima]
    );
    return rows[0]; 
};

module.exports = {
    obtenerTodos,
    VerCochera,
    crear
};































































