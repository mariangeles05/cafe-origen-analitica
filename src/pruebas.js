const ventas = require("./datos.js");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad
} = require("./analitica.js");

const entradas = {
  completo: ventas,
  unElemento: [ventas[0]],
  unElementoCantidadCero: [ventas[7]],
  vacio: []
};

for (const [nombre, entrada] of Object.entries(entradas)) {
  console.log("-----", nombre, "-----");
  console.log("totalVendido:", totalVendido(entrada));
  console.log("unidadesVendidas:", unidadesVendidas(entrada));
  console.log("ventaMayor:", ventaMayor(entrada));
  console.log("ticketPromedio:", ticketPromedio(entrada));
  console.log("ventasPorCiudad Medellín:", ventasPorCiudad(entrada, "Medellín"));
}

console.log("----- ciudad con mayúsculas y espacios -----");
console.log("' medellín ':", ventasPorCiudad(ventas, " medellín "));
console.log("'CALI':", ventasPorCiudad(ventas, "CALI"));
console.log("'Bogotá':", ventasPorCiudad(ventas, "Bogotá"));
console.log("'Pereira':", ventasPorCiudad(ventas, "Pereira"));
console.log("'Armenia' (no existe):", ventasPorCiudad(ventas, "Armenia"));