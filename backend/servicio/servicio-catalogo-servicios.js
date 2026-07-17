
// servicios/.catalogo.js
const pool = require('../db/db.js')


// 1. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM catalogo_servicios');
    return rows;
};

// 2. GET ÚNICO
const VerCatalogo = async (id) => {
    const { rows } = await pool.query('SELECT * FROM catalogo_servicios WHERE id = $1', [id]);
    return rows[0]; // Retorna el catalogo o undefined si no existe
};


module.exports = {
    obtenerTodos,
    VerCatalogo
};