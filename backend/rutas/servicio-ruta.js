const express = require('express');
const router = express.Router();

const { ObtenerServicios, VerUnicoServicio } = require('../controles/servicio-controles.js');
const { validarCrearServicio, validarActualizarServicio, validarForaneasServicio, validarId } = require('../validacion/validacion-servicio.js');

// Rutas
router.get('/servicios', ObtenerServicios);
router.get("/servicios/:id", validarId , VerUnicoServicio );

// router.post('/servicios', validarCrearServicio, CrearServicio);

// Usamos PATCH porque es ideal para transiciones de estados (ej. 'En Espera' a 'Finalizado') 
// router.patch('/servicios/:id', validarActualizarServicio, ActualizarEstadoServicio);

module.exports = router;