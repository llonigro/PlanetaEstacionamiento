// archivo que hace query
const express = require("express");
const {pool} = require("../db/db.js");

const router = express.Router()

router.get("/p", async (req, res) => {
    const resultado = await pool.query("SELECT * FROM usuarios;")
    res.json(resultado)
});
module.exports= {router};



