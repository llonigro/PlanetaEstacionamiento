// services/vehiculos.service.js
const pool = require("../db/db.js");
// 2. GET COMPLETO
const obtenerTodos = async () => {
  const { rows } = await pool.query("SELECT * FROM vehiculos");
  return rows;
};

// 2. GET ÚNICO
const VerVehiculo = async (id) => {
  const { rows } = await pool.query("SELECT * FROM vehiculos WHERE id = $1", [
    id,
  ]);
  return rows[0]; // Retorna el vehículo o undefined si no existe
};

// 2.1 GET POR USUARIO
const VerVehiculoPorUsuario = async (usuarioId) => {
  const { rows } = await pool.query(
    "SELECT * FROM vehiculos WHERE usuario_id = $1 ORDER BY id DESC LIMIT 1",
    [usuarioId],
  );
  return rows[0];
};

// 3. POST
const crearVehiculo = async (datosVehiculo) => {
  const { patente, marca, modelo, color, usuario_id, permitir_valet } =
    datosVehiculo;
  const { rows } = await pool.query(
    "INSERT INTO vehiculos (patente, marca, modelo, color, usuario_id, permitir_valet) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [patente, marca, modelo, color, usuario_id, permitir_valet],
  );
  return rows[0];
};

// 4. PATCH
const actualizarParcial = async (id, datosVehiculo) => {
  // const {id} = datosUsuario;
  const { patente, marca, modelo, color, usuario_id, permitir_valet } =
    datosVehiculo;

  const { rows } = await pool.query(
    `UPDATE vehiculos SET 
        patente = COALESCE($1, patente), 
        marca = COALESCE($2, marca), 
        modelo = COALESCE($3, modelo), 
        color = COALESCE($4, color), 
        usuario_id = COALESCE($5, usuario_id), 
        permitir_valet = COALESCE($6, permitir_valet) 
        WHERE id = $7 RETURNING *`,
    [
      patente ?? null,
      marca ?? null,
      modelo ?? null,
      color ?? null,
      usuario_id ?? null,
      permitir_valet ?? null,
      id,
    ],
  );
  return rows[0];
};

// 5 . DELETE
const eliminar = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM vehiculos WHERE id = $1 RETURNING *",
    [id],
  );
  return rows[0]; // Retorna el vehículo eliminado o undefined si no existía
};

module.exports = {
  obtenerTodos,
  VerVehiculo,
  VerVehiculoPorUsuario,
  crearVehiculo,
  eliminar,
  actualizarParcial,
};
