
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

// 4. PATCH
const actualizarParcial = async (id, datosCatalogo) => {
    const { nombre, descripcion, precio_base } = datosCatalogo;

    const { rows } = await pool.query(
        `UPDATE catalogo_servicios SET 
        nombre = COALESCE($1, nombre), 
        descripcion = COALESCE($2, descripcion), 
        precio_base = COALESCE($3, precio_base)
        WHERE id = $4 RETURNING *`,
        [nombre || null, descripcion || null, precio_base || null, id]
    );
    return rows[0]; 
};


// 5 . DELETE
const eliminar = async (id) => {
    const { rows } = await pool.query('DELETE FROM catalogo_servicios WHERE id = $1 RETURNING *', [id]);
    return rows[0]; 
};


module.exports = {
    obtenerTodos,
    VerCatalogo,
    crear,
    actualizarParcial,
    eliminar
};