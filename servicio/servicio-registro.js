// /registro.servicio.js
const pool = require('../db/db.js');

// Extraemos la lógica de base de datos a funciones puras


// 1. GET COMPLETO
const obtenerTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM registros');
    return rows;
};

// 2. GET ÚNICO
const VerRegistro = async (id) => {
    const { rows } = await pool.query('SELECT * FROM registros WHERE id = $1', [id]);
    return rows[0]; 
};

// 3. POST
/**
 * Registra el ingreso de un vehículo y bloquea la cochera
 */
const registrarIngreso = async (datosRegistro) => {
    const { cochera_id, vehiculo_id, fecha_ingreso } = datosRegistro;
    const fecha = fecha_ingreso || new Date(); 
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Validar Cochera (Solo leemos si está libre)
        const cocheraQuery = await client.query(
            'SELECT libre FROM cocheras WHERE id = $1 FOR UPDATE',
            [cochera_id]
        );
        if (cocheraQuery.rows.length === 0) {
            throw { status: 404, message: 'La cochera no existe.' };
        }
        if (!cocheraQuery.rows[0].libre) {
            throw { status: 400, message: 'La cochera seleccionada ya está ocupada.' };
        }

        // 2. Validar que el Vehículo no esté actualmente en el estacionamiento
        const vehiculoQuery = await client.query(
            'SELECT id FROM registros WHERE vehiculo_id = $1 AND fecha_egreso IS NULL AND anulado = false FOR UPDATE',
            [vehiculo_id]
        );
        if (vehiculoQuery.rows.length > 0) {
            throw { status: 400, message: 'El vehículo ya se encuentra dentro del estacionamiento.' };
        }

        // 3. Insertar el nuevo registro (precio_total inicial en 0, anulado en false por defecto)
        const insertQuery = `
            INSERT INTO registros (cochera_id, vehiculo_id, fecha_ingreso, precio_total, anulado) 
            VALUES ($1, $2, $3, 0, false) RETURNING *
        `;
        const nuevoRegistro = await client.query(insertQuery, [cochera_id, vehiculo_id, fecha]);

        // 4. Actualizar Cochera: CORRECCIÓN -> Solo alteramos 'libre'
        await client.query(
            'UPDATE cocheras SET libre = false WHERE id = $1',
            [cochera_id]
        );

        await client.query('COMMIT');
        return nuevoRegistro.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error; 
    } finally {
        client.release();
    }
};



// 3. PATCH
/**
 * Registra el egreso de un vehículo, cobra y libera la cochera
 */
const registrarEgreso = async (id, datosEgreso) => {
    const { fecha_egreso, precio_total } = datosEgreso;
    const fechaSalida = fecha_egreso ? new Date(fecha_egreso) : new Date();
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Buscar registro activo que no esté anulado
        const registroQuery = await client.query(
            'SELECT * FROM registros WHERE id = $1 AND fecha_egreso IS NULL AND anulado = false FOR UPDATE',
            [id]
        );
        if (registroQuery.rows.length === 0) {
            throw { status: 404, message: 'No se encontró un registro activo para este ID o ya fue cerrado.' };
        }

        const registro = registroQuery.rows[0];

        // 2. VALIDACIÓN ESTRICTA DE FECHAS (Evita que salgan antes o en el mismo instante de entrar)
        if (fechaSalida <= new Date(registro.fecha_ingreso)) {
            throw { 
                status: 400, 
                message: 'La fecha de egreso debe ser estrictamente posterior a la fecha de ingreso.' 
            };
        }

        // 3. Actualizar Registro
        const updateQuery = `
            UPDATE registros 
            SET fecha_egreso = $1, precio_total = $2 
            WHERE id = $3 RETURNING *
        `;
        const registroActualizado = await client.query(updateQuery, [fechaSalida, precio_total, id]);

        // 4. Liberar Cochera: CORRECCIÓN -> Solo alteramos 'libre'
        await client.query(
            'UPDATE cocheras SET libre = true WHERE id = $1',
            [registro.cochera_id]
        );

        await client.query('COMMIT');
        return registroActualizado.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};


module.exports = {
    obtenerTodos,
    VerRegistro,
    registrarIngreso,
    registrarEgreso
};