# 03 — Metodologia

## 1. Abordagem

O projeto segue fases sequenciais, e cada fase só termina quando o critério de saída é
cumprido. Dentro da fase 4, o prompt passa por ciclos curtos de medição e ajuste, cada
um com uma única mudança.

Três princípios orientam as decisões:

- **Entregar a versão 1 antes de pensar na versão 2.** A versão 2 (agente com lista de
  peças) só entra se a fase 4 terminar antes de 12/11/2026.
- **Medir antes de melhorar.** Nenhuma mudança no prompt entra sem a rodada de 24 casos
  que a comprova.
- **Separar IA e código.** Mudanças de regra de negócio são feitas no código, não no
  prompt.

---

## 2. Cronograma

As datas são uma proposta a partir de 30/10/2026. Se as aulas ou outras entregas
apertarem, a fase 4 é a primeira a ser reduzida, porque a fase 5 depende dela.

| Fase | Período (proposta) | Entrega | Critério de saída |
| ---- | ------------------ | ------- | ----------------- |
| 1. Ambiente | 30/10 a 03/11 | Docker e n8n rodando; chave do Gemini criada; repositório no GitHub; armazenamento decidido | Uma chamada de teste ao Gemini volta com resposta, e uma linha de teste é gravada |
| 2. Núcleo do fluxo | 04/11 a 06/11 | RF01 a RF05 e RF11 | O núcleo roda com 5 casos de teste sem erro |
| 3. Registro e mensagem | 07/11 a 09/11 | RF06, RF07, RF09 e RF10 | Ficha gravada uma única vez, mensagem gerada, falha de API tratada e execuções registradas |
| 4. Testes e ajuste | 10/11 a 12/11 | RF08, 24 casos, métricas das versões v1 e v2, relatório | Metas de precisão atingidas, ou data-limite de 12/11/2026 |
| 5. Entrega | 13/11 a 16/11 | README, vídeo de até 3 minutos, currículo e LinkedIn | Definição de pronto cumprida |

**Prazos externos:** a entrega do projeto é 16/11/2026. As inscrições do programa vão até
17/11/2026, segundo o Seja Trainee. Essa data precisa ser confirmada na página oficial da
vaga antes de qualquer entrega.

### 2.1 Detalhamento da fase 1

1. Instalar o Docker Desktop e testar com um contêiner simples.
2. Criar o `docker-compose.yml` com a versão do n8n fixada e um volume para os dados.
3. Abrir o n8n em `localhost:5678` e criar a conta local.
4. Criar a chave no Google AI Studio e cadastrá-la nas credenciais do n8n.
5. Criar o repositório no GitHub, com `.gitignore` para chaves e arquivos locais.
6. Decidir o armazenamento da ficha com uma linha de teste.

### 2.2 Ciclo de ajuste do prompt (fase 4)

1. Rodar os 24 casos com o prompt v1 e salvar todas as respostas.
2. Agrupar os erros por tipo: categoria, urgência, campo inventado ou formato.
3. Mudar uma coisa por vez no prompt: instrução, definição de categoria ou exemplos.
   O resultado é o prompt v2, versionado em `prompts/`.
4. Rodar os 24 casos de novo, sem alterar o gabarito.
5. Comparar v1 e v2 nas métricas e manter a versão melhor. Os resultados vão para o
   [registro de testes](08-Registro-testes-software.md).

---

## 3. Justificativa das ferramentas gratuitas

O projeto precisa custar R$ 0 (RNF01). Cada ferramenta abaixo foi escolhida pelo custo e
pelo que ela entrega ao projeto. A tabela também registra as limitações conhecidas, para
que elas entrem no planejamento.

| Ferramenta | Por que foi escolhida | Alternativas descartadas | Custo e limite conhecido |
| ---------- | --------------------- | ------------------------ | ------------------------ |
| n8n Community (Docker) | Orquestra fluxos visuais e é a ferramenta citada na vaga. Roda local, sem limite de execuções | API própria em ASP.NET Core, que levaria semanas. n8n Cloud, que tem teste de 14 dias | Gratuito para self-hosting. Exige conhecimento de servidor e Docker; a documentação do n8n recomenda o Cloud para quem não tem essa experiência |
| Docker Desktop | Isola o n8n e fixa a versão por meio do `docker-compose.yml` | Instalação direta do n8n com `npx`, mantida como plano B | Gratuito para uso pessoal, educação e pequenas empresas (menos de 250 funcionários). Exige WSL 2.1.5 ou superior, Windows 11 23H2 (build 22631) ou superior e 8 GB de RAM |
| Node.js com `npx n8n` (plano B) | Sobe o n8n sem Docker, se o Docker travar na instalação | Não usado por padrão, para manter um ambiente único | Gratuito. Exige Node.js entre 20.19 e 24.x |
| Gemini API (Google AI Studio) | Extrai, classifica e redige a mensagem com saída em JSON por esquema | Modelos pagos, que aumentariam o custo acima de R$ 0 | Nível gratuito com limites de RPM, TPM e RPD por projeto. O contador diário zera à meia-noite do horário do Pacífico. Pelo termo do nível gratuito, o Google pode usar as requisições para melhorar produtos |
| Git e GitHub | Versiona fluxos, prompts, testes e relatórios, e publica o portfólio | Armazenamento só local, sem histórico público | Gratuito |
| Planilha ou CSV | Armazena as fichas e os resultados sem infraestrutura | Banco de dados próprio, fora do escopo | Gratuito |
| Gravador de tela | Produz o vídeo de demonstração de até 3 minutos | Capturas de tela estáticas, que não mostram o fluxo | Gratuito |

**Ponto de atenção:** o Docker Desktop e o n8n consomem memória. Antes de rodar a
fase 4, confirme a memória livre da máquina, porque a rodada de 24 casos com 3 execuções
cada gera carga contínua.

---

## 4. Riscos de cronograma

| Risco | Mitigação |
| ----- | --------- |
| Pouco tempo por causa de aulas e outras entregas | Priorizar RF01 a RF05 e os testes; a versão 2 só entra com folga |
| Limite do nível gratuito atrasa as rodadas | Rodar em lotes com pausa; salvar respostas; conferir limites no AI Studio |
| Instalação do Docker ou do n8n trava | Usar o plano B com `npx n8n` na fase 1, sem esperar a semana inteira |
| Gravar a ficha no n8n é mais difícil que o previsto | Decidir o armazenamento na fase 1, com uma linha de teste |

Os riscos técnicos completos estão na [arquitetura](06-Arquitetura-solucao.md), seção 6.
