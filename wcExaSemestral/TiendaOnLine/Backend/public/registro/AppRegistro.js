(() => {
  const App = {
    URLAPI: 'http://localhost:3000',
    htmlElements: {
      loginForm: document.getElementById('loginForm'),
    },
    init() {
      App.htmlElements.loginForm?.addEventListener(
        'submit',
        App.handlers.FormHandler
      );
    },
    handlers: {
      async FormHandler(event) {
        event.preventDefault();
        const mensajealerta = document.querySelector('.alert');
        mensajealerta.style.display = 'none';
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const { error } = await App.methods.registrarUsuario(email, password);
        const respuesta = document.getElementById('respuestaR');
        const titulo = document.getElementById('tituloR');
        if (error) {
          respuesta.textContent = error;
          titulo.textContent = 'Registro de Usuario fallido';
          mensajealerta.style.display = 'block';
        } else {
          const textcorreo = document.getElementById('email');
          const textcontra = document.getElementById('password');
          const labelorreo = document.getElementById('labelemali');
          const labelcontra = document.getElementById('labelpassword');
          const botonregistrar = document.getElementById('botonregistrar');

          botonregistrar.style.display = 'none';
          textcorreo.style.display = 'none';
          textcontra.style.display = 'none';
          labelorreo.style.display = 'none';
          labelcontra.style.display = 'none';
          titulo.textContent = 'Registro de Usuario satisfactoria';
          respuesta.textContent = 'Verifica tu correo para validar tus datos ';
          mensajealerta.style.display = 'block';
        }
      },
    },
    methods: {
      async registrarUsuario(email, password) {
        try {
          const data = {
            email: email,
            password: password,
          };

          const response = await axios.post(
            `${App.URLAPI}/crear-usuario`,
            data
          );
          if (response.data) {
            const { user, session } = response.data;
            if (user && session) {
              return user;
            }
          }

          return false;
        } catch (error) {
          console.error('Error capturado:', error.response.data);
          return error.response.data;
        }
      },
    },
  };
  App.init();
})();
