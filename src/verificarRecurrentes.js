const datos = require("./datos.js");
const { generarVentas } = require("./generador.js");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  clientesRecurrentesMap,
} = require("./analitica.js");

const ordenar = (lista) => [...lista].sort();

const iguales = (a, b) =>
  JSON.stringify(ordenar(a)) === JSON.stringify(ordenar(b));

const comparar = (nombre, ventas) => {
  const original = clientesRecurrentes(ventas);
  const conSet = clientesRecurrentesSet(ventas);
  const conMap = clientesRecurrentesMap(ventas);

  console.log(nombre);
  console.log("  Original:", original.length, "clientes");
  console.log("  Set:", conSet.length, "clientes", iguales(original, conSet) ? "OK" : "DIFERENTE");
  console.log("  Map:", conMap.length, "clientes", iguales(original, conMap) ? "OK" : "DIFERENTE");
};

comparar("Datos del Día 1", datos);
comparar("5.000 ventas generadas", generarVentas(5000));