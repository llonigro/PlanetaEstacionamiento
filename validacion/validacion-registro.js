

const registroServicio = require('../servicio/servicio-registro.js');

// Verificamos si el error es de "tabla no existente" (código 42P01)
const verificarTablaNoExistente = (error, res) => {
    if (error.code === '42P01') {
        // console.warn("Advertencia: La tabla 'registros' no existe todavía.");
        res.status(404).json({ message: "La tabla 'registros' no existe todavía." });
        return true;
    }
    return false;
};

module.exports = {
    verificarTablaNoExistente
};