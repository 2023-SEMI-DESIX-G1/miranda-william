((Utils) => {
    const App = {
        htmlElements: {
            pokemonFinderForm: document.getElementById('pokemon-finder-form'),
            pokemonFinderSearchType: document.getElementById('pokemon-finder-search-type'),
            pokemonFinderInput: document.getElementById('pokemon-finder-input'),
            pokemonFinderOutput: document.getElementById('pokemon-finder-output'),
            pokemonFinderClearButton: document.getElementById('pokemon-finder-clear-button'),
        },
        settings: {
            backendGetPokemonSpecies: "pokemon-species",
            backendGetPokemonEvolutionChain: "evolution_chain",
        },
        utils: {
            ...Utils,
            getPokemonDataBackend: async ({ query, searchType }) => {
                try {
                    //primera consulta datos tipo busqueda pokemon
                    const pokemonDataResponse = await App.utils.getPokemon({
                        query,
                        searchType
                    });
                    //segunda consulta a url de Species
                    const pokemonEspeciesResponse = await App.utils.getPokemon({
                        query,
                        searchType: App.settings.backendGetPokemonSpecies
                    })
                    //tercera consulta obtener species-chain
                    const pokemonSpeciesChain = await App.utils.fetch({
                        url: pokemonEspeciesResponse.evolution_chain.url,
                        searchType: App.settings.backendGetPokemonEvolutionChain
                    })

                    //construir objeto con datos evolution_chain
                    const evolutionsObject = App.utils.getPokemonEvolutions(pokemonSpeciesChain.chain)

                    const pokemonGeneralDataTemplate = App.templates.pokemonGeneralData(pokemonDataResponse)
                    const pokemonTemplateExtraData = App.templates.pokemonExtraData(pokemonDataResponse, evolutionsObject)

                    return pokemonGeneralDataTemplate.concat('', pokemonTemplateExtraData)

                } catch (error) {
                    return App.templates.errorCard(error);
                }
            },
            getPokemonAbilityBackend: async ({ query, searchType }) => {
                try {
                    //primera consulta datos tipo habilidad
                    const pokemonAbilityResponse = await App.utils.getPokemon({
                        query,
                        searchType
                    });

                    return App.templates.abilitys(pokemonAbilityResponse)

                } catch (error) {
                    return App.templates.errorCard(error);
                }
            },
            getPokemonEvolutions: (chain) => {
                const evolve_chain = [];

                function getEvolve(chain) {
                    evolve_chain.push({
                        name: App.utils.capitalize(chain.species.name),
                        is_baby: chain.is_baby
                    });
                    for (let x = 0; x < chain.evolves_to.length; x++) {
                        getEvolve(chain.evolves_to[x])
                    }
                }

                getEvolve(chain)
                return evolve_chain;

            }
        },
        templates: {
            pokemonGeneralData: ({ id, name, weight, height, sprites }) => {

                return `
                <section class="form-card center">
                <div class="form-card-content">
                <section class="form-card-title">
                    <br>
                    <h3>${App.utils.capitalize(name)} (${id})</h3>
                </section>
                <section class="form-card-input">
                        <section class="form-card-input-child">
                            <section class = "content-sprites" >
                                <h4>Sprites</h4>
                                <img class="form-card-sprites" src="${sprites.front_default}" alt="">
                                <img class="form-card-sprites" src="${sprites.back_default}" alt="">
                            </section>
                        </section>
                    
                        <section class="form-card-input-child flex-end">
                                <section class="flex-left2">
                                    <h4>Peso / Altura</h4>
                                    <p>${weight} / ${height}</p>
                                </section>
                        </section>
                </section>
                `;

            },
            pokemonExtraData: ({ abilities }, evolutionsObject) => {

                const pokemonEvolutions = evolutionsObject.length > 1 ? evolutionsObject.map(
                    ({ name, is_baby }) =>
                        `<li>${name} ${is_baby ? `<img src="assets/svg/bebe.svg" alt="">` : ""
                        }</li>`
                ) : ['<li>Sin evolución</li>'];

                const pokemonAbilities = abilities.map(
                    ({ ability, is_hidden }) =>
                        `<li class="lis">${App.utils.capitalize(ability.name)} ${is_hidden ? `<img src="assets/svg/ojo.svg" alt="">` : ""
                        }</li>`
                );

                return `
                    <section class="form-card-input">
                        <section class="form-card-input-child">
                            <section class="flex-start" >
                                <h4>Cadena Evolutiva</h4>
                                <ul>
                                    ${pokemonEvolutions.join("")}
                                </ul>
                            </section>
                        </section>
                    
                        <section class="form-card-input-child flex-end">
                                <section class="flex-left2">
                                    <h4>Habilidades</h4>                        
                                    <ul>
                                        ${pokemonAbilities.join("")}
                                    </ul>
                                </section>
                        </section>
                    </section>
                    <br>
                        </div>
                        </section>
                `;

            },
            abilitys: ({ name, pokemon }) => {
                const pokemonList = pokemon.map(
                    ({ pokemon, is_hidden }) =>
                        `<li>${App.utils.capitalize(pokemon.name)} ${is_hidden ? `<img src="assets/svg/ojo.svg" alt="">` : ""
                        }</li>`
                );


                return `
                <section class="form-card center">
                <div class="form-card-content">
                <section class="flex-start" >
                <h2>${App.utils.capitalize(name)}</h2>
                <h4>¿Quién puede aprenderlo?</h4>
                <ul>
                ${pokemonList.join("")}
                </ul>
                <br><br>
                </section>
                </div>
                </section>
                `;
            },
            errorCard: (error) => {
                return ` 
                <section class="form-card center">
                <div class="form-card-content">
                <h3>${error}</h3>
                </div>
                </section>
                            `;
            },
        },
        init: () => {
            App.htmlElements.pokemonFinderForm.addEventListener("submit", App.handlers.pokemonFinderFormOnSubmit);
            App.htmlElements.pokemonFinderClearButton.addEventListener("click", App.handlers.pokemonFinderClearButtonOnClick)
        },
        handlers: {
            pokemonFinderFormOnSubmit: async (e) => {
                e.preventDefault();
                var template = "";

                const query = App.htmlElements.pokemonFinderInput.value.trim().toLowerCase();
                const searchType = App.htmlElements.pokemonFinderSearchType.value;

                if (query.length == 0 || searchType == "") {
                    template = App.templates.errorCard("Formulario Incompleto")
                    App.htmlElements.pokemonFinderOutput.innerHTML = template;
                    return
                }

                const pokemonSearchType = {
                    pokemon: App.utils.getPokemonDataBackend,
                    ability: App.utils.getPokemonAbilityBackend
                }

                template = pokemonSearchType[searchType] ?
                    await pokemonSearchType[searchType]({ query, searchType }) :
                    App.templates.errorCard;

                App.htmlElements.pokemonFinderOutput.innerHTML = template;
                App.htmlElements.pokemonFinderClearButton.style.visibility = "visible";
            },
            pokemonFinderClearButtonOnClick: () => {
                App.htmlElements.pokemonFinderForm.reset();
                App.htmlElements.pokemonFinderOutput.innerHTML = "";
                App.htmlElements.pokemonFinderClearButton.style.visibility = "hidden"
            },
        }
    }
    App.init();
})(document.Utils)