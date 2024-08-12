const productoService = require("../services/productoService");

const agregarProducto = async (req, res) => {
  try {
    const producto = req.body;

    await productoService.agregarProducto(producto);
    res.status(201).json({ message: "Producto creado exitosamente" });
  } catch (error) {
    if (error.code === "REFERENCIA_DUPLICADA") {
      res.status(400).json({
        message: error.message,
        error: "REGISTRO_DUPLICADO",
      });
    } else {
      console.error("Error al crear los el producto:", error);
      res.status(500).json({ message: "Error al crear los productos" });
    }
  }
};

// Controlador para obtener todos los productos
const obtenerTodosProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerTodosProductos();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

// Controlador para obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  const idProducto = req.params.id_producto;
  try {
    const producto = await productoService.obtenerProductoPorId(idProducto);
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

// Controlador para eliminar un producto
const eliminarProducto = async (req, res) => {
  const idProducto = req.params.id_producto;
  try {
    await productoService.eliminarProducto(idProducto);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};

// Controlador para actualizar un producto
// Controlador para actualizar un producto
const actualizarProducto = async (req, res) => {
  const idProducto = req.params.id_producto;
  const nuevoProducto = req.body;
  try {
    await productoService.actualizarProducto(idProducto, nuevoProducto);
    res.status(200).json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    if (error.code === "REFERENCIA_DUPLICADA") {
      res.status(400).json({
        message: error.message,
        error: "REGISTRO_DUPLICADO",
      });
    } else {
      console.error("Error al actualizar el PRODUCTO:", error);
      res.status(500).json({ message: "Error al actualizar el PRODUCTO" });
    }
  }
};

// Función para actualizar el estado de un producto por su ID
const actualizarEstadoProducto = async (req, res) => {
  const idProducto = req.params.id_producto;
  const { estado } = req.body; // Esperamos recibir el nuevo estado del producto

  try {
    await productoService.actualizarEstadoProducto(idProducto, estado);
    res
      .status(200)
      .json({ message: "Estado del producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado del producto:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el estado del producto" });
  }
};

// Controlador para actualizar el stock de un producto
// Controlador para actualizar el stock de un producto
const actualizarStockProducto = async (req, res) => {
  const idProducto = req.params.id_producto;
  const { nuevaCantidad } = req.body;

  try {
    await productoService.actualizarStockProducto(idProducto, nuevaCantidad);
    res
      .status(200)
      .json({ message: "Stock del producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al sumar la cantidad", error);
    res.status(500).json({ message: "Error al sumar la cantidad" });
  }
};

module.exports = {
  agregarProducto,
  obtenerTodosProductos,
  eliminarProducto,
  obtenerProductoPorId,
  actualizarProducto,
  actualizarEstadoProducto,
  actualizarStockProducto,
};
