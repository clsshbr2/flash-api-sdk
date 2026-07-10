// src/client/FlashApi.js
import { HttpClient } from '../http/HttpClient.js';
import { WebSocketClient } from '../websocket/WebSocketClient.js';
import {
    ChatResource,
    ConfigResource,
    ContactResource,
    GroupResource,
    SessionResource,
    SystemResource,
} from '../resources/index.js';

/**
 * Cliente principal da Flash API
 * Orquestra todos os recursos e gerencia autenticação
 */
export class FlashApi {
    /**
     * @param {Object} config - Configurações
     * @param {string} config.baseUrl - URL base da API (padrão: http://localhost:3000)
     * @param {string} config.apiKey - Chave de API
     * @param {number} config.timeout - Timeout em ms (padrão: 30000)
     * @param {number} config.retries - Tentativas de requisição (padrão: 3)
     * @param {string} config.wsUrl - URL do WebSocket (padrão: ws://localhost:3000/ws)
     * @param {string} config.wsSecret - Segredo do WebSocket (opcional)
     * @param {number} config.wsReconnectAttempts - Tentativas de reconexão (padrão: 5)
     */
    constructor(config = {}) {
        // Normalizar configurações internas (guardadas em `options` para não
        // colidir com o resource `config` de /api/config/*)
        this.options = {
            baseUrl: config.baseUrl || 'http://localhost:3000',
            apiKey: config.apiKey,
            timeout: config.timeout || 30000,
            retries: config.retries || 3,
            wsUrl: config.wsUrl || 'ws://localhost:3000/ws',
            wsSecret: config.wsSecret,
            wsReconnectAttempts: config.wsReconnectAttempts || 5,
        };

        // Inicializar HTTP Client
        this.http = new HttpClient({
            baseUrl: this.options.baseUrl,
            apiKey: this.options.apiKey,
            timeout: this.options.timeout,
            retries: this.options.retries,
        });

        // Inicializar WebSocket Client
        this.ws = new WebSocketClient({
            url: this.options.wsUrl,
            secret: this.options.wsSecret,
            reconnectAttempts: this.options.wsReconnectAttempts,
        });

        // Inicializar Resources
        this.chat = new ChatResource(this.http);
        this.config = new ConfigResource(this.http);
        this.contact = new ContactResource(this.http);
        this.group = new GroupResource(this.http);
        this.session = new SessionResource(this.http);
        this.system = new SystemResource(this.http);
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
            version: '1.0.0',
            name: 'flash-api-sdk',
            description: 'SDK JavaScript oficial da Flash API',
            repository: 'https://github.com/clsshbr2/flash-api-sdk',
            license: 'MIT',
        };
    }
}