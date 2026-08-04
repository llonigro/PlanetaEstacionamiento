// rutas/Usuarios-ruta.js
const express = require("express");
const router = express.Router();
const {
  VerUsuarios,
  VerUnicoUsuario,
  CrearUsuario,
  ActualizarUsuario,
  eliminarUsuario,
  verificarToken,
} = require("../controles/Usuario-controles.js");

// Importamos nuestro middleware de validación
const {
  validarCrearUsuario,
  validarId,
  validarActualizarUsuario,
} = require("../validacion/validacion-usuario.js");

// Rutas limpias: Ruta -> Validación -> Controlador
router.get("/usuario", verificarToken, (req, res) => {
  res.status(200).json({ id: req.usuario.id, rol: req.usuario.rol });
});

router.get("/usuarios", VerUsuarios);

router.get("/usuarios/:id", validarId, VerUnicoUsuario);

router.post("/usuarios", validarCrearUsuario, CrearUsuario);

router.patch(
  "/usuarios/:id",
  validarId,
  validarActualizarUsuario,
  ActualizarUsuario,
);

router.delete("/usuarios/:id", validarId, eliminarUsuario);

module.exports = router;
