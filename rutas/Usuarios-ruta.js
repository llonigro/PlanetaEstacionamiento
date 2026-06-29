
const express = require("express");
const {VerUsuario, VerUsuarios, CrearUsuario,ActualizarUsuario, BorrarUsuario} = require("../controles/Usuario-controles.js");

const router = express.Router();

/////////////////////////////// Tabla Usuarios //////////////////////////////////////////// 
router.get("/usuarios", VerUsuarios);

router.get("/usuarios/:id", VerUsuario);

router.post("/usuarios", CrearUsuario);

router.put("/usuarios", ActualizarUsuario);

router.delete("/usuarios/:id", BorrarUsuario);

///////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;