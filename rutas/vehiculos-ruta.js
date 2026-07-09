
const express = require("express");
const {VerVehiculos, VerUnicoVehiculo} = require("../controles/vehiculos-controles.js");
const router = express.Router();


// Importamos nuestro middleware de validación
const {validarId} = require('../validacion/validacion-vehiculos.js');


/////////////////////////////// Tabla vehiculos //////////////////////////////////////////// 
router.get("/vehiculos", VerVehiculos);

router.get("/vehiculos/:id", validarId ,VerUnicoVehiculo);

// router.post("/vehiculos", CrearVehiculo);

// router.patch("/vehiculos/:id", ActualizarVehiculo); // la diferencia entre patch y put es que patch actualiza parcialmente no completo como put

// router.delete("/vehiculos/:id", BorrarVehiculo);

///////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;