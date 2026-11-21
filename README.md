# Café Origen Analytics

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
```

## Findings

The data contains issues that aren't immediately apparent: a city name written in lowercase, a sale with a quantity of zero, and duplicate customer entries.