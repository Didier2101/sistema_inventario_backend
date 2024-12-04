const clienteService = require("../services/clienteService");

// codigo para agregar un cliente
const crearCliente = async (request, response) => {
  try {
    const cliente = request.body;
    await clienteService.agregarCliente(cliente);
    response.status(201).json({ message: "Cliente creado exitosamente" });
  } catch (error) {
    if (error.message === "El correo electrónico ya se encuentra registrado") {
      response.status(400).json({
        error: "REGISTRO_DUPLICADO",
        message: error.message,
      });
    } else if (error.message === "Datos del cliente incompletos") {
      response.status(400).json({
        error: "DATOS_INCOMPLETOS",
        message: error.message,
      });
    } else {
      console.error("Error al crear el cliente", error);
      response.status(500).json({ message: "Error al crear el cliente" });
    }
  }
};

// TODO =================================================================
const actualizarCliente = async (req, res) => {
  const idCliente = req.params.id_cliente; // Cambiado de 'id_empleado' a 'id_cliente'
  const nuevoCliente = req.body; // El cuerpo de la solicitud contiene los datos actualizados del cliente
  try {
    // Lógica para actualizar el cliente utilizando el servicio de cliente correspondiente
    await clienteService.actualizarCliente(idCliente, nuevoCliente);
    res.status(200).json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    if (
      error.code === "CEDULA_DUPLICADA" ||
      error.code === "CORREO_DUPLICADO"
    ) {
      res.status(400).json({
        message: error.message,
        error: "REGISTRO_DUPLICADO",
      });
    } else {
      console.error("Error al actualizar el cliente:", error);
      res.status(500).json({ message: "Error al actualizar el cliente" });
    }
  }
};
// codigo para obtener todos los clientes
const obtenerTodosClientes = async (req, res) => {
  try {
    const clientes = await clienteService.obtenerTodosClientes();
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    res.status(500).json({ message: "Error al obtener los clientes" });
  }
};

const obtenerClientePorId = async (req, res) => {
  const idCliente = req.params.id_cliente;
  try {
    const cliente = await clienteService.obtenerClientePorId(idCliente);
    res.status(200).json(cliente);
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    res.status(500).json({ message: "Error al obtener el cliente" });
  }
};
// codigo para eliminar un cliente
// TODO =================================================================
const eliminarCliente = async (req, res) => {
  const idCliente = req.params.id_cliente;
  try {
    await clienteService.eliminarCliente(idCliente);
    res.status(200).json();
  } catch (error) {
    res.status(500).json();
  }
};

// TODO =================================================================
module.exports = {
  crearCliente,
  obtenerTodosClientes,
  eliminarCliente,
  obtenerClientePorId,
  actualizarCliente,
};
