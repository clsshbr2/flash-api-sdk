// src/resources/SessionResource.js
/**
 * Resource para gerenciar sessões
 */
export class SessionResource {
    /**
     * @param {HttpClient} http - Cliente HTTP
     */
    constructor(http) {
        this.http = http;
    }

    /**
     * Cria uma nova sessão
     * @param {Object} data
     * @param {string} data.nome_sessao - Nome da sessão
     * @param {string} data.apikey - Chave da API (opcional, gera automaticamente)
     * @param {string} data.webhook_url - URL do webhook (opcional)
     * @param {boolean} data.webhook_status - Status do webhook (opcional)
     * @param {Array<string>} data.events - Lista de eventos (opcional)
     * @param {boolean} data.leitura_automatica - Ler automaticamente (opcional)
     * @param {string} data.numero - Número para pairing (opcional)
     * @param {boolean} data.rejeitar_ligacoes - Rejeitar ligações (opcional)
     * @param {boolean} data.ignorar_grupos - Ignorar grupos (opcional)
     * @param {Object} data.proxy - Config de proxy (opcional)
     * @returns {Promise<Object>}
     */
    async create(data) {
        return this.http.post('/session/create_sessao', data);
    }

    /**
     * Conecta uma sessão (gera QR Code)
     * @param {Object} data
     * @param {string} data.numero - Número para pairing (opcional)
     * @returns {Promise<Object>}
     */
    async connect(data = {}) {
        return this.http.put('/session/conectar_sessao', data);
    }

    /**
     * Obtém o status da sessão
     * @returns {Promise<Object>}
     */
    async status() {
        return this.http.get('/session/status');
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
        return this.http.put('/session/restart');
    }

    /**
     * Injeta credenciais previamente exportadas
     * @param {Object} data - Objeto de credenciais completo
     * @returns {Promise<Object>}
     */
    async injectCredentials(data) {
        return this.http.post('/session/creds', data);
    }

    /**
     * Lista todas as sessões (requer global API key)
     * @returns {Promise<Object>}
     */
    async list() {
        return this.http.get('/session/list');
    }

    /**
     * Verifica saúde do sistema (requer global API key)
     * @returns {Promise<Object>}
     */
    async health() {
        return this.http.get('/session/health');
    }

    /**
     * Deleta uma sessão (requer global API key)
     * @param {string} sessionId - ID da sessão
     * @returns {Promise<Object>}
     */
    async delete(sessionId) {
        return this.http.delete(`/session/delete/${sessionId}`);
    }

    /**
     * Desconecta a sessão (logout)
     * @returns {Promise<Object>}
     */
    async disconnect() {
        return this.http.delete('/session/desconect');
    }
}