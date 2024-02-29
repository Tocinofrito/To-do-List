const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const fs = require('fs');


const app = express();
const port = 3000;

const configData = fs.readFileSync('../config/config-tareas.json', 'utf-8')

if(!configData){
  console.error('Error al leer el archivo de configuración')
  process.exit(1)
}
const config = JSON.parse(configData)

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
});

app.use(express.json());

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, 'tu_secreto_secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token no válido' });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Endpoint para obtener tareas por usuario
app.get('/tareas', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    const tasks = result.rows;

    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tareas del usuario' });
  }
});

app.listen(port, () => {
  console.log(`Servidor de tareas iniciado en http://localhost:${port}`);
});
