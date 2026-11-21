const ventas = require("./datos.js");
const {
  totalVendido,
  unidadesVendidas,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM
} = require("./analitica.js");

const comparar = (nombre, porCiclo, porMetodo) => {
  const estado = porCiclo === porMetodo ? "OK" : "DIFERENTE";
  console.log(estado, "-", nombre, "| ciclo:", porCiclo, "| método:", porMetodo);
};

const entradas = {
  completo: ventas,
  unElemento: [ventas[0]],
  vacio: []
};

for (const [nombre, entrada] of Object.entries(entradas)) {
  comparar(`totalVendido (${nombre})`, totalVendido(entrada), totalVendidoM(entrada));
  comparar(`unidadesVendidas (${nombre})`, unidadesVendidas(entrada), unidadesVendidasM(entrada));
  comparar(
    `ventasPorCiudad Medellín (${nombre})`,
    ventasPorCiudad(entrada, "Medellín"),
    ventasPorCiudadM(entrada, "Medellín")
  );
}

comparar(
  "ventasPorCiudad ' medellín '",
  ventasPorCiudad(ventas, " medellín "),
  ventasPorCiudadM(ventas, " medellín ")
);
comparar("ventasPorCiudad CALI", ventasPorCiudad(ventas, "CALI"), ventasPorCiudadM(ventas, "CALI"));
comparar(
  "ventasPorCiudad Armenia",
  ventasPorCiudad(ventas, "Armenia"),
  ventasPorCiudadM(ventas, "Armenia")
);