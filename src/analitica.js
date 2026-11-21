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

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad
};