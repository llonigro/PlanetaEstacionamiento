// rutas/catalogo-ruta.js
const express = require('express');
const router = express.Router();
const { VerCatalogosServicios, VerUnicoCatalogo, CrearCatalogo} = require('../controles/catalogo-servicios-controles.js');

// Importamos nuestro middleware de validación
const { validarId, validarCrearCatalogo} = require('../validacion/validacion-catalogo-servicio.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/catalogo', VerCatalogosServicios);
router.get('/catalogo/:id', validarId ,VerUnicoCatalogo);

router.post('/catalogo', validarCrearCatalogo,  CrearCatalogo);

module.exports = router;
