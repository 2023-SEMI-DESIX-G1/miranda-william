((Products) => {
  const App = {
    products: Products,
    URLAPI: 'http://localhost:3000',
    choosenProduct: {},
    htmlElements: {
      loginForm: document.getElementById('loginForm'),
    },
    init() {
      App.htmlElements.loginForm?.addEventListener(
        'submit',
        App.handlers.LoginFormHandler
      );
    },
    handlers: {
      async LoginFormHandler(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isAuthenticated = await App.methods.login(email, password);
        if (isAuthenticated) {
          window.location.href = 'principal.html';
        } else {
          alert('Credenciales inválidas. Inténtalo de nuevo.');
        }
      },
      createPaymentHandler(e) {
        e.preventDefault();
        App.methods.CreatePayment();
      },
    },
    methods: {
      fakeAuthentication(email, password) {
        const validEmail = 'nombre@alwiro.com';
        const validPassword = 'contraseña';

        return email === validEmail && password === validPassword;
      },
      async login(email, password) {
        try {
          const data = {
            email: email,
            password: password,
          };

          const response = await axios.post(
            `${App.URLAPI}/inicio-sesion`,
            data
          );
          console.log('Respuesta del servidor:', response.data);

          if (response.data) {
            const { user, session } = response.data;
            if (user && session) {
              const usuarioJSON = JSON.stringify(user);
              const sessionJSON = JSON.stringify(session);
              localStorage.setItem('usuario', usuarioJSON);
              localStorage.setItem('sesion', sessionJSON);
              localStorage.setItem('authenticated', 'true');
              return true;
            }
          }

          return false;
        } catch (error) {
          console.error('Error capturado:', error.message);
          return false;
        }
      },
    },
  };
  App.init();
})(document.Products);
