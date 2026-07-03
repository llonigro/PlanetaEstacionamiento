
const pool = require("../db/db.js");

const VerVehiculos = async (req, res) =>  {
    try {
        const {rows} = await pool.query(`SELECT * FROM vehiculos`);
        res.json(rows);
    } 
    catch(error) {
        return res.status(500).json({ message: 'Algo salió mal en el servidor' });
    }
}


module.exports= { 
    VerVehiculos,
}