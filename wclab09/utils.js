const cache = require("./cache");
const { get } = require("./remote");

// Tiempo maximo de inactividad en minutos
const MAX_INACTIVITY_TIME = 5;
// Variable para almacenar el tiempo de la última consulta
let lastQueryTime = Date.now();

module.exports = {
  pokemon: {
    getCache() {
      return Object.values(cache).map(pokemonData);
    },
    getPokemonStructure({ pokemon, fromCache = false }) {
      return {
        fromCache,
        pokemon
      };
    },
    getPokemonUrl(pokemon) {
      return `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    },
    async get(pokemonId) {
      let fromCache, pokemon;
      if (cache[pokemonId]) {
        pokemon = cache[pokemonId];
        fromCache = true;
      } else {
        const url = this.getPokemonUrl(pokemonId);
        pokemon = await get(url);
        this.set(pokemonId, pokemon);
        fromCache = false;
      }

      // Actualizar el tiempo de la última consulta
      lastQueryTime = Date.now();

      return this.getPokemonStructure({
        pokemon,
        fromCache,
      });
    },
    set(pokemonId, data) {
      cache[pokemonId] = data;
    },
    getLastQueryTime() {
      return lastQueryTime;
    },
    clearCacheIfInactive() {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - lastQueryTime) / 1000 / 60; // Convertir a minutos
      if (elapsedTime >= MAX_INACTIVITY_TIME) {
        // Borrar todo el caché
        Object.keys(cache).forEach((key) => {
          delete cache[key];
        });
      }
    }

  },
};

function pokemonData(pokemon) {
  if (!pokemon) {
    return {};
  }
  const { name, abilities, forms } = pokemon;
  const pokedexId = forms[0].url.split("/").slice(-2, -1)[0];
  const height = pokemon.height;
  const weight = pokemon.weight;
  const abilitiesFormatted = abilities.map((ability) => ability.ability.name).join(", ");
  return {
    name: `Nombre: ${name}`,
    pokedexId: `ID en la Pokédex: ${pokedexId}`,
    height: `Altura: ${height}`,
    weight: `Peso: ${weight}`,
    abilities: `Habilidades: ${abilitiesFormatted}`,
    evolutions: `Evoluciones: `,
    fromCache: "Obtenido del caché: true",
  };
}
