// controles/Usuario-controles.js
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

module.exports = {
    VerCocheras
};