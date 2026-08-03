const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/db.js');


const iniciarSesion = async (email, contraseña ) => {
    // 1. Buscar usuario
    // porque se llama al email y no ala contraseña 
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];
    // 2. Validar existencia
    if (!usuario) throw { statusCode: 401, message: 'El usuario no existe' };
     // compara la contraseña que le llega desde el frontend con la contraseña de la tabla usuario
    const esValida = await bcrypt.compare(contraseña, usuario.contrasenia);
    if (!esValida) throw { statusCode: 401, message: 'La contraseña es inválida '};

    // 3. Crear el JWT
    const datos = { id: usuario.id, rol: usuario.rol };
    const token = jwt.sign(datos, process.env.JWT_SECRET, { expiresIn: '8h' });

    return { token, usuario: datos };//{ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } };
};

module.exports= {iniciarSesion};