
// services/usuarios.service.js
const pool = require('../db/db.js');
const bcrypt = require('bcryptjs');

// Extraemos la lógica de base de datos a funciones puras

// 1. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM usuarios');
    return rows;
};

// 2. GET ÚNICO
const VerUsuario = async (id) => {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return rows[0]; // Retorna el usuario o undefined si no existe
};


// 3. POST
const crear = async (datosUsuario) => {
    const { nombre, email, contrasenia, rol, telefono } = datosUsuario;
    // Hashear la contraseña antes de guardarla
    const saltRounds = 10;
    const contraseniaHasheada = await bcrypt.hash(contrasenia, saltRounds);
    // Es buena práctica usar RETURNING * para devolver el usuario recién creado
    const { rows } = await pool.query(
        'INSERT INTO usuarios (nombre, email, contrasenia, rol, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, email, contraseniaHasheada, rol, telefono]
    );
    return rows[0]; 
};

// 4. PATCH
const actualizarParcial = async (id, datosUsuario) => {
   // const {id} = datosUsuario;
    const { nombre, email, contrasenia, rol, telefono } = datosUsuario;
    const { rows } = await pool.query(
        `UPDATE usuarios SET 
        nombre = COALESCE($1, nombre), 
        email = COALESCE($2, email), 
        contrasenia = COALESCE($3, contrasenia), 
        rol = COALESCE($4, rol), 
        telefono = COALESCE($5, telefono) 
        WHERE id = $6 RETURNING *`,
        [nombre || null, email || null, contrasenia || null, rol || null, telefono || null, id]
        //[nombre, email, contrasenia, rol, telefono, id]
    );
    return rows[0]; 
};


// 5 . DELETE
const eliminar = async (id) => {
    const { rows } = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    return rows[0]; // Retorna el usuario eliminado o undefined si no existía
};

module.exports = {
    obtenerTodos,
    VerUsuario,
    crear,
    actualizarParcial,
    eliminar
};