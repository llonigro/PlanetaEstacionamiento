
// services/usuarios.service.js
const pool = require('../db/db.js');

// Extraemos la lógica de base de datos a funciones puras
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM usuarios');
    return rows;
};


const crear = async (datosUsuario) => {
    const { nombre, email, contrasenia, rol, telefono } = datosUsuario;
    // Es buena práctica usar RETURNING * para devolver el usuario recién creado
    const { rows } = await pool.query(
        'INSERT INTO usuarios (nombre, email, contrasenia, rol, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, email, contrasenia, rol, telefono]
    );
    return rows[0]; 
};

module.exports = {
    obtenerTodos,
    crear
};