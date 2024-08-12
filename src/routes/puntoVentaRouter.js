const express = require("express");
const router = express.Router();

const {
  crearPuntoVenta,
  obtenerTodosPuntosVentas,
  obtenerPuntoVentaPorId,
  eliminarPuntoVenta,
  actualizarPuntoVenta,
} = require("../controllers/puntoVentaController");

// Crear un nuevo punto de venta
router.post("/puntos_ventas", crearPuntoVenta);

// Obtener todos los puntos de ventas
router.get("/puntos_ventas", obtenerTodosPuntosVentas);

// Obtener un punto de venta por su ID
router.get("/puntos_ventas/:id_punto_venta", obtenerPuntoVentaPorId);

// Actualizar un punto de venta existente
router.put("/puntos_ventas/:id_punto_venta", actualizarPuntoVenta);

// Eliminar un punto de venta
router.delete("/puntos_ventas/:id_punto_venta", eliminarPuntoVenta);

module.exports = router;
