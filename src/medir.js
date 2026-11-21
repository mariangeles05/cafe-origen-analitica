const { generarVentas } = require("./generador.js");
const {
  totalVendidoConteo,
  ventaMayorConteo,
  totalPorCiudadConteo,
  primeraVenta
} = require("./analitica.js");

const tamanos = [100, 1000, 10000, 100000];

const contar = (funcion, ventas) => {
  const contador = { operaciones: 0 };
  funcion(ventas, contador);
  return contador.operaciones;
};

const filas = [];

for (const n of tamanos) {
  const ventas = generarVentas(n);

  filas.push({
    n,
    totalVendido: contar(totalVendidoConteo, ventas),
    ventaMayor: contar(ventaMayorConteo, ventas),
    totalPorCiudad: contar(totalPorCiudadConteo, ventas),
    primeraVenta: contar(primeraVenta, ventas)
  });
}

console.table(filas);

const factores = [];

for (let i = 1; i < filas.length; i++) {
  const antes = filas[i - 1];
  const ahora = filas[i];

  factores.push({
    de: antes.n,
    a: ahora.n,
    totalVendido: ahora.totalVendido / antes.totalVendido,
    ventaMayor: ahora.ventaMayor / antes.ventaMayor,
    totalPorCiudad: ahora.totalPorCiudad / antes.totalPorCiudad,
    primeraVenta: ahora.primeraVenta / antes.primeraVenta
  });
}

console.log("");
console.log("Cuántas veces crecieron las operaciones:");
console.table(factores);