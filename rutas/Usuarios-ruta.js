
const express = require("express");
const {VerUsuario, VerUsuarios, CrearUsuario,ActualizarUsuario, BorrarUsuario} = require("../controles/Usuario-controles.js");
const { check, body } = require("express-validator");
const router = express.Router();

/////////////////////////////// Tabla Usuarios ////////////////////////////////////////////  router.get("/usuarios", VerUsuarios);


const chequeos = [
    body("nombre").escape().notEmpty().withMessage("El nombre es obligatorio").bail().isAlpha().withMessage("El nombre debe contener letras"),
    body("email").escape().notEmpty().withMessage("El email es obligatorio").bail().isEmail().withMessage("El email es incorrecto")
]


//////////////////////////////////////////////////////////////////////////////
router.get("/usuarios/:id", VerUsuario);

router.post("/usuarios",chequeos, CrearUsuario);


 router.patch("/usuarios/:id", ActualizarUsuario); // la diferencia entre patch y put es que patch actualiza parcialmente no completo como put

router.delete("/usuarios/:id", BorrarUsuario);


///////// forma optima ////////////////////////////////////////////////////////////////////

// router.route("/usuarios")
//    .get(VerUsuarios)
//    .post(CrearUsuario);

// router.route("/usuarios/:id")
//    .get(VerUsuario)
//    .patch(ActualizarUsuario)
//    .delete(BorrarUsuario);

///////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;