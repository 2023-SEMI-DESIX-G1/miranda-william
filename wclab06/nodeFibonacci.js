(() => {
  const App = {

    Methods: {
      funFibonnacci(valor) {
        const respFibonacci = [];
        let keyFibonacci = 0;

        for (let i = 0; i < valor; i++) {
          if (i === 0 || i === 1) {
            keyFibonacci = i;
          } else {
            keyFibonacci = respFibonacci[i - 1] + respFibonacci[i - 2];
          }
          respFibonacci.push(keyFibonacci);
        }
        return respFibonacci;
      }
    },

    PrintFibonacci: {
      ConsolePrint(quantity) {
        console.log(quantity);
      }
    },

    init(number) {
      const response = App.Methods.funFibonnacci(number);
      App.PrintFibonacci.ConsolePrint(response);
    }
  }
  App.init(10);
})();