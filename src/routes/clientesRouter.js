const express = require("express");
const router = express.Router("Router");

const {
  crearCliente,
  obtenerTodosClientes,
  obtenerClientePorId,
  eliminarCliente,
  actualizarCliente,
} = require("../controllers/clienteController");

// Obtener todos los empleados
router.post("/clientes", crearCliente);
router.get("/clientes", obtenerTodosClientes);
router.put("/clientes/:id_cliente", actualizarCliente);
router.delete("/clientes/:id_cliente", eliminarCliente);
router.get("/clientes/:id_cliente", obtenerClientePorId);

module.exports = router;
