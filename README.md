# 🚀 Flash API SDK

SDK JavaScript oficial da Flash API - Multi-sessão WhatsApp

[![Node.js](https://img.shields.io/badge/Node.js->=18-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![npm version](https://img.shields.io/npm/v/flash-api-sdk?style=for-the-badge)](https://www.npmjs.com/package/flash-api-sdk)

Este pacote é um **cliente JavaScript** para consumir a [Flash API](https://github.com/clsshbr2/FlashApi), uma API REST multi-sessão para WhatsApp construída sobre o Baileys. O SDK cuida de autenticação, retries, tratamento de erros e conexão WebSocket, para que você só precise chamar métodos como `client.chat.sendText(...)`.

> ⚠️ Este SDK não é afiliado, endossado ou de qualquer forma oficialmente conectado ao WhatsApp Inc./Meta.

## 📋 Sumário

- [Características](#-características)
- [Instalação](#-instalação)
- [Início Rápido](#-início-rápido)
- [Autenticação](#-autenticação)
- [Recursos](#-recursos)
- [Exemplos](#-exemplos)
- [WebSocket](#-websocket)
- [Tratamento de Erros](#-tratamento-de-erros)
- [API Reference](#-api-reference)
- [FAQ](#-faq)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## ✨ Características

- ✅ **100% JavaScript** - Sem TypeScript, sem compilação (mas com `.d.ts` incluso para autocompletar)
- ✅ **Node.js >= 18** - Compatível com CommonJS e ESM
- ✅ **Multi-sessão** - Múltiplas instâncias do WhatsApp
- ✅ **WebSocket** - Eventos em tempo real
- ✅ **Retry automático** - Com backoff exponencial
- ✅ **HTTP Client** - Wrapper moderno com interceptadores
- ✅ **Validação** - Parâmetros obrigatórios verificados
- ✅ **Tratamento de erros** - Classes de erro customizadas
- ✅ **TypeScript definitions** - Autocompletar em IDEs

## 📦 Instalação

### npm

```bash
npm install flash-api-sdk
```

### yarn

```bash
yarn add flash-api-sdk
```

Você também precisa de uma instância da [Flash API](https://github.com/clsshbr2/FlashApi) rodando (local, VPS ou Docker) e de uma `apikey` de sessão já criada.

## ⚡ Início Rápido

```javascript
import FlashApi from "flash-api-sdk";

const client = new FlashApi({
  baseUrl: "http://localhost:3000",
  apiKey: "apikey-da-sua-sessao",
});

// Enviar mensagem de texto
await client.chat.sendText({
  jid: "5511999999999@s.whatsapp.net",
  text: "Olá mundo! 🚀",
});
```

## 🔑 Autenticação

A Flash API usa dois níveis de chave, ambos enviados via header `apikey`:

| Chave              | Uso                                                                  | Escopo     | Config do SDK  |
| ------------------ | --------------------------------------------------------------------- | ---------- | -------------- |
| `GLOBAL_API_KEY`   | `session.create/list/health/delete` e `system.status/config`          | Global     | `globalApiKey` |
| `apikey` da sessão | Demais rotas: chat, contact, group, config e `session.connect/status/…` | Por sessão | `apiKey`       |

Como as duas chaves podem ser necessárias ao mesmo tempo (ex: criar uma sessão e em seguida enviar mensagens por ela), o SDK aceita as duas simultaneamente e escolhe a correta automaticamente por método:

```javascript
const client = new FlashApi({
  baseUrl: "http://localhost:3000",
  apiKey: "apikey-da-sessao", // usada nas rotas de sessão/chat/contact/group/config
  globalApiKey: "SEU_GLOBAL_API_KEY", // usada apenas nas rotas administrativas
});

// Trocar as chaves em tempo de execução
client.setApiKey("nova-apikey-de-sessao");
client.setGlobalApiKey("nova-global-api-key");

// Trocar a URL base
client.setBaseUrl("https://minha-flash-api.com");
```

## 🧩 Recursos

O cliente `FlashApi` expõe um resource para cada grupo de rotas da API:

| Resource         | Descrição                                                           |
| ---------------- | ------------------------------------------------------------------- |
| `client.session` | Ciclo de vida das sessões (criar, conectar, status, deletar…)       |
| `client.chat`    | Envio de mensagens e leitura de conversas                           |
| `client.contact` | Contatos: listar, checar número, bloquear, converter LID            |
| `client.group`   | Grupos: criar, administrar participantes, convites                  |
| `client.config`  | Configurações da sessão (webhook, proxy, leitura automática…)       |
| `client.system`  | Status e configurações globais do sistema (requer `GLOBAL_API_KEY`) |

## 💡 Exemplos

### Criar e conectar uma sessão

```javascript
import FlashApi from "flash-api-sdk";

const client = new FlashApi({
  baseUrl: "http://localhost:3000",
  globalApiKey: "SEU_GLOBAL_API_KEY", // usada apenas em session.create/list/health/delete e system.*
});

// 1. Criar a sessão (retorna a apikey da nova sessão)
const { data } = await client.session.create({
  nome_sessao: "atendimento_vendas",
  leitura_automatica: false,
  rejeitar_ligacoes: true,
  ignorar_grupos: true,
  events: ["message_received", "connection_update"],
});

// 2. Trocar para a apikey da sessão recém-criada (demais rotas usam essa chave)
client.setApiKey(data.apikey);

// 3. Conectar (gera QR Code, ou informe phoneNumber para pairing via código)
const conexao = await client.session.connect();
console.log(conexao);
```

### Enviar mensagem de texto

```javascript
await client.chat.sendText({
  jid: "5511999999999@s.whatsapp.net",
  text: "Olá! Esta é uma mensagem enviada pela Flash API 🚀",
});
```

### Enviar imagem por URL

```javascript
await client.chat.sendImage({
  jid: "5511999999999@s.whatsapp.net",
  image: "https://exemplo.com/imagem.jpg",
  caption: "Confira nossa novidade!",
});
```

### Enviar áudio, documento e localização

```javascript
await client.chat.sendAudio({
  jid: "5511999999999@s.whatsapp.net",
  audio: "https://exemplo.com/audio.mp3",
});

await client.chat.sendDocument({
  jid: "5511999999999@s.whatsapp.net",
  document: "https://exemplo.com/contrato.pdf",
  fileName: "contrato.pdf",
});

await client.chat.sendLocation({
  jid: "5511999999999@s.whatsapp.net",
  location: {
    degreesLatitude: -22.9068,
    degreesLongitude: -43.1729,
  },
});
```

### Enquete, lista e botões

```javascript
await client.chat.sendPoll({
  jid: "5511999999999@s.whatsapp.net",
  poll: {
    name: "Qual seu horário preferido?",
    values: ["Manhã", "Tarde", "Noite"],
    selectableCount: 1,
  },
});

await client.chat.sendButtons({
  jid: "5511999999999@s.whatsapp.net",
  text: "Escolha uma opção:",
  buttons: [
    { buttonId: "op1", buttonText: { displayText: "Falar com atendente" } },
    { buttonId: "op2", buttonText: { displayText: "Ver catálogo" } },
  ],
});
```

### Gerenciar grupos

```javascript
const grupo = await client.group.create({
  subject: "Time de Vendas",
  participants: ["5511999999999@s.whatsapp.net"],
});

await client.group.updateParticipants({
  groupJid: grupo.data.groupJid,
  participants: ["5511988888888@s.whatsapp.net"],
  action: "add",
});

const invite = await client.group.getInviteLink(grupo.data.groupJid);
console.log(invite.data.inviteLink);
```

### Configurar webhook da sessão

```javascript
await client.config.updateWebhook({
  webhookUrl: "https://meu-servidor.com/webhook",
  events: ["messages_upsert", "connection_update"],
  status_webhook: true,
});
```

## 🔌 WebSocket

Além dos webhooks HTTP, o SDK oferece um cliente WebSocket embutido com reconexão automática e fila de mensagens:

```javascript
import FlashApi from "flash-api-sdk";

const client = new FlashApi({
  baseUrl: "http://localhost:3000",
  apiKey: "apikey-da-sessao",
  wsUrl: "ws://localhost:3000/ws",
  wsSecret: "SEU_GLOBAL_WEBSOCKET_SECRET", // opcional, se o servidor exigir
});

await client.connect();

client.on("messages_upsert", (data) => {
  console.log("Nova mensagem recebida:", data);
});

client.on("connection_update", (data) => {
  console.log("Status da conexão mudou:", data);
});

client.on("error", (error) => {
  console.error("Erro no WebSocket:", error);
});

// Para encerrar
client.disconnect();
```

Principais eventos disponíveis: `connection_update`, `qr_updated`, `creds_update`, `messages_upsert`, `messages_update`, `messages_delete`, `messages_reaction`, `message_receipt_update`, `chats_upsert`, `chats_update`, `chats_delete`, `contacts_upsert`, `contacts_update`, `groups_upsert`, `groups_update`, `group_participants_update`, `presence_update`, `call`, `labels_edit`, `blocklist_update`, entre outros — de acordo com o que a sua sessão está configurada para emitir.

## 🧯 Tratamento de Erros

Todas as chamadas HTTP rejeitam com uma subclasse de `FlashApiError`, mapeada de acordo com o status HTTP retornado pela API:

| Classe                | Quando ocorre                              |
| --------------------- | ------------------------------------------ |
| `AuthenticationError` | HTTP 401/403 — apikey inválida ou ausente  |
| `ValidationError`     | HTTP 400 — parâmetros inválidos            |
| `NotFoundError`       | HTTP 404 — recurso não encontrado          |
| `RateLimitError`      | HTTP 429 — limite de requisições excedido  |
| `InternalServerError` | HTTP 5xx — erro interno da API             |
| `TimeoutError`        | Requisição excedeu o tempo limite          |
| `WebSocketError`      | Falha de conexão/autenticação no WebSocket |

```javascript
import FlashApi, { AuthenticationError, ValidationError, RateLimitError } from "flash-api-sdk";

const client = new FlashApi({ apiKey: "apikey-invalida" });

try {
  await client.chat.sendText({ jid: "5511999999999@s.whatsapp.net", text: "oi" });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Chave de API inválida:", error.message);
  } else if (error instanceof ValidationError) {
    console.error("Parâmetros inválidos:", error.data);
  } else if (error instanceof RateLimitError) {
    console.error(`Limite excedido, tente novamente em ${error.retryAfter}s`);
  } else {
    console.error(error.toString());
  }
}
```

Requisições que falham por timeout ou erro de servidor (5xx) são automaticamente reenviadas com backoff exponencial, respeitando a opção `retries` do cliente. Erros de autenticação, validação e "não encontrado" **não** são reenviados.

## 📖 API Reference

> Todas as chamadas retornam uma `Promise` que resolve com o corpo da resposta da API (`{ success, message, data }`) ou rejeita com um erro de `flash-api-sdk`.

### `client.session`

| Método                    | Endpoint                       | Auth    |
| ------------------------- | ------------------------------ | ------- |
| `create(data)`            | `POST /session/create_sessao`  | Global  |
| `connect(data?)`          | `PUT /session/conectar_sessao` | Sessão  |
| `status()`                | `GET /session/status`          | Sessão  |
| `restart()`               | `PUT /session/restart`         | Sessão  |
| `getAvatar(apiKey)`       | `GET /session/avatar/:apiKey`  | Pública |
| `injectCredentials(data)` | `POST /session/creds`          | Sessão  |
| `list()`                  | `GET /session/list`            | Global  |
| `health()`                | `GET /session/health`          | Global  |
| `delete(sessionId)`       | `DELETE /session/delete/:id`   | Global  |
| `disconnect()`            | `DELETE /session/desconect`    | Sessão  |

### `client.chat`

| Método                         | Endpoint                             | Descrição                         |
| ------------------------------ | ------------------------------------ | --------------------------------- |
| `sendText(data)`               | `POST /chat/send-text`               | Envia texto                       |
| `sendImage(data)`              | `POST /chat/send-image`              | Envia imagem                      |
| `sendVideo(data)`              | `POST /chat/send-video`              | Envia vídeo                       |
| `sendAudio(data)`              | `POST /chat/send-audio`              | Envia áudio (convertido p/ Opus)  |
| `sendDocument(data)`           | `POST /chat/send-document`           | Envia documento                   |
| `sendLocation(data)`           | `POST /chat/send-location`           | Envia localização                 |
| `sendContact(data)`            | `POST /chat/send-contact`            | Envia vCard                       |
| `sendSticker(data)`            | `POST /chat/send-sticker`            | Envia figurinha                   |
| `sendReaction(data)`           | `POST /chat/send-reaction`           | Reage a uma mensagem              |
| `sendPoll(data)`               | `POST /chat/send-poll`               | Cria enquete                      |
| `sendList(data)`               | `POST /chat/send-list`               | Envia lista de opções             |
| `sendButtons(data)`            | `POST /chat/send-buttons`            | Envia botões                      |
| `sendInteractiveMessage(data)` | `POST /chat/send-interactiveMessage` | Mensagem interativa               |
| `sendCarouselMessage(data)`    | `POST /chat/send-carouselMessage`    | Carrossel de cards                |
| `typing(data)`                 | `POST /chat/typing`                  | "Digitando…" / "Gravando áudio…"  |
| `markRead(data)`               | `POST /chat/mark-read`               | Marca mensagens como lidas        |
| `getMessages(params?)`         | `GET /chat/messages`                 | Lista mensagens de uma conversa   |
| `getChats(params?)`            | `GET /chat/chats`                    | Lista conversas da sessão (page, limit, search) |
| `deleteMessage(idMessage)`     | `DELETE /chat/delete/:id_message`    | Apaga uma mensagem                |
| `mediaToBase64(data)`          | `POST /chat/midiaToBase64`           | Converte mídia recebida em base64 |

### `client.contact`

| Método                   | Endpoint                           |
| ------------------------ | ---------------------------------- |
| `list()`                 | `GET /contact/list`                |
| `getAvatar(apiKey, jid)` | `GET /contact/avatar/:apiKey/:jid` |
| `check(data)`            | `POST /contact/check`              |
| `block(data)`            | `POST /contact/block`              |
| `lidToJid(data)`         | `POST /contact/lid-to-jid`         |

### `client.group`

| Método                       | Endpoint                                    |
| ---------------------------- | ------------------------------------------- |
| `list()`                     | `GET /group/list`                           |
| `info(data)`                 | `POST /group/info`                          |
| `create(data)`               | `POST /group/create`                        |
| `updateDescription(data)`    | `POST /group/update-description`            |
| `updateSubject(data)`        | `POST /group/update-subject`                |
| `updateParticipants(data)`   | `POST /group/ParticipantsUpdate`            |
| `leave(data)`                | `POST /group/leave`                         |
| `updateSettings(data)`       | `POST /group/up-setting`                    |
| `getInviteLink(groupJid)`    | `GET /group/group-Invite/:groupJid`         |
| `revokeInviteLink(groupJid)` | `GET /group/group-Invite-revogar/:groupJid` |

### `client.config`

| Método                | Endpoint              |
| --------------------- | --------------------- |
| `getSession()`        | `GET /config/session` |
| `updateConfig(data)`  | `PUT /config/config`  |
| `updateWebhook(data)` | `PUT /config/webhook` |
| `updateProxy(data)`   | `PUT /config/proxy`   |

### `client.system`

| Método     | Endpoint             |
| ---------- | -------------------- |
| `status()` | `GET /system/status` |
| `config()` | `GET /system/config` |

## ❓ FAQ

**Preciso rodar a Flash API localmente pra usar o SDK?**

Não necessariamente — basta apontar `baseUrl` para qualquer instância da Flash API acessível (local, VPS, Docker etc.).

**O SDK funciona no navegador?**

Não é o foco atual: o cliente WebSocket depende do módulo `ws` do Node.js. Para uso no browser, seria necessário adaptar o `WebSocketClient` para usar a API `WebSocket` nativa.

**Como sei quais eventos meu webhook/WebSocket vai receber?**

Isso depende da lista `events` configurada na criação da sessão (`client.session.create`) ou atualizada depois via `client.config.updateWebhook`.

**O que acontece se eu não passar `retries`?**

O padrão é `3` tentativas com backoff exponencial (1s, 2s, 4s…), aplicado apenas a erros de timeout ou 5xx.

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para colaborar:

1. Faça um **fork** do projeto
2. Crie uma branch para sua feature/correção: `git checkout -b feature/minha-feature`
3. Rode `npm run lint` e `npm test` antes de subir suas mudanças
4. Faça commit das suas alterações: `git commit -m "feat: adiciona minha feature"`
5. Envie para o seu fork: `git push origin feature/minha-feature`
6. Abra um **Pull Request** descrevendo as mudanças

## 📄 Licença

Este projeto está licenciado sob a licença **MIT** — veja o arquivo [LICENSE](LICENSE) para o texto completo.
