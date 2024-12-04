const pool = require("../database");

// codigo para crear un cliente
const agregarCliente = async (cliente) => {
  try {
    if (
      !cliente.cedula ||
      !cliente.nombres ||
      !cliente.telefono ||
      !cliente.correo_electronico ||
      !cliente.direccion
    )
      throw new Error("Datos del cliente incompletos");

    await pool.query("START TRANSACTION");

    // Verificar si la cédula ya existe
    const [cedulaExistentes] = await pool.query(
      "SELECT * FROM clientes WHERE cedula = ?",
      [cliente.cedula]
    );
    if (cedulaExistentes.length > 0) {
      throw new Error("La cédula ya se encuentra registrada");
    }

    // Insertar datos del cliente
    const insertarCliente = `INSERT INTO clientes (cedula,nombres,telefono,correo_electronico,direccion)
    VALUES(?, ?, ?, ?, ?)`;

    // Resultado del cliente insertado
    const [resultadoClienteInsertado] = await pool.query(insertarCliente, [
      cliente.cedula,
      cliente.nombres,
      cliente.telefono,
      cliente.correo_electronico,
      cliente.direccion,
    ]);
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al agregar el cliente", error);
    throw error;
  }
};

const actualizarCliente = async (idCliente, nuevoCliente) => {
  try {
    // Verificar si la nueva cédula ya existe en otro cliente
    const checkCedulaQuery =
      "SELECT id_cliente FROM clientes WHERE cedula = ? AND id_cliente != ?";
    const [existingClient] = await pool.query(checkCedulaQuery, [
      nuevoCliente.cedula,
      idCliente,
    ]);

    if (existingClient.length > 0) {
      throw {
        code: "CEDULA_DUPLICADA",
        message: "La cédula ingresada ya está registrada",
      };
    }
    // Verificar si el nuevo correo electrónico ya existe en otro proveedor
    const checkCorreoQuery =
      "SELECT id_proveedor FROM proveedores WHERE correo_electronico = ? AND id_proveedor != ?";
    const [clienteCorreoExistente] = await pool.query(checkCorreoQuery, [
      nuevoCliente.correo_electronico,
      idCliente,
    ]);

    if (clienteCorreoExistente.length > 0) {
      throw {
        code: "CORREO_DUPLICADO",
        message: "El correo electrónico ya se encuentra registrado",
      };
    }

    // Continuar con la actualización del cliente si no hay cédula duplicada
    const query = `
      UPDATE clientes 
      SET 
        cedula = ?,
        nombres = ?,
        correo_electronico = ?,
        telefono = ?,
        direccion = ?
      WHERE id_cliente = ?
    `;
    const values = [
      nuevoCliente.cedula,
      nuevoCliente.nombres,
      nuevoCliente.correo_electronico,
      nuevoCliente.telefono,
      nuevoCliente.direccion,
      idCliente,
    ];
    await pool.query(query, values);

    console.log("Cliente actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    throw error;
  }
};

// codigo para obtener todos los clientes

const obtenerTodosClientes = async () => {
  try {
    const obtenerCliente = "SELECT * FROM clientes";
    const [clientes, _] = await pool.query(obtenerCliente);
    return clientes;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw error;
  }
};

const eliminarCliente = async (idCliente) => {
  try {
    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Eliminar empleado (esto también eliminará el usuario asociado debido a ON DELETE CASCADE)
    const eliminarClienteQuery = `
      DELETE FROM clientes
      WHERE id_cliente = ?
    `;
    await pool.query(eliminarClienteQuery, [idCliente]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log("Cliente eliminado correctamente de la base de datos");
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al eliminar el cliente de la base de datos:", error);
    throw error;
  }
};

const obtenerClientePorId = async (idCliente) => {
  try {
    const obtenerCliente = "SELECT * FROM clientes WHERE id_cliente =?";
    const [clientes, _] = await pool.query(obtenerCliente, [idCliente]);
    if (clientes.length === 0) {
      throw new Error("cliente no encontrado");
    } else {
      return clientes[0];
    }
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw error;
  }
};

module.exports = {
  obtenerTodosClientes,
  agregarCliente,
  eliminarCliente,
  obtenerClientePorId,
  actualizarCliente,
};
