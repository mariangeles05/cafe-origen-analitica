# Performance report: Café Origen analytics engine

Version: v1.0

This document describes how the functions of the analytics engine behave in time and memory, with measurements instead of opinions. It is written for any developer who needs to connect the engine to the marketplace platform.

## How it was measured

- **Data:** 10,000 random sales from `generarVentas(10000)`.
- **Time:** the median of 7 runs of each function, taken twice and averaged (`src/medirTodo.js`, Node.js 26).
- **Operations:** exact counts from the instrumented versions (`totalVendidoConteo`, `ventaMayorConteo`, `totalPorCiudadConteo`, `primeraVenta`). For `clientesRecurrentes`, the number of comparisons is `n(n-1)/2`, which I proved with a manual trace.
- **Notation:** `n` is the number of sales, `k` and `p` are the number of distinct cities or products, and `d` is the number of sales of one day. Space does not count the `ventas` array that each function receives.

The complexity of each function comes from reading its code. The measurements are evidence that confirms it, not the source of it.

## Functions

| Function | What it does | Time | Space | Justification | Measured (n = 10,000) |
|----------|--------------|------|-------|---------------|-----------------------|
| `valorVenta` | Value of one sale (`cantidad × precio`). | O(1) | O(1) | One multiplication, no loop. | about 0.0006 ms |
| `totalVendido` | Total sold. | O(n) | O(1) | One `for...of` with a fixed amount of work per sale; one accumulator. | 10,000 ops; 0.20 ms |
| `unidadesVendidas` | Total units sold. | O(n) | O(1) | One `for...of` adding `cantidad`; one accumulator. | 0.11 ms |
| `ventaMayor` | Largest sale, as a full record. | O(n) | O(1) | One loop with a visit and a comparison per sale; it keeps one reference to an existing sale. | 20,000 ops; 0.14 ms |
| `ticketPromedio` | Average value per purchase, ignoring sales with quantity 0. | O(n) | O(1) | One loop with a condition; a total and a counter. | 0.19 ms |
| `ventasPorCiudad` | Total sold in one city, ignoring case and extra spaces. | O(n) | O(1) | One loop; normalizing a short city name is constant work. | 0.47 ms |
| `totalVendidoM` | Same as `totalVendido`, with `reduce`. | O(n) | O(1) | One pass inside `reduce`, which returns a number and creates no array. | 0.08 ms |
| `unidadesVendidasM` | Same as `unidadesVendidas`, with `reduce`. | O(n) | O(1) | Same as above. | 0.08 ms |
| `ventasPorCiudadM` | Total sold in a city with `filter`, `map` and `reduce`. | O(n) | O(n) | Up to 3 passes (`n + m + m`, with `m <= n`) that simplify to O(n); `filter` and `map` create two arrays of up to `n` elements. | 0.40 ms |
| `totalPorCiudad` | Total sold per city, as an object. | O(n) | O(k) | One `reduce` pass with one dictionary lookup per sale (assumed constant time); one key per distinct city: 4 here, up to `n` in the worst case. | 20,000 ops; 1.55 ms |
| `unidadesPorProducto` | Units sold per product, as an object. | O(n) | O(k) | One `reduce` pass; one key per distinct product (5 here). | 0.48 ms |
| `topProductosPorValor` | The `k` products that generated the most money. | O(n + p log p) | O(p) | One grouping pass (`n`), then `sort` over the `p` products (`p log p`); the entries, the objects and the result depend on the number of products, not on the number of sales. | 0.51 ms |
| `ventasDelDia` | Sales of one day. | O(n) | O(d) | One `filter` pass; the result holds the `d` sales of that day (up to `n`). | 0.13 ms |
| `clientesRecurrentes` | Customers who bought more than once. | O(n²), worst case O(n³) | O(n) | A loop inside a loop compares `n(n-1)/2` pairs; `includes` scans the `recurrentes` list inside them, which is what makes the worst case cubic; the list can hold about `n/2` customers. | 49,995,000 comparisons; 424 ms |
| `totalCiudadCadena` | Total sold in a city, chaining `map`, `filter`, `map` and `reduce`. | O(n) | O(n) | 4 passes (at most `4n`, which simplifies to `n`); 3 intermediate arrays plus `n` copied objects. | 1.22 ms |
| `totalCiudadUnaPasada` | Total sold in a city in a single loop. | O(n) | O(1) | 1 pass and no intermediate arrays. | 0.54 ms |
| `primeraVenta` | First sale (a control function). | O(1) | O(1) | It only reads position 0, so it does not depend on `n`. | 1 op; about 0.0004 ms |
| `totalesDiarios` | Total sold per day, filling days without sales with 0. | O(n + d log d) | O(d) | One pass over the sales to group by date in a Map, then a sort of the `d` distinct dates and a pass over the day range. | 0.81 ms |
| `clientesRecurrentesSet` | Customers who bought more than once, with two Sets. | O(n) | O(c) | One pass; `has` and `add` on a Set take constant time. One Set holds every distinct customer. | 1.36 ms |
| `comprasPorCliente` | Number of purchases per customer, as a Map. | O(n) | O(c) | One pass with one Map lookup and update per sale. | 1.22 ms |
| `clientesRecurrentesMap` | Customers who bought more than once, from the Map. | O(n) | O(c) | One pass to build the Map plus one pass over its `c` entries (`c <= n`), which simplifies to O(n). | 1.57 ms |
| `productoEstrellaPorCiudad` | Most frequent product of each city. | O(n) | O(k × p) | One pass to count in a Map of Maps, then one pass over the counters (at most `n`). | 3.55 ms |
| `primerClienteUnico` | First customer who bought only once. | O(n) | O(c) | Two passes added together (n + n); one Map of purchases per customer. | 0.60 ms |
| `comboRegaloFuerzaBruta` | Two products that add up to a value, trying every pair. | O(m²) | O(1) | A loop inside a loop over the catalog (`m` products, not sales). | 0.0014 ms |
| `comboRegalo` | Two products that add up to a value, with a Map. | O(m) | O(m) | One pass over the catalog; one Map lookup and insertion per product. | 0.0027 ms |
| `mejorSemanaBruta` | Best block of `k` days, adding every block from zero. | O(d × k) | O(1) | About `d` blocks and each one adds `k` days. | 0.0127 ms |
| `mejorSemana` | Best block of `k` days, with a sliding window. | O(d) | O(1) | The first window plus one addition and one subtraction per step. | 0.0045 ms |
| `parMasCercano` | Two products closest to a budget without exceeding it. | O(m log m) | O(m) | Sorting a copy of the catalog dominates; the two-pointer pass is O(m). | 0.0036 ms |

Helper functions (`normalizar`, `nombreCiudad`, `contarVisita`, `contarComparacion`) are O(1) in time and space. The instrumented versions (`...Conteo`) have the same complexity as the functions they copy. `generarVentas` is a testing tool, not part of the engine.

## What the measurements show

With 10,000 sales, every function except one finishes in under 2 ms. `clientesRecurrentes` takes about 424 ms, around 270 times more than the next slowest function (`totalPorCiudad`, 1.55 ms), and it is the only one whose cost grows with `n²`. The small differences between the O(n) functions are too small to rely on at this scale and do not change the classification.


## Projection: 1,000,000 sales

Going from 10,000 to 1,000,000 sales multiplies `n` by 100. For O(n) functions the time is the measured time × 100, and for O(1) functions it does not change. These are estimates, not measurements.

| Function | Growth | Measured (n = 10,000) | Estimated (n = 1,000,000) |
|----------|--------|-----------------------|---------------------------|
| `valorVenta` | O(1) | about 0.0006 ms | about 0.0006 ms |
| `primeraVenta` | O(1) | about 0.0004 ms | about 0.0004 ms |
| `totalVendido` | O(n) | 0.20 ms | 20 ms |
| `unidadesVendidas` | O(n) | 0.11 ms | 11 ms |
| `ventaMayor` | O(n) | 0.14 ms | 14 ms |
| `ticketPromedio` | O(n) | 0.19 ms | 19 ms |
| `ventasPorCiudad` | O(n) | 0.47 ms | 47 ms |
| `totalVendidoM` | O(n) | 0.08 ms | 8 ms |
| `unidadesVendidasM` | O(n) | 0.08 ms | 8 ms |
| `ventasPorCiudadM` | O(n) | 0.40 ms | 40 ms |
| `totalPorCiudad` | O(n) | 1.55 ms | 155 ms |
| `unidadesPorProducto` | O(n) | 0.48 ms | 48 ms |
| `topProductosPorValor` | O(n + p log p) | 0.51 ms | 51 ms |
| `ventasDelDia` | O(n) | 0.13 ms | 13 ms |
| `totalCiudadCadena` | O(n) | 1.22 ms | 122 ms or more |
| `totalCiudadUnaPasada` | O(n) | 0.54 ms | 54 ms |
| `clientesRecurrentes` | O(n²) | 424 ms | about 7,100 s (about 2 hours) |

How the estimates were made:

- **`clientesRecurrentes`:** it was measured at n = 100,000 and took 71 s. Multiplying `n` by 10 multiplies the time by 100, so 71 s × 100 = 7,100 s, about 118 minutes. Scaling directly from the 10,000-sale measurement gives about 71 minutes (424 ms × 10,000), but the real run at 100,000 was slower than that formula predicts, so the larger number is the safer one.
- **`topProductosPorValor`:** the `p log p` part depends on the number of products, not on sales, so it stays almost the same.
- **`totalCiudadCadena`:** it creates 3 intermediate arrays of up to 1,000,000 elements, so memory pressure can make it slower than 100×. In the measurements, the gap against the one-pass version widened as `n` grew.
- **Limits:** these numbers come from my computer and from random data with 4 cities and 5 products. A different machine or a different data shape will change them, but not the order of magnitude.

- **Data shape:** the measurements use random sales with about one distinct customer for every 3 sales. With a different number of distinct customers the time of `clientesRecurrentes` would change, although it would still grow with `n²`.

At 1,000,000 sales, every report finishes in under 0.2 s except `clientesRecurrentes`, which takes about 2 hours.


## Risks

Functions are ranked from highest to lowest risk as the data grows. The criterion, in order: (1) how time grows with `n`, (2) how memory grows with `n`, and (3) the estimated time at 1,000,000 sales to break ties.

| Rank | Function | Time / Space | Estimated at 1M | Why it ranks here |
|------|----------|--------------|-----------------|-------------------|
| 1 | `clientesRecurrentes` | O(n²) / O(n) | about 2 hours | The only one that grows faster than `n`. Each 10× in sales means about 100× in time, and `includes` makes the worst case cubic. |
| 2 | `totalCiudadCadena` | O(n) / O(n) | 122 ms or more | 4 passes, 3 intermediate arrays and `n` copied objects; it is the one most exposed to memory pressure. |
| 3 | `ventasPorCiudadM` | O(n) / O(n) | 40 ms | Two intermediate arrays of up to `n` elements. |
| 4 | `ventasDelDia` | O(n) / O(d) | 13 ms | The result can reach `n` elements if all sales fall on the same day. |
| 5 | `totalPorCiudad` | O(n) / O(k) | 155 ms | The slowest of the linear functions, but memory depends on the number of cities, which stays small. |
| 6 | `topProductosPorValor` | O(n + p log p) / O(p) | 51 ms | Linear in `n`; the sort only depends on the number of products. |
| 7 | `unidadesPorProducto` | O(n) / O(k) | 48 ms | One pass and a small dictionary. |
| 8 | `totalCiudadUnaPasada` | O(n) / O(1) | 54 ms | One pass and no extra memory. |
| 9 | `ventasPorCiudad` | O(n) / O(1) | 47 ms | One pass and no extra memory. |
| 10 | `totalVendido` | O(n) / O(1) | 20 ms | One pass and one accumulator. |
| 11 | `ticketPromedio` | O(n) / O(1) | 19 ms | One pass with a condition. |
| 12 | `ventaMayor` | O(n) / O(1) | 14 ms | One pass and one reference. |
| 13 | `unidadesVendidas` | O(n) / O(1) | 11 ms | One pass and one accumulator. |
| 14 | `totalVendidoM` | O(n) / O(1) | 8 ms | One pass inside `reduce`. |
| 15 | `unidadesVendidasM` | O(n) / O(1) | 8 ms | One pass inside `reduce`. |
| 16 | `valorVenta` | O(1) / O(1) | about 0.0006 ms | Does not depend on `n`. |
| 17 | `primeraVenta` | O(1) / O(1) | about 0.0004 ms | Does not depend on `n`. |

`clientesRecurrentes` is the biggest risk by a wide margin. It is the only function whose cost grows faster than the data, and at 1,000,000 sales it would take about 2 hours while every other report finishes in under 0.2 s. The gap between rank 1 and rank 2 is far larger than the gaps among all the others together.

The `k` and `p` values (cities and products) are small in this dataset. If a future catalog had many more products or cities, ranks 5 to 7 would move up, because their memory and sorting costs depend on those numbers.


## Optimization plan: `clientesRecurrentes`

This is a plan only; nothing is implemented in v0.2.

**What work repeats.** For every sale, the function compares it with all the sales that come after it to find out whether that customer already appeared, and `includes` then scans the list of recurring customers again to avoid adding someone twice. The same customer is searched for again and again, and nothing learned in one search is kept for the next.

**What information could be stored.** A dictionary with the customer as the key and the number of purchases as the value, built in one pass over the sales: for each sale, add 1 to that customer's counter. A lookup by key takes constant time, so there is no need to scan the array to know whether a customer already appeared.

**The idea in steps.**

1. Walk through the sales once and fill the dictionary of counters.
2. Walk through the dictionary once and keep the customers whose counter is greater than 1.
3. Return that list.

Both walks are independent, so the costs add up instead of multiplying.

**Expected effect.**

| | Current | Planned |
|---|---|---|
| Time | O(n²), worst case O(n³) | O(n) |
| Space | O(n) | O(c), with `c` distinct customers (at most `n`) |
| Estimate at 1,000,000 sales | about 2 hours | about the same as `totalPorCiudad`, roughly 0.2 s |

The cost of the change is memory: the dictionary holds one entry per distinct customer. That is a small price compared with the time saved, and the current version already needs O(n) space for its result list.

**How it will be verified.** The new version must return the same customers as the current one on the 12-sale dataset and on generated data, and `src/tiempo.js` should show the time growing in proportion to `n` instead of quadratically.


## Update v1.0

**Optimization plan result.** The plan for `clientesRecurrentes` was implemented as `clientesRecurrentesSet` and `clientesRecurrentesMap`. At 100,000 sales they take about 18 ms instead of about 71 s.

### v0.1 vs v1.0

The same final report (all its sections) was built twice, measuring only the time to build it, not to generate the data: once with the original algorithms (`clientesRecurrentes`, `comboRegaloFuerzaBruta`, `mejorSemanaBruta`) and once with the optimized ones (`clientesRecurrentesSet`, `comboRegalo`, `mejorSemana`). "v0.1" here means the original algorithms, because the first v0.1 report did not have the recurring customers section. v1.0 is the median of 5 runs; v0.1 is the median of 3 runs at 10,000 sales and a single run at 100,000.

| Sales | v0.1 | v1.0 | Improvement |
|-------|------|------|-------------|
| 10,000 | 1,159.6 ms | 15.1 ms | 77× |
| 100,000 | 68,475.2 ms (about 68 s) | 86.0 ms | 797× |

With 10 times more sales, v0.1 took about 59 times longer (a quadratic cost), while v1.0 took about 6 times longer (close to linear). The first cold run of `node src/reporte.js 100000` printed 234.6 ms; the 86 ms above is the median of warm runs.

### Complexity of the final report

No function in the final report is O(n²) in the number of sales. Every report section is O(n), except sorting the few distinct dates and the catalog (`d log d`, `m log m`). `comboRegaloFuerzaBruta` is O(m²), but it only appears in the v0.1 comparison, and it works over the 8 catalog products, not over the sales.