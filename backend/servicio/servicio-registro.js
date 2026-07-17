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
const registrarIngreso = async (datosIngreso) => {
    const { cochera_id, vehiculo_id } = datosIngreso;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Verificar que la cochera exista y esté libre
        const cocheraQuery = await client.query(
            'SELECT libre FROM cocheras WHERE id = $1', 
            [cochera_id]
        );
        
        if (cocheraQuery.rows.length === 0) {
            throw { status: 404, message: 'La cochera no existe' };
        }
        if (!cocheraQuery.rows[0].libre) {
            throw { status: 400, message: 'La cochera seleccionada ya está ocupada' };
        }

        // 2. Verificar que el vehículo no esté ya estacionado actualmente
        const vehiculoActivoQuery = await client.query(
            'SELECT id FROM registros WHERE vehiculo_id = $1 AND fecha_egreso IS NULL AND anulado = false',
            [vehiculo_id]
        );
        
        if (vehiculoActivoQuery.rows.length > 0) {
            throw { status: 400, message: 'El vehículo ya se encuentra dentro del estacionamiento' };
        }

        // 3. AQUÍ SE DECLARA: insertRegistro
        // (Guardamos el resultado de la consulta en la constante para poder retornarla al final)
        const insertRegistro = await client.query(
            'INSERT INTO registros (cochera_id, vehiculo_id, precio_total) VALUES ($1, $2, 0) RETURNING *',
            [cochera_id, vehiculo_id]
        );

        // 4. Actualizar la cochera a ocupada (libre = false)
        await client.query(
            'UPDATE cocheras SET libre = false WHERE id = $1',
            [cochera_id]
        );

        await client.query('COMMIT'); // Guardamos los cambios en la base de datos
        
        // Retornamos el registro insertado (aquí ya existe la variable)
        return insertRegistro.rows[0];

    } catch (error) {
        await client.query('ROLLBACK'); // Deshacemos todo si algo falló
        throw error; // Lanza el error al controlador
    } finally {
        client.release(); // Devolvemos el cliente al pool
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


// 4. DELETE

/**
 * Borrado Lógico Seguro de un registro
 */
const eliminarLogico = async (id) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Verificar si el registro existe y no está anulado ya
        const registroQuery = await client.query(
            'SELECT * FROM registros WHERE id = $1 AND anulado = false FOR UPDATE',
            [id]
        );

        if (registroQuery.rows.length === 0) {
            throw { status: 404, message: 'El registro no existe o ya fue eliminado anteriormente.' };
        }

        const registro = registroQuery.rows[0];

        // 2. Si el vehículo ESTABA dentro (sin fecha_egreso), debemos liberar la cochera antes de anular
        if (registro.fecha_egreso === null) {
            await client.query(
                'UPDATE cocheras SET libre = true WHERE id = $1',
                [registro.cochera_id]
            );
        }

        // 3. Aplicar borrado lógico en el registro
        const updateAnuladoQuery = `
            UPDATE registros 
            SET anulado = true 
            WHERE id = $1 RETURNING *
        `;
        const registroAnulado = await client.query(updateAnuladoQuery, [id]);

        await client.query('COMMIT');
        return registroAnulado.rows[0];

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
    registrarEgreso,
    eliminarLogico
};