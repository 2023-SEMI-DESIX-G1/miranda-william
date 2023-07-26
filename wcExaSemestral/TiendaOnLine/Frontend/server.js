// app.js
const express = require('express');
const path = require('path');
const app = express(); //* Crear una app de express. */

//* Configurar el puerto del servidor
const hostname = '127.0.0.1';
const PORT = process.env.PORT || 3001;

// Ruta a los archivos estáticos (HTML, CSS, JS y otros archivos)
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());

// Ruta raíz - Servir el archivo index.html
// app.get('/', (req, res) => {
//   response.statusCode = 200; //* 200 = Salio todo bien. */
//   res.sendFile(path.join(__dirname, 'public', 'principal.html'));
// });

//? Iniciar el servidor
// app.listen(PORT, hostname, () => {
//   console.log(`Server running on http://${hostname}:${PORT}/`);
// });

//* Donde cargar los files staticos. */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


//? Ruta raíz - Servir el archivo index.html
app.get('/', function (request, response) {
  response.statusCode = 200;            //* 200 = Salio todo bien. */
  response.sendFile(path.join(__dirname + '/principal.html')); //* Envio de contenido de tipo HTML. */
});

//? Iniciar el servidor
app.listen(PORT, hostname, () => {
  console.log(`Server running on http://${hostname}:${PORT}/`);
});