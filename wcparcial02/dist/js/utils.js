(() => {
    const Utils = {
        settings: {
            backendBaseUrl: "https://pokeapi.co/api/v2"
        },
        getFormatedBackendUrl: ({ query, searchType }) => {
            return `${Utils.settings.backendBaseUrl}/${searchType}/${query}`
        },
        getPokemon: ({ query, searchType = "pokemon" }) => {
            return Utils.fetch({
                url: Utils.getFormatedBackendUrl({ query, searchType }),
                searchType
            });
        },
        fetch: async ({ url, searchType }) => {
            try {
                const rawReponse = await fetch(url);
                if (rawReponse.status != 200) {
                    throw new Error(`${searchType} sin resultado`);
                }
                return rawReponse.json();
            } catch (error) {
                throw error;
            }
        },
        capitalize: (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1).replace(/[^\w ]/, ' ');
        }
    }
    document.Utils = Utils;
})();