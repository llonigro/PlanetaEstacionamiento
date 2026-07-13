const express = require('express');
const router = express.Router();
const { VerRegistros, VerUnicoRegistro } = require('../controles/registros-controles.js');

// Importamos nuestro middleware de validación
const {validarId} = require('../validacion/validacion-registro.js');


// Rutas limpias: Ruta -> Validación -> Controlador

router.get('/registros', VerRegistros);
router.get('/registros/:id', validarId, VerUnicoRegistro);
module.exports = router;
