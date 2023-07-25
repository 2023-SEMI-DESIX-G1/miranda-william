const express = require("express");
const { pokemon } = require("./utils");
const { get } = require("./remote");
const axios = require("axios");
const app = express();

const hostname = '127.0.0.1';
const port = 3001;

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
    console.log("Evoluciones:", evolutions);

    const pokemonData = {
      name: `Nombre: ${name}`,
      pokedexId: `ID en la Pokédex: ${pokedexId}`,
      height: `Altura: ${height}`,
      weight: `Peso: ${weight}`,
      abilities: `Habilidades: ${abilitiesFormatted}`,
      evolutions: `Evoluciones: ${evolutions}`,
      // Agregar el valor correcto para fromCache
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

app.listen(port, hostname, () => {
  console.table(`Server running on http://${hostname}:${port}/`);
});