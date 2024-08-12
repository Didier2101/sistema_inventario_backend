const express = require("express");
const router = express.Router();

const { obtenerCargo } = require("../controllers/cargoController");

router.get("/cargos", obtenerCargo);

module.exports = router;
