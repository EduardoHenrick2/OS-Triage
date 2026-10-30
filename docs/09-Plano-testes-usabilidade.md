# 09 — Plano de testes de usabilidade

## 1. Objetivo

Verificar três coisas:

1. A atendente consegue enviar um relato sem ajuda, do formulário até a mensagem ao cliente.
2. A pergunta de esclarecimento, quando falta modelo ou descrição, é entendida na primeira
   leitura.
3. O tempo de espera entre o envio e o resultado não atrapalha o atendimento no balcão.

---

## 2. Participantes e papéis

Esta versão do plano usa o perfil de atendimento definido na [especificação](02-Especificacao.md), seção 2
como referência. As tarefas são executadas pelo desenvolvedor, que assume o papel de
atendente, seguindo o roteiro sem orientar a leitura das telas.

Um teste com uma atendente real de oficina é desejável, mas não está garantido na versão 1.
Se houver uma atendente disponível, ela executa as mesmas tarefas e os resultados são
registrados em [10-Registro-testes-usabilidade.md](10-Registro-testes-usabilidade.md).

---

## 3. Tarefas

| ID | Tarefa | Ponto de partida | Conclusão esperada |
| -- | ------ | ---------------- | ------------------ |
| T1 | Enviar o relato de um pedido completo | Abrir o formulário pelo endereço `triagem` | Ficha, mensagem ao cliente e aviso de urgência (quando houver) exibidos |
| T2 | Enviar um relato sem o modelo da moto | Abrir o formulário | Pergunta de esclarecimento exibida, nada gravado |
| T3 | Responder à pergunta com o relato completo | Tela de pergunta, link "Enviar relato completo" | Ficha gravada e exibida |
| T4 | Copiar a mensagem ao cliente | Tela de ficha | Mensagem copiada sem ajuste manual |
| T5 | Enviar o formulário vazio | Abrir o formulário | Campo obrigatório impede o envio, com aviso claro |

---

## 4. Critérios de aceitação

| Critério | Medida | Meta |
| -------- | ------ | ---- |
| Conclusão sem ajuda | Tarefas concluídas sem pedir orientação, sobre o total de tarefas | T1 a T5 todas concluídas |
| Clareza da pergunta | A pergunta de T2 é explicada com as palavras da própria atendente, na primeira leitura | Explicação correta na primeira leitura |
| Tempo total do pedido | Segundos entre o envio e a tela de resultado | Até 15 s (RNF04), registrado em [10](10-Registro-testes-usabilidade.md) |
| Erros de interface | Travamentos, telas em branco ou botões sem resposta | Nenhum |

---

## 5. Roteiro de observação

Para cada tarefa, anote:

- o que a atendente fez antes de clicar em enviar;
- se ela parou em algum ponto e por quê;
- se leu a mensagem ao cliente inteira antes de copiá-la;
- qualquer frase de dúvida sobre a pergunta de esclarecimento.

---

## 6. Checklist de heurísticas

Além das tarefas, avalie a tela com as heurísticas de usabilidade de Nielsen. Marque cada
item como "ok" ou "problema", com a tela afetada.

- [ ] O status do sistema é visível durante a espera (o formulário mostra que o envio foi feito).
- [ ] A linguagem da tela é a do atendimento, não a do desenvolvedor.
- [ ] Erros aparecem com texto claro, sem código técnico.
- [ ] Ações irreversíveis não existem na tela: nada é apagado pelo formulário.
- [ ] O caminho de volta para um novo relato está visível nas telas de resultado.
- [ ] A mensagem ao cliente pode ser copiada inteira com um clique ou seleção simples.

---

## 7. Limites deste teste

- Um ou dois participantes não representam a média de uma oficina. Os resultados servem
  para achar problemas de interface, não para medir satisfação.
- O teste não avalia a qualidade da mensagem gerada. Essa avaliação está no plano de testes
  de software ([07](07-Plano-testes-software.md)).
