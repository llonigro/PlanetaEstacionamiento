# Planeta Estacionamiento

# modulos 
- npm install dotenv
- npm install pg
- npm install express



> Plataforma web que ofrece un servicio de gestión de estacionamientos diseñado para optimizar las tareas del personal administrativo y permitir a los clientes consultar disponibilidad y tarifas en tiempo real

## Características Principales

### Rol Encargado
- **Gestión de ocupación:** Registro de entrada y salida de vehículos.
- **Monitoreo en tiempo real:** Interfaz gráfica con el estado de las cocheras (libres/ocupadas).
- **Reportes financieros:** Administración de tarifas y estadísticas de recaudación.

### Rol Cliente
- **Consulta de disponibilidad:** Vista pública que permite verificar y elegir cocheras libres. 
- **Información comercial:** Acceso a tarifas, horarios, ubicación y servicios de atención


### Otras funciones

- **Tablero de Noticias:** Sección interactiva con novedades de eventos ocurridos estacionamiento.
- **Sistema de Reporte de Daños:** Permite a los clientes denunciar de forma digital en caso de que el vehiculo haya sufrido algún siniestro, o haya sido multado (durante el uso de uno de los valets).
- **Alertas de Riesgo Climático:** Notificaciones que advierten a los sectores afectados por condiciones climáticas (ej: granizo, inundaciones, etc.)
- **Servicio de Lavado (Car Wash):**
  - **Gestión de Turnos:** Asignación de vehículos a la zona de lavado según el orden de llegada o reserva previa.
  - **Control de Estados:** Monitoreo del proceso del vehículo en tiempo real (`En Espera`, `Lavando`, `Listo para Entrega`).
  - **Notificaciones automáticas:** Envío de una alerta al portal del cliente cuando su auto está limpio y listo para ser retirado. 
- **Servicio de Valet Colaborativo:** 
  - **Delivery de Auto:** Permite solicitar que un chofer lleve el vehículo hasta la ubicación actual del cliente por un costo adicional.
  - **Logística Colaborativa:** Los clientes pueden autorizar voluntariamente el uso de sus vehículos para traslados de cortesía de los valets hacia otros servicios.
  - **Beneficio e Información:** El sistema calcula la distancia recorrida, otorga descuentos automáticos en la tarifa del dueño del auto e indica el tiempo estimado de retorno.

## Tecnologías Utilizadas
- **Lenguaje:** `JavaScript (Node.js)`
- **Framework:** `Express`
- **Base de Datos:** `PostgreSQL`
- **Otras:** `Git` y `Docker`

## Estructura de Datos (PostgreSQL)

El sistema cuenta con una base de datos relacional, a continuación se detallan tablas principales y sus campos:

- **`usuarios`**: `id` (PK), `nombre`, `email`, `password`, `rol` (encargado/cliente).
- **`cocheras`**: `id` (PK), `numero`, `estado` (libre/ocupada), `riesgo_clima` (booleano).
- **`vehiculos`**: `id` (PK), `patente`, `marca`, `modelo`, `usuario_id` (FK), `permitir_valet` (booleano)
- **`servicios_lavado`**: `id` (PK), `vehiculo_id` (FK), `estado` (espera/lavando/listo), `precio`.
- **`valet_registros`**: `id` (PK), `vehiculo_usado_id` (FK), `cliente_id` (FK), `chofer_id` (FK), `estado` (`en_camino` / `entregado` / `volviendo`), `distancia_km`, `descuento`.
- **`noticias`**: `id` (PK), `titulo`, `contenido`, `imagen_url`, `fecha_publicacion`.

## Dependencias

>[!WARNING] Campo en desarrollo
> Acá van las dependencias para poder levantar el proyecto tipo las versiones o el Docker  


## Integrantes del Grupo
| Nombre y Apellido                     |  Legajo  |                 GitHub                 |
| ------------------------------------- | :------: | :------------------------------------: |
| **Garabatos Macchi, Federico Hernan** | `114242` | [@cuenta1](https://github.com/cuenta1) |
| **Quintana, Santiago**                | `114723` | [@cuenta2](https://github.com/cuenta2) |
| **Ayala Choque, Facundo Nicolás**     | `115323` | [@cuenta3](https://github.com/cuenta3) |
| **Lo Nigro, Lucas**                   | `115601` | [@cuenta4](https://github.com/cuenta4) |