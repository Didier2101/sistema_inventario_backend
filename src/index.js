const express = require("express");
const cors = require("cors");
const pool = require("./database");
// const path = require("path");

const empleadosRouter = require("./routes/empleadoRouter");
const usuariosRouter = require("./routes/usuarioRouter");
const clientesRouter = require("./routes/clientesRouter");
const puntosVentasRouter = require("./routes/puntoVentaRouter");
const bodegasRouter = require("./routes/bodegaRouter");
const productosRouter = require("./routes/productoRouter");
const cargosRouter = require("./routes/cargoRouter");

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "https://sistema-inventario-frontend.onrender.com",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(empleadosRouter);
app.use(usuariosRouter);
app.use(clientesRouter);
app.use(puntosVentasRouter);
app.use(bodegasRouter);
app.use(productosRouter);
app.use(cargosRouter);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
