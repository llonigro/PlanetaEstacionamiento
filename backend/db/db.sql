-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE PlanetaEstacionamiento;

-- (Asegúrate de conectarte a la base de datos PlanetaEstacionamiento antes de ejecutar lo siguiente)

-- 2. TABLA USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasenia VARCHAR(100) NOT NULL,
    rol VARCHAR(100) NOT NULL,
    telefono VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA VEHÍCULOS
CREATE TABLE vehiculos (
    id SERIAL PRIMARY KEY,
    patente VARCHAR(100) UNIQUE NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    color VARCHAR(100),
    usuario_id INT NOT NULL,
    permitir_valet BOOLEAN NOT NULL, -- cambiar a default false 
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);  

-- 4. TABLA COCHERAS
CREATE TABLE cocheras (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    libre BOOLEAN  DEFAULT true,
    clima VARCHAR(100) NOT NULL
);


-- 5. TABLA REGISTROS 
CREATE TABLE registros (
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


-- 5. TABLA CATÁLOGO DE SERVICIOS
create table catalogo_servicios(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10, 2) NOT NULL
);

--6 TABLA SERVICIOS

-- 6. TABLA SERVICIOS (Con control de estados y notificaciones)
CREATE TABLE servicios(
    id SERIAL PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    servicio_id INT NOT NULL,
    -- Usamos CHECK para asegurar que solo entren los estados de tu negocio
    estado VARCHAR(50) DEFAULT 'En Espera', 
    precio_final DECIMAL(10, 2) NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notificado_cliente BOOLEAN DEFAULT false, -- Controla el envío de alertas/mensajes
    FOREIGN KEY(vehiculo_id) REFERENCES vehiculos(id),
    FOREIGN KEY(servicio_id) REFERENCES catalogo_servicios(id)
);


-- ==========================================
-- DATOS DE PRUEBA (INSERCIONES)
-- ==========================================

INSERT INTO usuarios (nombre, email, contrasenia, rol, telefono)
VALUES ('Santiago Quintana', 'santiago@gmail.com', '1234qwert', 'chofer', '123456789');

INSERT INTO vehiculos (patente, marca, modelo, color, usuario_id, permitir_valet)
VALUES ('ABC123', 'Toyota', 'Corolla', 'Rojo', 1, true);

INSERT INTO cocheras (numero, tipo, estado, libre, clima)
VALUES (1, 'Estándar', 'buen estado', true, 'Soleado');

INSERT INTO registros (cochera_id, vehiculo_id, fecha_ingreso, fecha_egreso, precio_total, anulado)
VALUES (1, 1, '2024-06-01 08:00:00', '2024-06-01 10:00:00', 20.00, false);



-- create table servicios(
--     id SERIAL PRIMARY KEY,
--     vehiculo_id INT NOT NULL,
--     servicio_id INT NOT NULL,
--     estado VARCHAR(100),
--     precio_final DECIMAL,
--     FOREIGN KEY(vehiculo_id) REFERENCES vehiculos(id)    
--     FOREIGN KEY(servicio_id) REFERENCES catalogo_servicios(id)
-- )