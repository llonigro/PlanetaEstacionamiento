const express = require('express');
const router = express.Router();
const { VerRegistros, VerUnicoRegistro,CrearIngreso, CrearEgreso } = require('../controles/registros-controles.js');

// Importamos nuestro middleware de validación
const {validarId, validarIngreso, validarEgreso} = require('../validacion/validacion-registro.js');


// Rutas limpias: Ruta -> Validación -> Controlador

router.get('/registros', VerRegistros);
router.get('/registros/:id', validarId, VerUnicoRegistro);

// Ruta para INGRESO (POST)
router.post('/registros/ingreso', validarIngreso, CrearIngreso);

// Ruta para EGRESO (PATCH o PUT, pasándole el ID del registro)
router.patch('/registros/:id', validarEgreso, CrearEgreso);

module.exports = router;
