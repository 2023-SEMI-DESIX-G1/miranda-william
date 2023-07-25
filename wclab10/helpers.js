const { createClient } = require("@supabase/supabase-js");
const moment = require('moment');
const { jsonHelpers } = require('./jsonHelpers.js');

module.exports = {

  helpers: {
    supabaseClient() {
      const supabaseUrl = 'http://129.159.77.176:8000';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';
      return createClient(supabaseUrl, supabaseKey);
    },

    async manageCache(id_name) {

      const lookupColumn = !isNaN(id_name) ? "pokemon_id" : "pokemon_name";
      const supabase = this.supabaseClient();

      const { data, error } = await supabase
        .from('pokemon_jzTable')
        .select('pokemon_data')
        .eq(lookupColumn, id_name)

      const time_passed = moment();

      if (Object.keys(data).length > 0 && time_passed.diff(data['createAt'], 'minutes') <= 5) {
        return { state: true, info: data };
      } else if (error) {
        return { state: false };
      } else {
        return { state: false };
      }
    },

    async updateCache(id_name, data) {

      if (404 in data === false) {

        const supabase = this.supabaseClient();
        const { error } = await supabase
          .from('pokemon_jzTable')
          .insert({
            pokemon_data: data,
            pokemon_name: data.baseInfo.pokemonName,
            pokemon_id: data.baseInfo.pokedexId
          });
        if (error)
          console.log('Error al actualizar base de datos');
      }
    },

    async manageEntryId_Name(id_name) {

      let data;
      const result = await this.manageCache(id_name);

      if (result['state']) {
        console.log("From cache, YES");
        data = result.info;
      } else {
        console.log("From cache, NO");
        data = await jsonHelpers.pokemonMainMethod(id_name);
        this.updateCache(id_name, data);
      }
      return data;
    }
  }
}