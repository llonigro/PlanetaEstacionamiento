const express = require('express');
const router = express.Router();
const { login } = require('../controles/login-controles.js'); // agregar a logout si es necesario
const { validarLogin } = require('../validacion/validacion-login.js');

// Endpoint: POST 
router.post('/login', validarLogin, login);

// router.post('/logout', logout);

module.exports = router;