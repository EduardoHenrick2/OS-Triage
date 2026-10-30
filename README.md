# Triagem de ordens de serviço com LLM

Fluxo no n8n que recebe o relato de um cliente de oficina de motos em texto livre e devolve uma ficha
estruturada (moto, ano, sintomas, categoria, urgência, peças prováveis) e uma mensagem pronta para o cliente.
O LLM (Gemini) extrai e classifica; o código valida e decide as regras de negócio.

> **Só dados fictícios.** Nunca coloque nome, placa ou telefone de cliente real neste projeto.

## Status

- [ ] Fase 1: ambiente (Docker, n8n, chave do Gemini, armazenamento da ficha)
- [ ] Fase 2: núcleo de triagem
- [ ] Fase 3: registro e mensagem
- [ ] Fase 4: testes e ajuste do prompt
- [ ] Fase 5: README final, vídeo e currículo

## Como rodar (Windows 11)

### 1. Instalar o Docker Desktop

1. Baixe o Docker Desktop em https://www.docker.com/products/docker-desktop/ e instale, mantendo marcada a opção **Use WSL 2 instead of Hyper-V**.
2. Se o instalador pedir o WSL, abra o PowerShell **como administrador**, rode `wsl --install` e reinicie o computador.
3. Se aparecer erro de virtualização, ative **Intel VT-x** ou **AMD-V (SVM)** na BIOS/UEFI.
4. Abra o Docker Desktop e espere o ícone indicar que está rodando.
5. Confirme no PowerShell:

```powershell
docker --version
docker compose version
```

### 2. Subir o n8n

Na pasta do projeto:

```powershell
copy .env.example .env
docker compose up -d
```

Abra http://localhost:5678 e crie a conta de administrador local.

### 3. Cadastrar a chave do Gemini

1. Crie uma chave em https://aistudio.google.com/app/apikey (nível gratuito).
2. No n8n, vá em **Credentials**, crie uma credencial do Google Gemini e cole a chave.
3. A chave fica guardada dentro do n8n. Não a coloque em arquivos do repositório.

### 4. Fixar a versão do n8n

Em **Settings > About**, veja a versão instalada. Edite o `.env`, troque `N8N_VERSION=latest`
pela versão (por exemplo `N8N_VERSION=1.xx.x`) e rode `docker compose up -d` de novo.

### Comandos úteis

| Ação | Comando |
| --- | --- |
| Ver se está rodando | `docker compose ps` |
| Ver logs | `docker compose logs -f n8n` |
| Parar | `docker compose down` |
| Atualizar a imagem | `docker compose pull` e depois `docker compose up -d` |

**Atenção:** não use `docker compose down -v`. A opção `-v` apaga o volume com seus workflows e credenciais.

## Estrutura

```text
.
├── docker-compose.yml     n8n em Docker
├── .env.example           modelo de configuração (copie para .env)
├── data/                  arquivos gerados na execução (não vão para o GitHub)
├── prompts/               versões do prompt (v1, v2, ...)
├── tests/                 casos de teste com gabarito
└── workflows/             fluxos do n8n exportados em JSON
```

## Plano B sem Docker

Se o Docker travar, use Node.js entre as versões 20.19 e 24.x e rode `npx n8n`.
Os workflows podem ser exportados e importados em JSON, então nada se perde na troca.

## Próximos passos (evolução futura)

O mesmo núcleo, o prompt e os casos de teste podem virar uma API própria em ASP.NET Core,
sem refazer a avaliação.
