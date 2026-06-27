
const express = require("express");

const {getUsuarios} = require("../controles/estacionamiento.controles.js")

const router = express.Router()



router.get("/usuarios", getUsuarios);

module.exports=router;