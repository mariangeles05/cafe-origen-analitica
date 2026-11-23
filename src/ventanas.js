const mejorSemanaBruta = (dias, k) => {
  if (k <= 0 || k > dias.length) {
    return null;
  }

  let mejor = null;

  for (let inicio = 0; inicio <= dias.length - k; inicio++) {
    let suma = 0;

    for (let i = inicio; i < inicio + k; i++) {
      suma += dias[i];
    }

    if (mejor === null || suma > mejor.total) {
      mejor = { total: suma, inicio: inicio + 1 };
    }
  }

  return mejor;
};

const mejorSemana = (dias, k) => {
  if (k <= 0 || k > dias.length) {
    return null;
  }

  let suma = 0;

  for (let i = 0; i < k; i++) {
    suma += dias[i];
  }

  let mejor = { total: suma, inicio: 1 };

  for (let i = k; i < dias.length; i++) {
    suma += dias[i] - dias[i - k];

    if (suma > mejor.total) {
      mejor = { total: suma, inicio: i - k + 2 };
    }
  }

  return mejor;
};

const parMasCercano = (catalogo, presupuesto) => {
  const ordenado = [...catalogo].sort((a, b) => a.precio - b.precio);

  let izquierda = 0;
  let derecha = ordenado.length - 1;
  let mejor = null;
  let mejorSuma = -1;

  while (izquierda < derecha) {
    const suma = ordenado[izquierda].precio + ordenado[derecha].precio;

    if (suma > presupuesto) {
      derecha--;
    } else {
      if (suma > mejorSuma) {
        mejorSuma = suma;
        mejor = [ordenado[izquierda], ordenado[derecha]];
      }
      izquierda++;
    }
  }

  return mejor;
};
module.exports = { mejorSemanaBruta, mejorSemana, parMasCercano };