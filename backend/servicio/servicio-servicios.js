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


// 2. POST
const crear = async (datos) => {
    const { vehiculo_id, servicio_id, precio_final } = datos;
    const result = await pool.query(
        "INSERT INTO servicios (vehiculo_id, servicio_id, precio_final) VALUES ($1, $2, $3) RETURNING *",
        [vehiculo_id, servicio_id, precio_final]
    );
    return result.rows[0];
};
module.exports = { obtenerTodos, VerServicio,crear };