const express = require('express');
const router = express.Router();
const { VerRegistros } = require('../controles/registros-controles.js');

// Importamos nuestro middleware de validación
//const data= require('../validacion/validacion-registro.js');


// Rutas limpias: Ruta -> Validación -> Controlador

router.get('/registros', VerRegistros);
module.exports = router;
