const ventas = require("./datos.js");

const ciudades = [...new Set(ventas.map((venta) => venta.ciudad))];
console.log("Ciudades distintas:", ciudades);

const sinUnidades = ventas.filter((venta) => venta.cantidad === 0);
console.log("Ventas con cantidad 0:", sinUnidades);

const registrosPorCliente = {};
for (const venta of ventas) {
  registrosPorCliente[venta.cliente] = (registrosPorCliente[venta.cliente] || 0) + 1;
}
console.log("Registros por cliente:", registrosPorCliente);