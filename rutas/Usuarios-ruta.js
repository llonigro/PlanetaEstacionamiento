// rutas/Usuarios-ruta.js
const express = require('express');
const router = express.Router();
const { VerUsuarios, VerUnicoUsuario ,CrearUsuario, ActualizarUsuario, eliminarUsuario } = require('../controles/Usuario-controles.js');

// Importamos nuestro middleware de validación
const { validarCrearUsuario, validarId, validarActualizarUsuario} = require('../validacion/validacion-usuario.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/usuarios', VerUsuarios);

router.get("/usuarios/:id", validarId , VerUnicoUsuario );

router.post('/usuarios', validarCrearUsuario, CrearUsuario);

router.patch('/usuarios/:id', validarId, validarActualizarUsuario, ActualizarUsuario);

router.delete('/usuarios/:id', validarId, eliminarUsuario);

module.exports = router;