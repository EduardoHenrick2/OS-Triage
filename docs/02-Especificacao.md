# 02 — Especificação

## 1. Modelo de negócio

O projeto não é um produto comercial. Esta seção descreve como a solução geraria
valor se uma oficina real a adotasse, e orienta as decisões de escopo.

### 1.1 Proposta de valor

- **Para a oficina:** pedidos registrados com dados completos e urgência definida antes
  de chegarem ao mecânico.
- **Para o cliente:** resposta padronizada e mais rápida ao relato do problema.
- **Para o portfólio:** demonstração de automação com n8n, saída estruturada de LLM e
  medição objetiva de qualidade.

### 1.2 Segmento

Oficinas pequenas e médias de motos, com um atendente no balcão e poucos mecânicos.
Não atende oficinas de carros, concessionárias nem frotas.

### 1.3 Fontes de valor e custos

| Item | Descrição |
| ---- | --------- |
| Economia de tempo | Menos transcrição manual e menos perguntas de volta ao cliente |
| Redução de risco | Casos de risco são marcados como urgência alta por regra em código |
| Custo de operação | R$ 0: n8n Community em Docker e nível gratuito do Gemini |
| Custo de desenvolvimento | Horas do desenvolvedor, sem infraestrutura paga |

### 1.4 Fora do modelo

Cobrança, preços, orçamento automático, integração com sistema de gestão da oficina e
envio automático por WhatsApp não fazem parte da versão 1.

---

## 2. Personas

As personas são fictícias e se inspiram na rotina de uma oficina de motos. Cada card
resume quem usa o sistema, o que precisa e onde sente dificuldade. As histórias da
seção 3 partem delas.

> ### Carla — atendente
>
> **Função:** recebe clientes no balcão e pelo telefone, e registra o pedido.
>
> **Rotina:** atende de dez a vinte pedidos por dia, com interrupções constantes.
>
> **Necessidade:** registrar o relato rápido, sem esquecer modelo ou sintoma.
>
> **Dor:** anota o problema "do jeito que o cliente fala" e às vezes esquece o ano da
> moto ou o detalhe que indica risco.
>
> **Familiaridade técnica:** usa planilha e aplicativo de mensagens. Não programa.
>
> **Interage com o sistema por:** formulário web de campo único (seção 2 de
> [04-Projeto-interface.md](04-Projeto-interface.md)).

> ### Antônio — mecânico
>
> **Função:** executa os serviços e decide a ordem de atendimento.
>
> **Rotina:** lê as fichas na planilha no início do turno.
>
> **Necessidade:** saber, sem interpretar texto, o que fazer, em qual moto e com qual
> urgência.
>
> **Dor:** fichas vagas obrigam a ligar para o cliente antes de começar o serviço.
>
> **Familiaridade técnica:** usa planilha básica no celular.
>
> **Interage com o sistema por:** filtro de urgência e de categoria na planilha (UC02).

> ### Rodrigo — cliente
>
> **Função:** leva a moto para revisão ou conserto.
>
> **Necessidade:** entender o que será feito e quando recebe o orçamento.
>
> **Dor:** recebe respostas genéricas e demora para saber se a moto está segura para
> rodar.
>
> **Familiaridade técnica:** usa aplicativo de mensagens. Não acessa o sistema
> diretamente.
>
> **Interage com o sistema por:** mensagem escrita pelo fluxo e enviada pelo atendente.

> ### Eduardo — desenvolvedor e avaliador
>
> **Função:** constrói, testa e documenta o projeto. Também é o avaliador técnico da
> solução durante os testes.
>
> **Necessidade:** medir a precisão do LLM com números e comparar versões do prompt.
>
> **Dor:** resultados que não podem ser reproduzidos por quem lê o portfólio.
>
> **Familiaridade técnica:** programa em nível intermediário e revisa código com
> frequência.
>
> **Interage com o sistema por:** fluxos do n8n, arquivos do repositório e
> planilha de resultados.

---

## 3. Histórias de usuário

Cada história traz critérios de aceite que apontam para um requisito da seção 5.

### 3.1 Atendente (Carla)

| ID | História | Critérios de aceite | Requisitos |
| -- | -------- | ------------------- | ---------- |
| HU01 | Como atendente, quero digitar o relato do cliente em um único campo, para registrar o pedido sem preencher formulários longos. | Formulário com um campo obrigatório; a execução inicia ao enviar | RF01, RNF06 |
| HU02 | Como atendente, quero ver a ficha estruturada logo após o envio, para conferir os dados antes de passar ao mecânico. | Ficha exibida com modelo, ano, sintomas, categoria, urgência e peças prováveis | RF02, RF03 |
| HU03 | Como atendente, quero ver uma pergunta quando faltar modelo ou problema, para completar o pedido na hora. | Pergunta exibida; nada é gravado enquanto o campo faltar | RF05 |
| HU04 | Como atendente, quero um aviso destacado quando a urgência for alta, para tratar o caso antes dos demais. | Aviso visível sempre que a urgência final for alta | RF04 |
| HU05 | Como atendente, quero receber uma mensagem pronta para o cliente, para enviá-la sem escrever do zero. | Mensagem em português com até 60 palavras, citando moto e serviço | RF07 |
| HU06 | Como atendente, quero uma mensagem clara quando a API estiver fora do ar, para saber que devo tentar de novo mais tarde. | Mensagem de erro legível após as novas tentativas | RF09 |

### 3.2 Mecânico (Antônio)

| ID | História | Critérios de aceite | Requisitos |
| -- | -------- | ------------------- | ---------- |
| HU07 | Como mecânico, quero ver cada pedido já classificado por categoria, para saber qual serviço preparar. | Categoria é um dos oito valores permitidos | RF03 |
| HU08 | Como mecânico, quero filtrar as fichas por urgência, para atender primeiro os casos de risco. | Filtro por urgência funciona na planilha | RF04 |
| HU09 | Como mecânico, quero uma ficha sem duplicatas, para não executar o mesmo serviço duas vezes. | Uma única linha por pedido, inclusive após falha simulada | RF06 |

### 3.3 Cliente (Rodrigo)

| ID | História | Critérios de aceite | Requisitos |
| -- | -------- | ------------------- | ---------- |
| HU10 | Como cliente, quero uma resposta clara sobre o que será feito, para entender o atendimento. | Mensagem cita a moto e o serviço, sem prometer preço | RF07 |

### 3.4 Desenvolvedor e avaliador (Eduardo)

| ID | História | Critérios de aceite | Requisitos |
| -- | -------- | ------------------- | ---------- |
| HU11 | Como desenvolvedor, quero rodar os 24 casos de teste pelo mesmo núcleo do atendente, para que a medição reflita o uso real. | Fluxo de avaliação chama o núcleo compartilhado | RF08 |
| HU12 | Como avaliador, quero ver a versão do prompt, o modelo e a temperatura de cada execução, para comparar resultados. | Cinco campos de rastreio registrados em toda linha de resultado | RF10 |
| HU13 | Como desenvolvedor, quero que um texto do cliente que tente mudar as regras seja tratado como dado, para proteger a triagem. | Casos de teste com instruções embutidas no relato são ignorados | RF11 |
| HU14 | Como avaliador, quero que a chave do Gemini nunca apareça no repositório, para publicar o projeto com segurança. | Chave somente nas credenciais do n8n; `.env` no `.gitignore` | RNF02, RNF05 |

---

## 4. Casos de uso técnicos

Os casos de uso descrevem o comportamento esperado de cada ator. Os componentes citados
são os do [documento de arquitetura](06-Arquitetura-solucao.md).

### 4.1 UC01 — Registrar pedido de serviço

| Campo | Descrição |
| ----- | --------- |
| Ator principal | Atendente (Carla) |
| Gatilho | Envio do formulário de campo único |
| Pré-condições | Fluxo do atendimento ativo no n8n; credencial do Gemini cadastrada |
| Entrada | Texto livre do relato, tratado como dado |
| Saída | Ficha gravada uma vez, ou pergunta ao atendente, ou mensagem de erro |
| Pós-condição | Ficha gravada somente se as duas verificações passaram; execução registrada em todos os casos |
| Componentes | Formulário do n8n, nó de chamada ao Gemini, verificações em código, planilha ou CSV |

**Fluxo normal**

1. A atendente envia o relato pelo formulário.
2. O núcleo envia o relato ao Gemini, delimitado como dado, junto com a instrução e o
   esquema JSON.
3. O código confere esquema e categoria (verificação 1).
4. O código confere modelo e descrição do problema (verificação 2).
5. O código aplica a regra de urgência com a lista de palavras de risco.
6. O código grava a ficha uma única vez e registra a execução.
7. O Gemini redige a mensagem ao cliente, e o formulário mostra a ficha, o aviso de
   urgência alta (se houver) e a mensagem.

**Fluxos alternativos**

- **2a. API indisponível ou no limite:** o fluxo espera, tenta de novo e, se falhar,
  mostra mensagem de erro clara.
- **3a. Modelo ou descrição ausente:** o fluxo mostra a pergunta, não grava e aguarda
  um novo envio com o dado completo.
- **3b. JSON fora do esquema ou categoria fora da lista:** o fluxo repete a extração até
  2 vezes. Se o erro persistir, mostra falha e registra a execução com o erro.

### 4.2 UC02 — Consultar fichas

| Campo | Descrição |
| ----- | --------- |
| Ator principal | Mecânico (Antônio) |
| Gatilho | Abertura da planilha ou do CSV de fichas |
| Entrada | Filtro por urgência ou por categoria |
| Saída | Lista de fichas filtradas |
| Componentes | Planilha ou CSV gravado pelo UC01 |

**Fluxo normal:** o mecânico abre a planilha, aplica o filtro e lê a ficha do serviço.

### 4.3 UC03 — Executar o conjunto de teste

| Campo | Descrição |
| ----- | --------- |
| Ator principal | Desenvolvedor (Eduardo) |
| Gatilho | Execução manual do fluxo de avaliação |
| Pré-condições | Os 24 casos com gabarito estão em `tests/casos_teste.csv` |
| Entrada | Casos com gabarito |
| Saída | Um registro por chamada, e métricas por versão do prompt |
| Componentes | Fluxo de avaliação, núcleo de triagem, planilha de resultados |

**Fluxo normal**

1. O fluxo de avaliação lê os 24 casos.
2. Envia cada caso três vezes ao núcleo usado pelo atendimento.
3. Calcula as métricas definidas no [plano de testes](07-Plano-testes-software.md) e
   salva o resultado por versão do prompt.

---

## 5. Requisitos

### 5.1 Requisitos funcionais

A prioridade segue a ordem de entrega. Cada requisito tem uma forma concreta de
verificação.

| ID | Requisito | Prioridade | Como verificar |
| -- | --------- | ---------- | -------------- |
| RF01 | Receber o relato do cliente em texto livre por um formulário | Alta | Enviar um texto e ver a execução iniciar |
| RF02 | Extrair modelo da moto, ano, sintomas, categoria do serviço, urgência e peças prováveis em JSON | Alta | JSON válido no esquema em 100% das execuções do conjunto de teste |
| RF03 | Classificar o serviço em uma das 8 categorias; valor fora da lista é rejeitado em código | Alta | Comparar com o gabarito; um caso simulado com categoria inválida é rejeitado |
| RF04 | Classificar a urgência como baixa, média ou alta; uma regra em código eleva para alta quando o relato cita palavra de risco | Alta | Comparar com o gabarito; nenhum caso de risco fica abaixo de alta |
| RF05 | Calcular em código os campos obrigatórios ausentes e gerar a pergunta de esclarecimento | Alta | Casos de teste com informação faltando |
| RF06 | Gravar a ficha com data e hora somente depois de todas as validações, sem duplicar linhas em novas tentativas | Média | Uma única linha por pedido, inclusive após uma falha simulada |
| RF07 | Gerar mensagem ao cliente em português, com até 60 palavras | Média | Conferir tamanho e presença de moto e serviço |
| RF08 | Executar o conjunto de teste em um fluxo separado, que usa o mesmo núcleo do fluxo do atendente, e registrar o resultado de cada caso | Média | Planilha de resultados preenchida após a rodada |
| RF09 | Tratar falha da API (limite, tempo esgotado) com nova tentativa e mensagem de erro clara | Média | Simular falha com chave inválida |
| RF10 | Registrar em cada execução a versão do prompt, o modelo, a temperatura, o tempo e a resposta bruta | Média | Todas as linhas de resultado trazem esses cinco campos |
| RF11 | Tratar o relato do cliente como dado, nunca como instrução | Média | Casos de teste com texto que tenta mudar as regras |
| RF12 | (Versão 2) Consultar uma lista de peças por meio de um agente | Baixa | Ficha com peças vindas da lista |

### 5.2 Requisitos não funcionais

As metas numéricas são propostas e podem ser ajustadas após a primeira rodada de testes.

| ID | Requisito | Meta |
| -- | --------- | ---- |
| RNF01 | Custo | R$ 0: n8n Community em Docker e nível gratuito do Gemini |
| RNF02 | Privacidade | Somente dados fictícios; nenhum nome, placa ou telefone de cliente real |
| RNF03 | Confiabilidade da saída | JSON válido e dentro do esquema em 100% das execuções, com até 2 novas tentativas se vier inválido |
| RNF04 | Desempenho | Até 15 segundos por pedido, de ponta a ponta (meta a validar; depende da API) |
| RNF05 | Reprodutibilidade | `docker-compose.yml` com versão do n8n fixada, fluxos exportados em JSON e instruções no manual; chave do Gemini nas credenciais do n8n |
| RNF06 | Usabilidade | Formulário com um único campo obrigatório |
| RNF07 | Manutenibilidade | Prompt versionado (v1, v2...) no repositório |
| RNF08 | Separação de responsabilidades | Regras de negócio e validações em código; o LLM só extrai e classifica |

### 5.3 Restrições

- **Gratuidade:** a solução roda sem custo; não há licença paga nem hospedagem.
- **Limite de requisições:** o nível gratuito do Gemini limita chamadas por minuto (RPM),
  por tokens por minuto (TPM) e por dia (RPD). Os limites são por projeto, e o contador
  diário zera à meia-noite do horário do Pacífico. Os valores aparecem no AI Studio. Os
  testes rodam em lotes com pausa.
- **Armazenamento a confirmar:** anexar linhas a um CSV no n8n pode exigir passos extras.
  A Fase 1 decide o armazenamento com uma linha de teste. Planos B: Google Sheets ou
  tabela de dados do próprio n8n, se a versão tiver.
- **Ambiente local:** tudo roda na máquina do desenvolvedor, em `localhost:5678`.
- **Dados:** somente dados fictícios.

---

## 6. Regras de negócio

### 6.1 Categorias de serviço

O fluxo trabalha com oito categorias:

1. corrente e relação;
2. freios;
3. suspensão;
4. motor e lubrificação;
5. elétrica e bateria;
6. pneus e rodas;
7. revisão periódica;
8. outro ou não identificado.

Relato que não trata de serviço de moto vai para a categoria *outro ou não identificado*.

### 6.2 Níveis de urgência

| Urgência | Critério | Exemplo |
| -------- | -------- | ------- |
| Alta | Risco à segurança de quem pilota | Freio fraco, vazamento de óleo, folga na direção |
| Média | Afeta o uso, mas a moto ainda roda | Ruído na corrente, partida difícil |
| Baixa | Manutenção preventiva ou estética | Revisão de rotina, troca de retrovisor |

### 6.3 Campos obrigatórios

- **Modelo da moto** e **descrição do problema** são obrigatórios.
- **Ano** é desejável, mas a sua falta não bloqueia o registro.

### 6.4 Regras de decisão

1. Se faltar um campo obrigatório, o código detecta, o fluxo pergunta ao atendente e
   **não grava** a ficha.
2. Se o modelo ou o ano não estiverem no texto, o campo fica vazio (`null`). O fluxo
   nunca deduz nem inventa.
3. Palavras de risco no relato elevam a urgência para alta, mesmo que o LLM tenha
   respondido outra coisa.
4. Urgência alta sempre destaca um aviso ao atendente.
5. Categoria fora da lista das oito é rejeitada como falha de formato e dispara nova
   tentativa de extração.
6. Instruções escritas dentro do relato são ignoradas: o texto do cliente é sempre dado.

**Nota de extração.** O LLM extrai os campos de modelo estritamente como redigidos no
relato. O enriquecimento dos dados, como inferir a marca a partir do modelo, é feito
depois, em código, por meio de uma tabela estática no fluxo do n8n. O LLM nunca completa
o modelo com marca ou outro dado que não esteja no texto.

### 6.5 Palavras de risco (lista inicial)

- freio;
- vazamento ou perda de óleo;
- folga na direção;
- pneu furado ou careca;
- moto desligando sozinha.

Essas palavras não substituem o LLM. Elas apenas elevam a urgência para alta. A lista será
revisada com os erros dos testes.

---

## 7. Atores

| Ator | Tipo | Papel no sistema |
| ---- | ---- | ---------------- |
| Atendente (Carla) | Primário | Registra o pedido e recebe ficha, pergunta ou aviso |
| Mecânico (Antônio) | Primário | Consulta as fichas na planilha |
| Cliente (Rodrigo) | Secundário | Recebe a mensagem enviada manualmente pelo atendente. Não acessa o sistema |
| Desenvolvedor e avaliador (Eduardo) | Primário (manutenção e testes) | Mantém o fluxo, o prompt e o conjunto de teste; executa a avaliação |
| API do Gemini | Externo | Extrai e classifica o texto, devolvendo JSON |
| n8n | Sistema de suporte | Orquestra as etapas e executa as verificações |
| Planilha ou CSV | Sistema de suporte | Armazena as fichas gravadas |

---

## 8. Trabalhos relacionados

Esta seção descreve categorias de solução que resolvem partes do mesmo problema. Não
foi feita uma revisão bibliográfica formal.

| Categoria | Exemplos de abordagem | Diferença deste projeto |
| --------- | --------------------- | ----------------------- |
| Sistemas de gestão para oficinas | Programas de ordem de serviço com cadastro de clientes, estoque e faturamento | Cobrem o fluxo financeiro. Este projeto foca só na triagem do relato livre, sem integração com faturamento |
| Planilhas e formulários de atendimento | Formulário com campos fixos preenchido pelo atendente | Dependem de o atendente transcrever o relato. Este projeto aceita texto livre e estrutura automaticamente |
| Extração de informação com LLM | Saída em JSON com esquema, como a saída estruturada do Gemini ([documentação oficial](11-Referencias.md)) | Este projeto acrescenta uma camada de validação em código e uma regra de segurança que não depende do modelo |
| Automação com n8n | Fluxos que chamam APIs de LLM e gravam resultados | Usa o n8n como base, mas separa o núcleo de triagem do fluxo de avaliação, para medir o que roda em produção |

**Lacuna que o projeto explora:** a validação determinística em código aplicada sobre a
saída de um LLM, medida contra um gabarito escrito antes da execução.

---

## 9. Conclusão

A especificação define uma versão 1 pequena e verificável. A atendente registra um relato
em texto livre e recebe uma ficha estruturada, uma pergunta quando faltar informação e uma
mensagem para o cliente. O Gemini extrai e classifica; o código valida e aplica as regras
de negócio, com destaque para a regra que eleva a urgência de casos de risco.

Os requisitos RF01 a RF11 formam o escopo obrigatório. O RF12 (lista de peças por agente)
fica como versão 2, e só entra se sobrar tempo após a fase de testes.

Os próximos documentos usam os identificadores desta especificação. A
[arquitetura](06-Arquitetura-solucao.md) detalha o esquema da ficha e a integração dos
fluxos. O [plano de testes](07-Plano-testes-software.md) mede o cumprimento dos requisitos
com o conjunto de 24 casos.
