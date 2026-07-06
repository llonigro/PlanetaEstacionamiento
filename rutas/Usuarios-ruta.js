// rutas/Usuarios-ruta.js
const express = require('express');
const router = express.Router();
const { VerUsuarios, VerUnicoUsuario ,CrearUsuario } = require('../controles/Usuario-controles.js');

// Importamos nuestro middleware de validación
const { validarCrearUsuario } = require('../validacion/validacion-usuario.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/usuarios', VerUsuarios);

router.get("/usuarios/:id", VerUnicoUsuario );

router.post('/usuarios', validarCrearUsuario, CrearUsuario);

module.exports = router;