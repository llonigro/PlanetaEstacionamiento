// rutas/Usuarios-ruta.js
const express = require('express');
const router = express.Router();
const { VerCocheras } = require('../controles/cocheras-controles.js');

// Importamos nuestro middleware de validación
const { validarCrearUsuario, validarId, validarActualizarUsuario} = require('../validacion/validacion-usuario.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/cocheras', VerCocheras);

module.exports = router;
