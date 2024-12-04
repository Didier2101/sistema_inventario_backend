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

const corsOptions = {
  // origin: ["https://inventario-rogo-1.onrender.com"],
  origin: ["sistema-inventario-frontend-dusky.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
  credentials: true, // Si es necesario enviar cookies o encabezados de autorización
};

const app = express();
const port = process.env.PORT || 4000;

app.use(cors(corsOptions));
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de React
// Servir archivos estáticos de React
// app.use(
//   express.static(path.join(__dirname, "/frontend/dist"), {
//     setHeaders: (res, filePath) => {
//       if (filePath.endsWith(".css")) {
//         res.set("Content-Type", "text/css");
//       }
//     },
//   })
// );
// rutas
app.use(empleadosRouter);
app.use(usuariosRouter);
app.use(clientesRouter);
app.use(puntosVentasRouter);
app.use(bodegasRouter);
app.use(productosRouter);
app.use(cargosRouter);

// Redirecciona todas las demás rutas a `index.html` de `frontend/dist`
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
// });

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
