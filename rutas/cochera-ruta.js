// rutas/Usuarios-ruta.js
const express = require('express');
const router = express.Router();
const { VerCocheras, VerUnicaCochera, CrearCochera, ActualizarCochera } = require('../controles/cocheras-controles.js');

// Importamos nuestro middleware de validación
const { validarId, validarCrearCochera, validarActualizarCochera} = require('../validacion/validacion-cochera.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/cocheras', VerCocheras);

router.get('/cocheras/:id', validarId ,VerUnicaCochera);

router.post('/cocheras', validarCrearCochera, CrearCochera);

router.patch('/cocheras/:id', validarId, validarActualizarCochera, ActualizarCochera);

module.exports = router;
