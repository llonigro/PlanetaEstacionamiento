// controles/Registros-controles.js
const registroServicio = require('../servicio/servicio-registro.js');

const { verificarTablaNoExistente } = require('../validacion/validacion-registro.js');

const VerRegistros = async (req, res) => {
    try {
        const registros = await registroServicio.obtenerTodos();
        if (!registros) {
            return res.status(404).json({ message: "No se encontraron registros" });
        }
        res.json(registros).status(200);
        // console.log(usuarios);
    } catch (error) {
        if (verificarTablaNoExistente(error, res)) {
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

module.exports = {
    VerRegistros
};