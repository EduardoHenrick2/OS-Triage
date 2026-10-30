# OS Triage — Documentação

Esta pasta reúne a documentação de engenharia do projeto. Ela serve de guia técnico para
quem for reproduzir ou evoluir o fluxo e também é uma peça de portfólio, que mostra
engenharia de software e engenharia de prompt aplicadas a um LLM (Gemini) orquestrado em n8n.

> **Apenas dados fictícios.** Nenhum documento desta pasta deve conter nome, placa,
> telefone ou qualquer dado real de cliente.

## Índice de conteúdos

| # | Documento | Conteúdo | Status |
| - | --------- | -------- | ------ |
| 01 | [Contexto](01-Contexto.md) | Introdução, problema da oficina, objetivos e público-alvo | Escrito |
| 02 | [Especificação](02-Especificacao.md) | Modelo de negócio, personas, histórias de usuário, casos de uso técnicos, requisitos, restrições, regras, atores, trabalhos relacionados e conclusão | Escrito |
| 03 | [Metodologia](03-Metodologia.md) | Cronograma em cinco fases até 16/11/2026 e justificativa das ferramentas gratuitas | Escrito |
| 04 | [Projeto de interface](04-Projeto-interface.md) | Formulário do n8n usado pela atendente e formato da mensagem ao cliente | Escrito |
| 05 | [Template padrão](05-Template-padrao.md) | Modelo de documentação para cada sub-fluxo, com exemplo preenchido | Escrito |
| 06 | [Arquitetura da solução](06-Arquitetura-solucao.md) | Esquema JSON da ficha, divisão entre LLM e código, tecnologias, ambiente Docker e integração | Escrito |
| 07 | [Plano de testes de software](07-Plano-testes-software.md) | Escopo, ferramentas, cenários, gabarito dos 24 casos e métricas | Escrito |
| 08 | [Registro de testes de software](08-Registro-testes-software.md) | Tabela comparativa entre prompt v1 e v2 | Aguarda a fase 4 |
| 09 | [Plano de testes de usabilidade](09-Plano-testes-usabilidade.md) | Tarefas e critérios para o formulário de campo único | Plano pronto |
| 10 | [Registro de testes de usabilidade](10-Registro-testes-usabilidade.md) | Desempenho ponta a ponta (RNF04) e erros de interface | Aguarda a fase 4 |
| 11 | [Referências](11-Referencias.md) | Documentação oficial conferida e itens ainda não conferidos | Escrito |
| 12 | [Manual de instalação](12-Manual-instalacao.md) | Passo a passo com Docker, `.env` e primeiro teste | Escrito |

## Como ler esta documentação

1. **Contexto** e **Especificação** dizem o que o sistema faz e para quem.
2. **Metodologia**, **Interface** e **Arquitetura** dizem como ele é construído.
3. **Plano de testes** e **Registros** dizem como a qualidade é medida, com números.
4. **Manual de instalação** permite reproduzir o projeto na própria máquina.

## Convenções

- Cada requisito tem um identificador estável (`RF01`, `RNF01`, ...) usado em todos os
  documentos, para rastrear do contexto ao teste.
- Arquivos seguem o padrão `NN-Nome-do-documento.md`, com o número na ordem de leitura.
- Datas no formato `DD/MM/AAAA`; horários no fuso `America/Sao_Paulo`.
- Termos de domínio (categoria de serviço, nível de urgência, campo obrigatório) são
  definidos uma vez na especificação e apenas referenciados depois.
- Registros começam com campos "a medir" e são preenchidos durante a execução.

## Documentos relacionados fora desta pasta

- [README do projeto](../README.md): visão geral e comandos rápidos do ambiente.
- [Prompts](../prompts/README.md): regras de versionamento dos prompts.
- [Testes](../tests/README.md): conjunto de casos com gabarito.
