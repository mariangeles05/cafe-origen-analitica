# cafe-origen-analitica

A small sales analytics engine for Café Origen, built with plain JavaScript and Node.js. It reads a sample of the sales history and prints a business report in the console, so the manager can run the analysis without opening the code.

Current version: **v1.0**

## Requirements

Node.js 18 or newer. There is nothing to install: the project has no dependencies.

## How to run it

You need [Node.js](https://nodejs.org) installed. Open a terminal in the project folder and run:

```bash
git clone https://github.com/mariangeles05/cafe-origen-analitica.git
cd cafe-origen-analitica
node src/reporte.js
```

That prints the full report. To look at a different day, change the dates in the last two lines of `src/reporte.js`, for example `resumenDelDia("2026-09-04")`. Dates use the format `YYYY-MM-DD`.

Other scripts:
That runs the report with the real sales data (12 sales). To run it with generated sales, pass the number you want:

```bash
node src/reporte.js 100000
```

With 100,000 sales the report finishes in well under a second.

## What questions it answers

- How much was sold in total, and how many units?
- What was the largest sale?
- What is the average ticket (spend per purchase)?
- How much was sold in each city?
- How many units were sold of each product?
- Which three products generated the most money?
- What happened on a given day, including days with no sales?
- What is the star product of each city?
- Which two products add up to a $87,000 gift card?
- Who is the first customer who bought only once (to send a comeback coupon)?
- What was the best week of sales (7 consecutive days)?

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
- `src/catalogo.js`: the product catalog with prices.
- `src/combos.js`: gift card combos, by brute force and with a Map.
- `src/ventasDiarias.js`: daily sales totals for September.
- `src/ventanas.js`: best week (brute force and sliding window) and closest pair under a budget (two pointers).
- `src/verificarVentanas.js`: checks both best-week versions and compares their times.


## Performance
    
The slowest report in v0.1, recurring customers, grew with the square of the data and took about a minute with 100,000 sales. In v1.0 it uses a Set and takes a few milliseconds. The full report went from about 68 s to 86 ms with 100,000 sales. Details, complexities and measurements are in [`RENDIMIENTO.md`](RENDIMIENTO.md).

## Data notes

The real data keeps its imperfections on purpose, and the engine handles them:

- A city can be written in different ways (for example `medellín` in lowercase); cities are compared ignoring case and extra spaces.
- One sale has quantity 0; it counts as a sale but is left out of the average ticket.
- A customer is recurrent when they appear in more than one sale.
- The best week needs at least 7 days of sales; with the 12 real sales the report says so instead of guessing.