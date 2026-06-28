
const express = require("express");

const {VerUsuarios, CrearUsuario, BorrarUsuario} = require("../controles/estacionamiento.controles.js")

const router = express.Router()

router.get("/usuarios", VerUsuarios);

router.post("/:usuario", CrearUsuario);

router.delete("/:usuario", BorrarUsuario);

module.exports=router;