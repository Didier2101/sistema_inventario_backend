// Importar el módulo de conexión a la base de datos
const pool = require("../database");
const bcrypt = require("bcrypt");

// Función para agregar un empleado a la base de datos
const agregarEmpleado = async (empleado) => {
  try {
    // Validación básica de datos
    if (
      !empleado.cedula ||
      !empleado.nombres ||
      !empleado.correo_electronico ||
      !empleado.telefono ||
      !empleado.direccion ||
      !empleado.id_cargo ||
      !empleado.salario ||
      !empleado.fecha_ingreso ||
      !empleado.fecha_nacimiento ||
      !empleado.contrasena ||
      !empleado.nombre_usuario
    ) {
      throw new Error("Datos del empleado incompletos");
    }

    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Verificar si la cédula ya existe
    const [cedulaExistente] = await pool.query(
      "SELECT * FROM empleados WHERE cedula = ?",
      [empleado.cedula]
    );
    if (cedulaExistente.length > 0) {
      throw new Error("La cédula ya se encuentra registrada");
    }
    const [correoExistente] = await pool.query(
      "SELECT * FROM empleados WHERE correo_electronico = ?",
      [empleado.correo_electronico]
    );
    if (correoExistente.length > 0) {
      throw new Error("El correo electrónico ya se encuentra registrado");
    }
    // Insertar datos del empleado
    const empleadoInsertQuery = `
      INSERT INTO empleados (cedula, nombres, correo_electronico, telefono, direccion, id_cargo, salario, fecha_ingreso, fecha_nacimiento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [empleadoInsertResult] = await pool.query(empleadoInsertQuery, [
      empleado.cedula,
      empleado.nombres,
      empleado.correo_electronico,
      empleado.telefono,
      empleado.direccion,
      empleado.id_cargo,
      empleado.salario,
      empleado.fecha_ingreso,
      empleado.fecha_nacimiento,
    ]);

    // Obtener ID del empleado recién insertado
    const idEmpleado = empleadoInsertResult.insertId;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(empleado.contrasena, 10);

    // Insertar usuario
    const usuarioInsertQuery = `
      INSERT INTO usuarios (nombre_usuario, contrasena, id_empleado)
      VALUES (?, ?, ?)
    `;
    await pool.query(usuarioInsertQuery, [
      empleado.nombre_usuario,
      hashedPassword,
      idEmpleado,
    ]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log(
      "Empleado y usuario agregados correctamente a la base de datos"
    );
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error(
      "Error al agregar el empleado y usuario a la base de datos:",
      error
    );
    throw error;
  }
};

// ! ====================================================================================================
// Función para obtener todos los empleados de la base de datos
// Consulta para obtener todos los empleados de la base de datos
const obtenerTodosEmpleados = async () => {
  try {
    const query =
      "SELECT empleados.*, cargos.nombre_cargo AS nombre_cargo FROM empleados LEFT JOIN cargos ON empleados.id_cargo = cargos.id_cargo";
    const [empleados, _] = await pool.query(query);
    return empleados;
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    throw error;
  }
};

// ! ====================================================================================================
// Agrega la función para actualizar un empleado en el servicio de empleado

const actualizarEmpleado = async (idEmpleado, nuevoEmpleado) => {
  try {
    // Verificar si la nueva cédula ya existe en otro empleado
    const checkCedulaQuery =
      "SELECT id_empleado FROM empleados WHERE cedula = ? AND id_empleado != ?";
    const [existingEmployee] = await pool.query(checkCedulaQuery, [
      nuevoEmpleado.cedula,
      idEmpleado,
    ]);

    if (existingEmployee.length > 0) {
      throw {
        code: "CEDULA_DUPLICADA",
        message: "La cédula ingresada ya está registrada",
      };
    }
    // Verificar si el nuevo correo electrónico ya existe en otro proveedor
    const checkCorreoQuery =
      "SELECT id_empleado FROM empleados WHERE correo_electronico = ? AND id_empleado != ?";
    const [empleadoCorreoExistente] = await pool.query(checkCorreoQuery, [
      nuevoEmpleado.correo_electronico,
      idEmpleado,
    ]);

    if (empleadoCorreoExistente.length > 0) {
      throw {
        code: "CORREO_DUPLICADO",
        message: "El correo electrónico ya se encuentra registrado",
      };
    }
    // Continuar con la actualización del empleado si no hay cédula duplicada
    const query = `
      UPDATE empleados 
      SET 
        cedula = ?,
        nombres = ?,
        correo_electronico = ?,
        telefono = ?,
        direccion = ?,
        id_cargo = ?,
        salario = ?,
        fecha_ingreso = ?,
        fecha_nacimiento = ?
      WHERE id_empleado = ?
    `;
    const values = [
      nuevoEmpleado.cedula,
      nuevoEmpleado.nombres,
      nuevoEmpleado.correo_electronico,
      nuevoEmpleado.telefono,
      nuevoEmpleado.direccion,
      nuevoEmpleado.id_cargo,
      nuevoEmpleado.salario,
      nuevoEmpleado.fecha_ingreso,
      nuevoEmpleado.fecha_nacimiento,
      idEmpleado,
    ];
    await pool.query(query, values);

    console.log("Empleado actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el empleado:", error);
    throw error;
  }
};

// ! ====================================================================================================
const eliminarEmpleado = async (idEmpleado) => {
  try {
    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Eliminar empleado (esto también eliminará el usuario asociado debido a ON DELETE CASCADE)
    const eliminarEmpleadoQuery = `
      DELETE FROM empleados
      WHERE id_empleado = ?
    `;
    await pool.query(eliminarEmpleadoQuery, [idEmpleado]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log(
      "Empleado y usuario eliminados correctamente de la base de datos"
    );
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error(
      "Error al eliminar el empleado y usuario de la base de datos:",
      error
    );
    throw error;
  }
};

// ! ====================================================================================================
const obtenerEmpleadoPorId = async (idEmpleado) => {
  try {
    const query =
      "SELECT empleados.*, cargos.nombre_cargo AS nombre_cargo FROM empleados LEFT JOIN cargos ON empleados.id_cargo = cargos.id_cargo WHERE empleados.id_empleado = ?";
    const [empleados, _] = await pool.query(query, [idEmpleado]);
    if (empleados.length === 0) {
      throw new Error("Empleado no encontrado");
    }
    return empleados[0];
  } catch (error) {
    console.error("Error al obtener el empleado:", error);
    throw error;
  }
};

// ! ====================================================================================================
// ! ====================================================================================================

module.exports = {
  agregarEmpleado,
  obtenerTodosEmpleados,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerEmpleadoPorId,
};
