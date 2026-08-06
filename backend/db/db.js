const { Pool } = require("pg");
const config = require('../index/config.js');

const pool = new Pool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: String(config.DB_PASSWORD),
    database: config.DB_DATABASE,
    port: Number(config.DB_PORT || 5432),
});

const initSchema = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                contrasenia VARCHAR(100) NOT NULL,
                rol VARCHAR(100) NOT NULL,
                telefono VARCHAR(100),
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS vehiculos (
                id SERIAL PRIMARY KEY,
                patente VARCHAR(100) UNIQUE NOT NULL,
                marca VARCHAR(100) NOT NULL,
                modelo VARCHAR(100) NOT NULL,
                color VARCHAR(100),
                usuario_id INT NOT NULL,
                permitir_valet BOOLEAN NOT NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            );

            CREATE TABLE IF NOT EXISTS cocheras (
                id SERIAL PRIMARY KEY,
                numero INT UNIQUE NOT NULL,
                tipo VARCHAR(100) NOT NULL,
                libre BOOLEAN DEFAULT true,
                clima VARCHAR(100) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS registros (
                id SERIAL PRIMARY KEY,
                cochera_id INT NOT NULL,
                vehiculo_id INT NOT NULL,
                fecha_ingreso TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                fecha_egreso TIMESTAMPTZ,
                precio_total DECIMAL(10, 2) NOT NULL,
                anulado BOOLEAN DEFAULT false,
                FOREIGN KEY(cochera_id) REFERENCES cocheras(id),
                FOREIGN KEY(vehiculo_id) REFERENCES vehiculos(id)
            );

            CREATE TABLE IF NOT EXISTS catalogo_servicios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                precio_base DECIMAL(10, 2) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS servicios (
                id SERIAL PRIMARY KEY,
                vehiculo_id INT NOT NULL,
                servicio_id INT NOT NULL,
                usuario_valet_id INT,
                direccion_entrega VARCHAR(255),
                estado VARCHAR(50) DEFAULT 'En Espera',
                precio_final DECIMAL(10, 2) NOT NULL,
                fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(vehiculo_id) REFERENCES vehiculos(id),
                FOREIGN KEY(servicio_id) REFERENCES catalogo_servicios(id),
                FOREIGN KEY(usuario_valet_id) REFERENCES usuarios(id)
            );
        `);

        console.log("Esquema de PostgreSQL inicializado");
    } catch (err) {
        console.error("Error al inicializar el esquema de PostgreSQL:", err);
    }
};

pool.connect()
    .then(async () => {
        console.log("Conexión a PostgreSQL exitosa");
        await initSchema();
    })
    .catch((err) => console.error("Error al conectar a PostgreSQL:", err));

module.exports = pool;
