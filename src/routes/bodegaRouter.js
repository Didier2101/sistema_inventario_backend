const express = require("express");
const router = express.Router();

const {
  crearBodegas,
  obtenerBodegas,
  obtenerBodegaPorId,
  actualizarBodega,
  eliminarBodega,
  obtenerProductosPorBodega,
} = require("../controllers/bodegaController");

// Agregar un nuevo punto de venta
router.post("/bodegas", crearBodegas);

// Obtener todos los puntos de ventas
router.get("/bodegas", obtenerBodegas);

// Obtener un punto de venta por su ID
router.get("/bodegas/:id_bodega", obtenerBodegaPorId);

// Actualizar un punto de venta existente
router.put("/bodegas/:id_bodega", actualizarBodega);

// Eliminar un punto de venta
router.delete("/bodegas/:id_bodega", eliminarBodega);

router.get("/bodegas/:id_bodega/productos", obtenerProductosPorBodega);

module.exports = router;
