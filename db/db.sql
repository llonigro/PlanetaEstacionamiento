CREATE DATABASE PlanetaEstacionamiento;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasenia VARCHAR(100) NOT NULL,
    rol VARCHAR(100) NOT NULL,
    telefono VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplo de inserción
INSERT INTO usuarios (nombre, email, contrasenia, rol, telefono)
VALUES ('Santiago Quintana', 'santiago@gmail.com', '1234qwert', 'chofer', '123456789');


create table vehiculos (
    id SERIAL PRIMARY KEY,
    patente VARCHAR(100) UNIQUE NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    color VARCHAR(100),
    usuario_id INT NOT NULL,
    permitir_valet BOOLEAN NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);  

--ejemplo de inserccion

INSERT INTO vehiculos (patente, marca, modelo, color, usuario_id, permitir_valet)
VALUES  ('ABC123', 'Toyota', 'Corolla', 'Rojo', 1, true);


create table cocheras (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    libre BOOLEAN NOT NULL,
    clima VARCHAR(100) NOT NULL
);

---ejemplo de inserccion

INSERT INTO cocheras (numero, tipo, estado, libre, clima)
VALUES (1, 'Estándar', 'Disponible', true, 'Soleado');

create table registros (
    id SERIAL PRIMARY KEY,
    cochera_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    fecha_ingreso DATETIME NOT NULL,
    fecha_egreso DATETIME,
    precio_total DECIMAL NOT NULL,
    FOREIGN KEY(cochera_id) REFERENCES cocheras(id),    
    FOREIGN KEY(vehiculo_id) REFERENCES vehiculos(id)    
);

-- create table catalogo_servicios(
--     id SERIAL PRIMARY KEY,
--     nombre VARCHAR(100) NOT NULL,
--     descripcion TEXT,
--     precio_base DECIMAL NOT NULL
-- );

-- create table servicios(
--     id SERIAL PRIMARY KEY,
--     vehiculo_id INT NOT NULL,
--     servicio_id INT NOT NULL,
--     estado VARCHAR(100),
--     precio_final DECIMAL,
--     FOREIGN KEY(vehiculo_id) REFERENCES vehiculos(id)    
--     FOREIGN KEY(servicio_id) REFERENCES catalogo_servicios(id)
-- )