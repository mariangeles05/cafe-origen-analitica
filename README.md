# cafe-origen-analitica

A small sales analytics engine for Café Origen, built with plain JavaScript and Node.js. It reads a sample of the sales history and prints a business report in the console, so the manager can run the analysis without opening the code.

Current version: **v0.1**

## How to run it

You need [Node.js](https://nodejs.org) installed. Open a terminal in the project folder and run:

```bash
node src/reporte.js
```

That prints the full report. To look at a different day, change the dates in the last two lines of `src/reporte.js`, for example `resumenDelDia("2026-09-04")`. Dates use the format `YYYY-MM-DD`.

Other scripts:

```bash
node src/explorar.js
node src/pruebas.js
node src/verificar.js
```

## What questions it answers

- How much was sold in total, and how many units?
- What was the largest sale?
- What is the average ticket (spend per purchase)?
- How much was sold in each city?
- How many units were sold of each product?
- Which three products generated the most money?
- What happened on a given day, including days with no sales?

## What's inside

- `src/datos.js`: the 12 sales of the sample, exactly as they came.
- `src/analitica.js`: the calculation functions (loop versions and array-method versions).
- `src/reporte.js`: the report the manager runs.
- `src/verificar.js`: proves each method version gives the same result as its loop version.
- `src/explorar.js` and `src/pruebas.js`: data exploration and edge-case tests.
- `bitacora.md`: data dictionary, edge cases, decisions and debugging notes.
- `src/generador.js`: builds sales histories of any size for testing.
- `src/medir.js`: counts operations at different sizes to show how the work grows.
- `RENDIMIENTO.md`: performance report with complexity, projection to 1,000,000 sales, risks and an optimization plan.
- `src/verificarRecurrentes.js`: checks that the three recurring-customers versions return the same customers.
- `src/medirRecurrentes.js`: times the three versions with 1,000, 10,000 and 100,000 sales.

## Data notes

The data is never modified. Known issues (a city in lowercase, a sale with quantity zero) are handled in the code and explained in `bitacora.md`. A sale with quantity zero does not count as a purchase, and a day without sales shows zeros instead of an error.