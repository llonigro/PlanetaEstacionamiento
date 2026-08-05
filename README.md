# Planeta Estacionamiento

Plataforma web que ofrece un sistema para gestionar estacionamientos: registro de ingresos y egresos, administración de cocheras, gestión de servicios (lavado/valet) y paneles para clientes y personal.

## Descripción y características

### Rol Encargado

- **Gestión de ocupación:** registrar ingresos y egresos de vehículos, anular registros y liberar cocheras.
- **Monitoreo en tiempo real:** visualizar cocheras libres/ocupadas desde el dashboard.
- Administración de catálogo de servicios y control de estados (lavado/valet).

### Rol Cliente

- Consultar disponibilidad de cocheras y seleccionar/registrar ingreso (cuando está autenticado).
- Ver información del vehículo y solicitar servicios (lavado/valet) desde el dashboard.

### Otras funciones relevantes

- Panel de noticias y promociones en el frontend.
- Registro de servicios asociados a vehículos con estados y notificaciones al cliente.
- Control de anulación segura de registros y consistencia de la ocupación de cocheras.

## Estado del proyecto

Esta versión incluye:

- Backend en Node.js + Express con endpoints para usuarios, cocheras, vehículos, registros y servicios.
- Frontend estático (HTML/CSS/JS) con dashboard cliente y modales para interactuar con el sistema.
- Conexión a PostgreSQL y scripts de creación de tablas en `backend/db/db.sql`.

## Ejecutar localmente

1. Instalar dependencias (desde la raíz del proyecto):

```bash
npm install
```

2. Crear un archivo `.env` en la raíz con las variables de conexión a la DB (ejemplo):

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=PlanetaEstacionamiento
PORT=3000
```

3. Levantar backend:

```bash
npm start
```

4. Servir el frontend (opcional) con un servidor estático, por ejemplo:

```bash
# desde la carpeta raíz
python3 -m http.server 5500 --directory frontend
```

Abrir `http://localhost:5500/dashboard.html` en el navegador.

## Endpoints principales (resumen)

- `GET /cocheras` — lista de cocheras
- `GET /cocheras/:id` — detalle de una cochera
- `POST /cocheras` — crear cochera
- `PATCH /cocheras/:id` — actualizar cochera
- `DELETE /cocheras/:id` — eliminar cochera

- `GET /vehiculos` — lista de vehículos
- `GET /vehiculos/usuario/:id` — vehículo por usuario
- `GET /vehiculos/:id` — detalle vehículo
- `POST /vehiculos` — crear vehículo
- `PATCH /vehiculos/:id` — actualizar vehículo
- `DELETE /vehiculos/:id` — eliminar vehículo

- `GET /registros` — lista de registros
- `GET /registros/:id` — detalle registro
- `POST /registros/ingreso` — registrar ingreso (asigna cochera)
- `PATCH /registros/egreso/:id` — registrar egreso (cierra registro)
- `DELETE /registros/:id` — anular registro

- `GET /catalogo` — catálogo de servicios
- `GET /catalogo/:id` — detalle catálogo
- `POST /catalogo` — crear entrada de catálogo
- `PATCH /catalogo/:id` — actualizar catálogo
- `DELETE /catalogo/:id` — eliminar catálogo

- `GET /servicios` — servicios solicitados (lavado/valet)
- `GET /servicios/:id` — detalle servicio
- `POST /servicios` — crear servicio (asocia a vehículo y catálogo)
- `PATCH /servicios/:id` — actualizar estado/precio
- `DELETE /servicios/:id` — eliminar servicio

- `GET /usuario` — endpoint protegido que retorna `id` y `rol` del usuario logueado (usa token)

> Nota: muchas rutas usan validaciones y middleware; revisar `backend/rutas` y `backend/controles` para más detalles.

## Estructura real de la base de datos (resumen)

Las tablas principales definidas en `backend/db/db.sql` son:

- `usuarios`:
  - `id SERIAL PRIMARY KEY`
  - `nombre VARCHAR(100)`
  - `email VARCHAR(100) UNIQUE`
  - `contrasenia VARCHAR(100)`
  - `rol VARCHAR(100)`
  - `telefono VARCHAR(100)`
  - `fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- `vehiculos`:
  - `id SERIAL PRIMARY KEY`
  - `patente VARCHAR(100) UNIQUE`
  - `marca VARCHAR(100)`
  - `modelo VARCHAR(100)`
  - `color VARCHAR(100)`
  - `usuario_id INT` (FK -> `usuarios.id`)
  - `permitir_valet BOOLEAN`

- `cocheras`:
  - `id SERIAL PRIMARY KEY`
  - `numero INT UNIQUE`
  - `tipo VARCHAR(100)`
  - `libre BOOLEAN DEFAULT true`
  - `clima VARCHAR(100)`

- `registros`:
  - `id SERIAL PRIMARY KEY`
  - `cochera_id INT` (FK -> `cocheras.id`)
  - `vehiculo_id INT` (FK -> `vehiculos.id`)
  - `fecha_ingreso TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`
  - `fecha_egreso TIMESTAMPTZ` (nullable)
  - `precio_total DECIMAL(10,2)`
  - `anulado BOOLEAN DEFAULT false`

- `catalogo_servicios`:
  - `id SERIAL PRIMARY KEY`
  - `nombre VARCHAR(100)`
  - `descripcion TEXT`
  - `precio_base DECIMAL(10,2)`

- `servicios`:
  - `id SERIAL PRIMARY KEY`
  - `vehiculo_id INT` (FK -> `vehiculos.id`)
  - `servicio_id INT` (FK -> `catalogo_servicios.id`)
  - `estado VARCHAR(50) DEFAULT 'En Espera'`
  - `precio_final DECIMAL(10,2)`
  - `fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  - `notificado_cliente BOOLEAN DEFAULT false`

## Notas y recomendaciones

- El backend espera un archivo `.env` con las credenciales de la base de datos; revisá `backend/index/config.js` para la ubicación esperada.
- Para pruebas rápidas del frontend sin backend, podés usar `python3 -m http.server` desde la carpeta `frontend`.
- Si querés poblar la base de datos localmente, ejecutá las sentencias SQL en `backend/db/db.sql`.

## Integrantes

| Nombre y Apellido      | Legajo  | Rol / Aporte principal | GitHub |
| ---------------------- | :------: | :--------------------- | :----: |
| **Quintana, Santiago** | `114723` | Backend y lógica del servidor | [@Quintana](https://github.com/santiagoquintana574-collab) |
| **Lo Nigro, Lucas**    | `115601` | Frontend e interfaz de usuario | [@LoNigro](https://github.com/llonigro) |
