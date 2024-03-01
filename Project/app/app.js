const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

// Configuración del middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para servir el archivo HTML de inicio de sesión
app.get('/login', verifyToken, (req, res) => {
  if (req.user) {
    // Si el usuario tiene una sesión iniciada, redirigir a todo-list.html
    return res.redirect('/todo-list');
  }

  // Si no hay sesión iniciada, mostrar el formulario de inicio de sesión
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Endpoint para servir el archivo HTML de la lista de tareas
app.get('/todo-list', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'todo-list.html'));
});

// Endpoint para la lista de tareas, en caso de que sea la ruta predeterminada
app.get('/', verifyToken, (req, res) => {
  // Verificar si el usuario está autenticado
  if (req.user) {
    // Si está autenticado, redirigir a todo-list.html
    return res.redirect('/todo-list');
  }

  // Si no está autenticado, mostrar la página principal (todo-list.html)
  res.sendFile(path.join(__dirname, 'public', 'todo-list.html'));
});

function verifyToken(req, res, next) {
  const token = req.cookies.token || req.headers['authorization'];

  if (!token) {
    // Si no hay token, continuar con la solicitud
    return next();
  }

  axios.post('http://localhost:3000/verify-token', { token })
    .then(response => {
      if (response.data.valid) {
        // Si el token es válido, almacenar el usuario en la solicitud para su posterior uso
        req.user = response.data.decoded;
      }
      next();
    })
    .catch(error => {
      console.error(error);
      next();
    });
}

app.listen(port, () => {
  console.log(`Servidor de la aplicación iniciado en http://localhost:${port}`);
});
