const fetch = require('node-fetch');
require('dotenv').config();
const paypalApi = process.env.PAY_PAL_API;
const clientId = process.env.CLIENTID;
const secretId = process.env.SECRETID;

const auth = Buffer.from(`${clientId}:${secretId}`).toString('base64');

const createPayment = (req, res) => {
  const bodyData = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: req.body,
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: `ALWIRO`,
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `http://localhost:3000/principal.html`,
          cancel_url: `http://localhost:3000/principal.html`,
        },
      },
    },
  };

  fetch(`${paypalApi}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(bodyData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error en la solicitud.');
      }
      return response.json();
    })
    .then((data) => {
      // Aquí tienes los datos de respuesta de PayPal
      // Puedes manipularlos o enviarlos de vuelta al cliente si es necesario
      res.json(data);
    })
    .catch((error) => {
      // Manejo de errores
      console.error('Error en la solicitud:', error);
      res.status(500).json({ error: 'Error en la solicitud' });
    });
};

const funcionParaCobrarLaPlata = (req, res) => {
  const token = req.body.token;
  const orden = req.body.OrderId;
  const bodyData = {};
  fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${token}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(bodyData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error en la solicitud.');
      }
      return response.json();
    })
    .then((data) => {
      // Aquí tienes los datos de respuesta de PayPal
      // Puedes manipularlos o enviarlos de vuelta al cliente si es necesario
      res.json(data);
    })
    .catch((error) => {
      // Manejo de errores
      console.error('Error en la solicitud:', error);
      res.status(500).json({ error: 'Error en la solicitud' });
    });
};

module.exports = {
  createPayment: createPayment,
  funcionParaCobrarLaPlata: funcionParaCobrarLaPlata,
};
