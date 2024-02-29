const express = require('express');
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const port = 3000;

const configData = fs.readFileSync('../config/config-tareas.json', 'utf-8')

if(!configData){
  console.error('Error al leer el archivo de configuraci{on')
  process.exit(1)
}
const config = JSON.parse(configData)

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port
});

app.use(express.json());

//endpoint registro de usuarios
app.post('/register', async(req,res) =>{
  try{
    const{username, password} = req.body;
    //hash de la contraseña antes de almacenarla
    const password_Hash = await bcrypt.hash(password,10);
    
    const result = await pool.query(
      'INSERT INTO users(username, password_hash) VALUES ($1, $2) RETURNING *',
      [username, password_nHash]
    );

    const user = result.rows[0];
    res.json({ user });
  }catch(error){
    res.status(500).json({error: 'Error al registrar el usuario'});
  }
});

//Endpoint iniciar sesion y generar JWT
app.post('/login', async(req, res)=>{
  try{
    const { username, password} = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if(!user || !(await bcrypt.compare(password, user.password_Hash))){
      return res.status(401).json({ error: 'Credencialess incorrectas'});
    }

    //Generar token JWT
    const token = jwt.sign({userId: user.user_id, username: user.username}, 'tu_secreto_secreto',{
      expiresIn: '1h',
    });

    res.json({ token });
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.listen(port, ()=>{
  console.log(`Servidor iniciado en http://localhost:${port}`)
});