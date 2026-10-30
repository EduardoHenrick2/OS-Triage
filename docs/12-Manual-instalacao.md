# 12 — Manual de instalação

## 1. Pré-requisitos

| Requisito | Detalhe |
| --------- | ------- |
| Windows | Windows 11 23H2 (build 22631) ou superior, ou Windows 10 22H2 (build 19045) Pro, Enterprise ou Education |
| Memória | 8 GB de RAM, no mínimo. Feche outros programas pesados durante a rodada de testes |
| Virtualização | Ativada na BIOS/UEFI (Intel VT-x ou AMD-V, conforme o processador) |
| WSL 2 | Versão 2.1.5 ou superior |
| Docker Desktop | Versão atual, com o backend WSL 2 |
| Git | Para clonar o repositório |
| Conta Google | Para criar a chave do Gemini no Google AI Studio |

Para verificar a versão do WSL, rode no PowerShell:

```powershell
wsl --version
```

Se o comando não mostrar a versão, instale ou atualize o WSL como administrador:

```powershell
wsl --install
```

Reinicie o computador se o instalador pedir.

---

## 2. Instalar o Docker Desktop

1. Baixe o Docker Desktop em [docs.docker.com, instalação para Windows](https://docs.docker.com/desktop/setup/install/windows-install/).
2. Execute o instalador. Escolha o modo **por usuário**, que não exige administrador.
3. Na tela de configuração, selecione o backend **WSL 2**.
4. Abra o Docker Desktop e aguarde o ícone indicar que está em execução.
5. Confirme a instalação:

```powershell
docker --version
docker compose version
```

Se o Docker Desktop não iniciar, consulte a seção 6.

---

## 3. Clonar o repositório

Copie o endereço do repositório na página do projeto no GitHub e rode:

```powershell
git clone <endereço do repositório>
cd "OS Triage"
```

---

## 4. Configurar o ambiente

Copie o modelo de configuração:

```powershell
copy .env.example .env
```

O arquivo `.env` tem duas variáveis:

| Variável | Valor inicial | Função |
| -------- | ------------- | ------ |
| `N8N_VERSION` | `latest` | Versão da imagem do n8n. Fixe a versão depois do primeiro início (passo 6) |
| `TIMEZONE` | `America/Sao_Paulo` | Fuso horário do n8n |

O `.env` não vai para o GitHub. A chave do Gemini não fica nele.

---

## 5. Subir o n8n

```powershell
docker compose up -d
```

Abra [http://localhost:5678](http://localhost:5678) no navegador e crie a conta de
administrador local. O n8n responde apenas nesta máquina (`127.0.0.1`).

Para acompanhar os logs:

```powershell
docker compose logs -f n8n
```

---

## 6. Fixar a versão do n8n

1. No n8n, abra **Settings > About** e anote a versão.
2. Edite o `.env` e troque `N8N_VERSION=latest` pela versão anotada, por exemplo
   `N8N_VERSION=2.45.6`.
3. Reinicie o contêiner:

```powershell
docker compose up -d
```

A versão fixada garante que o fluxo continue funcionando depois de uma atualização do n8n
(RNF05).

---

## 7. Cadastrar a chave do Gemini

1. Crie a chave em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey),
   no nível gratuito.
2. No n8n, abra **Credentials**, crie uma credencial do tipo Google Gemini e cole a chave.
3. Salve. A chave fica guardada no volume do n8n, nunca em arquivo do repositório.

---

## 8. Importar os fluxos

Os fluxos estão em `workflows/`, exportados em JSON.

1. No n8n, abra o menu de importação e selecione o arquivo do núcleo de triagem.
2. Repita para o fluxo do atendimento e para o fluxo de avaliação.
3. Associe a credencial do Gemini a cada nó que chama o modelo.

Os arquivos de fluxo ainda estão sendo construídos na fase 2. Antes da fase 2 terminar,
esta seção só se aplica ao que já estiver exportado.

---

## 9. Primeiro teste

1. Abra o formulário de triagem pelo Test URL do nó Form Trigger, no n8n.
2. Envie um relato fictício, por exemplo: "Honda CB 300 2017. O freio está mole."
3. Confirme que a ficha aparece, com urgência `alta`, e que a mensagem ao cliente tem até
   60 palavras.
4. Confira a linha gravada na planilha ou no CSV de fichas.

---

## 10. Comandos úteis

| Ação | Comando |
| ---- | ------- |
| Ver se o contêiner está em execução | `docker compose ps` |
| Ver os logs do n8n | `docker compose logs -f n8n` |
| Parar o n8n | `docker compose down` |
| Atualizar a imagem | `docker compose pull`, depois `docker compose up -d` |

**Atenção:** não use `docker compose down -v`. A opção `-v` apaga o volume com os
workflows e as credenciais.

---

## 11. Arquivo de referência: `docker-compose.yml`

O arquivo abaixo é o que está no repositório. Os valores vêm do `.env`, por isso não é preciso editá-lo.

```yaml
# Serviço n8n do projeto OS Triage.
# Lê N8N_VERSION e TIMEZONE do arquivo .env desta pasta (o Compose faz isso sozinho).
# Subir:  docker compose up -d        Parar:  docker compose down
# NUNCA use "docker compose down -v": ele apaga o volume os_triage_n8n_data,
# que guarda workflows e as credenciais do Gemini.

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:${N8N_VERSION:?Defina N8N_VERSION no arquivo .env}
    container_name: os_triage_n8n
    restart: unless-stopped
    ports:
      # Publicado somente em localhost. Não fica acessível pela rede.
      - "127.0.0.1:5678:5678"
    environment:
      - GENERIC_TIMEZONE=${TIMEZONE:?Defina TIMEZONE no arquivo .env}
      - TZ=${TIMEZONE}
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
    volumes:
      # Workflows, credenciais criptografadas e a chave de criptografia do n8n.
      - n8n_data:/home/node/.n8n
      # Fichas e resultados dos testes, visíveis na pasta data/ do projeto.
      # O caminho dentro do contêiner ainda precisa ser confirmado na Fase 1.
      - ./data:/home/node/.n8n-files

volumes:
  n8n_data:
    name: os_triage_n8n_data
```

**Observações sobre o arquivo:**

- A imagem usa a tag definida em `N8N_VERSION`. A tag `2.45.6` foi conferida no Docker Hub.
- `N8N_RUNNERS_ENABLED` foi removida. A documentação do n8n a considera obsoleta a partir da versão 2.0.
- O volume `os_triage_n8n_data` guarda workflows e credenciais. `docker compose down` não o apaga.
- O caminho `/home/node/.n8n-files` ainda precisa ser confirmado na fase 1.

---

## 12. Solução de problemas

| Sintoma | Causa provável | O que fazer |
| ------- | -------------- | ----------- |
| `docker` não é reconhecido | Docker Desktop não foi iniciado | Abra o Docker Desktop e aguarde o ícone |
| Docker Desktop não inicia | WSL 2 desatualizado ou virtualização desligada | Atualize o WSL (`wsl --install`) e ative a virtualização na BIOS/UEFI |
| `localhost:5678` não abre | Contêiner parado ou porta em uso | Rode `docker compose ps`; se a porta estiver ocupada, feche o programa que a usa |
| Docker trava na instalação | Problema de ambiente | Use o plano B: Node.js entre 20.19 e 24.x e `npx n8n`, conforme o [projeto de arquitetura](06-Arquitetura-solucao.md), seção 4.3 |
| Erro de chave inválida no Gemini | Chave copiada com espaço ou removida | Recrie a credencial no n8n |
| Erro de limite (429) | Limite do nível gratuito atingido | Espere o próximo minuto ou o reset diário; rode os testes em lotes com pausa |
