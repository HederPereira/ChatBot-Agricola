const palavrasAgricolas = [
  "plantar","plantação","milho","soja","feijão",
  "irrigação","solo","adubo","fertilizante",
  "praga","fungo","lagarta","colheita",
  "horta","tomate","alface"
];

function ehAgricola(texto){
  return palavrasAgricolas.some(p =>
    texto.toLowerCase().includes(p)
  );
}

module.exports = ehAgricola;