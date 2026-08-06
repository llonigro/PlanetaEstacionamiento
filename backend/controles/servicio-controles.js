const serviciosService = require("../servicio/servicio-servicios.js");
const {
  validarForaneasServicio,
} = require("../validacion/validacion-servicio.js");

/////////////////////////////////////////////////////////////////////////////////////
const ObtenerServicios = async (req, res) => {
  try {
    const servicios = await serviciosService.obtenerTodos();
    if (servicios.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros" });
    }
    res.status(200).json(servicios);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

const VerUnicoServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await serviciosService.VerServicio(id);
    if (servicio === undefined) {
      return res.status(404).json({ message: "servicio no encontrado" });
    }

    res.json(servicio);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

const CrearServicio = async (req, res) => {
  try {
    const nuevoServicio = await serviciosService.crear(req.body);
    if (!nuevoServicio) {
      return res
        .status(404)
        .json({ message: "No se pudo crear correctamente el servicio" });
    }
    res.status(201).json({
      message: "Servicio registrado con éxito",
      registro: nuevoServicio,
    });
  } catch (error) {
    // Si es un error de PostgreSQL (Llaves foráneas)
    if (validarForaneasServicio(error, res)) return;
    console.error(error);
    res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

const ActualizarServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servicioActualizado = await serviciosService.actualizarParcial(
      id,
      req.body,
    );

    if (!servicioActualizado) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    res.status(200).json({
      mensaje: "Servicio actualizado exitosamente",
      servicio: servicioActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await serviciosService.eliminar(id);
    if (!servicio) {
      return res.status(404).json({
        ok: false,
        mensaje: "Servicio no encontrado",
      });
    }
    res.status(200).json({
      ok: true,
      mensaje: "Servicio eliminado correctamente de la base de datos",
      servicioEliminado: servicio[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Algo salió mal en el servidor" });
  }
};

///////////////////////////////////////////////////////////////////////////////

module.exports = {
  ObtenerServicios,
  VerUnicoServicio,
  CrearServicio,
  ActualizarServicio,
  eliminarServicio,
};
