const express = require("express");
const router = express.Router();

const {
  agregarProducto,
  obtenerTodosProductos,
  obtenerProductoPorId,
  eliminarProducto,
  actualizarProducto,
  actualizarEstadoProducto,
  actualizarStockProducto,
} = require("../controllers/productoController");

// Agregar un nuevo producto
router.post("/productos", agregarProducto);

// Obtener todos los productos
router.get("/productos", obtenerTodosProductos);

// Obtener un producto por su ID
router.get("/productos/:id_producto", obtenerProductoPorId);

// Actualizar un producto existente
router.put("/productos/:id_producto", actualizarProducto);

// Eliminar un producto
router.delete("/productos/:id_producto", eliminarProducto);
router.patch("/productos/:id_producto", actualizarEstadoProducto);
router.put("/productos/:id_producto/cantidad", actualizarStockProducto);

module.exports = router;
