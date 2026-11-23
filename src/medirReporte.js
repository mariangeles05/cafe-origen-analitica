const { generarVentas } = require("./generador.js");
const catalogo = require("./catalogo.js");
const { construirReporte, motorOptimizado, motorOriginal } = require("./reporte.js");
const {
  clientesRecurrentesSet,
  comprasPorCliente,
  clientesRecurrentesMap,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  totalesDiarios,
} = require("./analitica.js");
const { comboRegalo, comboRegaloFuerzaBruta } = require("./combos.js");
const { mejorSemana, mejorSemanaBruta, parMasCercano } = require("./ventanas.js");

const mediana = (valores) => {
  const ordenados = [...valores].sort((a, b) => a - b);
  return ordenados[Math.floor(ordenados.length / 2)];
};

const medir = (funcion, repeticiones) => {
  const tiempos = [];
  for (let i = 0; i < repeticiones; i++) {
    const inicio = performance.now();
    funcion();
    tiempos.push(performance.now() - inicio);
  }
  return mediana(tiempos);
};

const ventas10k = generarVentas(10000);
const { totales } = totalesDiarios(ventas10k);

const funciones = {
  clientesRecurrentesSet: () => clientesRecurrentesSet(ventas10k),
  comprasPorCliente: () => comprasPorCliente(ventas10k),
  clientesRecurrentesMap: () => clientesRecurrentesMap(ventas10k),
  productoEstrellaPorCiudad: () => productoEstrellaPorCiudad(ventas10k),
  primerClienteUnico: () => primerClienteUnico(ventas10k),
  totalesDiarios: () => totalesDiarios(ventas10k),
  comboRegaloFuerzaBruta: () => comboRegaloFuerzaBruta(catalogo, 87000),
  comboRegalo: () => comboRegalo(catalogo, 87000),
  mejorSemanaBruta: () => mejorSemanaBruta(totales, 7),
  mejorSemana: () => mejorSemana(totales, 7),
  parMasCercano: () => parMasCercano(catalogo, 100000),
};

console.log("Funciones nuevas con 10.000 ventas (mediana de 7 corridas, en ms)");
const filasFunciones = Object.entries(funciones).map(([nombre, funcion]) => ({
  funcion: nombre,
  "ms": Number(medir(funcion, 7).toFixed(4)),
}));
console.table(filasFunciones);

const filasReporte = [];

for (const n of [10000, 100000]) {
  const ventas = generarVentas(n);

  if (n >= 100000) {
    console.log("Midiendo el reporte con los algoritmos originales y 100.000 ventas (puede tardar 1 o 2 minutos)...");
  }

  const original = medir(() => construirReporte(ventas, motorOriginal), n <= 10000 ? 3 : 1);
  const optimizado = medir(() => construirReporte(ventas, motorOptimizado), 5);

  filasReporte.push({
    ventas: n,
    "v0.1 (ms)": Number(original.toFixed(1)),
    "v1.0 (ms)": Number(optimizado.toFixed(1)),
    "mejora (veces)": Number((original / optimizado).toFixed(0)),
  });
}

console.log("Reporte completo");
console.table(filasReporte);