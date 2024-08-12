const express = require("express");
const router = express.Router();
const {
  crearEmpleado,
  obtenerTodosEmpleados,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerEmpleadoPorId,
} = require("../controllers/empleadoController");

// Obtener todos los empleados
router.post("/empleados", crearEmpleado);
router.get("/empleados", obtenerTodosEmpleados);
router.put("/empleados/:id_empleado", actualizarEmpleado);
router.delete("/empleados/:id_empleado", eliminarEmpleado);
router.get("/empleados/:id_empleado", obtenerEmpleadoPorId);

module.exports = router;
