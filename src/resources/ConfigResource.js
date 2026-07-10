// src/resources/ConfigResource.js
/**
 * Resource para gerenciar configurações da sessão
 */
export class ConfigResource {
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
        return this.http.get('/config/session');
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
        return this.http.put('/config/config', data);
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
        return this.http.put('/config/webhook', data);
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
        return this.http.put('/config/proxy', data);
    }
}