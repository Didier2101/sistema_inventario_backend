const bodegaService = require("../services/bodegaService");

// Código para agregar una bodega
const crearBodegas = async (request, response) => {
  try {
    const bodega = request.body;
    await bodegaService.agregarBodega(bodega);
    response.status(201).json({ message: "Bodega creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la bodega", error);
    response.status(500).json({ message: "Error al crear la bodega" });
  }
};

// Código para obtener todas las bodegas
const obtenerBodegas = async (req, res) => {
  try {
    const bodegas = await bodegaService.obtenerBodegas();
    res.status(200).json(bodegas);
  } catch (error) {
    console.error("Error al obtener las bodegas:", error);
    res.status(500).json({ message: "Error al obtener las bodegas" });
  }
};

// Código para obtener una bodega por ID
const obtenerBodegaPorId = async (req, res) => {
  const idBodega = req.params.id_bodega;
  try {
    const bodega = await bodegaService.obtenerBodegaPorId(idBodega);
    res.status(200).json(bodega);
  } catch (error) {
    console.error("Error al obtener la bodega:", error);
    res.status(500).json({ message: "Error al obtener la bodega" });
  }
};

// Código para eliminar una bodega
const eliminarBodega = async (req, res) => {
  const idBodega = req.params.id_bodega;
  try {
    await bodegaService.eliminarBodega(idBodega);
    res.status(200).json({ message: "Bodega eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la bodega, ", error);
    res.status(500).json({
      message: "Error al eliminar la bodega, contiene productos",
    });
  }
};

// Código para actualizar una bodega
const actualizarBodega = async (req, res) => {
  const idBodega = req.params.id_bodega;
  const nuevaBodega = req.body;
  try {
    await bodegaService.actualizarBodega(idBodega, nuevaBodega);
    res.status(200).json({ message: "Bodega actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la bodega:", error);
    res.status(500).json({ message: "Error al actualizar la bodega" });
  }
};

// Código para obtener productos por bodega
const obtenerProductosPorBodega = async (req, res) => {
  const idBodega = req.params.id_bodega;
  try {
    const productos = await bodegaService.obtenerProductosPorBodega(idBodega);
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener los productos de la bodega:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los productos de la bodega" });
  }
};

module.exports = {
  crearBodegas,
  obtenerBodegas,
  eliminarBodega,
  obtenerBodegaPorId,
  actualizarBodega,
  obtenerProductosPorBodega,
};
