const pool = require("../database");

// Código para crear un punto de venta
const agregarPuntoVenta = async (puntoVenta) => {
  try {
    if (
      !puntoVenta.nombre_punto_venta ||
      !puntoVenta.telefono ||
      !puntoVenta.direccion ||
      !puntoVenta.encargado
    )
      throw new Error("Datos del punto de venta incompletos");

    await pool.query("START TRANSACTION");

    // Insertar datos del punto de venta
    const insertarPuntoVenta = `INSERT INTO puntos_ventas ( nombre_punto_venta, telefono, direccion, encargado)
    VALUES(?, ?, ?, ?)`;

    // Resultado del punto de venta insertado
    const [resultadoPuntoVentaInsertado] = await pool.query(
      insertarPuntoVenta,
      [
        puntoVenta.nombre_punto_venta,
        puntoVenta.telefono,
        puntoVenta.direccion,
        puntoVenta.encargado,
      ]
    );
    await pool.query("COMMIT");
    console.log(
      "Punto de venta agregado correctamente:",
      resultadoPuntoVentaInsertado
    );
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al agregar el punto de venta", error);
    throw error;
  }
};

// Código para obtener todos los puntos de venta
const obtenerTodosPuntosVentas = async () => {
  try {
    const query =
      "SELECT pv.*, e.nombres AS encargado FROM puntos_ventas pv JOIN empleados e ON pv.encargado = e.id_empleado";
    const [puntosVentas, _] = await pool.query(query);
    return puntosVentas;
  } catch (error) {
    console.error("Error al obtener los puntos de venta:", error);
    throw error;
  }
};

const eliminarPuntoVenta = async (idPuntoVenta) => {
  try {
    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Eliminar punto de venta
    const eliminarPuntoVentaQuery = `
      DELETE FROM puntos_ventas
      WHERE id_punto_venta = ?
    `;
    await pool.query(eliminarPuntoVentaQuery, [idPuntoVenta]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log("Punto de venta eliminado correctamente de la base de datos");
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error(
      "Error al eliminar el punto de venta de la base de datos:",
      error
    );
    throw error;
  }
};

const obtenerPuntoVentaPorId = async (idPuntoVenta) => {
  try {
    const obtenerPuntoVenta =
      "SELECT * FROM puntos_ventas WHERE id_punto_venta = ?";
    const [puntosVenta, _] = await pool.query(obtenerPuntoVenta, [
      idPuntoVenta,
    ]);
    if (puntosVenta.length === 0) {
      throw new Error("Punto de venta no encontrado");
    } else {
      return puntosVenta[0];
    }
  } catch (error) {
    console.error("Error al obtener el punto de venta:", error);
    throw error;
  }
};

const actualizarPuntoVenta = async (idPuntoVenta, nuevoPuntoVenta) => {
  try {
    // Continuar con la actualización del punto de venta
    const query = `
      UPDATE puntos_ventas
      SET 
        nombre_punto_venta = ?,
        telefono = ?,
        direccion = ?,
        encargado = ?
      WHERE id_punto_venta = ?
    `;
    const values = [
      nuevoPuntoVenta.nombre_punto_venta,
      nuevoPuntoVenta.telefono,
      nuevoPuntoVenta.direccion,
      nuevoPuntoVenta.encargado,
      idPuntoVenta,
    ];
    await pool.query(query, values);

    console.log("Punto de venta actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el punto de venta:", error);
    throw error;
  }
};

module.exports = {
  obtenerTodosPuntosVentas,
  agregarPuntoVenta,
  eliminarPuntoVenta,
  obtenerPuntoVentaPorId,
  actualizarPuntoVenta,
};
