
const express = require("express");
const {VerUsuario, VerUsuarios, CrearUsuario,ActualizarUsuario, BorrarUsuario} = require("../controles/Usuario-controles.js");

const router = express.Router();

/////////////////////////////// Tabla Usuarios //////////////////////////////////////////// 
// router.get("/usuarios", VerUsuarios);

// router.get("/usuarios/:id", VerUsuario);

// router.post("/usuarios", CrearUsuario);

// router.patch("/usuarios/:id", ActualizarUsuario); // la diferencia entre patch y put es que patch actualiza parcialmente no completo como put

// router.delete("/usuarios/:id", BorrarUsuario);


///////// forma optima ////////////////////////////////////////////////////////////////////

router.route("/usuarios")
    .get(VerUsuarios)
    .post(CrearUsuario);

router.route("/usuarios/:id")
    .get(VerUsuario)
    .patch(ActualizarUsuario)
    .delete(BorrarUsuario);

///////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;