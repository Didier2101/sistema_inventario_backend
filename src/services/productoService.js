// productoService.js

const pool = require("../database");

const agregarProducto = async (producto) => {
  try {
    if (
      !producto.bodega ||
      !producto.nombre ||
      !producto.referencia ||
      !producto.descripcion ||
      !producto.precio_venta ||
      !producto.cantidad
    ) {
      throw new Error("Datos del producto incompletos");
    }

    await pool.query("START TRANSACTION");

    // Verificar si la cédula ya existe
    const [referenciaExistente] = await pool.query(
      "SELECT * FROM productos WHERE referencia = ?",
      [producto.referencia]
    );
    if (referenciaExistente.length > 0) {
      const error = new Error(
        "La referencia ya se encuentra registrada con otro producto"
      );
      error.code = "REFERENCIA_DUPLICADA";
      throw error;
    }
    // Insertar datos del producto
    const insertarProductoQuery = `
      INSERT INTO productos ( bodega, nombre, referencia, descripcion, precio_venta, cantidad)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      producto.bodega,
      producto.nombre,
      producto.referencia,
      producto.descripcion,
      producto.precio_venta,
      producto.cantidad,
    ];
    await pool.query(insertarProductoQuery, values);

    await pool.query("COMMIT");
    return { message: "Producto agregado correctamente" };
  } catch (error) {
    await pool.query("ROLLBACK");
    // Error genérico si no existe un código de error personalizado
    if (!error.code) {
      error.code = "ERROR_DESCONOCIDO";
      error.message = "Error al agregar el producto";
    }
    throw error;
  }
};

// Función para obtener todos los productos con bodegas services
const obtenerTodosProductos = async () => {
  try {
    const query = `
      SELECT 
        p.id_producto,
        b.nombres AS bodega,
        p.nombre,
        p.referencia,
        p.descripcion,
        p.precio_venta,
        p.cantidad
      FROM 
        productos p
      LEFT JOIN 
        bodegas b ON p.bodega = b.id_bodega
    `;
    const [productos] = await pool.query(query);
    return productos;
  } catch (error) {
    error.message = "Error al obtener los productos desde la base de datos";
    throw error;
  }
};

// Función para obtener un producto por su ID
const obtenerProductoPorId = async (idProducto) => {
  try {
    const obtenerProductoQuery = `
      SELECT *
      FROM productos
      WHERE id_producto = ?
    `;
    const [productos] = await pool.query(obtenerProductoQuery, [idProducto]);

    if (productos.length === 0) {
      const error = new Error("Producto no encontrado");
      error.code = "PRODUCTO_NO_ENCONTRADO"; // Código de error personalizado
      throw error;
    }

    return productos[0];
  } catch (error) {
    error.message = "Error al obtener el producto desde la base de datos";
    throw error;
  }
};

// Función para actualizar un producto por su ID
// Función para actualizar un producto por su ID
const actualizarProducto = async (idProducto, nuevoProducto) => {
  try {
    const checkReferenciaQuery =
      "SELECT id_producto FROM productos WHERE referencia = ? AND id_producto != ?";
    const [existingReferencia] = await pool.query(checkReferenciaQuery, [
      nuevoProducto.referencia,
      idProducto,
    ]);

    if (existingReferencia.length > 0) {
      // Lanza un error con código personalizado si la referencia ya existe en otro producto
      const error = new Error("La referencia ingresada ya está registrada");
      error.code = "REFERENCIA_DUPLICADA";
      throw error;
    }

    // Realiza la actualización del producto en la base de datos
    const query = `
      UPDATE productos
      SET 
        bodega = ?,
        nombre = ?,
        referencia = ?,
        descripcion = ?,
        precio_venta = ?,
        cantidad = ?
      WHERE id_producto = ?
    `;
    const values = [
      nuevoProducto.bodega,
      nuevoProducto.nombre,
      nuevoProducto.referencia,
      nuevoProducto.descripcion,
      nuevoProducto.precio_venta,
      nuevoProducto.cantidad,
      idProducto,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      // Error si no se encuentra el producto a actualizar
      const error = new Error("Producto no encontrado");
      error.code = "PRODUCTO_NO_ENCONTRADO";
      throw error;
    }

    // Retorna un mensaje de éxito para que el controlador lo use en la respuesta
    return { message: "Producto actualizado correctamente" };
  } catch (error) {
    // Ajusta el mensaje de error y lo lanza para que el controlador lo maneje
    error.message = error.message || "Error al actualizar el producto";
    throw error;
  }
};

// Función para eliminar un producto por su ID
// Función para eliminar un producto por su ID
const eliminarProducto = async (idProducto) => {
  try {
    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Eliminar producto
    const eliminarProductoQuery = `
      DELETE FROM productos
      WHERE id_producto = ?
    `;
    const [result] = await pool.query(eliminarProductoQuery, [idProducto]);

    if (result.affectedRows === 0) {
      // Si no se encuentra el producto, lanzar un error
      const error = new Error("Producto no encontrado");
      error.code = "PRODUCTO_NO_ENCONTRADO";
      throw error;
    }

    // Confirmar transacción
    await pool.query("COMMIT");

    // Retornar un mensaje de éxito para que el controlador lo maneje
    return { message: "Producto eliminado correctamente" };
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    // Ajustar el mensaje de error y lanzarlo para que el controlador lo maneje
    error.message = error.message || "Error al eliminar el producto";
    throw error;
  }
};

// Función para actualizar el stock de un producto (sumar o restar)
const actualizarStockProducto = async (idProducto, cantidad, operacion) => {
  try {
    // Consulta la cantidad actual del producto
    const [productoActual] = await pool.query(
      "SELECT cantidad FROM productos WHERE id_producto = ?",
      [idProducto]
    );

    if (productoActual.length === 0) {
      throw new Error("Producto no encontrado");
    }

    // Calcula la nueva cantidad según la operación
    const cantidadActual = productoActual[0].cantidad;
    let cantidadNueva;

    if (operacion === "sumar") {
      cantidadNueva = cantidadActual + cantidad;
    } else if (operacion === "restar") {
      cantidadNueva = cantidadActual - cantidad;
    } else {
      throw new Error("Operación no válida");
    }

    // Verifica que la cantidad nueva no sea negativa
    if (cantidadNueva < 0) {
      throw new Error("No se puede reducir la cantidad por debajo de cero");
    }

    // Actualiza la cantidad en la base de datos
    const [resultado] = await pool.query(
      "UPDATE productos SET cantidad = ? WHERE id_producto = ?",
      [cantidadNueva, idProducto]
    );

    if (resultado.affectedRows === 0) {
      throw new Error("Error al actualizar el producto");
    }

    // Devuelve el ID del producto y la nueva cantidad
    return { idProducto, cantidadNueva };
  } catch (error) {
    throw new Error(`Error al actualizar la cantidad: ${error.message}`);
  }
};

module.exports = {
  obtenerTodosProductos,
  agregarProducto,
  eliminarProducto,
  obtenerProductoPorId,
  actualizarProducto,
  actualizarStockProducto,
};
