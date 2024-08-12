const express = require("express");
const router = express.Router();

const {
  crearProveedor,
  obtenerTodosProveedores,
  obtenerProveedorPorId,
  eliminarProveedor,
  actualizarProveedor,
} = require("../controllers/proveedorController");

// Crear un nuevo proveedor
router.post("/proveedores", crearProveedor);

// Obtener todos los proveedores
router.get("/proveedores", obtenerTodosProveedores);

// Obtener un proveedor por su ID
router.get("/proveedores/:id_proveedor", obtenerProveedorPorId);

// Actualizar un proveedor existente
router.put("/proveedores/:id_proveedor", actualizarProveedor);

// Eliminar un proveedor
router.delete("/proveedores/:id_proveedor", eliminarProveedor);

module.exports = router;
