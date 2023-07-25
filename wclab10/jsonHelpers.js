const moment = require('moment');
const utils = require('./utils.js');

module.exports = {

  jsonHelpers: {

    async necssryFetchForEvolChain(urlSpecies4UrlEvolChain) {
      const urlEvolChain = await utils.fetchData.getFromPokeAPI(urlSpecies4UrlEvolChain, '');
      return utils.fetchData.getFromPokeAPI(urlEvolChain['evolution_chain']['url'], '');
    },

    async getBaseInfo(pokeName_Id) {
      const jsonResponse = await utils.fetchData.getFromPokeAPI("https://pokeapi.co/api/v2/pokemon/", pokeName_Id);
      return jsonResponse;
    },

    async pokemonMainMethod(pokeName_Id) {
      const jsonResponse = await this.getBaseInfo(pokeName_Id);

      if (typeof jsonResponse !== 'string') {
        let finalTemplate = {};

        finalTemplate['baseInfo'] = await this.pokemonBaseInfoTemplate({ jsonResponse });
        finalTemplate['abilities'] = await this.pokemonAbilitiesTemplate({ jsonResponse });
        finalTemplate['evolChain'] = await this.pokemonChainTemplate(jsonResponse['species']['url'], '');
        finalTemplate['createAt'] = moment();

        return finalTemplate;
      } else {
        return { 404: 'not found' };
      }
    },

    async pokemonBaseInfoTemplate({ jsonResponse }) {

      let template = {};
      template.pokemonName = jsonResponse['name'];
      template.pokedexId = jsonResponse['id'];
      template['weight/height'] = jsonResponse['weight'] + '/' + jsonResponse['height'];

      return template;
    },

    async pokemonAbilitiesTemplate({ jsonResponse }) {
      let template = {};

      for (let i = 0; i < jsonResponse['abilities'].length; i++) {

        template['habilidad ' + (i + 1)] = jsonResponse['abilities'][i]['ability']['name'];
      }

      return template;
    },

    async pokemonChainTemplate(urlSpecies4UrlEvolChain) {

      const evolChain = await this.necssryFetchForEvolChain(urlSpecies4UrlEvolChain);

      let template = {};
      template['formabase'] = evolChain['chain']['species']['name'];

      if (evolChain['chain']['evolves_to'].length > 0) {
        for (let i = 0; i < evolChain['chain']['evolves_to'].length; i++) {
          template['evolucion ' + (i + 1)] = evolChain['chain']['evolves_to'][i]['species']['name'];

          if (evolChain['chain']['evolves_to'][i]['evolves_to'].length > 0) {

            for (let j = 0; j < evolChain['chain']['evolves_to'][i]['evolves_to'].length; j++) {
              template['evolucion ' + (i + 2)] = evolChain['chain']['evolves_to'][i]['evolves_to'][j]['species']['name'];
            }
          }
        }
      }

      return template;
    }
  }
}