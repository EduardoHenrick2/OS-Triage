# Workflows do n8n

Os três fluxos do projeto são exportados para cá em formato JSON:

| Arquivo (a criar) | Fluxo |
| --- | --- |
| `nucleo-triagem.json` | Núcleo: monta o prompt, chama o Gemini, valida em código e aplica a regra de urgência |
| `fluxo-atendente.json` | Formulário, núcleo, gravação da ficha e mensagem ao cliente |
| `fluxo-avaliacao.json` | Roda os 24 casos 3 vezes e calcula as métricas |

## Como exportar

No n8n, abra o workflow, clique no menu (três pontos) e escolha **Download**. Salve o arquivo aqui.

## Antes de fazer commit

Confira se o JSON não contém chave de API. As credenciais do n8n ficam fora do arquivo exportado,
mas vale abrir o arquivo e procurar por "key" ou "token" antes de publicar.
