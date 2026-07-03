
const express = require("express");
const {VerVehiculos} = require("../controles/vehiculos-controles.js");
const router = express.Router();

/////////////////////////////// Tabla vehiculos //////////////////////////////////////////// 
router.get("/vehiculos", VerVehiculos);

// router.get("/vehiculos/:id", VerVehiculo);

// router.post("/vehiculos", CrearVehiculo);

// router.patch("/vehiculos/:id", ActualizarVehiculo); // la diferencia entre patch y put es que patch actualiza parcialmente no completo como put

// router.delete("/vehiculos/:id", BorrarVehiculo);

///////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;