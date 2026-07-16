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
        return this.http.postGlobal('/session/create_sessao', data);
    }

    /**
     * Conecta uma sessão (gera QR Code)
     * @param {Object} data
     * @param {string} data.phoneNumber - Número para pairing via código (opcional)
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
     * Lista todas as sessões (requer a chave de API global/admin)
     * @returns {Promise<Object>}
     */
    async list() {
        return this.http.getGlobal('/session/list');
    }

    /**
     * Verifica saúde do sistema (requer a chave de API global/admin)
     * @returns {Promise<Object>}
     */
    async health() {
        return this.http.getGlobal('/session/health');
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
        return this.http.delete('/session/desconect');
    }
}