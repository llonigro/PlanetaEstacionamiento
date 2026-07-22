// validacion/usuarios.validator.js
const { param, body, validationResult } = require('express-validator');


// Middleware común para revisar si express-validator encontró errores
const verificarErrores = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};



// Validación para rutas que requieren ID (GET único, PATCH, DELETE)
const validarId = [
    param('id')
        .isInt({min: 1}).withMessage('El ID debe ser un número entero válido'),
    // 2. Middleware para interceptar los errores
    verificarErrores
];

// validacion para POST

const validarCrearUsuario = [
    // 1. Reglas de validación (lo que tenías en chequeos)
        // verifica que el nombre sea obligatorio y contenga espacios solamente
    body('nombre')
        .trim()
        .escape()
        .notEmpty().withMessage('El nombre es obligatorio')
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('El nombre debe contener solo letras y espacios'),
        // Verifica que email sea obligatorio y tenga formato correcto
    body('email')
        .escape()
        .notEmpty().withMessage('El email es obligatorio')
        .bail()
        .isEmail().withMessage('El email es incorrecto')
        .normalizeEmail(),
        // Verifica que la contraseña sea obligatorio y contenga 6 caracteres
    body('contrasenia')
        .escape()
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        // Verifica que el telefono tenga formato correcto
        body('telefono')
        .escape()
        .optional({ checkFalsy: true }) // Permite que el campo sea opcional
        .isMobilePhone().withMessage('El teléfono debe ser un número válido'), // ejemplo de numero : 123456789
    // 2. Middleware para interceptar los errores
    verificarErrores
];


// Validación para PATCH (actualización parcial)
const validarActualizarUsuario = [
    body('nombre')
        .escape()
        .optional({ checkFalsy: true }) // Si no viene, express-validator lo saltea. Si viene, aplica lo de abajo:
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('El nombre debe contener solo letras y espacios')
        .notEmpty().withMessage('Si envías el nombre, no puede estar vacío')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    body('email')
        .escape()
        .optional({ checkFalsy: true })
        .isEmail().withMessage('El formato del email es incorrecto')
        .normalizeEmail(),

    body('contrasenia')
        .escape()
        .optional({ checkFalsy: true })
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('telefono')
        .escape()
        .optional({ checkFalsy: true })
        .isMobilePhone().withMessage('El formato del teléfono no es válido'),

    verificarErrores 
]

///////////////////////////////////////////////////////////////////////


// Si el usuario ingresa un gmail existente toma el error y muestra un json
const validarGmailUnico = (error, res) => { 
    if (error?.code === '23505' && error?.constraint === 'usuarios_email_key') {
        res.status(409).json({ message: 'El email ya está registrado' });
        return true;
    }

    return false;
};

const validarClaveForanea = (error, res) => { 
    if (error?.code === '23503' && error?.constraint === 'vehiculos_usuario_id_fkey') {
        res.status(409).json({ message: 'No se puede eliminar el usuario porque tiene vehículos registrados. Elimine primero los vehículos' });
        return true;
    }

    return false;
};


module.exports = { validarCrearUsuario, validarGmailUnico, validarId, validarActualizarUsuario, validarClaveForanea};