const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { login, logout } = require("../controles/login-controles.js");
const { validarLogin } = require("../validacion/validacion-login.js");
=======
const { login } = require('../controles/login-controles.js'); // agregar a logout si es necesario
const { validarLogin } = require('../validacion/validacion-login.js');
>>>>>>> 7533cd532b774ba17e4283ff0caebb583882a1da

// Endpoint: POST
router.post("/login", validarLogin, login);

<<<<<<< HEAD
router.post("/logout", logout);

module.exports = router;
=======
// router.post('/logout', logout);

module.exports = router;
>>>>>>> 7533cd532b774ba17e4283ff0caebb583882a1da
