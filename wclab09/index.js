const express = require("express");
const { pokemon } = require("./utils");
const { get } = require("./remote");
const axios = require("axios");
const app = express();

const PORT = 3001;

const CACHE_CLEAR_INTERVAL = 5 * 60 * 1000; // Intervalo de 5 minutos en milisegundos

app.get("/cache", async (req, res) => {
  res.json(pokemon.getCache());
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await pokemon.get(id);
  if (response && response.pokemon) {
    const { name, id: pokedexId, height, weight, abilities, species } = response.pokemon;
    const abilitiesFormatted = abilities.map((ability) => ability.ability.name).join(", ");

    console.log("Procesando solicitud para el ID:", id);
    console.log("Nombre:", name);
    console.log("ID en la Pokédex:", pokedexId);
    console.log("Altura:", height);
    console.log("Peso:", weight);
    console.log("Habilidades:", abilitiesFormatted);

    const speciesResponse = await axios.get(species.url);
    const speciesData = speciesResponse.data;
    const evolutionChainUrl = speciesData.evolution_chain.url;

    const evolutionChainResponse = await axios.get(evolutionChainUrl);
    const evolutionChainData = evolutionChainResponse.data.chain;
    const evolutions = getEvolutionsList(evolutionChainData);

    const pokemonData = {
      name: `Nombre: ${name}`,
      pokedexId: `ID en la Pokédex: ${pokedexId}`,
      height: `Altura: ${height}`,
      weight: `Peso: ${weight}`,
      abilities: `Habilidades: ${abilitiesFormatted}`,
      evolutions: `Evoluciones: ${evolutions}`,
      fromCache: response.fromCache ? "Obtenido del caché: true" : "Obtenido del caché: false",
    };

    res.json(pokemonData);
  } else {
    res.status(404).json({ error: "No se encontró el Pokémon solicitado" });
  }
});

function getEvolutionsList(chain) {
  const evolutions = [];
  const processChain = (evolutionData) => {
    evolutions.push(evolutionData.species.name);
    if (evolutionData.evolves_to.length > 0) {
      processChain(evolutionData.evolves_to[0]);
    }
  };
  processChain(chain);
  return evolutions.join(", ");
}

// Función para borrar el caché si ha pasado el tiempo máximo de inactividad
function clearCacheIfInactive() {
  const currentTime = Date.now();
  const elapsedTime = (currentTime - pokemon.getLastQueryTime()) / 1000 / 60; // Convertir a minutos
  // Cambiar el 5 para 5 minutos
  if (elapsedTime >= 5) {
    // Borrar todo el caché
    pokemon.clearCache();
  }
}

//Para llamar la función para borrar el cache al pasar 5min de inactividad
setInterval(pokemon.clearCacheIfInactive, CACHE_CLEAR_INTERVAL);

app.listen(PORT, () => {
  console.log(`El servidor se está ejecutando en el puerto ${PORT}`);
});
