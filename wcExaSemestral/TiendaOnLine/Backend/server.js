const express = require('express');
const cors = require('cors');

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Paypal = require('./Paypal/MetodosPaypal');
require('dotenv').config();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
const supabaseUrl = process.env.TU_URL_DE_SUPABASE;
const supabaseKey = process.env.TU_CLAVE_DE_ACCESO;
const supabase = createClient(supabaseUrl, supabaseKey);

//* Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
const hostname = '127.0.0.1';

const crearUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
    if (data.user.identities?.length === 0) {
      return res.status(500).json({ error: 'El usuario ya existe' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Error al registrar el usuario: ', error.message);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

const iniciarsesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return res.json(data);
  } catch (error) {
    console.error('Error al autenticar al usuario: ' + error.message);
    res.status(500).json({ error: 'Error al autenticar al usuario' });
  }
};

const cerrarsesion = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    res.status(200).json({ OK: 'OK' });
  } catch (error) {
    console.error('Error al signOut al usuario: ' + error.message);
    res.status(500).json({ error: 'Error al signOut del usuario' });
  }
};

const buscartodoslosproductos = async (req, res) => {
  try {
    const { data: Productos, error } = await supabase
      .from('Productos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    res.status(200).json(Productos);
  } catch (error) {
    console.error('Error al Buscar los productos: ' + error.message);
    res.status(500).json({ error: 'Error al Buscar los productos' });
  }
};

const registrarlacompraenbasededatos = async (req, res) => {
  const {
    idProducto,
    idUsuario,
    monto,
    direccionEntrega,
    estado,
    token,
    paypal,
  } = req.body;

  supabase
    .from('Compras')
    .insert([
      {
        idProducto: idProducto,
        IdUsuario: idUsuario,
        Monto: monto,
        direccionEntrega: direccionEntrega,
        estado: estado,
        Paypal: paypal,
      },
    ])
    .then((response) => {
      if (response.error) {
        console.error('Error al insertar el registro:', response.error);
        res.status(500).json({ error: 'Error al insertar el registro' });
      } else {
        console.log('Registro insertado correctamente:', response.data);

        res.json({ OK: 'OK' });
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error.message);
    });
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

//? Iniciar el servidor
app.listen(PORT, hostname, () => {
  console.log(`Server running on http://${hostname}:${PORT}/`);
});

app.post(`/create-payment`, Paypal.createPayment);
app.post('/cobrar-dinero', Paypal.funcionParaCobrarLaPlata);
app.post(`/crear-usuario`, crearUsuario);
app.post(`/inicio-sesion`, iniciarsesion);
app.post('/cerrar-sesion', cerrarsesion);
app.get('/buscar-todos-productos', buscartodoslosproductos);
app.post('/registrar-compra', registrarlacompraenbasededatos);