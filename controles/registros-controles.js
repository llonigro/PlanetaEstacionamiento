// controles/Registros-controles.js
const registroServicio = require('../servicio/servicio-registro.js');

const VerRegistros = async (req, res) => {
    try {
        const registros = await registroServicio.obtenerTodos();
        if (registros.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros" });
        }
        res.json(registros).status(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const VerUnicoRegistro = async (req, res, next) => {
    try {
        const { id } = req.params;
        const registro = await registroServicio.VerRegistro(id);
        if (!registro) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }       
        res.json(registro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" }); 
    }
};

module.exports = {
    VerRegistros,
    VerUnicoRegistro
};
