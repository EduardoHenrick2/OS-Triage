// n8n_mapeamento_marcas.js
// Nó de Código (JavaScript) do n8n. Fica depois da confirmação dos dados no texto
// (06, seção 4.4) e antes da decisão final.
// Entrada: a ficha, com modelo_moto exatamente como o cliente escreveu.
// Saída: a mesma ficha, com modelo_moto completado pela marca quando o modelo está na tabela.
// O LLM não infere marca. Esta tabela é a única fonte de marcas do fluxo.

const CATALOGO = [
  { marca: 'Honda', modelo: 'CG 160' },
  { marca: 'Honda', modelo: 'CG 150 Titan' },
  { marca: 'Honda', modelo: 'CB 300' },
  { marca: 'Honda', modelo: 'CB 500' },
  { marca: 'Honda', modelo: 'Bros 160' },
  { marca: 'Honda', modelo: 'PCX 150' },
  { marca: 'Honda', modelo: 'Biz 125' },
  { marca: 'Honda', modelo: 'Biz' },
  { marca: 'Yamaha', modelo: 'Fazer 250' },
  { marca: 'Yamaha', modelo: 'Fazer' },
  { marca: 'Yamaha', modelo: 'YBR 125' },
  { marca: 'Yamaha', modelo: 'Factor 125' },
  { marca: 'Yamaha', modelo: 'Crosser 150' },
  { marca: 'Dafra', modelo: 'Speed 150' },
  { marca: 'Dafra', modelo: 'Next 250' },
  { marca: 'Shineray', modelo: 'XY150' }
];

// Chave de comparação: sem acento, minúscula e sem espaços ou pontuação.
// "CG 160", "cg160" e "CG-160" viram a mesma chave.
function chave(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const INDICE = new Map(
  CATALOGO.map(({ marca, modelo }) => [chave(modelo), `${marca} ${modelo}`])
);

function enriquecerModelo(ficha) {
  if (typeof ficha.modelo_moto !== 'string' || ficha.modelo_moto.trim() === '') {
    return ficha;
  }
  // Remove artigos e pronomes soltos no início: "a fazer 250" vira "fazer 250".
  const modeloOriginal = ficha.modelo_moto;
  const modeloLimpo = modeloOriginal.trim().replace(/^(a |o |minha |meu |uma |um )/gi, '').trim();
  const completo = INDICE.get(chave(modeloLimpo));
  if (completo === undefined) {
    return ficha;
  }
  return { ...ficha, modelo_moto: completo };
}

// Execução no nó de Código do n8n (modo "Run Once for All Items").
if (typeof $input !== 'undefined') {
  return $input.all().map(item => ({ json: enriquecerModelo(item.json) }));
}

// Execução fora do n8n, para teste local com Node.js.
module.exports = { enriquecerModelo, chave, CATALOGO };
