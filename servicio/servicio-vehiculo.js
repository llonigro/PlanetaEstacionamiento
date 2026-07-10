// services/vehiculos.service.js
const pool = require('../db/db.js');
// 2. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM vehiculos');
    return rows;
};

// 2. GET ÚNICO
const VerVehiculo = async (id) => {
    const { rows } = await pool.query('SELECT * FROM vehiculos WHERE id = $1', [id]);
    return rows[0]; // Retorna el vehículo o undefined si no existe
};

// 3. POST
const crearVehiculo = async (datosVehiculo) => {
    const { patente, marca, modelo, color, usuario_id, permitir_valet } = datosVehiculo;
        const { rows } = await pool.query(
        'INSERT INTO vehiculos (patente, marca, modelo, color, usuario_id, permitir_valet) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [patente, marca, modelo, color, usuario_id, permitir_valet]
    );
    return rows[0]; 
};

//



module.exports = {
    obtenerTodos,
    VerVehiculo,
    crearVehiculo
};
