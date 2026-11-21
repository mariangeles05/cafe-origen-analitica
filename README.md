# cafe-origen-analitica

Primer acercamiento a las ventas de Café Origen. Antes de calcular nada, el objetivo es entender los datos: qué representa cada registro, de qué tipo es cada campo y qué problemas traen.

## Qué hay en el proyecto

- `src/datos.js`: las 12 ventas de la muestra, tal como vienen.
- `src/explorar.js`: muestra cuántos registros hay, el primero, el último y la tabla completa.
- `src/analitica.js`: comprobaciones sobre los casos borde (ciudades, cantidades, clientes).
- `bitacora.md`: el diccionario de datos y las decisiones que fui tomando.

## Cómo correrlo

Necesitas Node.js instalado. Desde la carpeta del proyecto:

```bash
node src/explorar.js
node src/analitica.js
```

## Lo que encontré

Los datos traen cosas que no se ven a simple vista: una ciudad escrita en minúscula, una venta con cantidad cero y clientes que se repiten. 