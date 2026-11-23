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

## Micro-challenge 3:

## array methods, grouping and rankings

New rule from my tech lead: every method version must give exactly the same result as the loop it replaces, and I have to prove it (`src/verificar.js`). Each function answers some of the five questions from the session: what do I loop over, what do I filter, what do I transform, what do I accumulate, how do I group.

| Function | Loop over | Filter | Transform | Accumulate | Group |
|----------|-----------|--------|-----------|------------|-------|
| `totalVendidoM` | all sales | none | sale to value, inside the `reduce` | sum, starts at `0` | none |
| `unidadesVendidasM` | all sales | none | none | sum of `cantidad`, starts at `0` | none |
| `ventasPorCiudadM` | all sales | `filter`: normalized city equals the search | `map`: sale to value | `reduce` sum, starts at `0` | none |
| `totalPorCiudad` | all sales | none | city name cleaned (`nombreCiudad`) | sum of values per city | by city, in an object `{}` |
| `unidadesPorProducto` | all sales | none | product name trimmed | sum of `cantidad` per product | by product, in an object `{}` |
| `topProductosPorValor` | all sales | none | `Object.entries` + `map` to `{ producto, valor }` | sum of values per product | by product, in an object `{}` |

`topProductosPorValor` also sorts with `sort((a, b) => b.valor - a.valor)` and keeps the first `k` with `slice(0, k)`. Sorting is done on the new array from `Object.entries`, so `ventas` keeps its original order. Sorting `ventas` itself would need a copy first: `[...ventas].sort(...)`.

### Results with the sample

- `totalPorCiudad`: Medellín 356000, Bogotá 276000, Cali 185000, Pereira 168000 (four groups, total 985000). `"Bogotá"` and `"Bogotá "` fall in the same group.
- `unidadesPorProducto`: Origen Huila 500 g 7, Origen Nariño 250 g 6, Origen Sierra 500 g 5, Prensa francesa 2, Molino manual 1 (total 21).
- `topProductosPorValor(ventas, 3)`: Origen Huila 500 g 294000, Origen Sierra 500 g 225000, Prensa francesa 190000.

### Proof: loops vs methods

`node src/verificar.js` runs each loop version and its method version on the same data (full array, one element and `[]`, plus three spellings of a city). All 12 pairs print `OK`, so the methods give exactly the same result as the loops they replace. I also checked that `totalPorCiudad` returns four groups, that `topProductosPorValor(ventas, 3)` is sorted from highest to lowest, and that `ventas` keeps its original order.

**Status:** micro-challenge 3 done.

## Micro-challenge 4: v0.1 report and debugging

The manager reported two errors from a preliminary version. I reproduced that version with small `node -e` scripts and ran it next to mine with the same input.

### Error 1: "Bogotá" shown twice

- **Symptom:** the sales-by-city section listed Bogotá two times.
- **Input:** two sales with `ciudad: "Bogotá"` and `ciudad: "Bogotá "` (trailing space).
- **Hypothesis:** the preliminary version groups by the raw city text, so the two spellings become two keys.
- **Test:** printed the keys with `JSON.stringify`, which showed `"Bogotá"` and `"Bogotá "`.
- **Cause:** grouping without normalizing the key.
- **Fix:** `totalPorCiudad` builds the key with `nombreCiudad` (`trim()`, `toLowerCase()`, then capitalize). My version returns one group, `Bogotá: 121000`, so it no longer has the error.

### Error 2: average ticket `NaN` on a day without sales

- **Symptom:** the average ticket showed `NaN` when filtering a day with no sales.
- **Input:** `ventasDelDia(ventas, "2026-09-07")`, which returns `[]`.
- **Hypothesis:** the preliminary version divides by `ventas.length`, which is 0 for an empty day.
- **Test:** printed `0 / 0`, which gives `NaN`, next to `ticketPromedio` on the same empty day.
- **Cause:** dividing the total by a count of zero.
- **Fix:** `ticketPromedio` counts only purchases with `cantidad > 0` and returns `0` when that count is zero, before dividing. My version returns `0`, and the report shows zeros plus "Sin ventas registradas este día."

## Micro-challenge 5: how much does each report cost?

I built `generarVentas(n)` to create sales of any size, and instrumented versions of three functions that count operations (one per element visited and one per comparison made). Before measuring anything, this is what I expect.

### Prediction (written before measuring)

Each of the three functions loops over the sales once and does a fixed amount of work per element, with no nested loops. So if `n` is multiplied by 10, I expect the operations to be multiplied by about 10 in all three. A function that only looks at the first sale should not grow at all.

| Function | Expected operations | If `n` x 10 |
|----------|---------------------|-------------|
| `totalVendido` | `n` (one visit per sale) | x 10 |
| `ventaMayor` | `2n` (a visit and a comparison per sale) | x 10 |
| `totalPorCiudad` | `2n` (a visit and a dictionary lookup per sale) | x 10 |
| `primeraVenta` | 1, always | x 1 (does not grow) |

Assumption: looking up a key in an object costs the same no matter how many keys it has. Here there are only four cities, so it should not matter.

### Results

`node src/medir.js` gave these operation counts:

| n | totalVendido | ventaMayor | totalPorCiudad | primeraVenta |
|---|---|---|---|---|
| 100 | 100 | 200 | 200 | 1 |
| 1000 | 1000 | 2000 | 2000 | 1 |
| 10000 | 10000 | 20000 | 20000 | 1 |
| 100000 | 100000 | 200000 | 200000 | 1 |

Every time `n` grew 10 times, the three loop functions did exactly 10 times more operations, and `primeraVenta` stayed at 1.

### Prediction vs. results

My prediction was right in every case: x10 for the three loop functions and no growth for `primeraVenta`. The counts matched the expected `n`, `2n`, `2n` and 1 exactly.

### Big O classification

| Function | Big O | Why |
|----------|-------|-----|
| `totalVendido` | O(n) | One `for...of` over the sales with a fixed amount of work per sale. It made `n` operations, and x10 data meant x10 operations. |
| `ventaMayor` | O(n) | One loop, with a visit and a comparison per sale: `2n` operations. The factor 2 is dropped in Big O, and the growth was still x10. |
| `totalPorCiudad` | O(n) | One loop, with a visit and a dictionary lookup per sale: `2n` operations, x10 when `n` grew x10. This assumes a lookup in an object costs the same however many keys it has (here only 4 cities). |
| `primeraVenta` | O(1) | It only reads position 0. It made 1 operation with 100 sales and with 100,000. |

None of the four is O(n²). That would need a loop inside a loop (for example, comparing every sale with every other sale), and the growth factor would be 100 when `n` grows 10 times, not 10.

Limit of this measurement: I counted visits and comparisons, not seconds. It shows how the work grows, not how fast a computer runs it.

## Micro-challenge 6: a report that got slow

A colleague added `clientesRecurrentes(ventas)`, which lists customers who bought more than once. It works on the 12 sample sales (it returns C01, C02 and C03), but it took minutes on the yearly history. I kept it exactly as written and analyzed it.

### Trace with 5 sales

Customers by position: `0: C01`, `1: C02`, `2: C01`, `3: C03`, `4: C02`. The comparison counted is `ventas[i].cliente === ventas[j].cliente`.

| i | j | compared | equal? | action | recurrentes |
|---|---|----------|--------|--------|-------------|
| 0 | 1 | C01 vs C02 | no | | [] |
| 0 | 2 | C01 vs C01 | yes | not in list, add C01 | [C01] |
| 0 | 3 | C01 vs C03 | no | | [C01] |
| 0 | 4 | C01 vs C02 | no | | [C01] |
| 1 | 2 | C02 vs C01 | no | | [C01] |
| 1 | 3 | C02 vs C03 | no | | [C01] |
| 1 | 4 | C02 vs C02 | yes | not in list, add C02 | [C01, C02] |
| 2 | 3 | C01 vs C03 | no | | [C01, C02] |
| 2 | 4 | C01 vs C02 | no | | [C01, C02] |
| 3 | 4 | C03 vs C02 | no | | [C01, C02] |
| 4 | none | the inner loop does not run | | | [C01, C02] |

**Comparisons with 5 sales: 10.**

### Generalization

For each `i` the inner loop runs `n - 1 - i` times, so the total is `(n-1) + (n-2) + ... + 1 + 0 = n(n-1)/2`.

| n | comparisons |
|---|-------------|
| 5 | 10 |
| 12 | 66 |
| 1,000 | 499,500 |
| 2,000 | 1,999,000 |
| 16,000 | 127,992,000 |

The `n²` term dominates, so this is O(n²). Doubling `n` multiplies the comparisons by about 4: 499,500 with 1,000 sales and 1,999,000 with 2,000.

### Three runs and estimates

I ran `src/tiempo.js` three times and averaged each size, so one odd run does not weigh too much.

| n | average time (ms) | times more than the previous n |
|---|-------------------|--------------------------------|
| 1,000 | 8.64 | - |
| 2,000 | 31.47 | 3.64 |
| 4,000 | 123.43 | 3.92 |
| 8,000 | 550.02 | 4.46 |
| 16,000 | 1980.16 | 3.60 |

The ratios stay around 4 (average 3.9), which confirms O(n²).

### Estimates from my measurements

For an O(n²) function, `T(n) ≈ T(16,000) × (n / 16,000)²`, using the largest measured size as the starting point.

- **100,000 sales:** `(100,000 / 16,000)² = 39.06`, so `1980.16 ms × 39.06 ≈ 77 s`. With the highest constant I measured, about 86 s. Estimate: 77 to 86 seconds, under two minutes, so I ran it.
- **1,000,000 sales:** `(1,000,000 / 16,000)² = 3,906`, so `1980.16 ms × 3,906 ≈ 7,735 s`, about 129 minutes. With the highest constant, about 143 minutes. Estimate: roughly 2 hours. I did not run it.

Going from 100,000 to 1,000,000 sales (10 times more data) means about 100 times more time, not 10.

The estimate assumes the quadratic trend continues. At large sizes, memory effects can make it somewhat worse.

**Real time with 100,000 sales:** 71.0 seconds  n=100000: 1:11.015 (m:ss.mmm)

### Hidden cost: `includes`

`recurrentes.includes(cliente)` is also a loop: it compares against the list until it finds the customer or reaches the end, so it costs up to `k`, the number of customers already in `recurrentes`. It only runs when the two customers are equal (the `&&` skips it otherwise), but then it runs for every equal pair, even if that customer is already in the list.

**Typical case (my generator).** There are about `n/3` customers and about `1.5n` equal pairs, each one scanning a list that keeps growing with `n`. That extra work also grows like `n²`, so the function is still O(n²) with a bigger constant. It also explains ratios slightly above 4 in my table (4.46).

**Worst case.** About `n/4` customers appear twice, and one customer has `n/2` sales, placed so that it enters `recurrentes` last. The big customer produces about `n²/8` equal pairs, and each one scans a list of about `n/4` customers. The total work is around `n³/32`, so the worst case is **O(n³)**, and doubling `n` multiplies the time by about 8 instead of 4.

### Conclusion for the manager

The report slows down because, to find customers who bought more than once, it takes every sale and compares it with all the other sales. It is like taking one receipt and checking every other receipt to see if the same customer appears, and then doing that for every receipt in the pile.

With a few sales this is invisible, which is why the test with 12 sales looked instant. But the work does not grow at the same pace as the data, it grows much faster: if the history doubles, the report takes about 4 times longer, and if it grows 10 times, it takes about 100 times longer.

These are the times I measured and estimated:

| Sales in the history | Time of the report |
|----------------------|--------------------|
| 16,000 | about 2 seconds |
| 100,000 | 71 seconds (measured) |
| 1,000,000 | about 2 hours (estimated) |

This can be fixed by changing how the report is calculated, so that it goes through the sales only once. 

## Micro-challenge 7: space complexity

### Both versions give the same result

With `generarVentas(10000)`, `totalCiudadCadena` and `totalCiudadUnaPasada` returned exactly the same value (compared with `===`) for the four cities, for a badly written city (`" medellín "`) and for a city that does not exist (0). The four cities add up to `totalVendido`, so no sale was lost.

### Passes, new arrays and Big O

**Chain (`totalCiudadCadena`).**

| Stage | Loops over | Creates |
|-------|------------|---------|
| `map` (normalize) | the `n` sales | an array of `n` new objects (a copy of each sale) |
| `filter` | the `n` copied sales | an array of the `m` sales of that city (`m <= n`) |
| `map` (value) | the `m` filtered sales | an array of `m` numbers |
| `reduce` | the `m` values | nothing, it returns one number |

It makes **4 passes** (all 4 are full passes in the worst case, when `m = n`) and creates **3 intermediate arrays**, plus `n` copied objects in the first `map`.

**One pass (`totalCiudadUnaPasada`).** It makes **1 pass** and creates **0 intermediate arrays**. The extra memory is the variable `total`, the searched city and a temporary string per turn that is discarded.

| Version | Passes | New arrays | Time | Space |
|---------|--------|------------|------|-------|
| Chain | 4 | 3 (and `n` copied objects) | O(n) | O(n) |
| One pass | 1 | 0 | O(n) | O(1) |

### Why both are O(n) in time

The chain visits elements about `4n` times (`n + n + m + m`, with `m <= n`), while the one-pass loop visits `n`. Big O describes how the work grows when `n` grows, not the exact count, so two simplification rules apply:

1. **Constant factors are dropped.** If `n` grows 10 times, `4n` becomes `40n`, which is also 10 times more. Both versions grow at the same pace, so `O(4n)` is written `O(n)`.
2. **Steps in sequence add up, they do not multiply.** Four loops one after another give `n + n + m + m <= 4n`. The work would multiply (`n x n = n²`) only if the loops were nested, like in `clientesRecurrentes`.

Smaller terms are dropped too: a fixed cost such as normalizing the searched city once (`4n + 5`) becomes `n`.

The constant still matters in practice: the chain makes about 4 times more visits and also creates arrays and copies objects, so it is slower and uses more memory. But the number of operations grows at the same pace as in the one-pass version, so both are O(n) in time.

### Measured time of both versions

I measured both versions with `generarVentas(n)`, taking the median of 7 runs for each size (a single run was too noisy).

| n | chain (ms) | one pass (ms) | chain / one pass |
|---|------------|---------------|------------------|
| 100,000 | 10.2 | 4.3 | 2.4 |
| 200,000 | 29.8 | 6.6 | 4.5 |
| 400,000 | 69.6 | 9.3 | 7.5 |
| 800,000 | 152.7 | 18.7 | 8.1 |

From 100,000 to 800,000 sales (8 times more data), the chain took about 15 times longer and the one pass about 4.4 times longer. An O(n²) function would have taken about 64 times longer, so neither is quadratic: both are linear in the number of operations.

The chain is always slower, and the gap widens as `n` grows. A likely reason is memory: the chain allocates an array of `n` copied objects plus two more arrays, and creating and cleaning that memory costs time that the operation count does not capture. So the extra space of the chain also shows up as extra time.

### Space complexity of the engine

Convention: I count the memory a function creates (variables, arrays, objects), including what it returns, but not the `ventas` array it receives. `k` is the number of distinct groups (cities or products), and `n` the number of sales.

| Space | Functions | Why |
|-------|-----------|-----|
| O(1) | `valorVenta`, `normalizar`, `totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `ventasPorCiudad`, `totalCiudadUnaPasada`, `primeraVenta`, `contarVisita`, `contarComparacion`, `totalVendidoConteo`, `ventaMayorConteo` | Only a few variables: numbers, one reference to an existing sale, the counter, a temporary short string. |
| O(1) | `totalVendidoM`, `unidadesVendidasM` | `reduce` returns one number and creates no array. |
| O(k) | `totalPorCiudad`, `totalPorCiudadConteo` | One object with one key per distinct city, not per sale. With 4 cities it stays at 4 keys, so it is constant here; in the worst case (a different city in every sale) it would be O(n). |
| O(k) | `unidadesPorProducto` | One key per distinct product (5 here), not per sale. |
| O(k) | `topProductosPorValor` | An object with `p` products, then an array of `p` pairs and an array of `p` objects (`Object.entries` and `map`), and `slice` keeps the first `k`. Everything depends on the number of products, not on the number of sales. |
| O(n) | `ventasPorCiudadM` | `filter` creates an array of up to `n` sales and `map` another of up to `n` numbers. |
| O(n) | `ventasDelDia` | `filter` returns an array with the sales of that day, up to `n`. |
| O(n) | `totalCiudadCadena` | Three arrays plus `n` copied objects. |
| O(n) | `clientesRecurrentes` | The `recurrentes` array can hold up to about `n/2` customers. Its time is O(n²), but its space is only O(n). |

The key point: the memory of the grouping functions depends on how many distinct groups exist, not on how many sales exist. The functions that need memory proportional to the data are the ones that create copies or filtered arrays.

### Decision: which `totalCiudad` stays in the engine

I keep **`totalCiudadUnaPasada`** as the engine's version. `totalCiudadCadena` stays in `analitica.js` only as a reference for the comparison.

**Readability.** The chain reads like a sentence (normalize, filter, compute the value, add up), which is its best argument. But the one-pass version is also short, a single loop with one `if`, so the readability I give up is small.

**Resources.** This weighs more:
- The chain makes 4 passes, creates 3 arrays and copies `n` objects, so its space is O(n). The one pass uses O(1).
- In my measurements the chain was 2.4 to 8.1 times slower, and the gap widened as `n` grew.
- The marketplace server has limited memory, so reserving memory proportional to the history is a real cost.

The chain would be a fine choice for small data or a one-off script, where reading it quickly matters more than saving memory. Here, resources weigh more than the little readability that is lost.


## Micro-challenge 8: Performance document

**What I did.** Measured 17 functions with 10,000 sales and wrote `RENDIMIENTO.md` (complexity, projection to 1,000,000 sales, risks and an optimization plan).

**Main finding.** `clientesRecurrentes` took 424 ms at 10,000 sales, about 270 times more than the next slowest function, and would take around 2 hours at 1,000,000. Every other report stays under 0.2 s.

**Peer review.**

| Reviewer | Observation | My answer |
|----------|-------------|-----------|
| Samuel Castaño | La proyección de 2 horas depende de los datos de prueba. ¿Cambiaría con otros datos? | Sí, los datos tienen cerca de un cliente distinto por cada 3 ventas. Con otra cantidad el tiempo cambia, aunque seguiría creciendo con n². Lo agregué al documento. |

**What changed after the review.** Added a line about data shape to the projection notes in `RENDIMIENTO.md`.


## Micro-challenge 9: Recurring customers in linear time

**Goal.** The marketplace needs every report to answer in under 1 second with 100,000 sales. The current `clientesRecurrentes` takes minutes.

### 1. Understand

- **Input:** an array of sales; each sale has a `cliente`.
- **Output:** a list of the customers who appear in more than one sale, each one listed once.
- **Constraints:** under 1 second with 100,000 sales; the order of the result does not matter; the input must not be modified.

### 2. Examples and edge cases

| Input | Expected output |
|-------|-----------------|
| `[]` | `[]` |
| One sale | `[]` |
| C1, C2, C3 (nobody repeats) | `[]` |
| C1, C2, C1 | `["C1"]` |
| C1, C1, C1 | `["C1"]` (listed once, not twice) |
| C1, C2, C1, C2, C3 | `["C1", "C2"]` |

### 3. Brute force

For each sale, compare it with all the sales after it; if the customer matches, add it to the result unless `includes` finds it already there.

- **Time:** O(n²), worst case O(n³) because of `includes`.
- **Space:** O(n).
- **Measured:** 424 ms at 10,000 sales and 71 s at 100,000.

### 4. Optimization idea

The brute force searches for the same customer again and again. Instead, remember what has already been seen:

- **Set version:** one Set for customers already seen and another for recurring ones. If a customer is already in "seen", it goes into "recurring". `has` and `add` take constant time.
- **Map version:** one Map with the number of purchases per customer, then keep those with a count greater than 1.

Both walk through the sales once, so the time drops to O(n). The price is memory: O(c), with `c` distinct customers.


### 5. Implement

I added three functions to `analitica.js`:

- `clientesRecurrentesSet(ventas)`: one Set of customers already seen and another of recurring ones, in one pass.
- `comprasPorCliente(ventas)`: a Map with the number of purchases per customer.
- `clientesRecurrentesMap(ventas)`: keeps the customers whose count in that Map is greater than 1.

### 6. Test and measure

`src/verificarRecurrentes.js` compares the sorted results of the three versions. With the Day 1 data (3 customers) and with 5,000 generated sales (about 1,300 customers) all of them match.

`src/medirRecurrentes.js` gives the median of 7 runs (the original ran once at 10,000 and 5 times at 1,000):

| Sales | Original (ms) | Set (ms) | Map (ms) |
|-------|---------------|----------|----------|
| 1,000 | 7.7 | 0.30 | 0.30 |
| 10,000 | 890 | 1.27 | 1.38 |
| 100,000 | about 71,000 (measured in micro-challenge 6) | 18.3 | 18.6 |

The original grows with the square of the data: 10× more sales took about 115× more time. Set and Map grow roughly in line with the data: 10× more sales took between 4× and 15× more time, with small deviations from the cache and the first runs. At 100,000 sales both finish in about 18 ms, far under the 1-second limit and thousands of times faster than the original.

### Time vs. memory

The brute force stores almost nothing besides its result. The new versions remember every distinct customer (the Set of seen customers, or the whole Map), so memory grows from the size of the result to O(c), with `c` the number of distinct customers, which in the worst case is O(n). That is the price: a bit of memory spent to avoid searching again, which turns O(n²) time into O(n). Set and Map cost the same; I prefer the Map version when I also need the number of purchases per customer.