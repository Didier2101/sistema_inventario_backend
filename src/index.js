const express = require("express");
const cors = require("cors");
const pool = require("./database");
const path = require("path");

const empleadosRouter = require("./routes/empleadoRouter");
const usuariosRouter = require("./routes/usuarioRouter");
const clientesRouter = require("./routes/clientesRouter");
const proveedoresRouter = require("./routes/proveedorRouter");
const puntosVentasRouter = require("./routes/puntoVentaRouter");
const bodegasRouter = require("./routes/bodegaRouter");
const productosRouter = require("./routes/productoRouter");
const cargosRouter = require("./routes/cargoRouter");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(empleadosRouter);
app.use(usuariosRouter);
app.use(clientesRouter);
app.use(proveedoresRouter);
app.use(puntosVentasRouter);
app.use(bodegasRouter);
app.use(productosRouter);
app.use(cargosRouter);

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, "build")));

// Ruta catch-all para servir index.html en caso de una ruta desconocida
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, async () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
