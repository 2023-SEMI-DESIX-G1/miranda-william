const axios = require('axios').default;
const url = 'https://pokeapi.co/api/v2/pokemon/';
const especie = 'eevee';

(async () => {
    //primera consulta general
    const pokemonGeneralDataFetch = await axios.get(url + especie)
    const { data } = pokemonGeneralDataFetch;
    const { species } = data;
    //2daspecies.url
    const pokemonEspeciesFetch = await axios.get(species.url)
    const evolutionChainUrl = pokemonEspeciesFetch.data.evolution_chain.url
    //3ra evolutionChainUrl
    const evolutionChainData = await axios.get(evolutionChainUrl)
    evolve_chain = [];
    getPokemonEvolutions(evolutionChainData.data.chain, evolve_chain);

    printPokemonData(data, evolve_chain);
})()

const getPokemonEvolutions = (chain, evolve_chain) => {
    evolve_chain.push({
        Evolution_chain: chain.species.name,
        Is_baby: chain.is_baby
    });
    for (let x = 0; x < chain.evolves_to.length; x++) {
        getPokemonEvolutions(chain.evolves_to[x], evolve_chain)
    }
}

const printPokemonData = ({ name, id, height, weight, abilities }, evolve_chain) => {

    const habilidades = {};
    abilities.forEach(({ ability, is_hidden }, index) => {
        habilidades[index] = {
            Abilitys: ability.name,
            Is_hidden: is_hidden
        }
    });
    console.table({
        Nombre: name,
        Id: id,
        Altura: height,
        Peso: weight
    })
    console.table(habilidades)
    console.table(evolve_chain)
}