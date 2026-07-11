// rutas/Usuarios-ruta.js
const express = require('express');
const router = express.Router();
const { VerCocheras, VerUnicaCochera, CrearCochera } = require('../controles/cocheras-controles.js');

// Importamos nuestro middleware de validación
const { validarId, validarCrearCochera} = require('../validacion/validacion-cochera.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/cocheras', VerCocheras);

router.get('/cocheras/:id', validarId ,VerUnicaCochera);

router.post('/cocheras', validarCrearCochera, CrearCochera);


module.exports = router;
