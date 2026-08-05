const config = require("./config.js");
const express = require("express");
<<<<<<< HEAD
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {pool} = require("../db/db.js");
=======
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { pool } = require("../db/db.js");
>>>>>>> 9e477c78adada486447e268c4c3b3a08a265c88a
///////////////////////////////////////////////////////////////////////////
const RutaUsuario = require("../rutas/Usuarios-ruta.js");
const RutaVehiculos = require("../rutas/vehiculos-ruta.js");
const RutaCocheras = require("../rutas/cochera-ruta.js");
const RutaRegistros = require("../rutas/registros-ruta.js");
const RutaCatalogoServicios = require("../rutas/catalogo-servicio-ruta.js");
const RutaServicios = require("../rutas/servicio-ruta.js");
const RutaLogin = require("../rutas/login-ruta.js");

const corsOptions = {
  origin: "http://localhost:5500",
  credentials: true,
  optionsSuccessStatus: 200,
};

const PORT = 3000;

const app = express();
app.use((req, res, next) => {
  console.log("ORIGIN RECIBIDO:", req.headers.origin);
  next();
});
app.use(cors(corsOptions));
//app.use(config)
app.use(express.json({ strict: false }));
<<<<<<< HEAD
app.use(cookieParser()); 
app.use(RutaUsuario); 
app.use(RutaVehiculos)
app.use(RutaCocheras)
app.use(RutaRegistros)
app.use(RutaCatalogoServicios)
// app.use(RutaRegistros)
app.use(RutaServicios)
app.use(RutaLogin)
=======
app.use(cookieParser());
app.use(RutaUsuario);
app.use(RutaVehiculos);
app.use(RutaCocheras);
app.use(RutaRegistros);
app.use(RutaCatalogoServicios);
// app.use(RutaRegistros)
app.use(RutaServicios);
app.use(RutaLogin);
>>>>>>> 9e477c78adada486447e268c4c3b3a08a265c88a
// si no existe la ruta devuelve un json ej / http://localhost:5000/dhdh
app.use((req, res, next) => {
  res.status(404).json({
    message: "Endpoint no encontrado ",
  });
});

app.listen(PORT, () => {
  console.log(PORT);
});
