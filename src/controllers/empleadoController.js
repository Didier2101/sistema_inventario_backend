const empleadoService = require("../services/empleadoService");

const crearEmpleado = async (request, response) => {
  try {
    const empleado = request.body;
    await empleadoService.agregarEmpleado(empleado);
    response.status(201).json({ message: "Empleado creado exitosamente" });
  } catch (error) {
    if (
      error.message === "La cédula ya se encuentra registrada" ||
      error.message === "El correo electrónico ya se encuentra registrado"
    ) {
      response.status(400).json({
        error: "REGISTRO_DUPLICADO",
        message: error.message,
      });
    } else if (error.message === "Datos del empleado incompletos") {
      response.status(400).json({
        error: "DATOS_INCOMPLETOS",
        message: error.message,
      });
    } else {
      console.error("Error al crear los empleados:", error);
      response.status(500).json({ message: "Error al crear los empleados" });
    }
  }
};

// Controlador para actualizar un empleado
const actualizarEmpleado = async (request, response) => {
  const idEmpleado = request.params.id_empleado;
  const nuevoEmpleado = request.body;
  try {
    await empleadoService.actualizarEmpleado(idEmpleado, nuevoEmpleado);
    response
      .status(200)
      .json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    if (
      error.code === "CEDULA_DUPLICADA" ||
      error.code === "CORREO_DUPLICADO"
    ) {
      response.status(400).json({
        message: error.message,
        error: "REGISTRO_DUPLICADO",
      });
    } else {
      console.error("Error al actualizar el empleado:", error);
      res.status(500).json({ message: "Error al actualizar el empleado" });
    }
  }
};

// TODO =================================================================
// Controlador para obtener todos los empleados
const obtenerTodosEmpleados = async (request, response) => {
  try {
    const empleados = await empleadoService.obtenerTodosEmpleados();
    response.status(200).json(empleados);
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    response.status(500).json({ message: "Error al obtener los empleados" });
  }
};
// TODO =================================================================

// TODO =================================================================
const eliminarEmpleado = async (req, res) => {
  const idEmpleado = req.params.id_empleado;
  try {
    await empleadoService.eliminarEmpleado(idEmpleado);
    res.status(200).json();
  } catch (error) {
    // Si ocurre un error al eliminar el empleado, envía el error al cliente
    res.status(500).json({
      message:
        "el empleado no se puede eliminar porque esta encargado de un punto!",
    });
  }
};
// TODO =================================================================
const obtenerEmpleadoPorId = async (req, res) => {
  const idEmpleado = req.params.id_empleado;
  try {
    const empleado = await empleadoService.obtenerEmpleadoPorId(idEmpleado);
    res.status(200).json(empleado);
  } catch (error) {
    console.error("Error al obtener el empleado:", error);
    res.status(500).json({ message: "Error al obtener el empleado" });
  }
};
// TODO =================================================================

module.exports = {
  crearEmpleado,
  obtenerTodosEmpleados,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerEmpleadoPorId,
};
