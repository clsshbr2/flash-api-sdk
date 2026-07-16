// src/http/HttpClient.js
import axios from 'axios';
import {
    AuthenticationError,
    ValidationError,
    RateLimitError,
    NotFoundError,
    TimeoutError,
    InternalServerError,
    FlashApiError
} from '../errors/index.js';

/**
 * Cliente HTTP wrapper baseado em Axios com interceptadores
 */
export class HttpClient {
    /**
     * @param {object} config - Configurações do cliente
     * @param {string} config.baseUrl - URL base da API (sem o prefixo /api, ele é adicionado automaticamente)
     * @param {string} config.apiKey - Chave de API da sessão
     * @param {string} config.globalApiKey - Chave de API global/admin (usada em rotas administrativas)
     * @param {number} config.timeout - Timeout em ms (padrão: 30000)
     * @param {number} config.retries - Número de tentativas (padrão: 3)
     */
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || 'http://localhost:3000';
        this.apiKey = config.apiKey;
        this.globalApiKey = config.globalApiKey;
        this.timeout = config.timeout ?? 30000;
        this.retries = config.retries ?? 3;
        this.interceptors = [];
        this.middleware = [];

        // Criar instância do axios
        this.instance = axios.create({
            baseURL: this._resolveApiBaseUrl(this.baseUrl),
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Configurar interceptadores
        this._setupInterceptors();
    }

    /**
     * Todas as rotas da Flash API ficam sob o prefixo /api (ex: /api/chat/send-text)
     * @private
     */
    _resolveApiBaseUrl(baseUrl) {
        const trimmed = baseUrl.replace(/\/+$/, '');
        return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    }

    /**
     * Configura interceptadores de requisição e resposta
     * @private
     */
    _setupInterceptors() {
        // Interceptador de requisição
        this.instance.interceptors.request.use(
            (config) => {
                // Adicionar API Key ao header (sem sobrescrever um header já definido explicitamente,
                // ex: pelas chamadas *Global que usam a chave de API administrativa)
                if (this.apiKey && !config.headers['apikey']) {
                    config.headers['apikey'] = this.apiKey;
                }

                // Executar middleware
                for (const fn of this.middleware) {
                    config = fn(config) || config;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Interceptador de resposta
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
                throw new AuthenticationError('Chave de API inválida ou expirada', data);
            }

            if (status === 400) {
                throw new ValidationError('Parâmetros inválidos', data);
            }

            if (status === 404) {
                throw new NotFoundError('Recurso não encontrado', data);
            }

            if (status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                throw new RateLimitError('Limite de taxa excedido', retryAfter);
            }

            if (status >= 500) {
                throw new InternalServerError('Erro interno do servidor', data);
            }

            throw new FlashApiError(data.message || 'Erro na requisição', status, data);
        }

        if (error.code === 'ECONNABORTED') {
            throw new TimeoutError('Requisição expirou', { originalError: error });
        }

        throw new FlashApiError('Erro na requisição', null, { originalError: error });
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
        return this._requestWithRetry('GET', url, undefined, config);
    }

    /**
     * POST com retry automático
     * @param {string} url - URL relativa
     * @param {object} data - Dados
     * @param {object} config - Configurações
     * @returns {Promise}
     */
    async post(url, data = {}, config = {}) {
        return this._requestWithRetry('POST', url, data, config);
    }

    /**
     * PUT com retry automático
     * @param {string} url - URL relativa
     * @param {object} data - Dados
     * @param {object} config - Configurações
     * @returns {Promise}
     */
    async put(url, data = {}, config = {}) {
        return this._requestWithRetry('PUT', url, data, config);
    }

    /**
     * PATCH com retry automático
     * @param {string} url - URL relativa
     * @param {object} data - Dados
     * @param {object} config - Configurações
     * @returns {Promise}
     */
    async patch(url, data = {}, config = {}) {
        return this._requestWithRetry('PATCH', url, data, config);
    }

    /**
     * DELETE com retry automático
     * @param {string} url - URL relativa
     * @param {object} config - Configurações
     * @returns {Promise}
     */
    async delete(url, config = {}) {
        return this._requestWithRetry('DELETE', url, undefined, config);
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
                apikey: this.globalApiKey,
            },
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
    async _requestWithRetry(method, url, data = undefined, config = {}, attempt = 0) {
        try {
            const response = await this.instance({
                method,
                url,
                data,
                ...config,
            });

            return response.data;
        } catch (error) {
            // Não fazer retry em erros de autenticação ou validação
            if (
                error instanceof AuthenticationError ||
                error instanceof ValidationError ||
                error instanceof NotFoundError
            ) {
                throw error;
            }

            // Fazer retry em erros de timeout ou servidor
            if (attempt < this.retries) {
                const delay = Math.pow(2, attempt) * 1000; // Backoff exponencial
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
}