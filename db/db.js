const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "1234567890qwertyuiop",
    database: "planetaestacionamiento",
    port: 5432,
});

pool.connect()
    .then(() => console.log("Conexión a PostgreSQL exitosa"))
    .catch((err) => console.error("Error al conectar a PostgreSQL:", err));

module.exports = pool;