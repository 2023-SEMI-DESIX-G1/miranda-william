const express = require('express');
const { helpers } = require('./helpers.js');

const app = express();

const port = 3001;

app.get("/", (req, res) => {
  res.send("Laboratorio 10");
});

app.get("/pokemon-info/:id_name", async (req, res) => {

  const response = await helpers.manageEntryId_Name(req.params.id_name);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Servidor en escucha en el puerto: ${port}`);
});