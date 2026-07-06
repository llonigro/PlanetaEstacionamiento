// controles/Usuario-controles.js
const usuariosService = require('../servicio/servicio-usuario.js');
const { validarGmailUnico } = require('../validacion/validacion-usuario.js');

const VerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuariosService.obtenerTodos()
        res.json(usuarios);
        console.log(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const CrearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await usuariosService.crear(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        if (validarGmailUnico(error, res)) {
            return;
        }

        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

module.exports = { VerUsuarios, CrearUsuario };