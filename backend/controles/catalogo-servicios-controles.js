// controles/catalogo-servicio-controles.js
const catalogoServicio = require('../servicio/servicio-catalogo-servicios.js');

const VerCatalogoServicio = async (req, res) => {
    try {
        const catalogo = await catalogoServicio.obtenerTodos();

        if (catalogo.length === 0) {
            return res.status(404).json({ message: "No se encontraron servicios" });
        }

        res.status(200).json(catalogo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

module.exports = {
    VerCatalogoServicio
};