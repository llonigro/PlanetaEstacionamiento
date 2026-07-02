const pool = require("../db/db.js");

const VerUsuario = async (req, res) => {
    try { 
        const {id} = req.params;
        const {rows} = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id])
        res.json(rows);
    } 
    catch(error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
};

const VerUsuarios = async (req, res) => {
    try {
        const {rows} = await pool.query(`SELECT * FROM usuarios`);
        res.json(rows);
    } 
    catch(error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
    // validar lenght   
};

const CrearUsuario = async (req, res) => {
    try { 
        const {nombre, email, contrasenia, rol} = req.body;
        const { rows } = await pool.query("INSERT INTO usuarios (nombre, email, contrasenia, rol) VALUES ($1, $2, $3, $4) RETURNING *",[nombre, email, contrasenia, rol]);
        res.json(rows[0]);
    }
    catch(error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
    // affectedRows
    // send status 
};

const ActualizarUsuario = async (req, res) => {
    try { 
        const {id} = req.params;
        const {nombre, email, contrasenia, rol} = req.body;
        const { rows } = await pool.query( // COALESCE => Actualiza los campos, pero si no cambio todos los datos no los pisa el null.
            "UPDATE usuarios SET nombre = COALESCE($1, nombre), email = COALESCE($2, email), contrasenia = COALESCE($3, contrasenia), rol = COALESCE($4, rol) WHERE id = $5 RETURNING *",
            [nombre, email, contrasenia, rol, id]);
        res.json(rows[0]);
    }
    catch(error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
    // affectedRows
    // send status 
};

const BorrarUsuario  = async (req, res) => {
    try {
        const {id} = req.params;
        const {rows} = await pool.query("DELETE FROM usuarios WHERE id = $1",[id]);
        res.json(rows);
    } 
    catch (error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
};

module.exports= {
    VerUsuario,
    VerUsuarios,
    CrearUsuario,
    ActualizarUsuario,
    BorrarUsuario,
}
