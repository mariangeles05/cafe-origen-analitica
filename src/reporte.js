const ventas = require("./datos.js");

const {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia
} = require("./analitica.js");

const ANCHO_ETIQUETA = 26;
const ANCHO_VALOR = 14;

const pesos = (valor) => {
  return `$ ${valor.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
};

const linea = (etiqueta, valor) => {
  return `${etiqueta.padEnd(ANCHO_ETIQUETA)}${valor.padStart(ANCHO_VALOR)}`;
};

const titulo = (texto) => {
  console.log("");
  console.log(texto);
  console.log("-".repeat(ANCHO_ETIQUETA + ANCHO_VALOR));
};

const mayor = ventaMayor(ventas);

titulo("RESUMEN GENERAL");
console.log(linea("Ventas registradas", String(ventas.length)));
console.log(linea("Total vendido", pesos(totalVendido(ventas))));
console.log(linea("Unidades vendidas", String(unidadesVendidas(ventas))));
console.log(linea("Ticket promedio", pesos(ticketPromedio(ventas))));
console.log(linea("Venta mayor", pesos(valorVenta(mayor))));
console.log(`  ${mayor.producto} en ${mayor.ciudad}`);

titulo("VENTAS POR CIUDAD");
for (const [ciudad, total] of Object.entries(totalPorCiudad(ventas))) {
  console.log(linea(ciudad, pesos(total)));
}

titulo("UNIDADES POR PRODUCTO");
for (const [producto, unidades] of Object.entries(unidadesPorProducto(ventas))) {
  console.log(linea(producto, `${unidades} uds`));
}

titulo("TOP 3 PRODUCTOS POR VALOR");
topProductosPorValor(ventas, 3).forEach((item, posicion) => {
  console.log(linea(`${posicion + 1}. ${item.producto}`, pesos(item.valor)));
});

const resumenDelDia = (fecha) => {
  const delDia = ventasDelDia(ventas, fecha);

  titulo(`RESUMEN DEL DÍA ${fecha}`);
  console.log(linea("Ventas registradas", String(delDia.length)));
  console.log(linea("Total vendido", pesos(totalVendido(delDia))));
  console.log(linea("Unidades vendidas", String(unidadesVendidas(delDia))));
  console.log(linea("Ticket promedio", pesos(ticketPromedio(delDia))));

  if (delDia.length === 0) {
    console.log("Sin ventas registradas este día.");
  }
};

resumenDelDia("2026-09-02");
resumenDelDia("2026-09-07");