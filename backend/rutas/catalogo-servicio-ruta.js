// rutas/catalogo-ruta.js
const express = require('express');
const router = express.Router();
const { VerCatalogoServicio, VerUnicoCatalogo} = require('../controles/catalogo-servicios-controles.js');

// Importamos nuestro middleware de validación
const { validarId} = require('../validacion/validacion-catalogo-servicio.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/catalogo', VerCatalogoServicio);
router.get('/catalogo/:id', validarId ,VerUnicoCatalogo);

module.exports = router;
