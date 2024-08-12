const proveedorService = require("../services/proveedorService");

// Código para agregar un proveedor
const crearProveedor = async (request, response) => {
  try {
    const proveedor = request.body;
    await proveedorService.agregarProveedor(proveedor);
    response.status(201).json({ message: "Proveedor creado exitosamente" });
  } catch (error) {
    if (
      error.message === "El NIT ya se encuentra registrado" ||
      error.message === "La cédula ya se encuentra registrada" ||
      error.message === "El correo electrónico ya se encuentra registrado"
    ) {
      response.status(400).json({
        error: "REGISTRO_DUPLICADO",
        message: error.message,
      });
    } else if (error.message === "Datos del proveedor incompletos") {
      response.status(400).json({
        error: "DATOS_INCOMPLETOS",
        message: error.message,
      });
    } else {
      console.error("Error al crear el proveedor", error);
      response.status(500).json({ message: "Error al crear el proveedor" });
    }
  }
};

const actualizarProveedor = async (req, res) => {
  const idProveedor = req.params.id_proveedor;
  const nuevoProveedor = req.body;

  try {
    await proveedorService.actualizarProveedor(idProveedor, nuevoProveedor);
    res.status(200).json({ message: "Proveedor actualizado correctamente" });
  } catch (error) {
    if (
      error.code === "NIT_DUPLICADO" ||
      error.code === "CEDULA_DUPLICADA" ||
      error.code === "CORREO_DUPLICADO"
    ) {
      res
        .status(400)
        .json({ message: error.message, error: "REGISTRO_DUPLICADO" });
    } else {
      console.error("Error al actualizar el proveedor:", error);
      res.status(500).json({ message: "Error al actualizar el proveedor" });
    }
  }
};

// Código para obtener todos los proveedores
const obtenerTodosProveedores = async (req, res) => {
  try {
    const proveedores = await proveedorService.obtenerTodosProveedores();
    res.status(200).json(proveedores);
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    res.status(500).json({ message: "Error al obtener los proveedores" });
  }
};

// Código para obtener un proveedor por ID
const obtenerProveedorPorId = async (req, res) => {
  const idProveedor = req.params.id_proveedor;
  try {
    const proveedor = await proveedorService.obtenerProveedorPorId(idProveedor);
    res.status(200).json(proveedor);
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    res.status(500).json({ message: "Error al obtener el proveedor" });
  }
};

// Código para eliminar un proveedor
const eliminarProveedor = async (req, res) => {
  const idProveedor = req.params.id_proveedor;
  try {
    await proveedorService.eliminarProveedor(idProveedor);
    res.status(200).json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    res.status(500).json({ message: "Error al eliminar el proveedor" });
  }
};

module.exports = {
  crearProveedor,
  obtenerTodosProveedores,
  eliminarProveedor,
  obtenerProveedorPorId,
  actualizarProveedor,
};
