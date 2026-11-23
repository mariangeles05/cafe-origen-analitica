const ventasDiarias = require("./ventasDiarias.js");
const { mejorSemanaBruta, mejorSemana } = require("./ventanas.js");

const generarDias = (n) =>
  Array.from({ length: n }, () => 200 + Math.floor(Math.random() * 600));

const iguales = (a, b) => a.total === b.total && a.inicio === b.inicio;

const mediana = (valores) => {
  const ordenados = [...valores].sort((a, b) => a - b);
  return ordenados[Math.floor(ordenados.length / 2)];
};

const medir = (funcion, dias, k, repeticiones) => {
  const tiempos = [];
  for (let i = 0; i < repeticiones; i++) {
    const inicio = performance.now();
    funcion(dias, k);
    tiempos.push(performance.now() - inicio);
  }
  return Number(mediana(tiempos).toFixed(2));
};

const septiembreBruta = mejorSemanaBruta(ventasDiarias, 7);
const septiembreVentana = mejorSemana(ventasDiarias, 7);
console.log("Septiembre:", septiembreBruta, septiembreVentana, iguales(septiembreBruta, septiembreVentana) ? "OK" : "DIFERENTE");

const dias = generarDias(100000);
const filas = [];

for (const k of [7, 1000]) {
  const bruta = mejorSemanaBruta(dias, k);
  const ventana = mejorSemana(dias, k);
  console.log("100.000 días, k =", k, ":", ventana, iguales(bruta, ventana) ? "OK" : "DIFERENTE");

  filas.push({
    k,
    "bruta (ms)": medir(mejorSemanaBruta, dias, k, 5),
    "ventana (ms)": medir(mejorSemana, dias, k, 5),
  });
}

console.table(filas);