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

const validarGmailUnico = (error, res) => {
    try {
        if (error.code === '23505' && error.constraint === 'usuarios_email_key') {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};


module.exports = { validarCrearUsuario, validarGmailUnico };