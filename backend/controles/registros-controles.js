// controles/Registros-controles.js
const registroServicio = require('../servicio/servicio-registro.js');

const { validarForaneasRegistro } = require('../validacion/validacion-registro.js');

const VerRegistros = async (req, res) => {
    try {
        const registros = await registroServicio.obtenerTodos();
        if (registros.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros" });
        }
        return res.json(registros).status(200);
    } catch (error) {
        if (error.code ==='42P01') { // Código de error de PostgreSQL para tabla no encontrada
            return res.status(500).json({ message: "Error de base de datos: Tabla 'registros' no encontrada" });
        }
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
        if (error.code ==='42P01') { // Código de error de PostgreSQL para tabla no encontrada
            return res.status(500).json({ message: "Error de base de datos: Tabla 'registros' no encontrada" });
        }
        console.error(error);
        res.status(500).json({ message: "Algo salió mal en el servidor" }); 
    }
};


// POST
const CrearIngreso = async (req, res) => {
    try {
        const nuevoRegistro = await registroServicio.registrarIngreso(req.body);
        res.status(201).json({ 
            message: 'Ingreso registrado con éxito', 
            registro: nuevoRegistro 
        });
    } catch (error) {
        // Si es un error lógico de negocio que lanzamos desde el servicio
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        // Si es un error de PostgreSQL (Llaves foráneas)
        if (validarForaneasRegistro(error, res)) return;

        console.error(error);
        res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
};


// PATCH 
const CrearEgreso = async (req, res) => {
    const { id } = req.params;
    try {
        const registroActualizado = await registroServicio.registrarEgreso(id, req.body);
        res.status(200).json({ 
            message: 'Egreso registrado y cochera liberada', 
            registro: registroActualizado 
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
};


// DELETE
const EliminarRegistro = async (req, res) => {
    const { id } = req.params;
    try {
        const registroEliminado = await registroServicio.eliminarLogico(id);
        res.status(200).json({
            message: 'Registro eliminado con éxito (Anulado lógicamente)',
            registro: registroEliminado
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Algo salió mal en el servidor al intentar eliminar el registro' });
    }
};


module.exports = {
    VerRegistros,
    VerUnicoRegistro,
    CrearEgreso,
    CrearIngreso,
    EliminarRegistro
};
