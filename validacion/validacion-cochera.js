// validacion/cocheras.validator.js
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
const validarCrearCochera = [
    // 1. Reglas de validación (lo que tenías en chequeos)
    body('numero')
        .escape()
        .trim()
        .notEmpty().withMessage('El numero es obligatorio')
        .isInt().withMessage('El numero debe ser un número entero válido'),
        // Verifica que email sea obligatorio y tenga formato correcto
    body('tipo')
        .escape()
        .trim()
        .notEmpty().withMessage('El tipo es obligatorio')
        .toLowerCase() // <-- Pasamos a minúsculas
        .isIn(['techado', 'descubierto']).withMessage('El tipo debe ser "techado" o "descubierto"'),
    body('estado')
        .escape()
        .trim()
        .notEmpty().withMessage('El estado es obligatorio')
        .toLowerCase() // <-- Pasamos a minúsculas
        .isIn(['mal estado', 'buen estado']).withMessage('El estado debe ser "mal estado" o "buen estado"'),
    body('libre')
        .escape()
        .trim()
        .notEmpty().withMessage('Este apartado es obligatorio')
        .isBoolean().withMessage('Debe ser true o false'),
        body('clima')
        .trim()
        .escape()
        .toLowerCase() // <-- Pasamos a minúsculas
        .isIn(['frio', 'templado', 'caluroso']).withMessage('El clima debe ser "Frio", "templado" o "caluroso"'),
    // 2. Middleware para interceptar los errores
    verificarErrores
];


// validacion para PATCH
const validarActualizarCochera = [
    // 1. Reglas de validación (lo que tenías en chequeos)
    body('numero')
        .escape()
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty().withMessage('El numero es obligatorio')
        .isInt().withMessage('El numero debe ser un número entero válido'),
        // Verifica que email sea obligatorio y tenga formato correcto
    body('tipo')
        .escape()
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty().withMessage('El tipo es obligatorio')
        .toLowerCase() // <-- Pasamos a minúsculas
        .isIn(['techado', 'descubierto']).withMessage('El tipo debe ser "techado" o "descubierto"'),
    body('estado')
        .escape()
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty().withMessage('El estado es obligatorio')
        .toLowerCase() // <-- Pasamos a minúsculas
        .isIn(['mal estado', 'buen estado']).withMessage('El estado debe ser "mal estado" o "buen estado"'),
    body('libre')
        .escape()
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty().withMessage('Este apartado es obligatorio')
        .isBoolean().withMessage('Debe ser true o false'),
        body('clima')
        .trim()
        .escape()
        .optional({ checkFalsy: true })
        .toLowerCase() // <-- Pasamos a minúsculas
        .isIn(['frio', 'templado', 'caluroso']).withMessage('El clima debe ser "Frio", "templado" o "caluroso"'),
    // 2. Middleware para interceptar los errores
    verificarErrores
];
module.exports = { validarId, validarCrearCochera, validarActualizarCochera };
