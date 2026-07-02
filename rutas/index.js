const express = require("express");
const {pool} = require("../db/db.js");
const RutaUsuario = require("./Usuarios-ruta.js");





const PORT = 5000;

const app = express();
app.use(express.json({ strict: false }));
app.use(RutaUsuario); // otro ejemplo de colocar ruta ("/api/", RutaUsuario);

// si no existe la ruta devuelve un json ej / http://localhost:5000/dhdh
app.use((req, res, next) => {
    res.status(404).json({
        message: "Endpoint no encontrado "
    });
});



app.listen(PORT, () => {
    console.log(PORT);
});
