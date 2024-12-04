const pool = require("../database");

// Código para crear una bodega
const agregarBodega = async (bodega) => {
  try {
    if (
      !bodega.nombres ||
      !bodega.telefono ||
      !bodega.direccion ||
      !bodega.encargado
    )
      throw new Error("Datos de la bodega incompletos");

    await pool.query("START TRANSACTION");

    // Insertar datos de la bodega
    const insertarBodega = `INSERT INTO bodegas (nombres, telefono, direccion, encargado)
    VALUES(?, ?, ?, ?)`;

    // Resultado de la bodega insertada
    const [resultadoBodegaInsertada] = await pool.query(insertarBodega, [
      bodega.nombres,
      bodega.telefono,
      bodega.direccion,
      bodega.encargado,
    ]);
    await pool.query("COMMIT");
    console.log("Bodega agregada correctamente:", resultadoBodegaInsertada);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al agregar la bodega", error);
    throw error;
  }
};

// Código para obtener todas las bodegas
const obtenerBodegas = async () => {
  try {
    const query =
      "SELECT b.*, e.nombres AS encargado FROM bodegas b JOIN empleados e ON b.encargado = e.id_empleado";
    const [bodegas, _] = await pool.query(query);
    return bodegas;
  } catch (error) {
    console.error("Error al obtener las bodegas:", error);
    throw error;
  }
};

const eliminarBodega = async (idBodega) => {
  try {
    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Eliminar bodega
    const eliminarBodegaQuery = `
      DELETE FROM bodegas
      WHERE id_bodega = ?
    `;
    await pool.query(eliminarBodegaQuery, [idBodega]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log("Bodega eliminada correctamente de la base de datos");
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al eliminar la bodega de la base de datos:", error);
    throw error;
  }
};

const obtenerBodegaPorId = async (idBodega) => {
  try {
    const obtenerBodega = "SELECT * FROM bodegas WHERE id_bodega = ?";
    const [bodega, _] = await pool.query(obtenerBodega, [idBodega]);
    if (bodega.length === 0) {
      throw new Error("Bodega no encontrada");
    } else {
      return bodega[0];
    }
  } catch (error) {
    console.error("Error al obtener la bodega:", error);
    throw error;
  }
};

const actualizarBodega = async (idBodega, nuevaBodega) => {
  try {
    // Continuar con la actualización de la bodega
    const query = `
      UPDATE bodegas
      SET 
        nombres = ?,
        telefono = ?,
        direccion = ?,
        encargado = ?
      WHERE id_bodega = ?
    `;
    const values = [
      nuevaBodega.nombres,
      nuevaBodega.telefono,
      nuevaBodega.direccion,
      nuevaBodega.encargado,
      idBodega,
    ];
    await pool.query(query, values);

    console.log("Bodega actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la bodega:", error);
    throw error;
  }
};

const obtenerProductosPorBodega = async (idBodega) => {
  try {
    const query = `
     SELECT 
        p.id_producto,
        b.nombres AS bodega,
        p.nombre,
        p.referencia,
        p.descripcion,
        p.precio_venta,
        p.cantidad
      FROM 
        productos p
      LEFT JOIN 
        bodegas b ON p.bodega = b.id_bodega
      WHERE
        p.bodega = ?
    `;
    const [rows] = await pool.query(query, [idBodega]);
    return rows;
  } catch (error) {
    console.error("Error al obtener los productos por bodega:", error);
    throw error;
  }
};

module.exports = {
  agregarBodega,
  obtenerBodegas,
  eliminarBodega,
  obtenerBodegaPorId,
  actualizarBodega,
  obtenerProductosPorBodega,
};
