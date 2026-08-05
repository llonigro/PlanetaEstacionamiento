const pool = require("../db/db.js");
// controles/Usuario-controles.js
const VehiculosServicio = require("../servicio/servicio-vehiculo.js");
const {
  ValidarPatente,
  ValidarForeignKey,
  ValidarForeignKeyRegistros,
  ValidarForeignKeyServicio,
} = require("../validacion/validacion-vehiculos.js");

// 1. GET COMPLETO
const VerVehiculos = async (req, res) => {
  try {
    const vehiculo = await VehiculosServicio.obtenerTodos();
    res.json(vehiculo);
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

// 1.1 GET POR USUARIO
const VerVehiculoPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await VehiculosServicio.VerVehiculoPorUsuario(id);

    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    res.json(vehiculo);
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal en el servidor" });
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
    return res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

// 3. POST
const CrearVehiculo = async (req, res) => {
  try {
    const nuevoVehiculo = await VehiculosServicio.crearVehiculo(req.body);
    return res.status(201).json(nuevoVehiculo);
  } catch (error) {
    if (ValidarPatente(error, res)) {
      return;
    }

    if (ValidarForeignKey(error, res)) {
      return;
    }

    // Si es cualquier otro error, lo imprimimos en consola y respondemos con 500
    console.error("Error al crear el vehículo:", error);
    return res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

// 4. PATCH
const ActualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculoActualizado = await VehiculosServicio.actualizarParcial(
      id,
      req.body,
    );

    if (!vehiculoActualizado) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    res.json(vehiculoActualizado);
  } catch (error) {
    if (ValidarPatente(error, res)) {
      return;
    }
    if (ValidarForeignKey(error, res)) {
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

// 5. DELETE
const eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await VehiculosServicio.eliminar(id);
    if (!vehiculo) {
      return res.status(404).json({ message: "vehiculo no encontrado" });
    }
    return res
      .status(204)
      .json({ message: "vehiculo eliminado correctamente" });
  } catch (error) {
    if (ValidarForeignKeyRegistros(error, res)) {
      return;
    }
    if (ValidarForeignKeyServicio(error, res)) {
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

module.exports = {
  VerVehiculos,
  VerVehiculoPorUsuario,
  VerUnicoVehiculo,
  CrearVehiculo,
  eliminarVehiculo,
  ActualizarVehiculo,
};
