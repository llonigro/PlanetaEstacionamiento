const express = require("express");
const {pool} = require("../db/db.js");
const RutaUsuario = require("./estacionamiento.rutas.js")
const IndexRuta = require("./index.rutas.js")

const PORT = 5000;


const app = express()
app.use(RutaUsuario);
app.use(IndexRuta);

app.listen(PORT, () => {
    console.log(PORT)
});
