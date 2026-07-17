
// servicios/.catalogo.js
const pool = require('../db/db.js')


// 1. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM catalogo_servicios');
    return rows;
};


module.exports = {
    obtenerTodos
};