const express = require("express");
const {
  VerVehiculos,
  VerVehiculoPorUsuario,
  VerUnicoVehiculo,
  CrearVehiculo,
  eliminarVehiculo,
  ActualizarVehiculo,
} = require("../controles/vehiculos-controles.js");
const router = express.Router();

// Importamos nuestro middleware de validación
const {
  validarId,
  validarCrearVehiculo,
  validarActualizarVehiculo,
} = require("../validacion/validacion-vehiculos.js");

/////////////////////////////// Tabla vehiculos ////////////////////////////////////////////
router.get("/vehiculos", VerVehiculos);

router.get("/vehiculos/usuario/:id", validarId, VerVehiculoPorUsuario);

router.get("/vehiculos/:id", validarId, VerUnicoVehiculo);

router.post("/vehiculos", validarCrearVehiculo, CrearVehiculo);

router.patch("/vehiculos/:id", validarActualizarVehiculo, ActualizarVehiculo); // la diferencia entre patch y put es que patch actualiza parcialmente no completo como put

router.delete("/vehiculos/:id", validarId, eliminarVehiculo);

///////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
