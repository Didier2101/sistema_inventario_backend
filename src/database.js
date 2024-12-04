const mysql2 = require("mysql2/promise");
require("dotenv").config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      "Conexión a la base de datos establecida exitosamente inventario."
    );
    connection.release();
  } catch (err) {
    console.error(
      "Error al conectar a la base de datos de inventario:",
      err.message
    );
  }
})();

module.exports = pool;
