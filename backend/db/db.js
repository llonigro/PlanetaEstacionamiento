const { Pool } = require("pg");
const config = require('../Index/config.js');

const pool = new Pool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: String(config.DB_PASSWORD),
    database: config.DB_DATABASE,
    port: Number(config.DB_PORT || 5432),
});

pool.connect()
    .then(() => console.log("Conexión a PostgreSQL exitosa"))
    .catch((err) => console.error("Error al conectar a PostgreSQL:", err));

module.exports = pool;
