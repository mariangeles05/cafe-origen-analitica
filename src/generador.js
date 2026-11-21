const productos = [
  { nombre: "Origen Huila 500 g", precio: 42000 },
  { nombre: "Origen Nariño 250 g", precio: 26000 },
  { nombre: "Origen Sierra 500 g", precio: 45000 },
  { nombre: "Prensa francesa", precio: 95000 },
  { nombre: "Molino manual", precio: 120000 }
];

const ciudades = ["Medellín", "Bogotá", "Cali", "Pereira"];

const enteroEntre = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const elegir = (lista) => {
  return lista[enteroEntre(0, lista.length - 1)];
};

const generarVentas = (n) => {
  const ventas = [];
  const maxClientes = Math.max(1, Math.floor(n / 3));

  for (let i = 1; i <= n; i++) {
    const producto = elegir(productos);

    ventas.push({
      id: i,
      fecha: `2026-09-${String(enteroEntre(1, 30)).padStart(2, "0")}`,
      cliente: `C${String(enteroEntre(1, maxClientes)).padStart(2, "0")}`,
      producto: producto.nombre,
      ciudad: elegir(ciudades),
      cantidad: enteroEntre(1, 5),
      precio: producto.precio
    });
  }

  return ventas;
};

module.exports = { generarVentas };