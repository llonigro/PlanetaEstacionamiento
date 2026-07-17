
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

// 3. POST
const crear = async (datosCatalogo) => {
    const { nombre, descripcion, precio_base } = datosCatalogo;
    const { rows } = await pool.query(
        'INSERT INTO catalogo_servicios (nombre, descripcion, precio_base) VALUES ($1, $2, $3) RETURNING *',
        [nombre, descripcion, precio_base]
    );
    return rows[0]; 
};


module.exports = {
    obtenerTodos,
    VerCatalogo,
    crear
};