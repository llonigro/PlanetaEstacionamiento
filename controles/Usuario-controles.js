const pool = require("../db/db.js");

const VerUsuario = async (req, res) => {
    const {id} = req.params;
    const {rows} = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id])
    res.json(rows);
};

const VerUsuarios = async (req, res) => {
    const {rows} = await pool.query(`SELECT * FROM usuarios`);
        res.json(rows);
};

const CrearUsuario = async (req, res) => {
    const {nombre, email, contrasenia, rol} = req.body;
    const { rows } = await pool.query("INSERT INTO usuarios (nombre, email, contrasenia, rol) VALUES ($1, $2, $3, $4) RETURNING *",[nombre, email, contrasenia, rol]);
    res.json(rows[0]);
};

const ActualizarUsuario = async (req, res) => {
    const {id} = req.body;
    const {rows} = await pool.query("DELETE FROM usuarios WHERE id = $1",[id]);
    res.json(rows);
};

const BorrarUsuario  = async (req, res) => {
    await pool.query
};

module.exports= {
    VerUsuario,
    VerUsuarios,
    CrearUsuario,
    ActualizarUsuario,
    BorrarUsuario,
}
