const pool = require("../database");

// Código para crear un proveedor
const agregarProveedor = async (proveedor) => {
  try {
    if (
      !proveedor.nit ||
      !proveedor.empresa ||
      !proveedor.cedula ||
      !proveedor.nombres ||
      !proveedor.telefono ||
      !proveedor.correo_electronico ||
      !proveedor.direccion
    )
      throw new Error("Datos del proveedor incompletos");

    await pool.query("START TRANSACTION");

    // Verificar si el NIT ya existe
    const [proveedoresExistentes] = await pool.query(
      "SELECT * FROM proveedores WHERE nit = ?",
      [proveedor.nit]
    );
    if (proveedoresExistentes.length > 0) {
      throw new Error("El NIT ya se encuentra registrado");
    }
    const [proveedorExistentes] = await pool.query(
      "SELECT * FROM proveedores WHERE cedula = ?",
      [proveedor.cedula]
    );
    if (proveedorExistentes.length > 0) {
      throw new Error("La cédula ya se encuentra registrada");
    }
    // Verificar si el correo electrónico ya existe
    const [emailExistentes] = await pool.query(
      "SELECT * FROM proveedores WHERE correo_electronico = ?",
      [proveedor.correo_electronico]
    );
    if (emailExistentes.length > 0) {
      throw new Error("El correo electrónico ya se encuentra registrado");
    }
    // Insertar datos del proveedor
    const insertarProveedor = `INSERT INTO proveedores (nit, empresa, cedula, nombres, telefono, correo_electronico, direccion)
    VALUES(?, ?, ?, ?, ?, ?, ?)`;

    // Resultado del proveedor insertado
    const [resultadoProveedorInsertado] = await pool.query(insertarProveedor, [
      proveedor.nit,
      proveedor.empresa,
      proveedor.cedula,
      proveedor.nombres,
      proveedor.telefono,
      proveedor.correo_electronico,
      proveedor.direccion,
    ]);
    await pool.query("COMMIT");
    console.log(
      "Proveedor agregado correctamente:",
      resultadoProveedorInsertado
    );
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al agregar el proveedor", error);
    throw error;
  }
};

const actualizarProveedor = async (idProveedor, nuevoProveedor) => {
  try {
    // Verificar si el nuevo NIT ya existe en otro proveedor
    const checkNitQuery =
      "SELECT id_proveedor FROM proveedores WHERE nit = ? AND id_proveedor != ?";
    const [proveedorExistente] = await pool.query(checkNitQuery, [
      nuevoProveedor.nit,
      idProveedor,
    ]);

    if (proveedorExistente.length > 0) {
      throw {
        code: "NIT_DUPLICADO",
        message: "El NIT ya se encuentra registrado",
      };
    }

    // Verificar si la nueva cédula ya existe en otro proveedor
    const checkCedulaQuery =
      "SELECT id_proveedor FROM proveedores WHERE cedula = ? AND id_proveedor != ?";
    const [proveedorCedulaExistente] = await pool.query(checkCedulaQuery, [
      nuevoProveedor.cedula,
      idProveedor,
    ]);

    if (proveedorCedulaExistente.length > 0) {
      throw {
        code: "CEDULA_DUPLICADA",
        message: "La cédula ya se encuentra registrada",
      };
    }

    // Verificar si el nuevo correo electrónico ya existe en otro proveedor
    const checkCorreoQuery =
      "SELECT id_proveedor FROM proveedores WHERE correo_electronico = ? AND id_proveedor != ?";
    const [proveedorCorreoExistente] = await pool.query(checkCorreoQuery, [
      nuevoProveedor.correo_electronico,
      idProveedor,
    ]);

    if (proveedorCorreoExistente.length > 0) {
      throw {
        code: "CORREO_DUPLICADO",
        message: "El correo electrónico ya se encuentra registrado",
      };
    }

    // Aquí puedes continuar con la lógica para actualizar el proveedor
    const actualizarQuery = `
      UPDATE proveedores
      SET nit = ?, empresa = ?, cedula = ?, nombres = ?, telefono = ?, correo_electronico = ?, direccion = ?
      WHERE id_proveedor = ?
    `;
    const [resultadoActualizacion] = await pool.query(actualizarQuery, [
      nuevoProveedor.nit,
      nuevoProveedor.empresa,
      nuevoProveedor.cedula,
      nuevoProveedor.nombres,
      nuevoProveedor.telefono,
      nuevoProveedor.correo_electronico,
      nuevoProveedor.direccion,
      idProveedor,
    ]);

    console.log("Proveedor actualizado correctamente:", resultadoActualizacion);
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    throw error;
  }
};

// Código para obtener todos los proveedores
const obtenerTodosProveedores = async () => {
  try {
    const obtenerProveedor = "SELECT * FROM proveedores";
    const [proveedores, _] = await pool.query(obtenerProveedor);
    return proveedores;
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    throw error;
  }
};

const eliminarProveedor = async (idProveedor) => {
  try {
    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Eliminar proveedor
    const eliminarProveedorQuery = `
      DELETE FROM proveedores
      WHERE id_proveedor = ?
    `;
    await pool.query(eliminarProveedorQuery, [idProveedor]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log("Proveedor eliminado correctamente de la base de datos");
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al eliminar el proveedor de la base de datos:", error);
    throw error;
  }
};

const obtenerProveedorPorId = async (idProveedor) => {
  try {
    const obtenerProveedor = "SELECT * FROM proveedores WHERE id_proveedor = ?";
    const [proveedores, _] = await pool.query(obtenerProveedor, [idProveedor]);
    if (proveedores.length === 0) {
      throw new Error("Proveedor no encontrado");
    } else {
      return proveedores[0];
    }
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    throw error;
  }
};

module.exports = {
  obtenerTodosProveedores,
  agregarProveedor,
  eliminarProveedor,
  obtenerProveedorPorId,
  actualizarProveedor,
};
