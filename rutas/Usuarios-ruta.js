// rutas/Usuarios-ruta.js
const express = require('express');
const router = express.Router();
const { VerUsuarios, CrearUsuario } = require('../controles/Usuario-controles.js');

// Importamos nuestro middleware de validación
const { validarCrearUsuario } = require('../validacion/validacion-usuario.js');

// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/usuarios', VerUsuarios);

router.get("/usuarios/:id", )
router.post('/usuarios', validarCrearUsuario, CrearUsuario);

router.patch("/usuario")

module.exports = router;