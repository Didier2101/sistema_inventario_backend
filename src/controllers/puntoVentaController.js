const puntoVentaService = require("../services/puntoVentaService");

// Código para agregar un punto de venta
const crearPuntoVenta = async (request, response) => {
  try {
    const puntoVenta = request.body;
    await puntoVentaService.agregarPuntoVenta(puntoVenta);
    response
      .status(201)
      .json({ message: "Punto de venta creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el punto de venta", error);
    response.status(500).json({ message: "Error al crear el punto de venta" });
  }
};

// Código para obtener todos los puntos de venta
const obtenerTodosPuntosVentas = async (req, res) => {
  try {
    const puntosVentas = await puntoVentaService.obtenerTodosPuntosVentas();
    res.status(200).json(puntosVentas);
  } catch (error) {
    console.error("Error al obtener los puntos de venta:", error);
    res.status(500).json({ message: "Error al obtener los puntos de venta" });
  }
};

// Código para obtener un punto de venta por ID
const obtenerPuntoVentaPorId = async (req, res) => {
  const idPuntoVenta = req.params.id_punto_venta;
  try {
    const puntoVenta = await puntoVentaService.obtenerPuntoVentaPorId(
      idPuntoVenta
    );
    res.status(200).json(puntoVenta);
  } catch (error) {
    console.error("Error al obtener el punto de venta:", error);
    res.status(500).json({ message: "Error al obtener el punto de venta" });
  }
};

// Código para eliminar un punto de venta
const eliminarPuntoVenta = async (req, res) => {
  const idPuntoVenta = req.params.id_punto_venta;
  try {
    await puntoVentaService.eliminarPuntoVenta(idPuntoVenta);
    res.status(200).json({ message: "Punto de venta eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el punto de venta, ", error);
    res
      .status(500)
      .json({
        message:
          "Error al eliminar el punto de venta, el encargado sigue activo:",
      });
  }
};

// Código para actualizar un punto de venta
const actualizarPuntoVenta = async (req, res) => {
  const idPuntoVenta = req.params.id_punto_venta;
  const nuevoPuntoVenta = req.body;
  try {
    await puntoVentaService.actualizarPuntoVenta(idPuntoVenta, nuevoPuntoVenta);
    res
      .status(200)
      .json({ message: "Punto de venta actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el punto de venta:", error);
    res.status(500).json({ message: "Error al actualizar el punto de venta" });
  }
};

module.exports = {
  crearPuntoVenta,
  obtenerTodosPuntosVentas,
  eliminarPuntoVenta,
  obtenerPuntoVentaPorId,
  actualizarPuntoVenta,
};
