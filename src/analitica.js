const valorVenta = (venta) => {
  return venta.cantidad * venta.precio;
};

const normalizar = (texto) => {
  return texto.trim().toLowerCase();
};

const totalVendido = (ventas) => {
  let total = 0;

  for (const venta of ventas) {
    total = total + valorVenta(venta);
  }

  return total;
};

const unidadesVendidas = (ventas) => {
  let unidades = 0;

  for (const venta of ventas) {
    unidades = unidades + venta.cantidad;
  }

  return unidades;
};

const ventaMayor = (ventas) => {
  let mayor = null;

  for (const venta of ventas) {
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }

  return mayor;
};

const ticketPromedio = (ventas) => {
  let total = 0;
  let compras = 0;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total = total + valorVenta(venta);
      compras = compras + 1;
    }
  }

  if (compras === 0) {
    return 0;
  }

  return total / compras;
};

const ventasPorCiudad = (ventas, ciudad) => {
  const buscada = normalizar(ciudad);
  let total = 0;

  for (const venta of ventas) {
    if (normalizar(venta.ciudad) === buscada) {
      total = total + valorVenta(venta);
    }
  }

  return total;
};

const totalVendidoM = (ventas) => {
  return ventas.reduce((acumulado, venta) => acumulado + valorVenta(venta), 0);
};

const unidadesVendidasM = (ventas) => {
  return ventas.reduce((acumulado, venta) => acumulado + venta.cantidad, 0);
};

const ventasPorCiudadM = (ventas, ciudad) => {
  const buscada = normalizar(ciudad);

  return ventas
    .filter((venta) => normalizar(venta.ciudad) === buscada)
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, valor) => acumulado + valor, 0);
};

const nombreCiudad = (texto) => {
  const limpio = normalizar(texto);
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
};

const totalPorCiudad = (ventas) => {
  return ventas.reduce((grupos, venta) => {
    const ciudad = nombreCiudad(venta.ciudad);
    grupos[ciudad] = (grupos[ciudad] || 0) + valorVenta(venta);
    return grupos;
  }, {});
};
const unidadesPorProducto = (ventas) => {
  return ventas.reduce((grupos, venta) => {
    const producto = venta.producto.trim();
    grupos[producto] = (grupos[producto] || 0) + venta.cantidad;
    return grupos;
  }, {});
};

const topProductosPorValor = (ventas, k) => {
  const valorPorProducto = ventas.reduce((grupos, venta) => {
    const producto = venta.producto.trim();
    grupos[producto] = (grupos[producto] || 0) + valorVenta(venta);
    return grupos;
  }, {});

  return Object.entries(valorPorProducto)
    .map(([producto, valor]) => ({ producto, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, k);
};
const ventasDelDia = (ventas, fecha) => {
  const buscada = fecha.trim();
  return ventas.filter((venta) => venta.fecha === buscada);
};
const contarVisita = (contador) => {
  contador.operaciones = contador.operaciones + 1;
};

const contarComparacion = (contador) => {
  contador.operaciones = contador.operaciones + 1;
};

const totalVendidoConteo = (ventas, contador) => {
  let total = 0;

  for (const venta of ventas) {
    contarVisita(contador);
    total = total + valorVenta(venta);
  }

  return total;
};

const ventaMayorConteo = (ventas, contador) => {
  let mayor = null;

  for (const venta of ventas) {
    contarVisita(contador);
    contarComparacion(contador);
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }

  return mayor;
};

const totalPorCiudadConteo = (ventas, contador) => {
  const grupos = {};

  for (const venta of ventas) {
    contarVisita(contador);
    const ciudad = nombreCiudad(venta.ciudad);
    contarComparacion(contador);
    grupos[ciudad] = (grupos[ciudad] || 0) + valorVenta(venta);
  }

  return grupos;
};

const primeraVenta = (ventas, contador) => {
  if (ventas.length === 0) {
    return null;
  }

  contarVisita(contador);
  return ventas[0];
};

function clientesRecurrentes(ventas) {
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (ventas[i].cliente === ventas[j].cliente &&
          !recurrentes.includes(ventas[i].cliente)) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

const totalCiudadCadena = (ventas, ciudad) => {
  const buscada = normalizar(ciudad);

  return ventas
    .map((venta) => ({ ...venta, ciudad: normalizar(venta.ciudad) }))
    .filter((venta) => venta.ciudad === buscada)
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, valor) => acumulado + valor, 0);
};

const totalCiudadUnaPasada = (ventas, ciudad) => {
  const buscada = normalizar(ciudad);
  let total = 0;

  for (const venta of ventas) {
    if (normalizar(venta.ciudad) === buscada) {
      total = total + valorVenta(venta);
    }
  }

  return total;
};

const clientesRecurrentesSet = (ventas) => {
  const vistos = new Set();
  const recurrentes = new Set();

  for (const venta of ventas) {
    if (vistos.has(venta.cliente)) {
      recurrentes.add(venta.cliente);
    } else {
      vistos.add(venta.cliente);
    }
  }

  return [...recurrentes];
};

const comprasPorCliente = (ventas) => {
  const compras = new Map();

  for (const venta of ventas) {
    compras.set(venta.cliente, (compras.get(venta.cliente) || 0) + 1);
  }

  return compras;
};

const clientesRecurrentesMap = (ventas) => {
  const recurrentes = [];

  for (const [cliente, cantidad] of comprasPorCliente(ventas)) {
    if (cantidad > 1) {
      recurrentes.push(cliente);
    }
  }

  return recurrentes;
};

const productoEstrellaPorCiudad = (ventas) => {
  const conteos = new Map();

  for (const venta of ventas) {
    const ciudad = nombreCiudad(venta.ciudad);

    if (!conteos.has(ciudad)) {
      conteos.set(ciudad, new Map());
    }

    const productos = conteos.get(ciudad);
    productos.set(venta.producto, (productos.get(venta.producto) || 0) + 1);
  }

  const estrellas = {};

  for (const [ciudad, productos] of conteos) {
    let mejor = null;
    let maximo = 0;

    for (const [producto, veces] of productos) {
      if (veces > maximo) {
        mejor = producto;
        maximo = veces;
      }
    }

    estrellas[ciudad] = mejor;
  }

  return estrellas;
};

const primerClienteUnico = (ventas) => {
  const compras = comprasPorCliente(ventas);

  for (const venta of ventas) {
    if (compras.get(venta.cliente) === 1) {
      return venta.cliente;
    }
  }

  return null;
};

const totalesDiarios = (ventas) => {
  const porDia = new Map();

  for (const venta of ventas) {
    const dia = venta.fecha.trim();
    porDia.set(dia, (porDia.get(dia) || 0) + valorVenta(venta));
  }

  const fechas = [...porDia.keys()].sort();

  if (fechas.length === 0) {
    return { inicio: null, totales: [] };
  }

  const totales = [];
  const actual = new Date(fechas[0] + "T00:00:00Z");
  const ultimo = new Date(fechas[fechas.length - 1] + "T00:00:00Z");

  while (actual <= ultimo) {
    totales.push(porDia.get(actual.toISOString().slice(0, 10)) || 0);
    actual.setUTCDate(actual.getUTCDate() + 1);
  }

  return { inicio: fechas[0], totales };
};

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  totalVendidoConteo,
  ventaMayorConteo,
  totalPorCiudadConteo,
  primeraVenta,
  clientesRecurrentes,
  totalCiudadCadena,
  totalCiudadUnaPasada,
  clientesRecurrentesSet,
  comprasPorCliente,
  clientesRecurrentesMap,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  totalesDiarios
};