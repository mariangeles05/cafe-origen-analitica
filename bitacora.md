# Log: Café Origen

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