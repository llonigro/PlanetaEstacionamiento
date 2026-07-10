// validacion/vehiculos.validator.js
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



// Validación para POST (crear vehiculo)
const validarCrearVehiculo = [
    body('patente')
        .notEmpty().withMessage('La patente es obligatoria')
        .matches(/(^[a-zA-Z]{3}[-]{0,1}[0-9]{3,4}$)|(^[a-zA-Z]{2}[-]{0,1}[0-9]{3}[a-zA-Z]{1}$)/).withMessage('Formato de patente inválido'),
    body('marca')
        .notEmpty().withMessage('La marca es obligatoria')
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('La marca debe contener solo letras y espacios'),
    body('modelo')
        .notEmpty().withMessage('El modelo es obligatorio')
        .matches(/^[A-Za-zÀ-ÿ0-9\s\+\.\-]+$/).withMessage('El modelo debe contener solo letras y espacios numeros y signo (+ . -)'),
    body('color')
        .optional()
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('El color debe contener solo letras y espacios'),
    body('usuario_id')
        .notEmpty().withMessage('El ID de usuario es obligatorio')
        .isInt().withMessage('El ID de usuario debe ser un número entero'),
    body('permitir_valet')
        .notEmpty().withMessage('Debe especificar si permite valet (true/false)')
        .isBoolean().withMessage('Debe especificar si permite valet (true/false)'),
    // ... middleware para revisar los resultados
    verificarErrores 
];


// Validación para PATCH (actualización parcial)
const validarActualizarVehiculo = [
    body('patente')
        .optional()
        .matches(/(^[a-zA-Z]{3}[-]{0,1}[0-9]{3,4}$)|(^[a-zA-Z]{2}[-]{0,1}[0-9]{3}[a-zA-Z]{1}$)/).withMessage('Formato de patente inválido'),
    body('marca')
        .optional()
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('La marca debe contener solo letras y espacios').notEmpty().withMessage('La marca no puede estar vacía'),
    body('modelo')
        .optional()
        .matches(/^[A-Za-zÀ-ÿ0-9\s\+\.\-]+$/).withMessage('El modelo debe contener solo letras y espacios numeros y signo (+ . -)').notEmpty().withMessage('El modelo no puede estar vacío'),
    body('color')
        .optional()
        .matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage('El color debe contener solo letras y espacios'),
    body('usuario_id')
        .optional()
        .isInt().withMessage('El ID de usuario debe ser un número entero'),
    body('permitir_valet')
        .optional()
        .isBoolean().withMessage('Debe ser true o false'),
    // ... middleware para revisar los resultados
    verificarErrores 
];

// Validar Patente única (Vehículos)
const ValidarPatente = (error, res) => { 
    if (error?.code === '23505' && error?.constraint === 'vehiculos_patente_key') {
        res.status(409).json({ message: 'La patente ya se encuentra registrada' });
        return true;
    }
    return false;
};

// Validar que el Usuario exista (Foreign Key)
const ValidarForeignKey = (error, res) => {
    if (error?.code === '23503' && error?.constraint === 'vehiculos_usuario_id_fkey') {
        res.status(400).json({ message: 'El usuario asignado no existe en el sistema' });
        return true;
    }
    return false;
};


module.exports = {
    validarId,
    validarCrearVehiculo,
    validarActualizarVehiculo,
    ValidarPatente,
    ValidarForeignKey
};