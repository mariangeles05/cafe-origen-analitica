const comboRegaloFuerzaBruta = (catalogo, valor) => {
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (catalogo[i].precio + catalogo[j].precio === valor) {
        return [catalogo[i], catalogo[j]];
      }
    }
  }
  return null;
};

const comboRegalo = (catalogo, valor) => {
  const vistos = new Map();

  for (const producto of catalogo) {
    const complemento = valor - producto.precio;

    if (vistos.has(complemento)) {
      return [vistos.get(complemento), producto];
    }

    vistos.set(producto.precio, producto);
  }

  return null;
};

module.exports = { comboRegaloFuerzaBruta, comboRegalo };