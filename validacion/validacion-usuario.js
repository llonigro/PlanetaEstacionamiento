// validacion/usuarios.validator.js
const { body, validationResult } = require('express-validator');

const validarCrearUsuario = [
    // 1. Reglas de validación (lo que tenías en chequeos)
    body('nombre')
        .trim()
        .escape()
        .notEmpty().withMessage('El nombre es obligatorio')
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('El nombre debe contener solo letras y espacios'),
    body('email')
        .escape()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email es incorrecto'),
    body('contrasenia')
        .escape()
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('telefono')
        .escape()
        .optional({ checkFalsy: true }) // Permite que el campo sea opcional
        .isMobilePhone().withMessage('El teléfono debe ser un número válido'), // ejemplo de numero : 123456789
    // 2. Middleware para interceptar los errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores, respondemos con código 400 y frenamos la petición aquí
            return res.status(400).json({ errors: errors.array() });
        }
        // Si no hay errores, el "next()" le dice a Express que pase al controlador
        next(); 
    }
];

const validarGmailUnico = (error, res) => { // analizar 
    if (error?.code === '23505' && error?.constraint === 'usuarios_email_key') {
        res.status(409).json({ message: 'El email ya está registrado' });
        return true;
    }

    return false;
};


module.exports = { validarCrearUsuario, validarGmailUnico };