var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  AuthenticationError: () => AuthenticationError,
  FlashApi: () => FlashApi,
  FlashApiError: () => FlashApiError,
  InternalServerError: () => InternalServerError,
  NotFoundError: () => NotFoundError,
  RateLimitError: () => RateLimitError,
  TimeoutError: () => TimeoutError,
  ValidationError: () => ValidationError,
  WebSocketError: () => WebSocketError,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/http/HttpClient.js
var import_axios = __toESM(require("axios"));

// src/errors/FlashApiError.js
var FlashApiError = class extends Error {
  /**
   * @param {string} message - Mensagem de erro
   * @param {number} code - Código de erro
   * @param {object} data - Dados adicionais do erro
   */
  constructor(message, code = null, data = null) {
    super(message);
    this.name = "FlashApiError";
    this.code = code;
    this.data = data;
    this.timestamp = (/* @__PURE__ */ new Date()).toISOString();
  }
  /**
   * Retorna uma representação em string do erro
   * @returns {string}
   */
  toString() {
    return `${this.name}: ${this.message}${this.code ? ` (${this.code})` : ""}`;
  }
  /**
   * Retorna o erro em formato JSON
   * @returns {object}
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      data: this.data,
      timestamp: this.timestamp
    };
  }
};

// src/errors/AuthenticationError.js
var AuthenticationError = class extends FlashApiError {
  constructor(message = "Autentica\xE7\xE3o falhou", data = null) {
    super(message, "AUTH_ERROR", data);
    this.name = "AuthenticationError";
  }
};

// src/errors/ValidationError.js
var ValidationError = class extends FlashApiError {
  constructor(message = "Valida\xE7\xE3o falhou", data = null) {
    super(message, "VALIDATION_ERROR", data);
    this.name = "ValidationError";
  }
};

// src/errors/RateLimitError.js
var RateLimitError = class extends FlashApiError {
  constructor(message = "Limite de taxa excedido", retryAfter = null) {
    super(message, "RATE_LIMIT_ERROR", { retryAfter });
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
};

// src/errors/NotFoundError.js
var NotFoundError = class extends FlashApiError {
  constructor(message = "Recurso n\xE3o encontrado", data = null) {
    super(message, "NOT_FOUND_ERROR", data);
    this.name = "NotFoundError";
  }
};

// src/errors/TimeoutError.js
var TimeoutError = class extends FlashApiError {
  constructor(message = "Requisi\xE7\xE3o expirou", data = null) {
    super(message, "TIMEOUT_ERROR", data);
    this.name = "TimeoutError";
  }
};

// src/errors/InternalServerError.js
var InternalServerError = class extends FlashApiError {
  constructor(message = "Erro interno do servidor", data = null) {
    super(message, "INTERNAL_SERVER_ERROR", data);
    this.name = "InternalServerError";
  }
};

// src/errors/WebSocketError.js
var WebSocketError = class extends FlashApiError {
  constructor(message = "Erro de WebSocket", data = null) {
    super(message, "WEBSOCKET_ERROR", data);
    this.name = "WebSocketError";
  }
};

// src/http/HttpClient.js
var HttpClient = class {
  /**
   * @param {object} config - Configurações do cliente
   * @param {string} config.baseUrl - URL base da API (sem o prefixo /api, ele é adicionado automaticamente)
   * @param {string} config.apiKey - Chave de API da sessão
   * @param {string} config.globalApiKey - Chave de API global/admin (usada em rotas administrativas)
   * @param {number} config.timeout - Timeout em ms (padrão: 30000)
   * @param {number} config.retries - Número de tentativas (padrão: 3)
   */
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || "http://localhost:3000";
    this.apiKey = config.apiKey;
    this.globalApiKey = config.globalApiKey;
    this.timeout = config.timeout ?? 3e4;
    this.retries = config.retries ?? 3;
    this.interceptors = [];
    this.middleware = [];
    this.instance = import_axios.default.create({
      baseURL: this._resolveApiBaseUrl(this.baseUrl),
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this._setupInterceptors();
  }
  /**
   * Todas as rotas da Flash API ficam sob o prefixo /api (ex: /api/chat/send-text)
   * @private
   */
  _resolveApiBaseUrl(baseUrl) {
    const trimmed = baseUrl.replace(/\/+$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }
  /**
   * Configura interceptadores de requisição e resposta
   * @private
   */
  _setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        if (this.apiKey && !config.headers["apikey"]) {
          config.headers["apikey"] = this.apiKey;
        }
        for (const fn of this.middleware) {
          config = fn(config) || config;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => this._handleError(error)
    );
  }
  /**
   * Trata erros da API
   * @private
   */
  _handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 || status === 403) {
        throw new AuthenticationError("Chave de API inv\xE1lida ou expirada", data);
      }
      if (status === 400) {
        throw new ValidationError("Par\xE2metros inv\xE1lidos", data);
      }
      if (status === 404) {
        throw new NotFoundError("Recurso n\xE3o encontrado", data);
      }
      if (status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        throw new RateLimitError("Limite de taxa excedido", retryAfter);
      }
      if (status >= 500) {
        throw new InternalServerError("Erro interno do servidor", data);
      }
      throw new FlashApiError(data.message || "Erro na requisi\xE7\xE3o", status, data);
    }
    if (error.code === "ECONNABORTED") {
      throw new TimeoutError("Requisi\xE7\xE3o expirou", { originalError: error });
    }
    throw new FlashApiError("Erro na requisi\xE7\xE3o", null, { originalError: error });
  }
  /**
   * Adiciona um interceptador
   * @param {function} fn - Função do interceptador
   */
  addInterceptor(fn) {
    this.interceptors.push(fn);
  }
  /**
   * Adiciona middleware
   * @param {function} fn - Função middleware
   */
  use(fn) {
    this.middleware.push(fn);
  }
  /**
   * GET com retry automático
   * @param {string} url - URL relativa
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async get(url, config = {}) {
    return this._requestWithRetry("GET", url, void 0, config);
  }
  /**
   * POST com retry automático
   * @param {string} url - URL relativa
   * @param {object} data - Dados
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async post(url, data = {}, config = {}) {
    return this._requestWithRetry("POST", url, data, config);
  }
  /**
   * PUT com retry automático
   * @param {string} url - URL relativa
   * @param {object} data - Dados
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async put(url, data = {}, config = {}) {
    return this._requestWithRetry("PUT", url, data, config);
  }
  /**
   * PATCH com retry automático
   * @param {string} url - URL relativa
   * @param {object} data - Dados
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async patch(url, data = {}, config = {}) {
    return this._requestWithRetry("PATCH", url, data, config);
  }
  /**
   * DELETE com retry automático
   * @param {string} url - URL relativa
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async delete(url, config = {}) {
    return this._requestWithRetry("DELETE", url, void 0, config);
  }
  /**
   * Mescla o header apikey com a chave global/admin, sobrepondo qualquer valor padrão
   * @private
   */
  _withGlobalKey(config = {}) {
    return {
      ...config,
      headers: {
        ...config.headers,
        apikey: this.globalApiKey
      }
    };
  }
  /**
   * GET autenticado com a chave de API global (rotas administrativas)
   * @param {string} url - URL relativa
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async getGlobal(url, config = {}) {
    return this.get(url, this._withGlobalKey(config));
  }
  /**
   * POST autenticado com a chave de API global (rotas administrativas)
   * @param {string} url - URL relativa
   * @param {object} data - Dados
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async postGlobal(url, data = {}, config = {}) {
    return this.post(url, data, this._withGlobalKey(config));
  }
  /**
   * PUT autenticado com a chave de API global (rotas administrativas)
   * @param {string} url - URL relativa
   * @param {object} data - Dados
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async putGlobal(url, data = {}, config = {}) {
    return this.put(url, data, this._withGlobalKey(config));
  }
  /**
   * DELETE autenticado com a chave de API global (rotas administrativas)
   * @param {string} url - URL relativa
   * @param {object} config - Configurações
   * @returns {Promise}
   */
  async deleteGlobal(url, config = {}) {
    return this.delete(url, this._withGlobalKey(config));
  }
  /**
   * Requisição com retry automático
   * @private
   */
  async _requestWithRetry(method, url, data = void 0, config = {}, attempt = 0) {
    try {
      const response = await this.instance({
        method,
        url,
        data,
        ...config
      });
      return response.data;
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      if (attempt < this.retries) {
        const delay = Math.pow(2, attempt) * 1e3;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this._requestWithRetry(method, url, data, config, attempt + 1);
      }
      throw error;
    }
  }
  /**
   * Define nova API Key
   * @param {string} apiKey - Nova chave de API
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }
  /**
   * Define nova API Key global/admin
   * @param {string} globalApiKey - Nova chave de API global
   */
  setGlobalApiKey(globalApiKey) {
    this.globalApiKey = globalApiKey;
  }
  /**
   * Define nova URL base
   * @param {string} baseUrl - Nova URL base
   */
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    this.instance.defaults.baseURL = this._resolveApiBaseUrl(baseUrl);
  }
};

// src/websocket/WebSocketClient.js
var import_events = require("events");
var DEFAULT_EVENTS = [
  "connection_update",
  "creds_update",
  "messaging_history_set",
  "messaging_history_status",
  "chats_upsert",
  "chats_update",
  "chats_delete",
  "chats_lock",
  "lid_mapping_update",
  "presence_update",
  "contacts_upsert",
  "contacts_update",
  "messages_upsert",
  "messages_update",
  "messages_delete",
  "messages_media_update",
  "messages_reaction",
  "message_receipt_update",
  "message_capping_update",
  "groups_upsert",
  "groups_update",
  "group_participants_update",
  "group_join_request",
  "group_member_tag_update",
  "blocklist_set",
  "blocklist_update",
  "call",
  "labels_edit",
  "labels_association",
  "newsletter_reaction",
  "newsletter_view",
  "newsletter_participants_update",
  "newsletter_settings_update",
  "settings_update"
];
var WebSocketClient = class extends import_events.EventEmitter {
  /**
   * @param {object} config - Configurações
   * @param {string} config.url - URL do WebSocket
   * @param {string} config.secret - Chave usada no header `apikey` (apikey da sessão ou a chave global do WebSocket)
   * @param {Array<string>} config.events - Eventos a serem recebidos (padrão: todos)
   * @param {number} config.reconnectAttempts - Tentativas de reconexão (padrão: 5)
   * @param {number} config.reconnectDelay - Delay inicial em ms (padrão: 1000)
   * @param {number} config.heartbeatInterval - Intervalo de heartbeat em ms (padrão: 30000)
   */
  constructor(config = {}) {
    super();
    this.url = config.url || "ws://localhost:3000/ws";
    this.secret = config.secret;
    this.events = config.events || DEFAULT_EVENTS;
    this.reconnectAttempts = config.reconnectAttempts ?? 5;
    this.reconnectDelay = config.reconnectDelay ?? 1e3;
    this.heartbeatInterval = config.heartbeatInterval ?? 3e4;
    this.ws = null;
    this.reconnectAttempt = 0;
    this.heartbeatTimer = null;
    this.messageQueue = [];
    this.isAuthenticated = false;
    this.isConnecting = false;
    this.subscriptions = /* @__PURE__ */ new Map();
  }
  /**
   * Conecta ao WebSocket
   * @returns {Promise<void>}
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        return reject(new WebSocketError("Conex\xE3o j\xE1 em progresso"));
      }
      this.isConnecting = true;
      try {
        import("ws").then((wsModule) => {
          const WS = wsModule.default;
          this.ws = new WS(
            this.url,
            [],
            {
              headers: {
                apikey: this.secret,
                events: JSON.stringify(this.events)
              }
            }
          );
          this.ws.onopen = () => {
            this.isConnecting = false;
            this.reconnectAttempt = 0;
            this._startHeartbeat();
            this._processQueue();
            this.emit("open", "Conectado com a flashapi");
            resolve();
          };
          this.ws.onmessage = (event) => {
            try {
              const payload = JSON.parse(event.data);
              this._handleMessage(payload);
            } catch (error) {
              this.emit("error", new WebSocketError("Erro ao parsear mensagem", error));
            }
          };
          this.ws.onerror = (error) => {
            this.isConnecting = false;
            this.emit("error", new WebSocketError("Erro de conex\xE3o WebSocket", error));
            reject(new WebSocketError("Falha ao conectar", error));
          };
          this.ws.onclose = () => {
            this._stopHeartbeat();
            this.isAuthenticated = false;
            this.emit("close", "desconectado");
            this._attemptReconnect();
          };
        });
      } catch (error) {
        this.isConnecting = false;
        reject(new WebSocketError("Erro ao importar m\xF3dulo WebSocket", error));
      }
    });
  }
  /**
   * Desconecta do WebSocket
   */
  disconnect() {
    this._stopHeartbeat();
    if (this.ws) {
      this.ws.close(1e3, "Desconex\xE3o intencional");
    }
    this.isAuthenticated = false;
  }
  /**
   * Reconecta ao WebSocket
   */
  reconnect() {
    this.disconnect();
    return this.connect();
  }
  /**
   * Trata mensagens recebidas
   * @private
   */
  _handleMessage(payload) {
    if (payload.type === "welcome") {
      this.isAuthenticated = true;
      this.emit("authenticated", payload);
      return;
    }
    if (payload.type === "error") {
      this.emit("error", new WebSocketError(payload.message || "Erro no WebSocket"));
      return;
    }
    if (payload.event) {
      this.emit(payload.event, payload);
    }
    this.emit("message", payload);
  }
  /**
   * Envia mensagem via WebSocket
   * @param {object} message - Mensagem
   */
  send(message) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }
  /**
   * Se inscreve em um evento. A filtragem de quais eventos chegam do servidor
   * já é definida no handshake de conexão (config.events); subscribe/unsubscribe
   * apenas gerenciam os listeners localmente.
   * @param {string} event - Nome do evento
   * @param {function} callback - Função callback
   */
  subscribe(event, callback) {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, []);
    }
    this.subscriptions.get(event).push(callback);
    this.on(event, callback);
  }
  /**
   * Se desinscreve de um evento
   * @param {string} event - Nome do evento
   * @param {function} callback - Função callback
   */
  unsubscribe(event, callback) {
    if (this.subscriptions.has(event)) {
      const callbacks = this.subscriptions.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
    this.off(event, callback);
  }
  /**
   * Inicia heartbeat
   * @private
   */
  _startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, this.heartbeatInterval);
  }
  /**
   * Para heartbeat
   * @private
   */
  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  /**
   * Processa fila de mensagens
   * @private
   */
  _processQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }
  /**
   * Tenta reconectar com backoff exponencial
   * @private
   */
  _attemptReconnect() {
    if (this.reconnectAttempt < this.reconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempt);
      this.reconnectAttempt++;
      setTimeout(() => {
        this.connect().catch(() => {
        });
      }, delay);
    } else {
      this.emit("error", new WebSocketError("M\xE1ximo de tentativas de reconex\xE3o excedido"));
    }
  }
  /**
   * Retorna se está conectado
   * @returns {boolean}
   */
  isConnected() {
    return this.ws && this.ws.readyState === 1 && this.isAuthenticated;
  }
};

// src/resources/ChatResource.js
var ChatResource = class {
  /**
   * @param {HttpClient} http - Cliente HTTP
   */
  constructor(http) {
    this.http = http;
  }
  /**
   * Envia mensagem de texto
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.text - Texto da mensagem
   * @returns {Promise<Object>}
   */
  async sendText(data) {
    return this.http.post("/chat/send-text", data);
  }
  /**
   * Envia imagem (URL ou base64)
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.image - URL ou base64 da imagem
   * @param {string} data.caption - Legenda (opcional)
   * @returns {Promise<Object>}
   */
  async sendImage(data) {
    return this.http.post("/chat/send-image", data);
  }
  /**
   * Envia vídeo
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.video - URL ou base64 do vídeo
   * @param {string} data.caption - Legenda (opcional)
   * @returns {Promise<Object>}
   */
  async sendVideo(data) {
    return this.http.post("/chat/send-video", data);
  }
  /**
   * Envia áudio (convertido automaticamente para Opus/OGG pela API quando ptt=true)
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.audio - URL ou base64 do áudio
   * @param {boolean} data.ptt - true envia como áudio gravado (voice note), false como arquivo de áudio normal
   * @returns {Promise<Object>}
   */
  async sendAudio(data) {
    return this.http.post("/chat/send-audio", data);
  }
  /**
   * Envia documento/arquivo
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.document - URL ou base64 do documento
   * @param {string} data.fileName - Nome do arquivo
   * @param {string} data.mimetype - Tipo MIME do arquivo
   * @param {string} data.caption - Legenda (opcional)
   * @returns {Promise<Object>}
   */
  async sendDocument(data) {
    return this.http.post("/chat/send-document", data);
  }
  /**
   * Envia localização
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {Object} data.location
   * @param {number} data.location.degreesLatitude - Latitude
   * @param {number} data.location.degreesLongitude - Longitude
   * @param {string} data.location.name - Nome do local (opcional)
   * @param {string} data.location.address - Endereço (opcional)
   * @returns {Promise<Object>}
   */
  async sendLocation(data) {
    return this.http.post("/chat/send-location", data);
  }
  /**
   * Envia cartão de contato (vCard)
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.displayName - Nome de exibição do contato (opcional)
   * @param {Object} data.contact
   * @param {string} data.contact.firstName - Primeiro nome
   * @param {string} data.contact.lastName - Sobrenome (opcional)
   * @param {string} data.contact.organization - Empresa (opcional)
   * @param {string} data.contact.jobTitle - Cargo (opcional)
   * @param {string} data.contact.phone - Telefone
   * @param {string} data.contact.email - E-mail (opcional)
   * @param {string} data.contact.website - Website (opcional)
   * @param {Object} data.contact.address - Endereço (opcional): street, city, state, zip, country
   * @returns {Promise<Object>}
   */
  async sendContact(data) {
    return this.http.post("/chat/send-contact", data);
  }
  /**
   * Cria e envia figurinha (sticker) a partir de imagem
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.sticker - URL ou base64 da imagem
   * @returns {Promise<Object>}
   */
  async sendSticker(data) {
    return this.http.post("/chat/send-sticker", data);
  }
  /**
   * Reage a uma mensagem com emoji
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {Object} data.react
   * @param {string} data.react.messageId - ID da mensagem a reagir
   * @param {string} data.react.emoji - Emoji da reação (string vazia remove a reação)
   * @param {number} data.delay - Delay em ms (opcional)
   * @returns {Promise<Object>}
   */
  async sendReaction(data) {
    return this.http.post("/chat/send-reaction", data);
  }
  /**
   * Cria uma enquete
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {Object} data.poll
   * @param {string} data.poll.name - Pergunta/título da enquete
   * @param {Array<string>} data.poll.values - Opções da enquete
   * @param {number} data.poll.selectableCount - Quantidade de opções selecionáveis (0 = múltipla escolha)
   * @returns {Promise<Object>}
   */
  async sendPoll(data) {
    return this.http.post("/chat/send-poll", data);
  }
  /**
   * Envia lista de opções
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.title - Título da lista
   * @param {string} data.description - Descrição/corpo da mensagem
   * @param {string} data.buttonText - Texto do botão que abre a lista
   * @param {Array<Object>} data.sections - Seções e linhas da lista
   * @returns {Promise<Object>}
   */
  async sendList(data) {
    return this.http.post("/chat/send-list", data);
  }
  /**
   * Envia mensagem com botões
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {string} data.text - Texto da mensagem
   * @param {Array<Object>} data.buttons - Botões a exibir
   * @returns {Promise<Object>}
   */
  async sendButtons(data) {
    return this.http.post("/chat/send-buttons", data);
  }
  /**
   * Envia mensagem interativa
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @returns {Promise<Object>}
   */
  async sendInteractiveMessage(data) {
    return this.http.post("/chat/send-interactiveMessage", data);
  }
  /**
   * Envia carrossel de cards
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {Array<Object>} data.cards - Cards do carrossel
   * @returns {Promise<Object>}
   */
  async sendCarouselMessage(data) {
    return this.http.post("/chat/send-carouselMessage", data);
  }
  /**
   * Simula "digitando…" ou "gravando áudio…"
   * @param {Object} data
   * @param {string} data.jid - Número/JID do destinatário
   * @param {boolean} data.typing - true inicia o status, false pausa
   * @param {boolean} data.audio - true exibe "gravando áudio", false exibe "digitando" (opcional)
   * @param {number} data.delay - Delay em ms antes de aplicar o status (opcional)
   * @returns {Promise<Object>}
   */
  async typing(data) {
    return this.http.post("/chat/typing", data);
  }
  /**
   * Marca uma mensagem como lida
   * @param {Object} data
   * @param {string} data.jid - Número/JID da conversa
   * @param {string} data.messageId - ID da mensagem a marcar como lida
   * @returns {Promise<Object>}
   */
  async markRead(data) {
    return this.http.post("/chat/mark-read", data);
  }
  /**
   * Lista mensagens de uma conversa
   * @param {Object} params - Parâmetros de query
   * @param {string} params.jid - JID da conversa
   * @param {number} params.limit - Quantidade de mensagens (padrão: 50)
   * @param {number} params.offset - Offset de paginação (padrão: 0)
   * @returns {Promise<Object>}
   */
  async getMessages(params = {}) {
    return this.http.get("/chat/messages", { params });
  }
  /**
   * Lista conversas da sessão
   * @param {Object} params - Parâmetros de query
   * @param {number} params.page - Página (padrão: 1)
   * @param {number} params.limit - Quantidade por página, máximo 100 (padrão: 50)
   * @param {string} params.search - Busca textual (opcional)
   * @returns {Promise<Object>}
   */
  async getChats(params = {}) {
    return this.http.get("/chat/chats", { params });
  }
  /**
   * Apaga uma mensagem
   * @param {string} idMessage - ID da mensagem a apagar
   * @returns {Promise<Object>}
   */
  async deleteMessage(idMessage) {
    return this.http.delete(`/chat/delete/${idMessage}`);
  }
  /**
   * Converte mídia de uma mensagem recebida (imagem, vídeo ou áudio) em base64
   * @param {Object} data
   * @param {Object} data.message - Objeto de mensagem bruto do Baileys contendo imageMessage, videoMessage ou audioMessage
   * @returns {Promise<Object>}
   */
  async mediaToBase64(data) {
    return this.http.post("/chat/midiaToBase64", data);
  }
};

// src/resources/ConfigResource.js
var ConfigResource = class {
  /**
   * @param {HttpClient} http - Cliente HTTP
   */
  constructor(http) {
    this.http = http;
  }
  /**
   * Obtém configurações da sessão
   * @returns {Promise<Object>}
   */
  async getSession() {
    return this.http.get("/config/session");
  }
  /**
   * Atualiza configurações gerais da sessão
   * @param {Object} data
   * @param {boolean} data.ignoreGroups - Ignorar grupos (opcional)
   * @param {boolean} data.autoRead - Ler mensagens automaticamente (opcional)
   * @param {boolean} data.rejectCall - Rejeitar ligações (opcional)
   * @param {string} data.msg_rejectCall - Mensagem ao rejeitar (opcional)
   * @returns {Promise<Object>}
   */
  async updateConfig(data) {
    return this.http.put("/config/config", data);
  }
  /**
   * Atualiza configurações de webhook
   * @param {Object} data
   * @param {string} data.webhookUrl - URL do webhook
   * @param {Array<string>} data.events - Lista de eventos
   * @param {boolean} data.status_webhook - Status do webhook
   * @returns {Promise<Object>}
   */
  async updateWebhook(data) {
    return this.http.put("/config/webhook", data);
  }
  /**
   * Atualiza configurações de proxy
   * @param {Object} data
   * @param {string} data.protocol - Protocolo (http, https, socks4, socks5, etc)
   * @param {string} data.host - Host do proxy
   * @param {number} data.port - Porta do proxy
   * @param {string} data.username - Usuário (opcional)
   * @param {string} data.password - Senha (opcional)
   * @param {boolean} data.active - Ativar proxy
   * @returns {Promise<Object>}
   */
  async updateProxy(data) {
    return this.http.put("/config/proxy", data);
  }
};

// src/resources/ContactResource.js
var ContactResource = class {
  /**
   * @param {HttpClient} http - Cliente HTTP
   */
  constructor(http) {
    this.http = http;
  }
  /**
   * Lista todos os contatos da sessão
   * @returns {Promise<Object>}
   */
  async list() {
    return this.http.get("/contact/list");
  }
  /**
   * Obtém foto de perfil de um contato
   * @param {string} apiKey - Chave da API (sessão)
   * @param {string} jid - JID do contato
   * @returns {Promise<Object>}
   */
  async getAvatar(apiKey, jid) {
    return this.http.get(`/contact/avatar/${apiKey}/${jid}`);
  }
  /**
   * Verifica se um número existe no WhatsApp
   * @param {Object} data
   * @param {string} data.number - Número no formato JID
   * @returns {Promise<Object>}
   */
  async check(data) {
    return this.http.post("/contact/check", data);
  }
  /**
   * Bloqueia ou desbloqueia um contato
   * @param {Object} data
   * @param {string} data.jid - JID do contato
   * @param {string} data.action - 'block' ou 'unblock'
   * @returns {Promise<Object>}
   */
  async block(data) {
    return this.http.post("/contact/block", data);
  }
  /**
   * Converte LID para JID
   * @param {Object} data
   * @param {string} data.lid - Local ID
   * @returns {Promise<Object>}
   */
  async lidToJid(data) {
    return this.http.post("/contact/lid-to-jid", data);
  }
};

// src/resources/GroupResource.js
var GroupResource = class {
  /**
   * @param {HttpClient} http - Cliente HTTP
   */
  constructor(http) {
    this.http = http;
  }
  /**
   * Lista todos os grupos da sessão
   * @returns {Promise<Object>}
   */
  async list() {
    return this.http.get("/group/list");
  }
  /**
   * Obtém informações de um grupo específico
   * @param {Object} data
   * @param {string} data.groupJid - JID do grupo
   * @returns {Promise<Object>}
   */
  async info(data) {
    return this.http.post("/group/info", data);
  }
  /**
   * Cria um novo grupo
   * @param {Object} data
   * @param {string} data.subject - Nome do grupo
   * @param {Array<string>} data.participants - Array de JIDs dos participantes
   * @returns {Promise<Object>}
   */
  async create(data) {
    return this.http.post("/group/create", data);
  }
  /**
   * Atualiza a descrição do grupo
   * @param {Object} data
   * @param {string} data.groupJid - JID do grupo
   * @param {string} data.description - Nova descrição
   * @returns {Promise<Object>}
   */
  async updateDescription(data) {
    return this.http.post("/group/update-description", data);
  }
  /**
   * Atualiza o nome do grupo
   * @param {Object} data
   * @param {string} data.groupJid - JID do grupo
   * @param {string} data.subject - Novo nome
   * @returns {Promise<Object>}
   */
  async updateSubject(data) {
    return this.http.post("/group/update-subject", data);
  }
  /**
   * Gerencia participantes (adicionar, remover, promover, rebaixar)
   * @param {Object} data
   * @param {string} data.groupJid - JID do grupo
   * @param {Array<string>} data.participants - Array de números
   * @param {string} data.action - 'add' | 'remove' | 'promote' | 'demote'
   * @returns {Promise<Object>}
   */
  async updateParticipants(data) {
    return this.http.post("/group/ParticipantsUpdate", data);
  }
  /**
   * Sai do grupo
   * @param {Object} data
   * @param {string} data.groupJid - JID do grupo
   * @returns {Promise<Object>}
   */
  async leave(data) {
    return this.http.post("/group/leave", data);
  }
  /**
   * Atualiza configurações do grupo
   * @param {Object} data
   * @param {string} data.groupJid - JID do grupo
   * @param {string} data.setting - 'announcement' | 'not_announcement' | 'locked' | 'unlocked'
   * @returns {Promise<Object>}
   */
  async updateSettings(data) {
    return this.http.post("/group/up-setting", data);
  }
  /**
   * Gera link de convite do grupo
   * @param {string} groupJid - JID do grupo
   * @returns {Promise<Object>}
   */
  async getInviteLink(groupJid) {
    return this.http.get(`/group/group-Invite/${groupJid}`);
  }
  /**
   * Revoga e gera novo link de convite
   * @param {string} groupJid - JID do grupo
   * @returns {Promise<Object>}
   */
  async revokeInviteLink(groupJid) {
    return this.http.get(`/group/group-Invite-revogar/${groupJid}`);
  }
};

// src/resources/SessionResource.js
var SessionResource = class {
  /**
   * @param {HttpClient} http - Cliente HTTP
   */
  constructor(http) {
    this.http = http;
  }
  /**
   * Cria uma nova sessão (requer a chave de API global/admin)
   * @param {Object} data
   * @param {string} data.nome_sessao - Nome da sessão (mínimo 6 caracteres)
   * @param {string} data.apikey - Chave da API em formato UUID v4 (opcional, gera automaticamente)
   * @param {string} data.webhook_url - URL do webhook (opcional)
   * @param {number} data.webhook_status - Status do webhook: 1 ou 0 (opcional)
   * @param {Array<string>} data.events - Lista de eventos (opcional)
   * @param {boolean} data.leitura_automatica - Ler automaticamente (opcional)
   * @param {string} data.numero - Número para pairing na criação (opcional)
   * @param {boolean} data.rejeitar_ligacoes - Rejeitar ligações (opcional)
   * @param {string} data.msg_rejectcalls - Mensagem ao rejeitar ligação (opcional)
   * @param {boolean} data.ignorar_grupos - Ignorar grupos (opcional)
   * @param {Object} data.proxy - Config de proxy (opcional)
   * @returns {Promise<Object>}
   */
  async create(data) {
    return this.http.postGlobal("/session/create_sessao", data);
  }
  /**
   * Conecta uma sessão (gera QR Code)
   * @param {Object} data
   * @param {string} data.phoneNumber - Número para pairing via código (opcional)
   * @returns {Promise<Object>}
   */
  async connect(data = {}) {
    return this.http.put("/session/conectar_sessao", data);
  }
  /**
   * Obtém o status da sessão
   * @returns {Promise<Object>}
   */
  async status() {
    return this.http.get("/session/status");
  }
  /**
   * Obtém foto de perfil da sessão
   * @param {string} apiKey - Chave da API
   * @returns {Promise<Object>}
   */
  async getAvatar(apiKey) {
    return this.http.get(`/session/avatar/${apiKey}`);
  }
  /**
   * Reinicia a sessão
   * @returns {Promise<Object>}
   */
  async restart() {
    return this.http.put("/session/restart");
  }
  /**
   * Injeta credenciais previamente exportadas
   * @param {Object} data - Objeto de credenciais completo
   * @returns {Promise<Object>}
   */
  async injectCredentials(data) {
    return this.http.post("/session/creds", data);
  }
  /**
   * Lista todas as sessões (requer a chave de API global/admin)
   * @returns {Promise<Object>}
   */
  async list() {
    return this.http.getGlobal("/session/list");
  }
  /**
   * Verifica saúde do sistema (requer a chave de API global/admin)
   * @returns {Promise<Object>}
   */
  async health() {
    return this.http.getGlobal("/session/health");
  }
  /**
   * Deleta uma sessão (requer a chave de API global/admin)
   * @param {string} sessionId - ID da sessão
   * @returns {Promise<Object>}
   */
  async delete(sessionId) {
    return this.http.deleteGlobal(`/session/delete/${sessionId}`);
  }
  /**
   * Desconecta a sessão (logout)
   * @returns {Promise<Object>}
   */
  async disconnect() {
    return this.http.delete("/session/desconect");
  }
};

// src/resources/SystemResource.js
var SystemResource = class {
  /**
   * @param {HttpClient} http - Cliente HTTP
   */
  constructor(http) {
    this.http = http;
  }
  /**
   * Obtém status geral do sistema
   * @returns {Promise<Object>}
   */
  async status() {
    return this.http.getGlobal("/system/status");
  }
  /**
   * Obtém configurações do sistema
   * @returns {Promise<Object>}
   */
  async config() {
    return this.http.getGlobal("/system/config");
  }
};

// src/client/FlashApi.js
var FlashApi = class {
  /**
   * @param {Object} config - Configurações
   * @param {string} config.baseUrl - URL base da API, sem o prefixo /api (padrão: http://localhost:3000)
   * @param {string} config.apiKey - Chave de API da sessão
   * @param {string} config.globalApiKey - Chave de API global/admin (necessária para session.create/list/health/delete e system.status/config)
   * @param {number} config.timeout - Timeout em ms (padrão: 30000)
   * @param {number} config.retries - Tentativas de requisição (padrão: 3)
   * @param {string} config.wsUrl - URL do WebSocket (padrão: derivada de baseUrl + /ws)
   * @param {string} config.wsSecret - Chave usada para autenticar no WebSocket (padrão: apiKey da sessão)
   * @param {number} config.wsReconnectAttempts - Tentativas de reconexão (padrão: 5)
   */
  constructor(config = {}) {
    const baseUrl = config.baseUrl || "http://localhost:3000";
    this.options = {
      baseUrl,
      apiKey: config.apiKey,
      globalApiKey: config.globalApiKey,
      timeout: config.timeout ?? 3e4,
      retries: config.retries ?? 3,
      wsUrl: config.wsUrl || this._resolveWsUrl(baseUrl),
      wsSecret: config.wsSecret || config.apiKey,
      wsEvents: config.events,
      wsReconnectAttempts: config.wsReconnectAttempts ?? 5
    };
    this.http = new HttpClient({
      baseUrl: this.options.baseUrl,
      apiKey: this.options.apiKey,
      globalApiKey: this.options.globalApiKey,
      timeout: this.options.timeout,
      retries: this.options.retries
    });
    this.ws = new WebSocketClient({
      url: this.options.wsUrl,
      secret: this.options.wsSecret,
      events: this.options.wsEvents,
      reconnectAttempts: this.options.wsReconnectAttempts
    });
    this.chat = new ChatResource(this.http);
    this.config = new ConfigResource(this.http);
    this.contact = new ContactResource(this.http);
    this.group = new GroupResource(this.http);
    this.session = new SessionResource(this.http);
    this.system = new SystemResource(this.http);
  }
  /**
   * Deriva a URL do WebSocket a partir da URL base.
   * O servidor expõe o WebSocket em /ws (fora do prefixo /api das rotas REST),
   * então o sufixo /api é removido caso venha na baseUrl.
   * @private
   */
  _resolveWsUrl(baseUrl) {
    const origem = baseUrl.replace(/\/+$/, "").replace(/\/api$/, "");
    return `${origem.replace(/^http/, "ws")}/ws`;
  }
  /**
   * Define nova API Key
   * @param {string} apiKey - Nova chave de API
   */
  setApiKey(apiKey) {
    this.options.apiKey = apiKey;
    this.http.setApiKey(apiKey);
  }
  /**
   * Define nova URL base
   * @param {string} baseUrl - Nova URL base
   */
  setBaseUrl(baseUrl) {
    this.options.baseUrl = baseUrl;
    this.http.setBaseUrl(baseUrl);
  }
  /**
   * Define nova API Key global/admin
   * @param {string} globalApiKey - Nova chave de API global
   */
  setGlobalApiKey(globalApiKey) {
    this.options.globalApiKey = globalApiKey;
    this.http.setGlobalApiKey(globalApiKey);
  }
  /**
   * Conecta ao WebSocket
   * @returns {Promise<void>}
   */
  async connect() {
    return this.ws.connect();
  }
  /**
   * Desconecta do WebSocket
   */
  disconnect() {
    this.ws.disconnect();
  }
  /**
   * Reconecta ao WebSocket
   * @returns {Promise<void>}
   */
  async reconnect() {
    return this.ws.reconnect();
  }
  /**
   * Verifica se está conectado ao WebSocket
   * @returns {boolean}
   */
  isConnected() {
    return this.ws.isConnected();
  }
  /**
   * Registra um listener para um evento do WebSocket
   * @param {string} event - Nome do evento
   * @param {function} callback - Função callback
   */
  on(event, callback) {
    this.ws.on(event, callback);
  }
  /**
   * Registra um listener único para um evento
   * @param {string} event - Nome do evento
   * @param {function} callback - Função callback
   */
  once(event, callback) {
    this.ws.once(event, callback);
  }
  /**
   * Remove um listener
   * @param {string} event - Nome do evento
   * @param {function} callback - Função callback
   */
  off(event, callback) {
    this.ws.off(event, callback);
  }
  /**
   * Se inscreve em um evento do WebSocket
   * @param {string} event - Nome do evento
   * @param {function} callback - Função callback
   */
  subscribe(event, callback) {
    this.ws.subscribe(event, callback);
  }
  /**
   * Se desinscreve de um evento
   * @param {string} event - Nome do evento
   * @param {function} callback - Função callback
   */
  unsubscribe(event, callback) {
    this.ws.unsubscribe(event, callback);
  }
  /**
   * Adiciona middleware ao HTTP Client
   * @param {function} fn - Função middleware
   */
  use(fn) {
    this.http.use(fn);
  }
  /**
   * Adiciona interceptador ao HTTP Client
   * @param {function} fn - Função interceptadora
   */
  addInterceptor(fn) {
    this.http.addInterceptor(fn);
  }
  /**
   * Retorna informações sobre a SDK
   * @returns {Object}
   */
  getInfo() {
    return {
      version: "1.0.0",
      name: "flash-api-sdk",
      description: "SDK JavaScript oficial da Flash API",
      repository: "https://github.com/clsshbr2/flash-api-sdk",
      license: "MIT"
    };
  }
};

// src/index.js
var src_default = FlashApi;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticationError,
  FlashApi,
  FlashApiError,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  TimeoutError,
  ValidationError,
  WebSocketError
});
//# sourceMappingURL=index.cjs.map
