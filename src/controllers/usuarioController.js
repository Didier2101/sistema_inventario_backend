const pool = require("../database");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { usuario, contrasena, cargo } = req.body;

  try {
    // Recuperar el usuario de la base de datos
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre_usuario = ?",
      [usuario]
    );

    if (result[0].length > 0) {
      const user = result[0][0]; // Accede al primer usuario del resultado

      // Comparar la contraseña ingresada con la contraseña encriptada en la base de datos
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);
      if (!isMatch) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      // Recuperar el empleado asociado al usuario
      const [empleados] = await pool.query(
        "SELECT * FROM empleados WHERE id_empleado = ?",
        [user.id_empleado]
      );

      if (empleados.length === 0) {
        return res
          .status(401)
          .json({ message: "Empleado asociado no encontrado" });
      }

      const empleado = empleados[0];

      // Verificar que el cargo del empleado coincida con el cargo seleccionado
      if (empleado.id_cargo !== cargo) {
        return res.status(401).json({ message: "Cargo incorrecto" });
      }

      // Responder con éxito sin el token
      res.status(200).json({ message: "Usuario autenticado correctamente" });
    } else {
      res
        .status(401)
        .json({ message: "Usuario no se encontró en la base de datos" });
    }
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    res.status(500).json({
      message: "Error interno del servidor al conectar a la base de datos",
    });
  }
};

module.exports = { login };
