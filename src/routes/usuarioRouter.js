const express = require("express");
const router = express.Router();

const { login } = require("../controllers/usuarioController");

router.post("/ingresar", login);

module.exports = router;
