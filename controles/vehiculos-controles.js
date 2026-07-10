
const pool = require("../db/db.js");
// controles/Usuario-controles.js
const VehiculosServicio = require('../servicio/servicio-vehiculo.js');
const { ValidarPatente, ValidarForeignKey } = require('../validacion/validacion-vehiculos.js');




// 1. GET COMPLETO
const VerVehiculos = async (req, res) =>  {
    try {
        const vehiculo = await VehiculosServicio.obtenerTodos(); 
        res.json(vehiculo);
    } 
    catch(error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
};

// 2. GET ÚNICO
const VerUnicoVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculo = await VehiculosServicio.VerVehiculo(id);
        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }
        
        res.json(vehiculo);
    } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });

    }
};


// 3. POST 
const CrearVehiculo = async (req, res) => {
    try {
        const nuevoVehiculo = await VehiculosServicio.crearVehiculo(req.body);
        return res.status(201).json(nuevoVehiculo);
    } catch(error) {

        if (ValidarPatente(error, res)) {
            return;
        }
        // Verificamos si es un error de patente duplicada (Código de Postgres 23505)
        //if (error.code === '23505' && error.constraint === 'vehiculos_patente_key') {
        //    return res.status(400).json({ message: 'La patente ya se encuentra registrada' });
        //}

        if (ValidarForeignKey(error, res)) {
            return;
        }

        // Verificamos si es un error de usuario inexistente (Código de Postgres 23503)
        //if (error.code === '23503' && error.constraint === 'vehiculos_usuario_id_fkey') {
         //   return res.status(400).json({ message: 'El usuario asignado no existe en el sistema' });
        //}



        // Si es cualquier otro error, lo imprimimos en consola y respondemos con 500
        console.error("Error al crear el vehículo:", error); 
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
};


// 4. DELETE
const eliminarVehiculo = async (req, res) => {
    try {
        const {id} = req.params;
        const vehiculo = await VehiculosServicio.eliminar(id);
        if (!vehiculo) {
            return res.status(404).json({ message: "vehiculo no encontrado" });
        }
        return res.status(204).json({ message: "vehiculo eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};


module.exports= { 
    VerVehiculos,
    VerUnicoVehiculo,
    CrearVehiculo,
    eliminarVehiculo
}