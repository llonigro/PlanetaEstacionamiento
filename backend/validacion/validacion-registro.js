// validacion/registro.validator.js
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
const validarCrearRegistro = [
    body('cochera_id')
        .notEmpty().withMessage('El ID de la cochera es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID de la cochera debe ser un número entero válido'),

    body('vehiculo_id')
        .notEmpty().withMessage('El ID del vehículo es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID del vehículo debe ser un número entero válido'),

    body('fecha_ingreso')
        .notEmpty().withMessage('La fecha de ingreso es obligatoria')
        .isISO8601().withMessage('La fecha de ingreso debe tener un formato válido (ej: 2024-06-01T11:00:00.000Z)')
        .toDate(), // Convierte automáticamente el string a un objeto Date de JS

    body('fecha_egreso')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('La fecha de egreso debe tener un formato válido')
        .toDate()
        .custom((value, { req }) => {
            // Validacion extra: El egreso no puede ser ANTES del ingreso
            if (value && req.body.fecha_ingreso && value <= req.body.fecha_ingreso) {
                throw new Error('La fecha de egreso debe ser posterior a la fecha de ingreso');
            }
            return true;
        }),

    body('precio_total')
        .notEmpty().withMessage('El precio total es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
        .toFloat(), // Convierte el "20.00" (string) a 20.00 (float)

    verificarErrores // Tu middleware que captura los errores y responde con un 400
];

const validarIngreso = [
    body('cochera_id')
        .notEmpty().withMessage('El ID de la cochera es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID de la cochera debe ser un número entero'),

    body('vehiculo_id')
        .notEmpty().withMessage('El ID del vehículo es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID del vehículo debe ser un número entero'),

    body('fecha_ingreso')
        .optional() // Si no se envía, el backend usará la hora actual del servidor (NOW())
        .isISO8601().withMessage('La fecha de ingreso debe tener un formato ISO8601 válido')
        .toDate(),

    verificarErrores
];

const validarEgreso = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID del registro debe ser un número entero válido'),

    body('fecha_egreso')
        .optional() // Si no se envía, se toma la hora actual
        .isISO8601().withMessage('La fecha de egreso debe tener un formato ISO8601 válido')
        .toDate()
        .custom((value, { req }) => {
            // Validacion extra: El egreso no puede ser ANTES del ingreso
            if (value && req.body.fecha_ingreso && value <= req.body.fecha_ingreso) {
                throw new Error('La fecha de egreso debe ser posterior a la fecha de ingreso');
            }
            return true;
        }),

    body('precio_total')
        .notEmpty().withMessage('El precio total es obligatorio para cerrar el registro')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
        .toFloat(),

    verificarErrores
];


////////////////////////////////////////////////////////////////////////////////////////////////
// Si el usuario ingresa un cochera_id o vehiculo_id que NO existe
const validarForaneasRegistro = (error, res) => {
    // 23503 es "foreign_key_violation" en PostgreSQL
    if (error?.code === '23503') {        
        // Verificamos cuál de las dos llaves falló leyendo el nombre del "constraint"
        // (Postgres por defecto nombra los constraints: nombreTabla_nombreColumna_fkey)
        
        if (error?.constraint === 'registros_cochera_id_fkey') {
            res.status(404).json({ message: 'La cochera especificada no existe.' });
            return true;
        }
        if (error?.constraint === 'registros_vehiculo_id_fkey') {
            res.status(404).json({ message: 'El vehículo especificado no existe.' });
            return true;
        }
        // Un fallback genérico por si cambiaste el nombre del constraint
        res.status(400).json({ message: 'Error de referencia: El recurso asociado no existe en la base de datos.' });
        return true;
    }
    return false;
};



module.exports = { 
    validarId,
    validarEgreso,
    validarIngreso,
    validarForaneasRegistro
};






