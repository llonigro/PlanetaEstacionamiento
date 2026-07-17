// validacion/catalogo.validator.js
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
        .isInt().withMessage('El ID debe ser un número entero válido'),
    // 2. Middleware para interceptar los errores
    verificarErrores
];


// validacion para POST
const validarCrearCatalogo = [
    body("nombre")
        .trim()
        .escape()
        .notEmpty().withMessage('El nombre es obligatorio')
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('El nombre debe contener solo letras y espacios'),
    body("precio_base")
        .trim()
        .escape()
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
        .toFloat(),
    verificarErrores
]


module.exports = {
    validarId,
    validarCrearCatalogo
}