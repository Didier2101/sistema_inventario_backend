const cargoService = require("../services/cargoService");

const obtenerCargo = async (req, res) => {
  try {
    const cargos = await cargoService.obtenerCargo();
    res.status(200).json(cargos);
  } catch (error) {
    console.error("Error al obtener los cargos", error);
    res.status(500).json({ message: "Error al obtener los cargos" });
  }
};
module.exports = { obtenerCargo };
