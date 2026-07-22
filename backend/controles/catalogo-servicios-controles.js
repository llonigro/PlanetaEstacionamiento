// controles/catalogo-servicio-controles.js
const catalogoServicio = require('../servicio/servicio-catalogo-servicios.js');
const { ValidarForeignKeyServicio } = require('../validacion/validacion-catalogo-servicio.js');


const VerCatalogosServicios = async (req, res) => {
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

const CrearCatalogo = async (req, res) => {
    try {
        const nuevoCatalogo = await catalogoServicio.crear(req.body);
        if (!nuevoCatalogo) {
            return res.status(400).json({ message: "No se pudo crear el catalogo" });
        }
        res.status(201).json(nuevoCatalogo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const ActualizarCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        const catalogoActualizado = await catalogoServicio.actualizarParcial(id, req.body);
        if (catalogoActualizado === undefined) {
            return res.status(404).json({ message: "catalogo no encontrado" });
        }
        res.json(catalogoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const eliminarCatalogo = async (req, res) => {
    try {
        const {id} = req.params;
        const catalogo = await catalogoServicio.eliminar(id);
        if (catalogo === undefined) {
            return res.status(404).json({ message: "catalogo no encontrado" });
        }
        return res.json({ message: "catalogo eliminado correctamente" });
    } catch (error) {
        if (ValidarForeignKeyServicio(error, res)) {
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};



module.exports = {
    VerCatalogosServicios,
    VerUnicoCatalogo,
    CrearCatalogo,
    ActualizarCatalogo,
    eliminarCatalogo
};