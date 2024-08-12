const pool = require("../database");
const obtenerCargo = async () => {
  try {
    const query = "SELECT * FROM cargos";
    const [cargos, _] = await pool.query(query);
    return cargos;
  } catch (error) {
    console.error("Error al obtener los cargos:", error);
    throw error;
  }
};

module.exports = { obtenerCargo };
