# 04 — Projeto de interface

## 1. Visão geral

A interface é o formulário web que o nó **n8n Form Trigger** gera automaticamente. O
projeto não tem interface própria (fora do escopo da versão 1). O perfil de atendimento definido em 02
acessa o formulário pelo navegador, na própria máquina, em `localhost:5678`.

Há três telas em sequência:

1. **Formulário de entrada:** um único campo para o relato.
2. **Resultado com ficha:** a ficha, o aviso de urgência alta (se houver) e a mensagem
   ao cliente.
3. **Resultado com pergunta:** a pergunta de esclarecimento e um link para enviar um
   novo relato.

---

## 2. Formulário de entrada

O formulário tem um único campo, obrigatório, conforme RNF06.

| Configuração | Valor | Motivo |
| ------------ | ----- | ------ |
| Form Title | Triagem de ordem de serviço | Título exibido na página e na aba do navegador |
| Form Description | Descreva o problema com as palavras do cliente. Não digite nome, placa nem telefone. | Reforça RNF02 na própria tela |
| Campo: Field Label | Relato do cliente | Rótulo acima do campo |
| Campo: Field Name | `relato` | Nome usado pelos nós seguintes do fluxo |
| Campo: Element Type | Textarea | Permite texto de vários parágrafos |
| Campo: Required Field | Ligado | Impede envio vazio (RF01) |
| Campo: Placeholder | Ex.: "a moto faz barulho na corrente quando acelera" | Mostra o tipo de texto esperado, sem dado real |
| Button Label | Enviar relato | Nome do botão de envio |
| Form Path (opções do nó) | `triagem` | Endereço curto e legível, em vez do UUID gerado |
| Ignore Bots (opções do nó) | Ligado | Evita que um link preview dispare uma execução |
| Respond When | Workflow Finishes | Se o fluxo falhar, a atendente vê a mensagem de erro, em vez de uma tela em branco (RF09) |

**Regras de validação na entrada:** o campo não pode ficar vazio. A validação de conteúdo
(modelo, descrição, risco) acontece no núcleo de triagem, em código, depois do envio. A
tela de entrada não tenta validar o conteúdo.

**Autenticação:** a versão 1 não usa login. O n8n responde só em `127.0.0.1`, por
configuração do `docker-compose.yml`, então o formulário não fica acessível pela rede.

### 2.1 Endereços de teste e produção

O nó tem dois endereços.

- **Test URL:** usado durante a construção. Ao usá-lo, os dados enviados aparecem no
  editor do n8n, o que ajuda na depuração.
- **Production URL:** usado no uso real, com o fluxo publicado. Os dados enviados por esse
  endereço não aparecem no editor. Para consultá-los, use a aba **Executions**.

Use o Test URL na fase 2 e na fase 3. Use o Production URL na fase 5, na gravação do
vídeo.

---

## 3. Tela de resultado com ficha

A tela de resultado é uma segunda página do formulário, criada com o nó Form (o n8n
permite adicionar páginas ao formulário). Ela mostra quatro blocos, nesta ordem.

| Bloco | Conteúdo | Quando aparece |
| ----- | -------- | -------------- |
| Ficha | Tabela com modelo, ano, sintomas, categoria, urgência final e peças prováveis | Sempre que a ficha for gravada |
| Aviso de urgência | Texto destacado: "Urgência alta: avise o mecânico antes de atender o próximo pedido." | Somente quando a urgência final for `alta` (HU04) |
| Mensagem ao cliente | Texto pronto para copiar e enviar pelo aplicativo de mensagens | Sempre que a ficha for gravada |
| Link de registro | "Gravado com sucesso. Novo relato" | Sempre |

**Como exibir a ficha:** o bloco usa o nó Form com elemento do tipo **Custom HTML**.
A documentação do n8n permite estas tags de formatação: `<b>`, `<br>`, `<table>`,
`<tr>`, `<td>`, `<th>`, `<ul>`, `<li>`, `<p>`, `<h1>` a `<h6>`, `<a>` e `<div>`. Tags
como `<script>`, `<style>`, `<input>` e `<form>` são removidas automaticamente.

**Quebras de linha:** o texto da resposta não aceita quebra de linha comum. Use `<br>` ou
HTML formatado, conforme a documentação do nó.

---

## 4. Tela de resultado com pergunta

Quando faltar modelo ou descrição do problema (RF05), a ficha não é gravada. A tela
mostra:

- a pergunta de esclarecimento, vinda do campo `pergunta_ao_atendente`;
- a lista de campos que faltam, vinda do campo `campos_faltando`;
- um link **Enviar relato completo**, que abre o Form Path `triagem` de novo.

**Exemplo de tela:**

> **Não gravado.** Falta informação para registrar o pedido.
> Pergunta: Qual é o modelo da moto?
> [Enviar relato completo]

Ao reenviar, a atendente escreve o relato completo, e não apenas o dado que faltava. Assim,
o núcleo recebe o texto inteiro, sem depender de memória entre execuções.

---

## 5. Formato da mensagem ao cliente

A mensagem é gerada pelo Gemini e conferida em código antes de aparecer na tela (RF07).

### 5.1 Regras

- Português do Brasil, em tom cordial e direto.
- Até **60 palavras**. O código conta as palavras e refaz a geração se passar do limite.
- Cita a moto (modelo e ano, quando houver) e o serviço (categoria).
- Não promete preço nem prazo. O orçamento é enviado depois, pelo atendente.
- Não repete o relato do cliente literalmente e não inclui dados pessoais.
- Quando a urgência for alta, orienta o cliente a não usar a moto até a avaliação do
  mecânico.
- Assinatura fixa: **Equipe de atendimento**.

### 5.2 Estrutura

1. Recebimento do pedido, com o modelo da moto.
2. Serviço indicado, com a categoria em linguagem simples.
3. Próximo passo: orçamento a seguir, ou orientação de segurança quando a urgência for
   alta.
4. Assinatura.

### 5.3 Exemplo

> Olá! Recebemos o pedido para a sua Honda CB 300, ano 2017. O serviço indicado é a
> verificação do sistema de freios. Como o caso envolve segurança, recomendamos não usar a
> moto até a avaliação do mecânico. Em breve enviaremos o orçamento.
> Equipe de atendimento

Esse exemplo tem 45 palavras, dentro do limite de 60.

---

## 6. Mapa de telas e campos

| Tela | Campo ou bloco | Origem na ficha | Requisito |
| ---- | -------------- | --------------- | --------- |
| Entrada | Relato | Texto digitado | RF01 |
| Resultado com ficha | Modelo | `modelo_moto` | RF02 |
| Resultado com ficha | Ano | `ano` | RF02 |
| Resultado com ficha | Sintomas | `sintomas` | RF02 |
| Resultado com ficha | Categoria | `categoria` | RF03 |
| Resultado com ficha | Urgência final | `urgencia_final` | RF04 |
| Resultado com ficha | Peças prováveis | `pecas_provaveis` | RF02 |
| Resultado com ficha | Aviso de urgência | `urgencia_final` igual a `alta` | RF04 |
| Resultado com ficha | Mensagem ao cliente | Saída de redação do Gemini | RF07 |
| Resultado com pergunta | Pergunta | `pergunta_ao_atendente` | RF05 |
| Resultado com pergunta | Campos faltando | `campos_faltando` | RF05 |
| Erro | Mensagem de falha da API | Nó de tratamento de erro | RF09 |

---

## 7. Limitações da interface

- A tela não mostra o histórico de pedidos. A consulta é feita na planilha (UC02).
- O formulário não aceita anexos, fotos nem áudio.
- Sem login, qualquer pessoa com acesso à máquina pode enviar um relato. Por isso, o
  projeto usa só dados fictícios.
- A aparência é a padrão do n8n, com ajuste limitado. O campo "Custom Form Styling" do nó
  permite trocar o CSS, mas isso fica fora da versão 1.
