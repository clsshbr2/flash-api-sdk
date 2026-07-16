// src/resources/SystemResource.js
/**
 * Resource para informações do sistema (requer a chave de API global/admin)
 */
export class SystemResource {
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
        return this.http.getGlobal('/system/status');
    }

    /**
     * Obtém configurações do sistema
     * @returns {Promise<Object>}
     */
    async config() {
        return this.http.getGlobal('/system/config');
    }
}