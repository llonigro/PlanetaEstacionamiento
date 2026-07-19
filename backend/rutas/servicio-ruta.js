const express = require('express');
const router = express.Router();

const { ObtenerServicios, VerUnicoServicio, CrearServicio, ActualizarServicio } = require('../controles/servicio-controles.js');
const { validarCrearServicio, validarActualizarServicio, validarId } = require('../validacion/validacion-servicio.js');

// Rutas
router.get('/servicios', ObtenerServicios);
router.get("/servicios/:id", validarId , VerUnicoServicio );

router.post('/servicios', validarCrearServicio, CrearServicio);

// Usamos PATCH porque es ideal para transiciones de estados (ej. 'En Espera' a 'Finalizado') 
router.patch("/servicios/:id", validarActualizarServicio ,ActualizarServicio);

module.exports = router;