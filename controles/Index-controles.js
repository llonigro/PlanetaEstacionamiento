const pool = require("../db/db.js");


const consulta_Usuarios = async (req, res) => {
    const resultado = await pool.query("SELECT * FROM usuarios;");
    res.send(resultado.rows);
};

module.exports = {consulta_Usuarios};