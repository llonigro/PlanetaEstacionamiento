create usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasenia VARCHAR(100) NOT NULL,
    rol VARCHAR(100)
);

create vehiculos (
    id SERIAL PRIMARY KEY,
    patente VARCHAR(100) UNIQUE NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    usuario_id int,
    permitir_valet boolean,
    FOREIGN KEY (usuario) REFERENCES usuarios(id)
);  

