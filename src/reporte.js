const datos = require("./datos.js");
const catalogo = require("./catalogo.js");
const { generarVentas } = require("./generador.js");
const { comboRegalo, comboRegaloFuerzaBruta } = require("./combos.js");
const { mejorSemana, mejorSemanaBruta } = require("./ventanas.js");
const {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentes,
  clientesRecurrentesSet,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  totalesDiarios,
} = require("./analitica.js");

const motorOptimizado = {
  clientesRecurrentes: clientesRecurrentesSet,
  comboRegalo,
  mejorSemana,
};

const motorOriginal = {
  clientesRecurrentes,
  comboRegalo: comboRegaloFuerzaBruta,
  mejorSemana: mejorSemanaBruta,
};

const pesos = (valor) =>
  "$" + valor.toLocaleString("es-CO", { maximumFractionDigits: 0 });

const sumarDias = (fecha, dias) => {
  const resultado = new Date(fecha + "T00:00:00Z");
  resultado.setUTCDate(resultado.getUTCDate() + dias);
  return resultado.toISOString().slice(0, 10);
};

const construirReporte = (ventas, motor = motorOptimizado) => {
  const lineas = [];
  const linea = (texto = "") => lineas.push(texto);
  const titulo = (texto) => {
    linea();
    linea(`=== ${texto} ===`);
  };

  titulo("RESUMEN GENERAL");
  linea(`Ventas: ${ventas.length.toLocaleString("es-CO")}`);
  linea(`Total vendido: ${pesos(totalVendido(ventas))}`);
  linea(`Unidades vendidas: ${unidadesVendidas(ventas).toLocaleString("es-CO")}`);
  const mayor = ventaMayor(ventas);
  linea(
    mayor
      ? `Venta mayor: ${mayor.producto} por ${pesos(valorVenta(mayor))}`
      : "Venta mayor: sin ventas"
  );
  linea(`Ticket promedio: ${pesos(ticketPromedio(ventas))}`);

  titulo("VENTAS POR CIUDAD");
  for (const [ciudad, total] of Object.entries(totalPorCiudad(ventas))) {
    linea(`${ciudad.padEnd(12)} ${pesos(total)}`);
  }

  titulo("UNIDADES POR PRODUCTO");
  for (const [producto, unidades] of Object.entries(unidadesPorProducto(ventas))) {
    linea(`${producto.padEnd(24)} ${unidades.toLocaleString("es-CO")}`);
  }

  titulo("TOP 3 PRODUCTOS POR VALOR");
  for (const { producto, valor } of topProductosPorValor(ventas, 3)) {
    linea(`${producto.padEnd(24)} ${pesos(valor)}`);
  }

  const fechaDia = "2026-09-02";
  const delDia = ventasDelDia(ventas, fechaDia);
  titulo(`RESUMEN DEL DÍA ${fechaDia}`);
  linea(`Ventas: ${delDia.length.toLocaleString("es-CO")}`);
  linea(`Total vendido: ${pesos(totalVendido(delDia))}`);

  titulo("CLIENTES RECURRENTES");
  const recurrentes = motor.clientesRecurrentes(ventas);
  linea(`${recurrentes.length.toLocaleString("es-CO")} clientes compraron más de una vez`);
  if (recurrentes.length > 0) {
    linea(`Ejemplos: ${[...recurrentes].sort().slice(0, 5).join(", ")}`);
  }

  titulo("PRODUCTO ESTRELLA POR CIUDAD");
  for (const [ciudad, producto] of Object.entries(productoEstrellaPorCiudad(ventas))) {
    linea(`${ciudad.padEnd(12)} ${producto}`);
  }

  titulo("COMBO DE REGALO ($87.000)");
  const combo = motor.comboRegalo(catalogo, 87000);
  linea(
    combo
      ? `${combo[0].producto} + ${combo[1].producto}`
      : "No hay combinación que sume exactamente $87.000"
  );

  titulo("CLIENTE PARA CUPÓN");
  const cliente = primerClienteUnico(ventas);
  linea(
    cliente
      ? `Primer cliente que compró una sola vez: ${cliente}`
      : "Ningún cliente compró una sola vez"
  );

  titulo("MEJOR SEMANA");
  const { inicio, totales } = totalesDiarios(ventas);
  const semana = motor.mejorSemana(totales, 7);
  if (semana === null) {
    linea("No hay 7 días de ventas para calcularla");
  } else {
    const desde = sumarDias(inicio, semana.inicio - 1);
    const hasta = sumarDias(inicio, semana.inicio + 5);
    linea(`Del ${desde} al ${hasta}: ${pesos(semana.total)}`);
  }

  return lineas.join("\n");
};

if (require.main === module) {
  const argumento = process.argv[2];
  let ventas = datos;

  if (argumento === undefined) {
    console.log("Analítica Café Origen v1.0 (datos reales del Día 1)");
  } else {
    const n = Number(argumento);

    if (!Number.isInteger(n) || n <= 0) {
      console.log("Uso: node src/reporte.js [número de ventas]");
      process.exit(1);
    }

    ventas = generarVentas(n);
    console.log(`Analítica Café Origen v1.0 (${n.toLocaleString("es-CO")} ventas generadas)`);
  }

  const inicio = performance.now();
  const texto = construirReporte(ventas);
  const ms = performance.now() - inicio;

  console.log(texto);
  console.log(`\nReporte generado en ${ms.toFixed(1)} ms`);
}

module.exports = { construirReporte, motorOptimizado, motorOriginal };