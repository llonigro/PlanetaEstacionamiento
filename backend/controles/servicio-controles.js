const serviciosService = require('../servicio/servicio-servicios.js');

const ObtenerServicios = async (req, res, next) => {
    try {
        const servicios = await serviciosService.obtenerTodos();
        if (servicios.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros" })
        }
        res.status(200).json(servicios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
};

const VerUnicoServicio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const servicio = await serviciosService.VerServicio(id);
        if (servicio === undefined) {
            return res.status(404).json({ message: "servicio no encontrado" });
        }
        
        res.json(servicio);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
};

///////////////////////////////////////////////////////////////////////////////

module.exports = {ObtenerServicios, VerUnicoServicio};