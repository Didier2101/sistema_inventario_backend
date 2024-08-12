// productoService.js

const pool = require("../database");

const agregarProducto = async (producto) => {
  try {
    if (
      !producto.proveedor ||
      !producto.bodega ||
      !producto.nombre ||
      !producto.referencia ||
      !producto.descripcion ||
      !producto.precio_compra ||
      !producto.precio_venta ||
      !producto.cantidad ||
      !producto.estado
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
      INSERT INTO productos (proveedor, bodega, nombre, referencia, descripcion, precio_compra, precio_venta, cantidad, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      producto.proveedor,
      producto.bodega,
      producto.nombre,
      producto.referencia,
      producto.descripcion,
      producto.precio_compra,
      producto.precio_venta,
      producto.cantidad,
      producto.estado ? 1 : 0, // Convertimos el booleano a 0 o 1 para almacenarlo en la base de datos
    ];
    await pool.query(insertarProductoQuery, values);

    await pool.query("COMMIT");

    console.log("Producto agregado correctamente");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al agregar el producto:", error);
    throw error;
  }
};

// Función para obtener todos los productos con bodegas
const obtenerTodosProductos = async () => {
  try {
    const query = `
      SELECT 
        p.id_producto,
        pr.empresa AS proveedor,
        b.nombres AS bodega,  -- Se añadió la coma faltante aquí
        p.nombre,
        p.referencia,
        p.descripcion,
        p.precio_compra,
        p.precio_venta,
        p.cantidad,
        p.estado
      FROM 
        productos p
      LEFT JOIN 
        proveedores pr ON p.proveedor = pr.id_proveedor
      LEFT JOIN 
        bodegas b ON p.bodega = b.id_bodega
    `;
    const [productos] = await pool.query(query);
    return productos;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
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
      throw new Error("Producto no encontrado");
    } else {
      return productos[0];
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
};

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
      throw {
        code: "REFERENCIA_DUPLICADA",
        message: "La referencia ingresada ya está registrada",
      };
    }
    // Verificar si la nueva referencia ya existe en otro producto
    const query = `
      UPDATE productos
      SET 
      proveedor = ?,
      bodega = ?,
        nombre = ?,
        referencia = ?,
        descripcion = ?,
        precio_compra = ?,
        precio_venta = ?,
        cantidad = ?,
        estado = ?
      WHERE id_producto = ?
    `;
    const values = [
      nuevoProducto.proveedor,
      nuevoProducto.bodega,
      nuevoProducto.nombre,
      nuevoProducto.referencia,
      nuevoProducto.descripcion,
      nuevoProducto.precio_compra,
      nuevoProducto.precio_venta,
      nuevoProducto.cantidad,
      nuevoProducto.estado ? 1 : 0,
      idProducto,
    ];
    await pool.query(query, values);

    console.log("Producto actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};

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
    await pool.query(eliminarProductoQuery, [idProducto]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log("Producto eliminado correctamente de la base de datos");
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al eliminar el producto de la base de datos:", error);
    throw error;
  }
};

// Función para actualizar el estado de un producto por su ID en la base de datos
const actualizarEstadoProducto = async (idProducto, estado) => {
  try {
    const query = "UPDATE productos SET estado = ? WHERE id_producto = ?";
    await pool.query(query, [estado, idProducto]);
  } catch (error) {
    throw new Error(
      `Error al actualizar el estado del producto en la base de datos: ${error.message}`
    );
  }
};

// codigo para sumar cantidad a un producto
const actualizarStockProducto = async (idProducto, nuevaCantidad) => {
  try {
    // Obtiene la cantidad actual del producto desde la base de datos
    const [productoActual] = await pool.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [idProducto] // Parámetro para la consulta SQL
    );
    // Verifica si el producto existe en la base de datos
    if (productoActual.length === 0) {
      throw new Error("Producto no encontrado");
    }

    // Obtiene la cantidad actual del producto
    const cantidadActual = productoActual[0].cantidad;
    // Calcula la nueva cantidad sumando el nuevo stock al stock actual
    const cantidadNueva = cantidadActual + nuevaCantidad;

    // Actualiza la cantidad del producto en la base de datos
    const [resultado] = await pool.query(
      "UPDATE productos SET cantidad = ? WHERE id_producto = ?",
      [cantidadNueva, idProducto]
    );

    // Verifica si se actualizó alguna fila en la base de datos
    if (resultado.affectedRows === 0) {
      throw new Error("Producto no encontrado"); // Lanza un error si no se actualizó ninguna fila
    }

    // Devuelve el resultado con el ID del producto y la nueva cantidad
    return { idProducto, cantidadNueva };
  } catch (error) {
    throw new Error(`Error al insertar la nueva cantidad: ${error.message}`);
  }
};

module.exports = {
  obtenerTodosProductos,
  agregarProducto,
  eliminarProducto,
  obtenerProductoPorId,
  actualizarProducto,
  actualizarEstadoProducto,
  actualizarStockProducto,
};
