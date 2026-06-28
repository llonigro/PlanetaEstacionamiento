const pool = require("../db/db.js");


const consulta = async (req, res) => {
    const resultado = await pool.query("SELECT * FROM usuarios;");
    res.send(resultado.rows);
};

module.exports = {consulta};