# 11 — Referências

## 1. Documentação oficial conferida

| Tema | Fonte | Link | Usado em |
| ---- | ----- | ---- | -------- |
| Formulário do n8n | Documentação do nó n8n Form Trigger | [docs.n8n.io, nó Form Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger/) | [04 — Projeto de interface](04-Projeto-interface.md) |
| Instalação do n8n com Docker | Documentação de hospedagem do n8n | [docs.n8n.io, instalação com Docker](https://docs.n8n.io/hosting/installation/docker/) | [12 — Manual de instalação](12-Manual-instalacao.md), [06 — Arquitetura](06-Arquitetura-solucao.md) |
| Saída estruturada do Gemini | Documentação oficial da Gemini API | [ai.google.dev, structured outputs](https://ai.google.dev/gemini-api/docs/structured-output) | [06 — Arquitetura](06-Arquitetura-solucao.md), seção 2 |
| Limites de uso do Gemini | Documentação oficial da Gemini API | [ai.google.dev, rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) | [02 — Especificação](02-Especificacao.md), seção 5.3; [03 — Metodologia](03-Metodologia.md) |
| Instalação do Docker Desktop no Windows | Documentação oficial do Docker | [docs.docker.com, Docker Desktop para Windows](https://docs.docker.com/desktop/setup/install/windows-install/) | [12 — Manual de instalação](12-Manual-instalacao.md), [03 — Metodologia](03-Metodologia.md) |

### 1.1 Pontos extraídos das fontes

- **Formulário do n8n:** o nó Form Trigger tem Test URL e Production URL. Dados enviados
  pela Production URL não aparecem no editor; é preciso consultar a aba Executions. O nó
  aceita o tipo de campo Textarea e a opção de campo obrigatório. A resposta do formulário
  só aceita quebra de linha em HTML (`<br>`). O campo Respond When com a opção Workflow
  Finishes mostra uma mensagem se o fluxo falhar.
- **n8n em Docker:** a documentação do n8n recomenda Docker para a maioria das instalações
  e indica o uso de `N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true`. A variável
  `N8N_RUNNERS_ENABLED` é obsoleta a partir do n8n 2.0 e não é mais necessária. No
  momento da consulta, a versão estável indicada era a 2.45.6.
- **Gemini, saída estruturada:** a API aceita um JSON Schema para forçar a saída. Isso
  reduz, mas não elimina, a necessidade de validação em código, que o projeto mantém.
- **Gemini, limites:** os limites são por projeto, não por chave. Os contadores de RPM,
  TPM e RPD são independentes. O RPD zera à meia-noite do horário do Pacífico. O nível
  gratuito não tem limite de gasto em dinheiro, mas tem limites de requisições.
- **Docker Desktop:** o instalador pede o modo de instalação (por usuário ou para todos).
  O backend WSL 2 exige WSL 2.1.5 ou superior. Para Windows 11, a versão mínima é 23H2
  (build 22631). A documentação indica 8 GB de RAM.

---

## 2. Referências de uso e de conferência

| Tema | Fonte | Situação |
| ---- | ----- | -------- |
| Acesso à chave do Gemini | Página do Google AI Studio, citada no [README do repositório](../README.md) | Link do README, não reconferido na data desta consulta |
| Guia de engenharia de prompt do Gemini | Documentação de prompt do Google | Não consultada nesta versão; entra quando o ciclo de ajuste da fase 4 começar |

---

## 3. Itens do documento base ainda não conferidos

Estes dados vêm do documento base do projeto e precisam ser conferidos na fonte oficial
antes da entrega:

- Data limite de inscrição no programa GenAI do iFood (17/11/2026), segundo o Seja Trainee.
- Faixa de versões do Node.js para o plano B (entre 20.19 e 24.x).
- Aviso do n8n de que instalações via npm ficam obsoletas a partir da versão 3.0.
- Regra do nível gratuito sobre o uso das requisições para melhorar produtos do Google.
