# OS Triage

Fluxo no n8n que transforma o relato de um cliente de oficina de motos em uma ficha de serviço. O Gemini extrai os dados, e regras em código validam o resultado.

## Destaques

- O Gemini extrai e classifica. O código valida o esquema, a categoria e os campos obrigatórios.
- Uma regra em código eleva a urgência para alta quando o relato cita palavra de risco.
- A ficha é gravada uma única vez, somente depois de todas as verificações.
- A precisão é medida com 24 casos de teste com gabarito, em versões comparadas do prompt.
- Custo zero: n8n Community em Docker e nível gratuito da Gemini API.

## Stack

| Camada | Ferramenta |
| ------ | ---------- |
| Orquestração | n8n, com versão fixada no `.env` |
| Execução | Docker Desktop com WSL 2 |
| LLM | Google Gemini, pela Gemini API |
| Validação | JavaScript em nós de código do n8n |
| Armazenamento | Planilha ou CSV, a decidir na fase 1 |

## Documentação

| Documento | Conteúdo |
| --------- | -------- |
| [01 Contexto](docs/01-Contexto.md) | Problema, objetivos e público-alvo |
| [02 Especificação](docs/02-Especificacao.md) | Personas, histórias de usuário, requisitos e regras |
| [03 Metodologia](docs/03-Metodologia.md) | Cronograma em cinco fases e escolha das ferramentas |
| [04 Projeto de interface](docs/04-Projeto-interface.md) | Formulário e formato da mensagem ao cliente |
| [05 Template padrão](docs/05-Template-padrao.md) | Modelo para documentar sub-fluxos |
| [06 Arquitetura da solução](docs/06-Arquitetura-solucao.md) | Comportamento do Gemini, validações e ambiente |
| [07 Plano de testes de software](docs/07-Plano-testes-software.md) | Cenários, gabarito dos 24 casos e métricas |
| [08 Registro de testes de software](docs/08-Registro-testes-software.md) | Comparação entre versões do prompt |
| [09 Plano de testes de usabilidade](docs/09-Plano-testes-usabilidade.md) | Tarefas e critérios para o formulário |
| [10 Registro de testes de usabilidade](docs/10-Registro-testes-usabilidade.md) | Tempo de resposta e erros de interface |
| [11 Referências](docs/11-Referencias.md) | Fontes oficiais consultadas |
| [12 Manual de instalação](docs/12-Manual-instalacao.md) | Passo a passo completo |

## Como rodar

1. Instale o Docker Desktop, conforme o [manual de instalação](docs/12-Manual-instalacao.md).
2. Copie o modelo de configuração: `copy .env.example .env`
3. Suba o n8n: `docker compose up -d`
4. Abra [http://localhost:5678](http://localhost:5678), crie a conta local e cadastre a chave
   do Gemini em **Credentials**.

## Estrutura

```text
.
├── docker-compose.yml   n8n em Docker, com versão e volume fixados
├── .env.example         modelo de configuração (copie para .env)
├── data/                fichas e resultados gerados (fora do GitHub)
├── docs/                documentação do projeto, em 12 arquivos numerados
├── prompts/             versões do prompt de extração (v1, v2...)
├── tests/               casos de teste com gabarito
└── workflows/           fluxos do n8n exportados em JSON
```

## Estado

- [ ] Fase 1: ambiente (Docker, n8n, chave do Gemini, armazenamento)
- [ ] Fase 2: núcleo de triagem
- [ ] Fase 3: registro e mensagem
- [ ] Fase 4: testes e ajuste do prompt
- [ ] Fase 5: README final, vídeo e currículo

## Privacidade

Todos os dados deste projeto são fictícios. A chave do Gemini fica nas credenciais do n8n e
nunca entra no repositório.
