# Cafe Origen Analitica

An initial look at the sales data for Café Origen. Before performing any calculations, the goal is to understand the data: what each record represents, the data type of each field, and any underlying issues.

## Project Contents

- `src/datos.js`: The 12 sales records in the sample, in their original format.
- `src/explorar.js`: Displays the total number of records, the first and last entries, and the complete dataset.
- `src/analitica.js`: Checks for edge cases (regarding cities, quantities, and customers).
- `bitacora.md`: A data dictionary and a log of the decisions made throughout the process.

## How to Run

You must have Node.js installed. From the project folder, run:

```bash
node src/explorar.js
node src/analitica.js
node src/verificar.js
```

## Findings

The data contains issues that aren't immediately apparent: a city name written in lowercase, a sale with a quantity of zero, and duplicate customer entries.


## Indicators

- `valorVenta(venta)`: value of one sale (quantity × price).
- `totalVendido(ventas)`: total sold.
- `unidadesVendidas(ventas)`: total units sold.
- `ventaMayor(ventas)`: the largest sale, as a full record (`null` if there are none).
- `ticketPromedio(ventas)`: average value per purchase, ignoring zero-quantity sales.
- `ventasPorCiudad(ventas, ciudad)`: total sold in a city, ignoring case and extra spaces.
- `src/verificar.js`: proves that each method version gives the same result as its loop version.
- `totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM`: the same indicators written with `map`, `filter` and `reduce`.
- `totalPorCiudad(ventas)`: total sold per city, as an object.
- `unidadesPorProducto(ventas)`: units sold per product, as an object.
- `topProductosPorValor(ventas, k)`: the `k` products that generated the most money, from highest to lowest.