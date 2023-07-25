(() => {
    const App = {

        htmlElements: {
            notasMyForm: document.getElementById('myForm'),
            calcularNotas: document.getElementById('calcular'),
            imprimirNotas: document.getElementById('notas'),
            imprimirPromedio: document.getElementById('promedio'),
            graficoNotas: document.getElementById('graphHorizontal'),
            graficoNotasVert: document.querySelector('.barVertical')
        },

        myNotas: [],

        init() {
            // Handlers
            App.htmlElements.notasMyForm.addEventListener('submit', App.handlers.notasMyFormHandler);
            App.htmlElements.calcularNotas.addEventListener('click', App.handlers.calcularNotasHandler);
        },

        handlers: {
            notasMyFormHandler(event) {
                event.preventDefault();
                const estNota = parseFloat(document.getElementById('nota').value);
                App.methods.agregarNotas(estNota);
                App.methods.mostrarNotas();
                document.getElementById('nota').value = '';
            },

            calcularNotasHandler(event) {
                event.preventDefault();
                App.methods.calcularNotas();
            }
        },

        methods: {
            agregarNotas(estNota) {
                App.myNotas.push(estNota);
            },

            mostrarNotas() {
                App.htmlElements.imprimirNotas.innerHTML = '';
                for (let i = 0; i < App.myNotas.length; i++) {
                    let notasElement = document.createElement('div');
                    notasElement.classList.add('list-item');
                    notasElement.textContent = App.myNotas[i];
                    App.htmlElements.imprimirNotas.appendChild(notasElement);
                }
            },

            calcularNotas() {
                let total = 0;
                for (i = 0; i < App.myNotas.length; i++) {
                    total += App.myNotas[i];
                }

                const promedio = (total / App.myNotas.length).toFixed(2);
                App.htmlElements.imprimirPromedio.innerHTML = '';
                let promedioElement = document.createElement('div');
                promedioElement.classList.add('list-item');
                promedioElement.textContent = `Promedio del estudiante es : ${promedio}`;
                App.htmlElements.imprimirPromedio.appendChild(promedioElement);

                //! Calcular el porcentaje total
                const porcentajeTotal = 100;

                App.htmlElements.graficoNotasVert.style.display = 'block';
                App.htmlElements.graficoNotasVert.innerHTML = '';
                let progressBarVert = document.createElement('div');
                progressBarVert.style.display = 'flex';
                progressBarVert.style.alignSelf = 'flex-end';
                progressBarVert.style.backgroundColor = '#f16f29';
                progressBarVert.style.marginLeft = '1.5rem';
                progressBarVert.style.width = '2.5rem';
                progressBarVert.style.height = (promedio - 3) + '%'; // se resta 3 para que en la grafica se vea mas aproximada la barra al %
                progressBarVert.style.position = 'absolute';
                progressBarVert.style.bottom = '0';
                App.htmlElements.graficoNotasVert.appendChild(progressBarVert);

                //! Calcular el porcentaje de cada nota
                App.htmlElements.graficoNotas.style.display = 'block';
                App.htmlElements.graficoNotas.innerHTML = '';
                let progressBar = document.createElement('div');
                progressBar.className = 'barHorizontal';
                progressBar.style.width = porcentajeTotal + '%';

                if (promedio >= porcentajeTotal) {
                    progressBar.style.width = porcentajeTotal + '%';
                    progressBar.style.backgroundColor = '#E64A19';
                } else {
                    progressBar.style.width = promedio + '%';
                }

                let nivelBar = document.createElement('div');
                nivelBar.className = 'barHorizontal-label';
                nivelBar.textContent = promedio + '%';
                progressBar.appendChild(nivelBar);
                App.htmlElements.graficoNotas.appendChild(progressBar);
            },
        },
    };
    App.init();
})();
