((Products) => {
  const App = {
    products: Products,
    URLAPI: 'http://localhost:3000',
    choosenProduct: {},
    htmlElements: {
      wrapper: document.querySelector('.sliderWrapper'),
      menuItems: document.querySelectorAll('.menuItem'),
      loginForm: document.getElementById('loginForm'),
      currentProductImg: document.querySelector('.productImg'),
      currentProductTitle: document.querySelector('.productTitle'),
      currentProductPrice: document.querySelector('.productPrice'),
      currentProductproductDesc: document.querySelector('.productDesc'),
      currentProductColors: document.querySelectorAll('.color'),
      currentProductSizes: document.querySelectorAll('.size'),
      productButton: document.querySelector('.productButton'),
      payment: document.querySelector('.payment'),
      close: document.querySelector('.close'),
      createPayment: document.getElementById('CreatePayment'),
    },
    init() {
      App.choosenProduct = App.products[0];
      App.methods.menu();
      App.methods.currentProductColors();

      App.htmlElements.loginForm?.addEventListener(
        'submit',
        App.handlers.AddNotaFormHandler
      );
      App.htmlElements.productButton?.addEventListener('click', () => {
        App.htmlElements.payment.style.display = 'flex';
      });
      App.htmlElements.close?.addEventListener('click', () => {
        App.htmlElements.payment.style.display = 'none';
      });
      App.htmlElements.createPayment?.addEventListener(
        'click',
        App.handlers.createPaymentHandler
      );
    },
    handlers: {
      AddNotaFormHandler(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isAuthenticated = App.methods.login(email, password);
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
      menu() {
        App.htmlElements.menuItems.forEach((item, index) => {
          item.addEventListener('click', () => {
            //change the current slide
            App.htmlElements.wrapper.style.transform = `translateX(${-100 * index
              }vw)`;

            //change the choosen product
            App.choosenProduct = App.products[index];

            //change texts of currentProduct
            App.htmlElements.currentProductTitle.textContent =
              App.choosenProduct.title;
            App.htmlElements.currentProductPrice.textContent =
              '$' + App.choosenProduct.price;
            App.htmlElements.currentProductImg.src =
              App.choosenProduct.colors[0].img;
            App.htmlElements.currentProductproductDesc.textContent =
              App.choosenProduct.desc;
            //assing new colors
            App.htmlElements.currentProductColors.forEach((color, index) => {
              color.style.backgroundColor =
                App.choosenProduct.colors[index].code;
            });
          });
        });
      },
      currentProductColors() {
        App.htmlElements.currentProductColors.forEach((color, index) => {
          color.addEventListener('click', () => {
            App.htmlElements.currentProductImg.src =
              App.choosenProduct.colors[index].img;
          });
        });
      },
      currentProductSizes() {
        App.htmlElements.currentProductSizes.forEach((size, index) => {
          size.addEventListener('click', () => {
            App.htmlElements.currentProductSizes.forEach((size) => {
              size.style.backgroundColor = 'white';
              size.style.color = 'black';
            });
            size.style.backgroundColor = 'black';
            size.style.color = 'white';
          });
        });
      },
      fakeAuthentication(email, password) {
        const validEmail = 'nombre@alwiro.com';
        const validPassword = 'contraseña';

        return email === validEmail && password === validPassword;
      },
      login(email, password) {
        const data = {
          email: email,
          password: password,
        };
        axios.post(`${App.URLAPI}/inicio-sesion`, data).then((response) => {
          console.log('Respuesta del servidor:', response.data);
          if (response.data) {
            const { user, session } = response.data;
            const usuarioJSON = JSON.stringify(user);
            const sessionJSON = JSON.stringify(session);
            localStorage.setItem('usuario', usuarioJSON);
            localStorage.setItem('sesion', sessionJSON);
            return true;
          }
          return false;
        });
      },
      CreatePayment() {
        const data = {
          currency_code: 'USD',
          value: App.choosenProduct.price,
        };
        axios.post(`${App.URLAPI}/create-payment`, data).then((response) => {
          console.log('Respuesta del servidor:', response.data);
          if (response.data) {
            const redirect = response.data.links.find(
              (l) => l.rel === 'payer-action'
            );
            window.location.href = redirect.href;
          }
        });
      },
    },
  };
  App.init();
})(document.Products);
