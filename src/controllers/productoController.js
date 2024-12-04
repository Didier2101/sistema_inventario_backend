const productoService = require("../services/productoService");

const agregarProducto = async (req, res) => {
  try {
    const producto = req.body;

    // Llamar al servicio para agregar el producto
    await productoService.agregarProducto(producto);

    // Respuesta exitosa
    res.status(201).json({ message: "Producto creado exitosamente" });
  } catch (error) {
    // Manejo de errores basado en el tipo de error
    if (error.code === "REFERENCIA_DUPLICADA") {
      // Error cuando la referencia ya existe
      return res.status(400).json({
        message: error.message,
        error: "REGISTRO_DUPLICADO", // Código de error personalizado para el frontend
      });
    }

    // Manejo de errores genéricos
    res.status(500).json({
      message: "Error al crear el producto",
    });
  }
};

// Controlador para obtener todos los productos
const obtenerTodosProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerTodosProductos();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message || "Error desconocido",
    });
  }
};

// Controlador para obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  const idProducto = req.params.id_producto;
  try {
    const producto = await productoService.obtenerProductoPorId(idProducto);
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el producto",
      error: error.message || "Error desconocido",
    });
  }
};

// Controlador para eliminar un producto
const eliminarProducto = async (req, res) => {
  const idProducto = req.params.id_producto;

  try {
    // Verificar si el producto existe
    const productoExistente = await productoService.obtenerProductoPorId(
      idProducto
    );
    if (!productoExistente) {
      return res.status(404).json({
        message: "Producto no encontrado",
        error: "PRODUCTO_NO_ENCONTRADO", // Error personalizado
      });
    }

    // Llamar al servicio para eliminar el producto
    await productoService.eliminarProducto(idProducto);

    // Respuesta exitosa
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    // Manejo de errores personalizados, en caso de ser necesario
    if (error.code === "PRODUCTO_NO_ENCONTRADO") {
      return res.status(404).json({
        message: "Producto no encontrado",
        error: "PRODUCTO_NO_ENCONTRADO",
      });
    }

    // Error genérico para otros problemas
    res
      .status(500)
      .json({ message: "Error al eliminar el producto", error: error.message });
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
      res.status(500).json({ message: "Error al actualizar el PRODUCTO" });
    }
  }
};

const actualizarStockProducto = async (req, res) => {
  const { id_producto } = req.params;
  const { nuevaCantidad, operacion } = req.body;

  try {
    await productoService.actualizarStockProducto(
      id_producto,
      nuevaCantidad,
      operacion
    );
    res
      .status(200)
      .json({ message: "Stock del producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la cantidad" });
  }
};

module.exports = {
  agregarProducto,
  obtenerTodosProductos,
  eliminarProducto,
  obtenerProductoPorId,
  actualizarProducto,
  actualizarStockProducto,
};
