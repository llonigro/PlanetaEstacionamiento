// controles/Cocheras-controles.js
const cocherasServicio = require('../servicio/servicio-cocheras.js');

const VerCocheras = async (req, res) => {
    try {
        const cocheras = await cocherasServicio.obtenerTodos();
        res.json(cocheras);
        // console.log(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const VerUnicaCochera = async (req, res) => {
    try {
        const { id } = req.params;
        const cocheria = await cocherasServicio.VerCochera(id);
        if (!cocheria) {
            return res.status(404).json({ message: "Cochera no encontrada" });
        }
        
        res.json(cocheria).status(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const CrearCochera = async (req, res) => {
    try {
        const nuevaCochera = await cocherasServicio.crear(req.body);
        if (!nuevaCochera) {
            return res.status(400).json({ message: "No se pudo crear la cochera" });
        }
        res.status(201).json(nuevaCochera);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const ActualizarCochera = async (req, res) => {
    try {
        const { id } = req.params;
        const cocheraActualizada = await cocherasServicio.actualizarParcial(id, req.body);
        if (!cocheraActualizada) {
            return res.status(404).json({ message: "cochera no encontrada" });
        }
        res.status(200).json(cocheraActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};


module.exports = {
    VerCocheras,
    VerUnicaCochera,
    CrearCochera,
    ActualizarCochera
};