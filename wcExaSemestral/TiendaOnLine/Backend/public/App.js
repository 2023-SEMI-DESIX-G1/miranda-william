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
      cerrarsesion: document.getElementById('cerrarsesion'),
    },
    init() {
      const valorsesion = localStorage.getItem('authenticated');
      const urlActual = window.location.href;
      const { token, PayerID } =
        App.methods.buscarlosparamtrosdetokendepaypal();
      if (token && PayerID) {
        App.methods.completarPago(token, PayerID);
      }

      if (valorsesion !== 'true' && !urlActual.includes('login')) {
        window.location.href = 'login.html';
      } else {
      }
      !urlActual.includes('login') && App.methods.buscartodosproductos();
      App.methods.menu();
      App.methods.currentProductColors();
      !urlActual.includes('login') &&
        App.methods.colocarnombredelusuarioperfi();

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
      App.htmlElements.cerrarsesion?.addEventListener('click', () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('authenticated');
        localStorage.removeItem('sesion');
        window.location.href = 'login.html';
      });
    },
    handlers: {
      async AddNotaFormHandler(event) {
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
      menu() {
        App.htmlElements.menuItems.forEach((item, index) => {
          item.addEventListener('click', () => {
            App.methods.seleccionenelslaider(index);
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
      colocarnombredelusuarioperfi() {
        let uservar = JSON.parse(localStorage.getItem('usuario'));
        const userIDElement = document.getElementById('userID');

        userIDElement.textContent = uservar.email;
      },
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
      async buscartodosproductos() {
        try {
          const response = await axios.get(
            `${App.URLAPI}/buscar-todos-productos`
          );
          console.log('Respuesta del servidor:', response.data);

          if (response.data) {
            App.products = response.data;
            App.choosenProduct = App.products[0];
            App.methods.CreateHtmlProducts();
            App.methods.seleccionenelslaider(0);
          }
        } catch (error) {
          console.error('Error capturado:', error.message);
        }
      },
      CreatePayment() {
        const producto = JSON.stringify(App.choosenProduct);
        localStorage.setItem('producto', producto);
        const data = {
          currency_code: 'USD',
          value: App.choosenProduct.price,
        };
        axios
          .post(`${App.URLAPI}/create-payment`, data)
          .then((response) => {
            console.log('Respuesta del servidor:', response.data);
            if (response.data) {
              const redirect = response.data.links.find(
                (l) => l.rel === 'payer-action'
              );
              window.location.href = redirect.href;
            }
          })
          .catch((error) => {
            console.error('Error capturado:', error.message);
          });
      },
      completarPago(token, PayerID) {
        const data = {
          token: token,
          OrderId: PayerID,
        };
        axios
          .post(`${App.URLAPI}/cobrar-dinero`, data)
          .then((response) => {
            console.log('Respuesta del servidor:', response.data);
            if (response.data) {
              if (response.data.status === 'COMPLETED') {
                App.methods.registrarCompra(response.data);
              }
            }
          })
          .catch((error) => {
            console.error('Error capturado:', error.message);
          });
      },
      CreateHtmlProducts() {
        const deslizante = document.querySelector('#deslizadorid');
        const carruceldeproductos = App.products.map((producto) => {
          return `<div class="sliderItem">
        <img src="${producto.colors[0].img}" alt="" class="sliderImg">
        <div class="sliderBg"></div>
        <h1 class="sliderTitle">${producto.title
              .split(' ')
              .join(` </br> `)}</h1>
        <h2 class="sliderPrice">$${producto.price}</h2>
        <a href="#product">
            <button class="buyButton">Comprar Ahora!</button>
        </a>
    </div>`;
        });
        deslizante.innerHTML = carruceldeproductos;
      },
      seleccionenelslaider(index) {
        App.htmlElements.wrapper.style.transform = `translateX(${-100 * index
          }vw)`;
        App.choosenProduct = App.products[index];
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
          color.style.backgroundColor = App.choosenProduct.colors[index].code;
        });
      },
      buscarlosparamtrosdetokendepaypal() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const PayerID = urlParams.get('PayerID');
        return { token, PayerID };
      },
      registrarCompra(datapaypal) {
        const usuario = JSON.parse(localStorage.getItem('usuario') || {});
        const producto = JSON.parse(localStorage.getItem('producto') || {});
        const sesion = JSON.parse(localStorage.getItem('sesion') || {});
        const data = {
          idProducto: producto.id,
          idUsuario: usuario.id,
          monto: producto.price,
          direccionEntrega: '',
          estado: datapaypal?.status,
          token: sesion.access_token,
          paypal: JSON.stringify(datapaypal),
        };
        axios
          .post(`${App.URLAPI}/registrar-compra`, data)
          .then((response) => {
            window.location.href = 'principal.html';
            console.log('Respuesta del servidor:', response.data);
          })
          .catch((error) => {
            console.error('Error capturado:', error.message);
          });
      },
    },
  };
  App.init();
})(document.Products);
