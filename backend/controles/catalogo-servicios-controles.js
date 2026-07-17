// controles/catalogo-servicio-controles.js
const catalogoServicio = require('../servicio/servicio-catalogo-servicios.js');

const VerCatalogoServicio = async (req, res) => {
    try {
        const catalogos = await catalogoServicio.obtenerTodos();

        if (catalogos.length === 0) {
            return res.status(404).json({ message: "No se encontraron servicios" });
        }

        res.status(200).json(catalogos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const VerUnicoCatalogo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const catalogo = await catalogoServicio.VerCatalogo(id);
        if (catalogo === undefined) {
            return res.status(404).json({ message: "Catalogo no encontrado" });
        }
        
        res.status(200).json(catalogo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};


module.exports = {
    VerCatalogoServicio,
    VerUnicoCatalogo
};