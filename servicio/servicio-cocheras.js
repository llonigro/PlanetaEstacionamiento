
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

// 4. PATCH
const actualizarParcial = async (id, datosCochera) => {
    const { numero, tipo, estado, libre, clima } = datosCochera;
    const { rows } = await pool.query(
        `UPDATE cocheras SET 
        numero = COALESCE($1, numero), 
        tipo = COALESCE($2, tipo), 
        estado = COALESCE($3, estado), 
        libre = COALESCE($4, libre), 
        clima = COALESCE($5, clima) 
        WHERE id = $6 RETURNING *`,
        [numero || null, tipo || null, estado || null, libre || null, clima || null, id]
        //[numero, tipo, estado, libre, clima, id]
    );
    return rows[0]; 
};


// 5 . DELETE
const eliminar = async (id) => {
    const { rows } = await pool.query('DELETE FROM cocheras WHERE id = $1 RETURNING *', [id]);
    return rows[0]; // Retorna la cocheras eliminada o undefined si no existía
};

module.exports = {
    obtenerTodos,
    VerCochera,
    crear,
    actualizarParcial,
    eliminar
};
































































