//* Desarrollo del Problema 1 ==========================================================================================

function doublePalindrome() {
    let a = parseInt(document.getElementById('problema1').value);
    let res = document.getElementById('res1');

    const p1 = a.toString().split('').reverse().join('') === a.toString();
    const p2 = a.toString(2).split('').reverse().join('') === a.toString(2);
    res.textContent = p1 == true && p2 == true ? 'Es palindromo de doble base' : 'No es Palindromo';
}

//? Desarrollo del Problema 2 ==========================================================================================

function count() {
    let str = document.getElementById('problema2').value;
    let res = document.getElementById('res2');

    const array = {};

    for (let s in str) {
        if (str[s] in array) {
            array[str[s]]++;
        } else {
            array[str[s]] = 1;
        }
    }

    let resp = '';
    Object.keys(array).forEach((e) => {
        resp = resp.concat(`${array[e]} ${e}, `);
    });

    res.textContent = resp;
}

//! Desarrollo del Problema 3 ==========================================================================================

function leap_year() {
    let year = parseInt(document.getElementById('problema3').value);
    let res = document.getElementById('res3');

    res.textContent = year % 4 === 0 ? 'Año Bisiesto' : 'No año bisiesto';
}

//WC Desarrollo del Problema 4 =========================================================================================

function add() {
    let x = document.getElementById('problema4').value;
    let res = document.getElementById('res4');

    let total = 0;
    if (x <= 1000000) {
        for (let i = 1; i <= x; i++) {
            if (isCousin(i)) {
                total += i;
            }
        }
    }
    res.textContent = `Resultado : ${total}`;
}

function isCousin(num) {
    for (let x = 2; x < num; x++) {
        if (num % x == 0) return false;
    }
    return true;
}
