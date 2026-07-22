// controles/Usuario-controles.js
const usuariosService = require('../servicio/servicio-usuario.js');
const { validarGmailUnico, validarClaveForanea } = require('../validacion/validacion-usuario.js');

const VerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuariosService.obtenerTodos();

        if (!usuarios) {
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }

        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const VerUnicoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuariosService.VerUsuario(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.json(usuario);
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

const ActualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioActualizado = await usuariosService.actualizarParcial(id, req.body);
        if (usuarioActualizado === undefined) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(usuarioActualizado);
    } catch (error) {
        if (validarGmailUnico(error, res)) {
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const {id} = req.params;
        const usuario = await usuariosService.eliminar(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(204).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        if (validarClaveForanea(error, res)) {
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" });
    }
};
module.exports = { VerUsuarios,VerUnicoUsuario ,CrearUsuario, ActualizarUsuario, eliminarUsuario };