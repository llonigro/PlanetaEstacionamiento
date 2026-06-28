// archivo que hace query
const express = require("express");
const {pool} = require("../db/db.js");
const {consulta} = require("../controles/index.controles.js");


const router = express.Router();

router.get("/p", consulta);

module.exports = router;



