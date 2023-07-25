const cache = require("./cache");
const { get } = require("./remote");

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

      return this.getPokemonStructure({
        pokemon,
        fromCache,
      });
    },

    set(pokemonId, data) {
      cache[pokemonId] = data;
    },
  },
};


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

async function pokemonData(pokemon) {
  if (!pokemon) {
    return {};
  }
  const { name, id, height, weight, abilities, species } = pokemon;
  const abilitiesFormatted = abilities.map((ability) => ability.ability.name).join(", ");

  const evolutionChainUrl = await get(species.url).data.evolution_chain.url;
  const evolutionChainData = await get(evolutionChainUrl).data.chain;
  const evolutions = getEvolutionsList(evolutionChainData);

  return {
    name: `Nombre: ${name}`,
    pokedexId: `ID en la Pokédex: ${id}`,
    height: `Altura: ${height}`,
    weight: `Peso: ${weight}`,
    abilities: `Habilidades: ${abilitiesFormatted}`,
    evolutions: `Evoluciones: ${evolutions}`,
  };
}
