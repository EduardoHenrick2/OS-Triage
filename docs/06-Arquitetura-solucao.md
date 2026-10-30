# 06 — Arquitetura da solução

## 1. Visão geral

O sistema separa duas responsabilidades. O Google Gemini interpreta o texto livre do
relato e propõe uma ficha. O código, executado em nós JavaScript dentro do n8n, valida
essa proposta e decide o que acontece com ela. O modelo nunca grava dados, nunca decide
se uma ficha está completa e nunca rebaixa a urgência.

| Componente | Responsabilidade | Tipo de decisão |
| ---------- | ---------------- | --------------- |
| Gemini (Gemini API) | Extrai campos, classifica categoria e urgência, sugere peças e redige a mensagem | Probabilística |
| Nós JavaScript (n8n) | Valida esquema, tipos, categorias, campos obrigatórios e presença dos dados no texto; aplica a regra de risco | Determinística |
| n8n | Orquestra as etapas, faz as novas tentativas e roteia o resultado | Determinística |
| Planilha ou CSV | Guarda as fichas gravadas e o registro de cada execução | Armazenamento |

O sistema tem três fluxos no n8n que compartilham um mesmo núcleo de triagem. O fluxo do
atendimento recebe o relato pelo formulário. O fluxo de avaliação lê os casos de teste.
Os dois chamam o mesmo núcleo, por isso o que o conjunto de teste mede é o que roda no uso
real.

---

## 2. Comportamento do modelo

Esta seção descreve o que se pode esperar do Gemini e o que o código precisa compensar.

### 2.1 Saída guiada por JSON Schema

A Gemini API permite configurar o modelo para responder em conformidade com um JSON
Schema fornecido na chamada. A documentação oficial descreve esse recurso como o caminho
para extração de dados e classificação em categorias predefinidas, com saída de tipo
previsível. Na prática, o esquema reduz as respostas malformadas, mas não as elimina e não
garante que o conteúdo esteja certo.

O esquema da ficha é definido uma vez, como objeto JSON, e enviado na configuração da
chamada ao Gemini feita pelo n8n. O nome exato do campo de configuração depende do nó ou da
chamada HTTP usada, e será confirmado na Fase 1 com uma chamada de teste.

Mesmo com o esquema, o código valida a saída. A validação é a barreira real: ela é
determinística, testável e não depende da obediência do modelo.

### 2.2 Dados ausentes retornam null

O prompt instrui o modelo a usar `null` quando modelo ou ano não estiverem no relato, e o
esquema permite `null` nesses dois campos. Essa instrução reduz a invenção, mas não a
impede por completo. Por isso o código faz uma segunda conferência: o valor de modelo e de
ano só é mantido se aparecer no texto do relato (seção 4.4). Se não aparecer, o campo vira
`null` e fica registrado como não confirmado.

A forma exata de declarar que um campo aceita `null` depende da sintaxe de esquema aceita
pela API. Essa forma será confirmada na Fase 1 junto com o teste do nó.

### 2.3 Variação entre execuções

O modelo gera a resposta amostrando de uma distribuição de probabilidade sobre os próximos
tokens. A temperatura controla a largura dessa distribuição. Uma temperatura baixa reduz
a variação, mas não a elimina. Por isso o mesmo relato pode produzir categorias diferentes
em execuções diferentes, mesmo com temperatura baixa.

O projeto trata essa variação de três formas:

- **Medição, não suposição.** Cada caso roda três vezes. A métrica de consistência (seção
  de métricas do [plano de testes](07-Plano-testes-software.md)) mede quantos casos mantêm a
  mesma categoria nas três execuções.
- **Retentativa só para formato.** Uma saída fora do esquema ou com categoria inválida gera
  nova chamada, até duas vezes. Uma categoria diferente, mas válida, não gera retentativa:
  é um erro de acerto, medido pelo gabarito.
- **Registro integral.** Cada execução guarda a resposta bruta, a versão do prompt, o
  modelo, a temperatura e o tempo (RF10). Assim, qualquer divergência pode ser revista
  depois com os dados originais.

### 2.4 Limites da API

O nível gratuito da Gemini API aplica limites de requisições por minuto (RPM), tokens por
minuto (TPM) e requisições por dia (RPD). Os limites são por projeto, não por chave. O
contador diário zera à meia-noite do horário do Pacífico. Quando um limite é atingido, a
API responde com erro de cota, e o fluxo trata esse erro na etapa de chamada (seção 7.4).

Para o projeto, isso significa que a rodada de 24 casos com 3 execuções cada, ou 72
chamadas, deve ser dividida em lotes com pausa.

---

## 3. Modelo de dados

### 3.1 Ficha de serviço

A ficha é o objeto que o núcleo produz e que é gravado depois das validações. Os campos
marcados como "Gemini" vêm da extração. Os demais são calculados em código.

| Campo | Tipo | Quem preenche | Regra |
| ----- | ---- | ------------- | ----- |
| `modelo_moto` | texto ou `null` | Gemini, confirmado em código | Só se o texto do relato contiver o valor |
| `ano` | número inteiro ou `null` | Gemini, confirmado em código | Só se o texto do relato contiver o número |
| `sintomas` | lista de textos | Gemini | Um item por sintoma citado |
| `categoria` | uma das 8 categorias | Gemini, validada em código | Obrigatória; valor fora da lista é rejeitado |
| `urgencia_llm` | `baixa`, `media` ou `alta` | Gemini | Obrigatória |
| `pecas_provaveis` | lista de textos | Gemini | Sugestão; pode ficar vazia |
| `urgencia_final` | `baixa`, `media` ou `alta` | Código | Urgência do Gemini, elevada para `alta` quando há palavra de risco |
| `campos_faltando` | lista de textos | Código | Vazia quando a ficha está completa |
| `pergunta_ao_atendente` | texto ou `null` | Código | Preenchida só quando falta campo obrigatório |
| `campos_nao_confirmados` | lista de textos | Código | Modelo ou ano que o Gemini informou, mas que não aparecem no relato; ficam de fora da ficha |

Categorias válidas, com os nomes usados em toda a documentação:
`corrente e relação`, `freios`, `suspensão`, `motor e lubrificação`,
`elétrica e bateria`, `pneus e rodas`, `revisão periódica` e
`outro ou não identificado`.

Os valores de urgência são `baixa`, `media` e `alta`, sem acento, como no esquema do
documento base.

### 3.2 Exemplo de ficha gravada

```json
{
  "modelo_moto": "Honda CB 300",
  "ano": 2017,
  "sintomas": ["freio dianteiro mole", "preciso puxar bem a manete"],
  "categoria": "freios",
  "urgencia_llm": "media",
  "pecas_provaveis": ["pastilhas de freio", "disco de freio"],
  "urgencia_final": "alta",
  "campos_faltando": [],
  "pergunta_ao_atendente": null
}
```

O Gemini respondeu `media`. A palavra "freio" no relato elevou a urgência final para `alta`.

### 3.3 Exemplo de ficha com pergunta

```json
{
  "modelo_moto": null,
  "ano": 2017,
  "sintomas": ["barulho no motor", "perda de força"],
  "categoria": "motor e lubrificação",
  "urgencia_llm": "media",
  "pecas_provaveis": [],
  "urgencia_final": "media",
  "campos_faltando": ["modelo_moto"],
  "pergunta_ao_atendente": "Qual é o modelo da moto?"
}
```

Nesse caso a ficha não é gravada. A pergunta volta ao atendimento.

### 3.4 Registro de execução

Cada chamada ao Gemini gera um registro separado da ficha. Ele atende ao RF10.

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| `id_execucao` | texto | Identificador único da chamada |
| `id_pedido` | texto | Identificador do pedido, usado para evitar linhas duplicadas (RF06) |
| `data_hora` | data e hora | Momento da execução, no fuso `America/Sao_Paulo` |
| `versao_prompt` | texto | `v1`, `v2` etc., conforme `prompts/` |
| `modelo` | texto | Nome do modelo Gemini usado |
| `temperatura` | número | Temperatura usada na chamada |
| `tempo_s` | número | Tempo total da chamada, em segundos |
| `resposta_bruta` | texto | Saída do Gemini antes de qualquer validação |
| `tentativa` | número | 1 a 3, conforme a retentativa de extração |
| `resultado` | texto | `gravada`, `pergunta`, `falha_formato` ou `falha_api` |

### 3.5 Armazenamento

O destino da ficha é decidido na Fase 1, com uma linha de teste. As opções são um CSV
dentro de `data/`, uma planilha do Google Sheets ou uma tabela de dados do próprio n8n.
Qualquer que seja a escolha, o esquema da ficha e o do registro não mudam.

---

## 4. Validações em JavaScript

Os trechos abaixo mostram a lógica dos nós de código do n8n que rodam depois da resposta do
Gemini. São esboços para a fase 2. A versão final será testada com os casos do plano de
testes antes de entrar no fluxo.

### 4.1 Sequência dos nós

1. **Interpretar a saída.** Converte o texto da resposta em objeto. Falha de conversão é
   tratada como erro de formato.
2. **Validar a estrutura.** Confere se todos os campos existem e descarta as chaves
   desconhecidas.
3. **Validar os tipos.** Confere o tipo e o domínio de cada campo.
4. **Filtrar a categoria.** Aceita apenas as oito categorias permitidas.
5. **Confirmar os dados no texto.** Mantém modelo e ano só se aparecerem no relato.
6. **Verificar os campos obrigatórios.** Gera a lista de campos faltando.
7. **Aplicar a regra de risco.** Eleva a urgência para `alta` quando o relato contém
   palavra de risco. Esta etapa roda sobre o relato, não sobre a saída do Gemini.
8. **Decidir.** Retorna `gravada`, `pergunta` ou `falha_formato`.

### 4.2 Validação do esquema e barramento de chaves

A função abaixo converte a saída, confere os campos obrigatórios e descarta chaves que
não fazem parte do esquema. Chaves desconhecidas, como uma variante com erro de digitação,
não chegam à ficha.

```javascript
const CAMPOS_ESPERADOS = [
  'modelo_moto', 'ano', 'sintomas', 'categoria', 'urgencia_llm', 'pecas_provaveis'
];

function validarEstrutura(saidaBruta) {
  let objeto;
  try {
    objeto = JSON.parse(saidaBruta);
  } catch (erro) {
    return { ok: false, motivo: 'json_invalido' };
  }

  if (typeof objeto !== 'object' || objeto === null || Array.isArray(objeto)) {
    return { ok: false, motivo: 'nao_e_objeto' };
  }

  const dados = {};
  for (const campo of CAMPOS_ESPERADOS) {
    if (!(campo in objeto)) {
      return { ok: false, motivo: `campo_ausente:${campo}` };
    }
    dados[campo] = objeto[campo];
  }

  // Chaves fora do esquema são descartadas e registradas para auditoria.
  const descartadas = Object.keys(objeto).filter(k => !CAMPOS_ESPERADOS.includes(k));
  return { ok: true, dados, descartadas };
}
```

A segunda função confere os tipos e o domínio de cada campo. Um campo com tipo errado,
como `ano` em texto, reprova a saída inteira.

```javascript
function tiposValidos(d) {
  const textoOuNulo = v => v === null || typeof v === 'string';
  const listaDeTextos = v => Array.isArray(v) && v.every(item => typeof item === 'string');

  if (!textoOuNulo(d.modelo_moto)) return false;
  if (!(d.ano === null || Number.isInteger(d.ano))) return false;
  if (!listaDeTextos(d.sintomas)) return false;
  if (typeof d.categoria !== 'string') return false;
  if (!['baixa', 'media', 'alta'].includes(d.urgencia_llm)) return false;
  if (!listaDeTextos(d.pecas_provaveis)) return false;
  return true;
}
```

### 4.3 Filtro determinístico de categorias

A comparação de categorias ignora maiúsculas, espaços extras e acentos. Isso evita que uma
variação de grafia do modelo seja tratada como erro de domínio. Depois de aceita, a
categoria é gravada na forma canônica da lista, sempre igual.

```javascript
const CATEGORIAS = [
  'corrente e relação', 'freios', 'suspensão', 'motor e lubrificação',
  'elétrica e bateria', 'pneus e rodas', 'revisão periódica', 'outro ou não identificado'
];

// Normaliza para comparação: sem acento, sem espaços extras, minúsculo.
const normalizar = s =>
  String(s).normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase();

const CATEGORIAS_NORMALIZADAS = CATEGORIAS.map(normalizar);

function categoriaCanonica(valor) {
  const indice = CATEGORIAS_NORMALIZADAS.indexOf(normalizar(valor));
  return indice === -1 ? null : CATEGORIAS[indice];
}
```

Se `categoriaCanonica` retornar `null`, a saída é reprovada com o motivo
`categoria_invalida`, e a extração é repetida (RF03).

### 4.4 Confirmação dos dados no texto

Para modelo e ano, o código confere se o valor aparece no relato. Isso impede que um dado
inventado chegue à ficha. A comparação é literal e tolerante a maiúsculas e acentos, o que
é conservador: um modelo escrito de outra forma (por exemplo, "CB300" em vez de "CB 300")
pode ser descartado. Esse custo é aceito, porque um dado perdido gera uma pergunta ao
atendente, e um dado inventado gera uma ficha errada. A métrica "Invenção de dados", com
meta zero, mede o resultado.

```javascript
function contemNoTexto(relato, valor) {
  return normalizar(relato).includes(normalizar(valor));
}

function confirmarDados(d, relato) {
  const naoConfirmados = [];

  if (d.modelo_moto !== null && !contemNoTexto(relato, d.modelo_moto)) {
    d.modelo_moto = null;
    naoConfirmados.push('modelo_moto');
  }

  if (d.ano !== null && !relato.includes(String(d.ano))) {
    d.ano = null;
    naoConfirmados.push('ano');
  }

  return { dados: d, naoConfirmados };
}
```

### 4.5 Verificação de campos obrigatórios

Modelo da moto e descrição do problema são obrigatórios (regra 5.3 da especificação). A
descrição do problema é considerada presente quando a lista de sintomas tem pelo menos um
item. O ano é desejável, mas a sua falta não bloqueia o registro.

```javascript
function verificarObrigatorios(d) {
  const faltando = [];
  if (d.modelo_moto === null) faltando.push('modelo_moto');
  if (d.sintomas.length === 0) faltando.push('problema');
  return faltando;
}
```

### 4.6 Varredura por expressões regulares das palavras de risco

A regra de risco procura palavras da lista inicial no relato. O texto é normalizado antes
da busca, para que "óleo" e "oleo" sejam tratados igual. A busca usa limites de palavra do
JavaScript, que funcionam bem sobre texto sem acento.

```javascript
const PADROES_RISCO = [
  /\bfreios?\b/,
  /\bvazamento de oleo\b/,
  /\bperda de oleo\b/,
  /\bfolga na direcao\b/,
  /\bpneu (furado|careca)\b/,
  /\bmoto desligando sozinha\b/
];

function temRisco(relato) {
  const texto = normalizar(relato);
  return PADROES_RISCO.some(padrao => padrao.test(texto));
}
```

A regra só eleva a urgência. Se o Gemini classificou `alta`, o valor permanece `alta`, mesmo
que a palavra não apareça no texto. A lista é uma base mínima. Variações como "carequinha",
que não está na lista, não são capturadas. O caso CT-20 do plano de testes mede essa
lacuna, e a lista é revisada com os erros encontrados.

### 4.7 Decisão e roteamento

A função abaixo junta as etapas anteriores e devolve o resultado do núcleo. Ela não grava
nada. A gravação é feita pelo fluxo do atendimento, depois da decisão.

```javascript
function triar(saidaBruta, relato) {
  const risco = temRisco(relato);

  const estrutura = validarEstrutura(saidaBruta);
  if (!estrutura.ok) {
    return { resultado: 'falha_formato', motivo: estrutura.motivo, risco };
  }

  const d = estrutura.dados;
  if (!tiposValidos(d)) {
    return { resultado: 'falha_formato', motivo: 'tipo_invalido', risco };
  }

  const categoria = categoriaCanonica(d.categoria);
  if (categoria === null) {
    return { resultado: 'falha_formato', motivo: 'categoria_invalida', risco };
  }
  d.categoria = categoria;

  const { dados, naoConfirmados } = confirmarDados(d, relato);
  const faltando = verificarObrigatorios(dados);

  const ficha = {
    ...dados,
    urgencia_final: risco ? 'alta' : dados.urgencia_llm,
    campos_faltando: faltando,
    pergunta_ao_atendente: faltando.length
      ? `Falta informar: ${faltando.join(', ')}.`
      : null,
    campos_nao_confirmados: naoConfirmados
  };

  return { resultado: faltando.length ? 'pergunta' : 'gravada', ficha };
}
```

Duas regras de segurança aparecem nesse código.

- **Falha de formato não é silenciosa.** Mesmo quando o Gemini não devolve uma saída
  válida, a regra de risco roda sobre o relato. Se houver palavra de risco, a tela mostra o
  aviso de urgência alta, junto com a mensagem de erro. A atendente nunca vê uma tela
  vazia para um pedido que pode ser de risco.
- **Pergunta impede gravação.** O resultado `pergunta` não passa pelo nó de gravação.

---

## 5. Tecnologias e decisões

### 5.1 Stack

| Componente | Tecnologia | Função | Custo |
| ---------- | ---------- | ------ | ----- |
| Orquestração | n8n Community Edition | Executa os fluxos, o formulário e os nós JavaScript | R$ 0 |
| Execução do n8n | Docker Desktop com WSL 2 | Isola e sobe o n8n com versão fixada | R$ 0 para uso pessoal e estudo |
| LLM | Gemini API (Google AI Studio) | Extração, classificação e redação | R$ 0 no nível gratuito |
| Validação | JavaScript em nós de código do n8n | Esquema, categorias, dados no texto e regra de risco | R$ 0 |
| Versionamento | Git e GitHub | Fluxos, prompts, testes e relatórios | R$ 0 |
| Armazenamento | CSV, Google Sheets ou tabela do n8n | Fichas gravadas | R$ 0 |
| Plano B de execução | Node.js 20.19 a 24.x com `npx n8n` | Usado se o Docker travar | R$ 0 |

### 5.2 Decisões de arquitetura

| Decisão | Escolha | Motivo | Alternativa descartada |
| ------- | ------- | ------ | ---------------------- |
| Plataforma | n8n em Docker | Montagem rápida e ferramenta citada na vaga | API própria em ASP.NET Core, que levaria semanas |
| Divisão de papéis | Gemini extrai e classifica; JavaScript valida e decide | Regras de negócio não dependem do prompt | Deixar o modelo decidir tudo, inclusive se a ficha está completa |
| Estrutura de fluxos | Três fluxos: núcleo, atendimento e avaliação | Produção e teste passam pelo mesmo caminho | Um fluxo único com ramo de teste |
| Saída do modelo | Esquema fixo e validação em código | Resposta fora do formato nunca chega à ficha | Aceitar texto livre e interpretar depois |
| Urgência | Gemini mais regra de palavras de risco | Errar uma urgência alta é o erro mais grave | Confiar só no modelo |
| Dados ausentes | `null`, confirmado em código | Evita invenção de modelo e ano | Deixar o modelo preencher com estimativas |
| Entrada | Relato delimitado no prompt e tratado como dado | Reduz o risco de o texto alterar as regras | Juntar o texto direto às instruções |
| Rastreabilidade | Registro de execução com cinco campos de rastreio | Permite comparar v1 e v2 com fatos | Comparar as versões a olho |

---

## 6. Hospedagem e ambiente

### 6.1 Onde roda

Tudo roda na máquina do desenvolvedor, em Windows 11. Não há servidor, nuvem contínua nem
hospedagem 24 horas.

- O n8n sobe em `http://localhost:5678`, pelo `docker-compose.yml`. A porta é publicada
  apenas em `127.0.0.1`.
- A versão do n8n é fixada no `.env`, na variável `N8N_VERSION`, depois do primeiro início.
- O fuso horário é `America/Sao_Paulo`, pela variável `TIMEZONE`.
- O volume do Docker guarda workflows e credenciais. `docker compose down -v` apaga esse
  volume e não deve ser usado.

### 6.2 Configuração e segredos

| Item | Onde fica | Regra |
| ---- | --------- | ----- |
| Chave do Gemini | Credenciais do n8n | Nunca em arquivo do repositório |
| Configurações locais | `.env`, copiado de `.env.example` | `.env` está no `.gitignore` |
| Fluxos | JSON em `workflows/` | Revisar antes do commit, para não expor chave |
| Prompts | `prompts/v1.md`, `v2.md` | Versionados no Git |
| Casos de teste | `tests/` | Somente dados fictícios |
| Resultados | `data/` | Não vão para o GitHub |

### 6.3 Plano B

Se o Docker travar, o n8n roda com `npx n8n` sobre Node.js entre 20.19 e 24.x. Os fluxos
são exportados e importados em JSON, então nada se perde na troca.

### 6.4 Limites do ambiente

- **Cota do Gemini:** limites por minuto, por tokens e por dia, conforme a seção 2.4.
- **Memória:** o Docker Desktop consome memória. Antes da rodada de 72 chamadas, confira a
  memória livre da máquina.

---

## 7. Integração do fluxo

### 7.1 Fluxo do pedido

O fluxo do atendimento tem sete etapas. As etapas 3, 4 e 5 são as verificações em
JavaScript descritas na seção 4.

1. **Receber o relato.** O formulário envia o texto como campo `relato`.
2. **Chamar o Gemini.** O nó envia o relato delimitado como dado, junto com a instrução e
   o esquema.
3. **Validar estrutura e categoria.** Funções da seção 4.2 e 4.3.
4. **Confirmar dados e campos obrigatórios.** Funções da seção 4.4 e 4.5.
5. **Aplicar a regra de risco.** Função da seção 4.6.
6. **Gravar a ficha e o registro.** Só ocorre com resultado `gravada`.
7. **Gerar a mensagem e exibir.** O Gemini redige a mensagem ao cliente, com até 60
   palavras. O código conta as palavras e refaz a redação se passar do limite. O formulário
   mostra a ficha, o aviso de urgência alta, se houver, e a mensagem.

### 7.2 Regra de gravação

A gravação é o último passo e só ocorre com resultado `gravada`. Para evitar linhas
duplicadas em novas tentativas (RF06), a gravação usa o `id_pedido`. Se o pedido já tiver
uma linha, o fluxo não grava outra. A implementação dessa checagem será confirmada na
Fase 3.

### 7.3 Fluxo de avaliação

O fluxo de avaliação lê os casos de `tests/casos_teste.csv`, chama o núcleo três vezes por
caso e grava um registro por chamada. Depois calcula as métricas do plano de testes e salva
o resultado por versão do prompt. Ele não tem validação própria: se o núcleo mudar, a
avaliação muda junto.

### 7.4 Tratamento de erros

| Situação | Ponto do fluxo | Tratamento | Resultado |
| -------- | -------------- | ---------- | --------- |
| JSON inválido ou fora do esquema | Validação de estrutura | Até 2 novas tentativas | `falha_formato` se persistir |
| Categoria fora da lista | Filtro de categoria | Nova tentativa | `falha_formato` se persistir |
| Modelo ou problema ausente | Verificação de obrigatórios | Pergunta ao atendente, sem gravação | `pergunta` |
| Limite de cota (erro 429) | Chamada ao Gemini | Espera e nova tentativa | `falha_api` se persistir |
| Chave inválida | Chamada ao Gemini | Erro claro, sem nova tentativa em laço | `falha_api`, nada gravado |

Em todos os casos de falha, o registro de execução é gravado. A ficha não é.

---

## 8. Riscos técnicos

| Risco | Probabilidade | Impacto | Mitigação |
| ----- | ------------- | ------- | --------- |
| Saída fora do esquema ou categoria inválida | Alta | Média | Validação em código e até 2 novas tentativas |
| Modelo ou ano inventados | Média | Alta | Confirmação no texto (seção 4.4) e métrica de invenção igual a zero |
| Variação de categoria entre execuções | Média | Média | Três execuções por caso e métrica de consistência |
| Lista de risco incompleta | Média | Alta | Regra só eleva urgência; o caso CT-20 mede a lacuna e a lista é revisada com os erros dos testes |
| Cota do nível gratuito atrasa os testes | Média | Média | Lotes com pausa e conferência de limites no AI Studio |
| Chave de API vazar no GitHub | Média | Alta | Chave só nas credenciais; `.env` no `.gitignore`; revisão do commit |
| Texto do cliente tentar mudar as regras | Baixa | Média | Relato delimitado como dado; casos CT-23 e CT-24 |

---

## 9. Evolução futura

O mesmo núcleo, o prompt e os casos de teste podem virar uma API própria em ASP.NET Core
sem refazer a avaliação. Nesse caso, o n8n deixa de ser a porta de entrada, mas as
validações em JavaScript e o conjunto de testes continuam válidos. Essa evolução está fora
da versão 1.
