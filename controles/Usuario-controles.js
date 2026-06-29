const pool = require("../db/db.js");

const VerUsuario = async (req, res) => {
    const {id} = req.params;
    const {rows} = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id])
    res.json(rows);
};

const VerUsuarios = (req, res) => {
    console.log(req.body);
    res.send("post suces");
};

const CrearUsuario = (req, res) => {
    console.log();
};

const ActualizarUsuario = (req, res) => {
    console.log();
};

const BorrarUsuario  = (req, res) => {
    console.log();
};

module.exports= {
    VerUsuario,
    VerUsuarios,
    CrearUsuario,
    ActualizarUsuario,
    BorrarUsuario,
}
