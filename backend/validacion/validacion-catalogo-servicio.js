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
<<<<<<< HEAD
        .isInt({min : 1}).withMessage('El ID debe ser un número entero y mayor a cero'),
=======
        .isInt().withMessage('El ID debe ser un número entero válido'),
>>>>>>> f3e7abda41f3651a607c9d8acc0ac62c447dd575
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
];


// validacion para PATCH
const validarActualizarCatalogo = [
    body("nombre")
    .optional({ checkFalsy: true })
        .trim()
        .escape()
        .notEmpty().withMessage('El nombre es obligatorio')
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('El nombre debe contener solo letras y espacios'),
    body("precio_base")
    .optional({ checkFalsy: true })
        .trim()
        .escape()
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
        .toFloat(),
    verificarErrores
];


<<<<<<< HEAD

const ValidarForeignKeyServicio = (error, res) => {
    if (error?.code === '23503' && error?.constraint === 'servicios_servicio_id_fkey') {
        res.status(400).json({ message: 'El catalogo esta registrado a un servicio' });
        return true;
    }
    return false;
};

module.exports = {
    validarId,
    validarCrearCatalogo,
    validarActualizarCatalogo,
    ValidarForeignKeyServicio
=======
module.exports = {
    validarId,
    validarCrearCatalogo,
    validarActualizarCatalogo 
>>>>>>> f3e7abda41f3651a607c9d8acc0ac62c447dd575
}