# 05 — Template padrão para sub-fluxos

## 1. Como usar

1. Copie o bloco da seção 2 para um arquivo novo, nomeado `NN-nome-do-subfluxo.md`.
2. Preencha todas as seções. Se uma seção não se aplicar, escreva "Não se aplica" e o
   motivo, em vez de apagá-la.
3. Referencie os requisitos pelo ID (`RF01`, `RNF03`), sem copiar o texto do requisito.
4. Atualize o histórico de versões a cada mudança de comportamento.

---

## 2. Modelo em branco

```markdown
# NN — Nome do sub-fluxo

- **Identificador no n8n:** nome exato do fluxo ou sub-fluxo
- **Arquivo exportado:** `workflows/nome-do-arquivo.json`
- **Versão:** número da versão do documento
- **Data da última mudança:** DD/MM/AAAA

## 1. Propósito
Uma ou duas frases sobre o que o sub-fluxo faz e por que ele existe.

## 2. Entradas
| Campo | Tipo | Obrigatório | Exemplo fictício | Origem |
| ----- | ---- | ----------- | ---------------- | ------ |

## 3. Saídas
| Campo | Tipo | Descrição |
| ----- | ---- | --------- |

## 4. Regras aplicadas
Lista dos IDs de requisito e regras de negócio que o sub-fluxo implementa.

## 5. Erros e tratamentos
| Situação | Tratamento | Resultado |
| -------- | ---------- | --------- |

## 6. Dependências
Outros sub-fluxos, credenciais, planilhas ou APIs que este sub-fluxo usa.

## 7. Como testar
- Caso de teste de referência (ID do plano de testes)
- Critério de aprovação

## 8. Histórico de versões
| Versão | Data | Mudança |
| ------ | ---- | ------- |
```

---

## 3. Exemplo preenchido: núcleo de triagem

```markdown
# Núcleo de triagem

- **Identificador no n8n:** Núcleo de triagem
- **Arquivo exportado:** `workflows/nucleo-triagem.json`
- **Versão:** 1.0
- **Data da última mudança:** 30/10/2026

## 1. Propósito
Recebe um relato em texto livre, extrai a ficha com o Gemini, aplica as verificações
em código e devolve a ficha ou a pergunta de esclarecimento. É usado pelo fluxo do
atendimento e pelo fluxo de avaliação, sem diferença de comportamento entre eles.

## 2. Entradas
| Campo | Tipo | Obrigatório | Exemplo fictício | Origem |
| ----- | ---- | ----------- | ---------------- | ------ |
| `relato` | texto | Sim | "Honda CB 300 2017. O freio está mole." | Formulário ou fluxo de avaliação |
| `versao_prompt` | texto | Sim | `v1` | Parâmetro do fluxo chamador |
| `temperatura` | número | Sim | `0.2` | Parâmetro do fluxo chamador |

## 3. Saídas
| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| `ficha` | objeto JSON | Ficha no esquema da seção 2 do [arquitetura](06-Arquitetura-solucao.md) |
| `resultado` | texto | `gravada`, `pergunta` ou `falha_formato` |
| `resposta_bruta` | texto | Saída do Gemini antes das verificações |
| `tempo_s` | número | Tempo total do núcleo, em segundos |

## 4. Regras aplicadas
- RF02, RF03, RF04, RF05, RF11 e RNF08.
- Regra de palavras de risco (lista da [especificação](02-Especificacao.md), seção 6.5).

## 5. Erros e tratamentos
| Situação | Tratamento | Resultado |
| -------- | ---------- | --------- |
| JSON fora do esquema | Nova tentativa, até 2 vezes | `falha_formato` se persistir |
| Categoria fora da lista | Rejeitada em código; nova tentativa | `falha_formato` se persistir |
| Modelo ou descrição ausente | Monta a pergunta; não grava | `pergunta` |
| Limite ou tempo esgotado na API | Espera e nova tentativa | Erro de API repassado ao chamador |

## 6. Dependências
- Credencial do Gemini no n8n.
- Nenhuma planilha: a gravação é feita pelo fluxo chamador, nunca pelo núcleo.

## 7. Como testar
- Casos de referência: CT-01 (claro), CT-13 (informação faltando) e CT-23 (tenta mudar as
  regras), do [plano de testes](07-Plano-testes-software.md).
- Aprovação: a ficha de CT-01 confere com o gabarito; CT-13 devolve `pergunta`.

## 8. Histórico de versões
| Versão | Data | Mudança |
| ------ | ---- | ------- |
| 1.0 | 30/10/2026 | Primeira versão do núcleo |
```
