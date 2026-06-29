
const express = require("express");
const {VerUsuario, VerUsuarios, CrearUsuario,ActualizarUsuario, BorrarUsuario} = require("../controles/Usuario-controles.js");

const router = express.Router();


router.get("/usuarios", VerUsuarios);

router.get("/usuario/:id", VerUsuario);

router.post("/usuario", CrearUsuario);

router.put("/usuario", ActualizarUsuario);

router.delete("/usuario", BorrarUsuario);

module.exports = router;