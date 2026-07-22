
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
    const { numero, tipo, estado, clima } = datosCocheras;
    // Es buena práctica usar RETURNING * para devolver el usuario recién creado
    const { rows } = await pool.query(
        'INSERT INTO cocheras (numero, tipo, estado, clima) VALUES ($1, $2, $3, $4) RETURNING *',
        [numero, tipo, estado, clima]
    );
    return rows[0]; 
};

// 4. PATCH
const actualizarParcial = async (id, datosCochera) => {
    // 1. Extraemos solo los campos permitidos. NO extraemos 'libre'.
    const { numero, tipo, estado, clima } = datosCochera;

    // 2. Buscamos la cochera actual
    const cocheraRes = await pool.query('SELECT * FROM cocheras WHERE id = $1', [id]);
    if (cocheraRes.rows.length === 0) return [];
    
    const cocheraBD = cocheraRes.rows[0];

    // 3. Hacemos el UPDATE asegurándonos de que 'libre' no está en la consulta
    const query = `
        UPDATE cocheras SET
            numero = $1,
            tipo = $2,
            estado = $3,
            clima = $4
        WHERE id = $5 RETURNING *
    `;

    // Usamos los datos nuevos o mantenemos los viejos, pero 'libre' queda intacto
    const values = [
        numero !== undefined ? numero : cocheraBD.numero,
        tipo !== undefined ? tipo : cocheraBD.tipo,
        estado !== undefined ? estado : cocheraBD.estado,
        clima !== undefined ? clima : cocheraBD.clima,
        id
    ];

    const result = await pool.query(query, values);
    return result.rows;
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
































































