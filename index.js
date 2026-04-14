const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// CLIENTES
app.post("/clientes", async (req, res) => {
  const { nombre, dni } = req.body;
  const result = await pool.query(
    "INSERT INTO clientes(nombre, dni) VALUES($1,$2) RETURNING *",
    [nombre, dni]
  );
  res.json(result.rows[0]);
});

app.get("/clientes", async (req, res) => {
  const result = await pool.query("SELECT * FROM clientes");
  res.json(result.rows);
});

// SERVICIOS
app.post("/servicios", async (req, res) => {
  const { cliente_id, servicio, precio } = req.body;
  const result = await pool.query(
    "INSERT INTO servicios(cliente_id, servicio, precio) VALUES($1,$2,$3) RETURNING *",
    [cliente_id, servicio, precio]
  );
  res.json(result.rows[0]);
});

app.get("/servicios", async (req, res) => {
  const result = await pool.query(
    "SELECT s.*, c.nombre FROM servicios s JOIN clientes c ON s.cliente_id = c.id"
  );
  res.json(result.rows);
});

app.listen(3000, () => console.log("Servidor activo"));