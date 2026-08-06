const { body, param, validationResult } = require("express-validator");

// Middleware para interceptar los errores
const verificarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////

const validarId = [
  param("id").isInt().withMessage("El ID debe ser un número entero válido"),
  // 2. Middleware para interceptar los errores
  verificarErrores,
];

const validarCrearServicio = [
  body("vehiculo_id")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("El ID del vehículo es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El ID del vehículo debe ser un número entero"),
  body("servicio_id")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("El ID del servicio de catálogo es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El ID del servicio debe ser un número entero"),
  body("precio_final")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("El precio final es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("usuario_valet_id")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("El ID del usuario valet debe ser un número entero"),
  body("direccion_entrega")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage("La dirección de entrega debe tener al menos 5 caracteres"),
  verificarErrores,
];

const validarActualizarServicio = [
<<<<<<< HEAD
    
    body('estado')
        .optional({ checkFalsy: true })
        .trim().escape()
        .toLowerCase() 
        .isIn(['en espera ', 'en proceso','finalizado' ]).withMessage('El estado debe ser "en espera" , "en proceso" o "finalizado"'),
    verificarErrores
=======
  body("estado")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .toLowerCase()
    .isIn(["en espera", "en proceso", "finalizado"])
    .withMessage(
      'El estado debe ser "en espera" , "en proceso" o "finalizado"',
    ),
  body("precio_final")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("El precio final debe ser un número positivo"),
  body("usuario_valet_id")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("El ID del usuario valet debe ser un número entero"),
  body("direccion_entrega")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage("La dirección de entrega debe tener al menos 5 caracteres"),
  verificarErrores,
>>>>>>> 5f52598892e023690cc382113d892537934f3b7b
];

////////////////////////////////////////////////////////////////////////////////////////////////
// Si el usuario ingresa un servicio_id o vehiculo_id que NO existe
const validarForaneasServicio = (error, res) => {
  if (error?.code === "23503") {
    // Verificamos cuál de las dos llaves falló leyendo el nombre del "constraint"
    // (Postgres por defecto nombra los constraints: nombreTabla_nombreColumna_fkey)

    if (error?.constraint === "servicios_servicio_id_fkey") {
      res.status(404).json({ message: "El servicio especificado no existe." });
      return true;
    }
    if (error?.constraint === "registros_vehiculo_id_fkey") {
      res.status(404).json({ message: "El vehículo especificado no existe." });
      return true;
    }
    // Un fallback genérico por si cambiaste el nombre del constraint
    res.status(400).json({
      message:
        "Error de referencia: El recurso asociado no existe en la base de datos.",
    });
    return true;
  }
  return false;
};

module.exports = {
  validarCrearServicio,
  validarActualizarServicio,
  validarForaneasServicio,
  validarId,
};
