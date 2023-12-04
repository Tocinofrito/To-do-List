const express = require('express')
const { Client } = require('pg')
const fs = require('fs')
const wt = require('jsonwebtoken')

const app = express()
const port = 3000

const configData = fs.readFileSync('config.json', 'utf8') // Ler el archivo de configuración de forma síncrona

if (!configData) {
  console.error('Error al leer el archivo de configuración')
  process.exit(1)
}

const config = JSON.parse(configData) // Parsear los datos del archivo

// Conectar a la base de datos
const client = new Client({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port
})

client.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err)
    process.exit(1)
  }
  console.log('Conectado a la base de datos')
})

app.get('/consulta/:data?', (req, res) => {
  const SecretKey = config.secretKey // Utilizar la clave secreta desde el archivo de configuración
  const token = req.params.data

  if (!token) {
    return res.status(401).send('Token JWT no proporcionado')
  }

  wt.verify(token, SecretKey, (err, decoded) => {
    if (err) {
      console.error('Error al verificar token:', err)
      return res.status(401).send('Token JWT no válido')
    }
    const tipo = decoded.tipo
    const id = decoded.id

    // Realizar consultas a la base de datos aquí
    if (tipo === '1') {
      const query = 'SELECT * FROM cat_estados'
      client.query(query, (err, result) => {
        if (err) {
          console.error('Error en la consulta: ', err)
          res.status(500).json({ error: 'Error en la consulta' })
        } else {
          res.json(result.rows)
        }
      })
    } else if (tipo === '2' && id) {
      const query = 'SELECT * FROM cat_estados WHERE id_estado = $1'
      client.query(query, [id], (err, result) => {
        if (err) {
          console.error('Error en la consulta: ', err)
          res.status(500).json({ error: 'Error en la consulta' })
        } else {
          res.json(result.rows)
        }
      })
    }
  })
})

app.listen(port, () => {
  console.log('Iniciado microservicio puerto: ', port)
})
