# Bitácora: Café Origen

## Qué estoy mirando

Cada registro es una línea de venta: un cliente compró un producto en una ciudad, un día, y quedó anotada la cantidad y el precio. La muestra trae 12 registros, del 1 al 6 de septiembre de 2026.

Los pasé a `src/datos.js` tal cual vienen, errores incluidos. Si los corregía al copiarlos, ya no iba a saber qué traían los datos originales.

## Diccionario de datos

| Propiedad | Tipo | Qué significa |
|-----------|------|---------------|
| `id` | number | Identificador único de la venta, del 1 al 12. |
| `fecha` | string | Día de la venta en formato `AAAA-MM-DD`. Es texto, no un `Date`. |
| `cliente` | string | Código del cliente (`C01` a `C08`). |
| `producto` | string | Nombre del producto, con el gramaje dentro del texto. |
| `ciudad` | string | Ciudad donde se hizo la venta. |
| `cantidad` | number | Unidades vendidas en ese registro. |
| `precio` | number | Valor en pesos colombianos. Parece ser por unidad, porque cada producto repite siempre el mismo valor. |

## Casos borde detectados

**1. Ciudad escrita distinto (`id: 5`).** Aparece `medellín` en minúscula y en los demás registros `Medellín`. Para un computador son dos ciudades distintas, y un reporte por ciudad las separaría.
*Decisión:* normalizar el texto antes de agrupar (quitar espacios y unificar mayúsculas). En `datos.js` lo dejo como está, la corrección va en la limpieza.

**2. Cantidad en cero (`id: 8`).** Hay una venta con `cantidad: 0`. Puede ser un error de digitación o una venta anulada.
*Decisión:* no la cuento como venta en los totales de unidades ni de ingresos. El registro se queda en los datos y queda anotado aquí, y lo confirmo con Café Origen.

**3. Clientes repetidos.** C01 aparece 3 veces, y C02 y C03 aparecen 2. No es un error, son clientes que vuelven a comprar. Pero si cuento registros pensando que son clientes, me inflo el número.
*Decisión:* para saber cuántos clientes hay, cuento códigos únicos, no registros.

**4. El precio no dice si es unitario o total.** No viene aclarado.
*Decisión:* trabajo con la hipótesis de que es por unidad, porque el mismo producto siempre trae el mismo valor. El total de una venta sería `cantidad * precio`. Queda pendiente de confirmar.

## Decisiones generales

- Los datos originales no se modifican.
- Toda limpieza se hace en el código de análisis y se anota aquí.