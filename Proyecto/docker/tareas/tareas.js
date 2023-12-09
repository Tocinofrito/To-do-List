//Declaramos la variable de express para el servidor
const express = require('express')
//Variable para manejo de la bd postgres
const { Client } = require('pg')
//Variables para manejar JSON y usar el archivo config y jsonwebtoken para seguridad
const fs = require('fs')
//jsonwebtoken es un mecanismo para propagar información entre dos partes de forma segura
const wt = require('jsonwebtoken')

//Creamos variable app para manejarr el sb y el puero en el que se manejará

const app = express()
//Variable de cliente para la conexión a la base de datos
let client
//Se hace de manera síncrona debido a que debe tener los datos para configurara la conexión a la base de datos antes
//De ejecutar esa parte de código
const configData = fs.readFileSync('Proyecto/config/config-tareas.json', 'utf-8')
//Conprobamos la existencia del archvio
if(!configData){
  console.error('Error al leer el archivo de configuración')
  process.exit(1)
}
//Al hacer parse al JSON podemos acceder a sus valores con el .
const config = JSON.parse(configData)

//Conexión a la bse de datos
client = new Client({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port
})
//Comprobamos conexión a bd
client.connect((err) =>{
  if(err){
    console.error('Error al conectar a la base de datos:', err)
    process.exit(1)
  }
  console.log('Conectado a la base de datos')
})
//Ruta a llamar para lista de tareas por usuario
//Parámetros en la ruta jwt:
app.get('/consulta/:data?',(req, res) =>{
  const SecretKey = config.SecretKey
  const token = req.params.data
  if(!token){
    return res.status(401).sendStatus('Token JWT no proporcionado')
  }
  //Comprobamos el token sea correcto
  wt.verify(token, SecretKey, (err, decoded) =>{
    if(err){
      console.error('Error al verificar el token:',err)
      return res.status(401).sendStatus('Token JWT no válido')
    }
    const tipo = decoded.tipo
    const id = decoded.id
  })
  //Realizamos la consulta y retornamos eljson
  switch (tipo === '1') {
    case value:
      //Consulta de las tareas de todos los usuarios
      const query = "SELECT * FROM tasks"
      break;
  
    default:
      break;
  }
})