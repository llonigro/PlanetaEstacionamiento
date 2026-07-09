
const pool = require("../db/db.js");
// controles/Usuario-controles.js
const VehiculosServicio = require('../servicio/servicio-vehiculo.js');



// 1. GET COMPLETO
const VerVehiculos = async (req, res) =>  {
    try {
        const {rows} = await VehiculosServicio.obtenerTodos(); 
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron vehículos' });
        }
        res.json(rows);
    } 
    catch(error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
}


module.exports= { 
    VerVehiculos,
}