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
  primeraVenta
};