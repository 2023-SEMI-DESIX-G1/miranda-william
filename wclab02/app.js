//* Desarrollo del Problema 1           */================================================================================

function respPregunta() {
    const Answer = document.querySelector('.Answer');
    let Texto =
        'JavaScript es un lenguaje de programación interpretado, dialecto del estándar ECMAScript. Java es un lenguaje de programación orientado a objetos puros (OOP), mientras que JavaScript está basado en prototipos y, puede emular la programación orientada a objetos.';
    Answer.innerText = Texto;
}

//* Desarrollo del Problema 2           */================================================================================

function respOperaciones() {
    var valor1 = parseInt(document.getElementById('valor1').value);
    var valor2 = parseInt(document.getElementById('valor2').value);
    const suma = document.getElementById('suma');
    const resta = document.getElementById('resta');
    const producto = document.getElementById('producto');
    const division = document.getElementById('division');

    s = valor1 + valor2;
    r = valor1 - valor2;
    m = valor1 * valor2;
    d = valor1 / valor2;

    console.log(s);
    console.log(r);
    console.log(m);
    console.log(d);

    suma.innerText = 'La suma es igual a ' + s;
    resta.textContent = 'La resta es igual a ' + r;
    producto.textContent = 'La multiplicacion es igual a ' + m;
    division.textContent = 'La Division es igual a ' + d;
}

//* Desarrollo del Problema 3           */================================================================================

function cadConcatenar() {
    const concat = document.querySelector('.respCad');
    let variable1 = document.getElementById('cadena1').value;
    let variable2 = document.getElementById('cadena2').value;
    var resultado = `${variable1} - ${variable2}`;

    console.log(resultado);
    concat.innerText = 'El resultado de las dos cadenas es: ' + resultado;
}

//* Desarrollo del Problema 4           */================================================================================

function typeDatos() {
    const type1 = document.querySelector('.tipoDato1');
    const type2 = document.querySelector('.tipoDato2');
    const registro1 = document.getElementById('cadena1').value;
    const registro2 = document.getElementById('cadena2').value;

    console.log(type1);
    console.log(type2);

    type1.innerHTML = typeof (registro1);
    type2.innerHTML = typeof (registro2);
}

//* Desarrollo del Problema 5           */================================================================================

function datosObjetos() {
    const objeto1 = document.querySelector('.obj1');
    const objeto2 = document.querySelector('.obj2');
    const objeto3 = document.querySelector('.obj3');
    const objeto4 = document.querySelector('.obj4');
    var obj = {
        precio: 5.99,
        Campeon: 'Riven',
        Skin: true,
        manos: undefined,
    };
    objeto1.innerHTML = typeof obj.precio;
    objeto2.innerHTML = typeof obj.Campeon;
    objeto3.innerHTML = typeof obj.Skin;
    objeto4.innerHTML = typeof obj.manos;
}

//* Desarrollo del Problema 6           */================================================================================

function sumaValor() {
    var numero;
    var suma;
    var resultado = 0;

    const retorno = document.querySelector('.sumaNumb');
    numero = parseInt(document.getElementById('valor').value);
    const validarEntrada = numero;

    while (numero != 0) {
        if (numero % 3 == 0 || numero % 5 == 0) {
            if (numero < validarEntrada) {
                suma = numero;
                resultado += suma;
            }
        }
        numero--;
    }
    console.log('La suma de los numeros es:', resultado);
    retorno.innerHTML = 'La suma de los n&uacute;meros es: ' + resultado;
}
