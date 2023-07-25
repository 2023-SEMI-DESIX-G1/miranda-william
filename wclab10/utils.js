const fetch = require('node-fetch');

module.exports = utils = {

  fetchData: {
    async getFromPokeAPI(url, id_name_blank) {
      let response = {};

      try {
        const bulkresponse = await fetch(url + id_name_blank);
        response = await bulkresponse.json();
      } catch (err) {
        console.log(err);
        response = "Error fetching the data";
      }
      return response;
    }
  }
}