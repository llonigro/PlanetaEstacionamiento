// /registro.servicio.js
const pool = require("../db/db.js");

// Extraemos la lógica de base de datos a funciones puras

// 1. GET COMPLETO
const obtenerTodos = async () => {
  const { rows } = await pool.query("SELECT * FROM servicios");
  return rows;
};

// 2. GET ÚNICO
const VerServicio = async (id) => {
  const { rows } = await pool.query("SELECT * FROM servicios WHERE id = $1", [
    id,
  ]);
  return rows[0];
};

// 3. POST
const crear = async (datos) => {
  const {
    vehiculo_id,
    servicio_id,
    precio_final,
    usuario_valet_id,
    direccion_entrega,
  } = datos;
  const result = await pool.query(
    "INSERT INTO servicios (vehiculo_id, servicio_id, precio_final, usuario_valet_id, direccion_entrega) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      vehiculo_id,
      servicio_id,
      precio_final,
      usuario_valet_id,
      direccion_entrega,
    ],
  );
  return result.rows[0];
};

// 4. PATCH
const actualizarParcial = async (id, datos) => {
  const { estado, precio_final, usuario_valet_id, direccion_entrega } = datos;

  // Consulta dinámica para actualizar solo lo que se envía (PATCH)
  const result = await pool.query(
    `UPDATE servicios SET 
            estado = COALESCE($1, estado), 
            precio_final = COALESCE($2, precio_final),
            usuario_valet_id = COALESCE($3, usuario_valet_id),
            direccion_entrega = COALESCE($4, direccion_entrega)
         WHERE id = $5 RETURNING *`,
    [estado, precio_final, usuario_valet_id, direccion_entrega, id],
  );

  return result.rows[0];
};

// 5 . DELETE
const eliminar = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM servicios WHERE id = $1 RETURNING *",
    [id],
  );
  return rows[0];
};

/////////////////////////////////////////////////////////////////////////////////
module.exports = {
  obtenerTodos,
  VerServicio,
  crear,
  actualizarParcial,
  eliminar,
};
