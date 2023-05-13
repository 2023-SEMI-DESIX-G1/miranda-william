(() => {
    const App = {
        htmlElements: {
            fibonnacciForm: document.getElementById('myForma'),
            listFibonacci: document.getElementById('resultados'),
        },
        init() {
            // Handlers
            App.htmlElements.fibonnacciForm.addEventListener('submit', App.handlers.fibonnacciFormHandler);
        },
        handlers: {
            fibonnacciFormHandler(event) {
                event.preventDefault();
                const n = document.getElementById('numero').value;
                const resp = App.methods.returnFibonnacci({ n });
                App.methods.printRespFibonnacci(resp);
            },
        },

        methods: {
            // Problema 1
            returnFibonnacci({ n }) {
                let resp = [0, 1];
                for (let i = 2; i < n; i++) {
                    if (i === 0) {
                        resp = 0;
                    } else if (i === 1) {
                        resp = 1;
                    } else {
                        // Almacenar resp como elemento actual
                        resp[i] = resp[i - 2] + resp[i - 1];
                    }
                }

                return resp;
            },

            printRespFibonnacci(resp) {
                const listFibonacci = App.htmlElements.listFibonacci;
                listFibonacci.innerHTML = '';

                resp.forEach((value, n) => {
                    const listItem = document.createElement('div');
                    listItem.textContent = value;
                    listItem.classList.add('list-item');

                    //Borrar uno por uno
                    const deleteBoton = document.createElement('button');
                    deleteBoton.textContent = 'X';
                    deleteBoton.classList.add('delete-button');
                    deleteBoton.addEventListener('click', () => {
                        if (confirm('Desea eliminar este número?')) {
                            App.methods.deleteItem(n, resp);
                        }
                    });

                    listItem.appendChild(deleteBoton);

                    listItem.addEventListener('mouseover', () => {
                        deleteBoton.style.display = 'block';
                    });
                    listItem.addEventListener('mouseout', () => {
                        deleteBoton.style.display = 'none';
                    });

                    listFibonacci.appendChild(listItem);
                });
            },

            deleteItem(n, resp) {
                resp.splice(n, 1); // elimina el elemento del array en la posición index
                App.methods.printRespFibonnacci(resp); // actualiza la lista
            },
        },
    };
    App.init();
})();
