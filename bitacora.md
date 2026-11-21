# bitacora: Café Origen

## What I’m looking at

Each record represents a sales transaction: a customer purchased a product in a specific city on a given day, with the quantity and price recorded. The sample contains 12 records, covering the period from September 1 to September 6, 2026.

I have transferred them to `src/datos.js` exactly as they appear—errors and all. If I had corrected them during the copy process, I would no longer know what the original data contained.

## Data Dictionary

| Property | Type | Meaning |
|-----------|------|---------------|
| `id` | number | Unique identifier for the sale (1 through 12). |
| `fecha` | string | Date of the sale in `YYYY-MM-DD` format. Stored as text, not as a `Date` object. |
| `cliente` | string | Customer code (`C01` through `C08`). |
| `producto` | string | Product name, including the weight/size specification. |
| `ciudad` | string | City where the sale took place. |
| `cantidad` | number | Number of units sold in the transaction. |
| `precio` | number | Value in Colombian pesos. It appears to be a per-unit price, as each product consistently shows the same value. |

## Edge cases identified

**1. Inconsistent city spelling (`id: 5`).** The entry appears as `medellín` (lowercase), whereas other records use `Medellín` (capitalized). To a computer, these are two distinct cities, which would cause them to be separated in a city-based report.
*Decision:* Normalize the text before grouping (remove extra spaces and standardize capitalization). I will leave the data as-is in `datos.js`; the correction will be handled during the data-cleaning phase.

**2. Zero quantity (`id: 8`).** There is a sale with `cantidad: 0`. This could be a data-entry error or a cancelled transaction. *Decision:* I am not counting this as a sale in the total unit or revenue figures. The record remains in the dataset and is noted here; I will confirm this with Café Origen.

**3. Repeat customers.** C01 appears 3 times, while C02 and C03 appear 2 times each. This is not an error; these are repeat customers. However, if I count the records as if they were individual customers, the total count will be inflated.
*Decision:* To determine the number of customers, I will count unique codes rather than individual records.

**4. It is unclear whether the price is per unit or a total.** This is not specified.
*Decision:* I am proceeding under the assumption that it is a unit price, as the same product always carries the same value. The total for a sale would be `quantity * price`. This remains to be confirmed.

## General decisions

- The original data will not be modified.
- All data cleaning is performed within the analysis code and documented here.


## Micro-challenge 2: indicators with loops

The manager needs four numbers for Monday: total sold, units sold, largest sale and average ticket. Rule: loops only, no `map`, `filter` or `reduce`. For each indicator I decide what I loop over, what condition I apply, what I accumulate and where I start. `valorVenta(venta)` returns `cantidad * precio` and every indicator reuses it.

| Indicator | Loop over | Condition | Accumulate | Start at |
|-----------|-----------|-----------|------------|----------|
| Total sold | all sales | none | sum of `valorVenta` | `0` |
| Units sold | all sales | none | sum of `cantidad` | `0` |
| Largest sale | all sales | value beats the best so far | the whole record | `null` |
| Average ticket | all sales | `cantidad > 0` | total value + purchase count | `0` and `0` |
| Sales by city | all sales | normalized city equals normalized search | sum of `valorVenta` | `0` |

### Pseudocode

```
total <- 0
for each venta in ventas:
    total <- total + valorVenta(venta)
return total
```

```
mayor <- null
for each venta in ventas:
    if mayor is null or valorVenta(venta) > valorVenta(mayor):
        mayor <- venta
return mayor
```

```
total <- 0
compras <- 0
for each venta in ventas:
    if venta.cantidad > 0:
        total <- total + valorVenta(venta)
        compras <- compras + 1
if compras = 0: return 0
return total / compras
```

```
buscada <- normalize(ciudad)
total <- 0
for each venta in ventas:
    if normalize(venta.ciudad) = buscada:
        total <- total + valorVenta(venta)
return total
```

Units sold is the same as total sold, adding `venta.cantidad` instead.

### Empty array decisions

I tested every function with the full array, one element and `[]` (`src/pruebas.js`).

| Function | With `[]` | Why |
|----------|-----------|-----|
| `totalVendido` | `0` | Nothing to add; `0` is neutral for a sum. |
| `unidadesVendidas` | `0` | Same reason. |
| `ventaMayor` | `null` | There is no largest sale, and `0` is not a record. |
| `ticketPromedio` | `0` | No purchases, no average. `0` avoids `NaN`. |
| `ventasPorCiudad` | `0` | Nothing sold in that city. |

Accents are not stripped, so `Bogota` would not match `Bogotá`. A single zero-quantity sale (`id: 8`) is returned by `ventaMayor` because it is the only record; with the full array it never wins.

### Manual traces

**`ticketPromedio`**, state is `total, compras`, starting at `0, 0`:

```
id1  84000, 1  | id2  110000, 2 | id3  205000, 3 | id4  247000, 4
id5  382000, 5 | id6  434000, 6 | id7  554000, 7 | id8  skipped (quantity 0)
id9  644000, 8 | id10 812000, 9 | id11 907000, 10 | id12 985000, 11
985000 / 11 = 89545.45
```

Dividing by 12 would give 82083.33, so skipping `id: 8` matters.

**`ventaMayor`**, starting at `mayor = null`:

```
id1  84000  -> best id1    | id2  26000  -> no
id3  95000  -> best id3    | id4  42000  -> no
id5  135000 -> best id5    | id6, id7, id8, id9 (52000, 120000, 0, 90000) -> no
id10 168000 -> best id10   | id11, id12 (95000, 78000) -> no
Result: id 10 (4 x 42000 = 168000)
```

Both traces match the program: 985000 total, 89545.45 average and `id: 10` as the largest sale. As a cross-check, Medellín 356000 + Bogotá 276000 + Cali 185000 + Pereira 168000 = 985000.

**Status:** all functions done, tested and traced by hand.