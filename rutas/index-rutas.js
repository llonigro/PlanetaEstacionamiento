// archivo que hace query
const express = require("express");
const {pool} = require("../db/db.js");
const {consulta_Usuarios} = require("../controles/Index-controles.js");


const router = express.Router();

router.get("/pool", consulta_Usuarios);

module.exports = router;



