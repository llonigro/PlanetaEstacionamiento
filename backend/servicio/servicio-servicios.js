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


// 3. POST
const crear = async (datos) => {
    const { vehiculo_id, servicio_id, precio_final } = datos;
    const result = await pool.query(
        "INSERT INTO servicios (vehiculo_id, servicio_id, precio_final) VALUES ($1, $2, $3) RETURNING *",
        [vehiculo_id, servicio_id, precio_final]
    );
    return result.rows[0];
};

// 4. PATCH
const actualizarParcial = async (id, datos) => {
    const { estado, notificado_cliente } = datos;
    
    // Consulta dinámica para actualizar solo lo que se envía (PATCH)
    const result = await pool.query(
        `UPDATE servicios SET 
            estado = COALESCE($1, estado)
         WHERE id = $3 RETURNING *`,
        [estado, notificado_cliente, id]
    );
    
    return result.rows[0];
};

// 5 . DELETE
const eliminar = async (id) => {
    const { rows } = await pool.query('DELETE FROM servicios WHERE id = $1 RETURNING *', [id]);
    return rows[0]; 
};


/////////////////////////////////////////////////////////////////////////////////
module.exports = { obtenerTodos, VerServicio,crear, actualizarParcial, eliminar };