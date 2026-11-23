const { generarVentas } = require("./generador.js");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  clientesRecurrentesMap,
} = require("./analitica.js");

const mediana = (valores) => {
  const ordenados = [...valores].sort((a, b) => a - b);
  return ordenados[Math.floor(ordenados.length / 2)];
};

const medir = (funcion, ventas, repeticiones) => {
  const tiempos = [];
  for (let i = 0; i < repeticiones; i++) {
    const inicio = performance.now();
    funcion(ventas);
    tiempos.push(performance.now() - inicio);
  }
  return Number(mediana(tiempos).toFixed(2));
};

const tamanios = [1000, 10000, 100000];
const filas = [];

for (const n of tamanios) {
  const ventas = generarVentas(n);
  filas.push({
    ventas: n,
    "original (ms)": n <= 10000 ? medir(clientesRecurrentes, ventas, n <= 1000 ? 5 : 1) : "no medido",
    "Set (ms)": medir(clientesRecurrentesSet, ventas, 7),
    "Map (ms)": medir(clientesRecurrentesMap, ventas, 7),
  });
}

console.table(filas);