// rutas/catalogo-ruta.js
const express = require('express');
const router = express.Router();
const { VerCatalogosServicios, VerUnicoCatalogo, CrearCatalogo, ActualizarCatalogo} = require('../controles/catalogo-servicios-controles.js');

// Importamos nuestro middleware de validación
const { validarId, validarCrearCatalogo, validarActualizarCatalogo} = require('../validacion/validacion-catalogo-servicio.js');


// Rutas limpias: Ruta -> Validación -> Controlador
router.get('/catalogo', VerCatalogosServicios);
router.get('/catalogo/:id', validarId ,VerUnicoCatalogo);

router.post('/catalogo', validarCrearCatalogo,  CrearCatalogo);

router.patch('/catalogo/:id', validarActualizarCatalogo, ActualizarCatalogo);

module.exports = router;
