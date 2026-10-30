# 08 — Registro de testes de software

## 1. Execuções em lote

Uma linha por lote. Um lote é a rodada completa dos 24 casos, com 3 execuções cada, que
gera 72 registros de execução.

| Data | Versão do prompt | Modelo | Temperatura | Commit | Execuções | Erros de API | Tempo médio (s) | Tempo máximo (s) | Observações |
| ---- | ---------------- | ------ | ----------- | ------ | --------- | ------------ | --------------- | ---------------- | ----------- |
| a registrar | v1 | a registrar | a registrar | a registrar | a medir | a medir | a medir | a medir | a medir |
| a registrar | v2 | a registrar | a registrar | a registrar | a medir | a medir | a medir | a medir | a medir |

---

## 2. Métricas por versão do prompt

As metas são as da seção 6 do plano de testes. A coluna "Atingiu" recebe "sim" ou
"não" na fase 4.

| Métrica | Meta v1 | v1 | v2 | Atingiu (v2) |
| ------- | ------- | -- | -- | ------------ |
| Validade do JSON | 100%, com até 2 novas tentativas | a medir | a medir | a medir |
| Acerto de categoria | 85% ou mais | a medir | a medir | a medir |
| Acerto de urgência | 80% ou mais | a medir | a medir | a medir |
| Urgência alta não perdida | 100% | a medir | a medir | a medir |
| Falsos alertas | 10% ou menos (a validar) | a medir | a medir | a medir |
| Ganho da regra de segurança | Informativo | a medir | a medir | não se aplica |
| Extração de modelo e ano | 90% ou mais | a medir | a medir | a medir |
| Decisão de perguntar | 100% | a medir | a medir | a medir |
| Invenção de dados | 0 | a medir | a medir | a medir |
| Consistência | 90% ou mais | a medir | a medir | a medir |
| Tempo por pedido | Até 15 s (a validar) | a medir | a medir | a medir |

---

## 3. Erros por tipo

Os erros de cada versão são agrupados pelo tipo definido no ciclo de ajuste.

| Tipo de erro | v1 (casos com erro) | v2 (casos com erro) | Casos afetados (IDs) |
| ------------ | ------------------- | ------------------- | -------------------- |
| Categoria | a medir | a medir | a medir |
| Urgência | a medir | a medir | a medir |
| Campo inventado | a medir | a medir | a medir |
| Formato | a medir | a medir | a medir |

---

## 4. Testes especiais

| ID | Teste | v1 | v2 | Observações |
| -- | ----- | -- | -- | ----------- |
| TE01 | Chave de API inválida (RF09) | a medir | a medir | a medir |
| TE02 | Resposta fora do esquema (RNF03) | a medir | a medir | a medir |
| TE03 | Categoria fora da lista (RF03) | a medir | a medir | a medir |
| TE04 | Falha seguida de nova tentativa sem duplicar (RF06) | a medir | a medir | a medir |

---

## 5. Mudança entre v1 e v2

Uma frase por mudança, na forma "categoria: de X% na v1 para Y% na v2". Inclua a mudança
feita no prompt, que deve ser uma só, e os erros que continuam depois da v2.

| Métrica | De (v1) | Para (v2) | Mudança feita no prompt |
| ------- | ------- | --------- | ----------------------- |
| a medir | a medir | a medir | a medir |

---

## 6. Conclusão da rodada

- **Versão mantida:** a registrar.
- **Metas atingidas:** a registrar.
- **Erros restantes e causa provável:** a registrar.
- **Próxima ação:** a registrar, ou "encerrar a fase 4" se as metas foram atingidas.
