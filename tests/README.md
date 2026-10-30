# Conjunto de teste

Arquivo: `casos_teste.csv` (24 casos, todos **fictícios**).

## Colunas

| Coluna | Conteúdo |
| --- | --- |
| id | CT-01 a CT-24 |
| tipo | claro, varios_sintomas, info_faltando, bagunçado, ambiguo, injecao |
| relato | texto do atendente, como seria digitado |
| modelo_esperado | modelo da moto ou vazio, se o relato não traz |
| ano_esperado | ano ou vazio, se o relato não traz |
| categoria_esperada | uma das 8 categorias da documentação |
| urgencia_esperada | baixa, media ou alta |
| acao_esperada | gravar ou perguntar |

## Composição

| Tipo | Qtde |
| --- | --- |
| claro | 8 |
| varios_sintomas | 4 |
| info_faltando | 4 |
| bagunçado | 4 |
| ambiguo | 2 |
| injecao | 2 |

Pelo menos 4 casos devem ter urgência alta no gabarito (risco à segurança).

## Regras

1. Escreva o gabarito **antes** da primeira execução e não o altere para combinar com o resultado do LLM.
2. Nenhum caso entra como exemplo dentro do prompt.
3. Nunca use dado real de cliente: nada de nome, placa ou telefone verdadeiros.
