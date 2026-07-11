// rutas/Usuarios-ruta.js
const express = require('express');
const router = express.Router();
const { VerCocheras, VerUnicaCochera } = require('../controles/cocheras-controles.js');

// Importamos nuestro middleware de validación
const { validarId} = require('../validacion/validacion-cochera.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/cocheras', VerCocheras);

router.get('/cocheras/:id', validarId ,VerUnicaCochera);

module.exports = router;
