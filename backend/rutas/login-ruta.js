const express = require("express");
const router = express.Router();
const { login, logout } = require("../controles/login-controles.js");
const { validarLogin } = require("../validacion/validacion-login.js");

// Endpoint: POST
router.post("/login", validarLogin, login);

router.post("/logout", logout);

module.exports = router;
