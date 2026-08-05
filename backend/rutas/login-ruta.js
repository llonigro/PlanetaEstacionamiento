<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { login } = require('../controles/login-controles.js'); // agregar a logout si es necesario
const { validarLogin } = require('../validacion/validacion-login.js');

// Endpoint: POST 
router.post('/login', validarLogin, login);

// router.post('/logout', logout);

module.exports = router;
=======
const express = require("express");
const router = express.Router();
const { login, logout } = require("../controles/login-controles.js");
const { validarLogin } = require("../validacion/validacion-login.js");

// Endpoint: POST
router.post("/login", validarLogin, login);

router.post("/logout", logout);

module.exports = router;
>>>>>>> 9e477c78adada486447e268c4c3b3a08a265c88a
