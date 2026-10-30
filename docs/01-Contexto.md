# Contexto

## 1. Introdução

A oficina de motos recebe pedidos de serviço por balcão e telefone. O cliente descreve o
problema do jeito que fala, e o atendente transcreve essa descrição para uma ficha de
serviço. O projeto Triagem de Ordens de Serviço automatiza essa etapa: recebe o relato em
texto livre e devolve uma ficha estruturada, uma pergunta quando faltar informação e uma
mensagem para o cliente.

A extração e a classificação do texto são feitas pelo **Google Gemini**, acessado pela
Gemini API. As regras de negócio e as validações ficam em **código JavaScript**, executado
em nós de código do n8n. O fluxo inteiro roda em n8n, na máquina do desenvolvedor, com
dados fictícios.

Esse desenho separa duas responsabilidades:

> O Gemini interpreta o texto. O código garante as regras.

O modelo pode errar a classificação, mas não decide sozinho se uma ficha está completa,
se a urgência deve subir nem se a ficha pode ser gravada.

## 2. Problema

A triagem atual é manual, e isso causa três problemas.

| Situação atual | Problema | Consequência |
| -------------- | -------- | ------------ |
| O atendente transcreve o relato do jeito que o cliente conta | A informação chega incompleta ou ambígua ao mecânico | Retrabalho, perguntas de volta ao cliente e demora no orçamento |
| A urgência é avaliada na intuição | Um caso de risco, como freio fraco ou vazamento de óleo, pode passar como caso comum | Risco à segurança de quem pilota, o erro mais grave do domínio |
| A mensagem ao cliente é escrita do zero a cada vez | Consome tempo e produz tons diferentes | Atendimento mais lento e pouco padronizado |

A causa comum é a entrada sem estrutura. Sem campos mínimos, como modelo e problema,
cada pedido exige interpretação manual, e os casos graves dependem da atenção de quem
atende.

## 3. Objetivos

### 3.1 Objetivo geral

Entregar até 16/11/2026 um fluxo de triagem funcional, testado com 24 casos com gabarito,
com a precisão medida e documentada por versão do prompt.

### 3.2 Objetivos específicos

- **Estruturar a entrada.** Extrair do texto livre, em JSON válido, o modelo da moto, o
  ano, os sintomas, a categoria do serviço, a urgência e as peças prováveis.
- **Proteger os casos de risco.** Garantir, por regra em código, que um relato com palavra
  de risco nunca fique abaixo da urgência alta.
- **Separar IA e regra de negócio.** Restringir o Gemini à extração e à classificação, e
  manter as validações em código testável.
- **Medir a qualidade.** Comparar a saída do Gemini com o gabarito e registrar as métricas
  por versão do prompt (v1, v2).
- **Manter custo zero e reprodutibilidade.** Rodar com n8n Community em Docker e o nível
  gratuito da Gemini API, com fluxos e prompts versionados no repositório.

### 3.3 Objetivo de portfólio

O projeto também serve como peça de portfólio para o Programa de Estágio GenAI do iFood.
A documentação deve mostrar, com evidências, o aprendizado em:

- engenharia de prompt, com versões do prompt e uma mudança por vez;
- saída estruturada de LLM validada por código;
- medição objetiva de qualidade, com gabarito escrito antes da execução;
- automação com n8n e consumo de API de LLM.

As inscrições do programa vão até 17/11/2026, segundo o Seja Trainee. A data ainda precisa
ser confirmada na página oficial da vaga.

### 3.4 Entregáveis

- fluxos do n8n exportados em JSON;
- README com instalação e execução;
- vídeo de demonstração de até 3 minutos;
- relatório de testes com as métricas de precisão por versão do prompt.

## 4. Público-alvo

| Público | Relação com o sistema |
| ------- | --------------------- |
| Atendimento da oficina | Registra o pedido e recebe a ficha, a pergunta ou o aviso de urgência |
| Mecânicos | Consultam as fichas gravadas e filtram por urgência e categoria |
| Clientes da oficina | Recebem a mensagem enviada pelo atendimento. Não acessam o sistema |
| Desenvolvedor | Constrói, testa e mantém o fluxo, o prompt e o conjunto de teste |
| Avaliadores do portfólio | Leem a documentação e assistem ao vídeo para verificar a solução |

As personas que detalham esses públicos estão em [02-Especificacao.md](02-Especificacao.md).

## 5. Premissas e restrições

- O projeto custa R$ 0: n8n Community em Docker e nível gratuito da Gemini API.
- O nível gratuito limita requisições por minuto, por tokens e por dia. Os testes rodam em
  lotes com pausa.
- Somente dados fictícios entram no sistema.
- O envio da mensagem ao cliente é manual, feito pelo atendimento.
- Prazo: a entrega é 16/11/2026, e o prazo de ajuste de testes é 12/11/2026.
