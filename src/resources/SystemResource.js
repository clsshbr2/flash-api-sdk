// src/resources/SystemResource.js
/**
 * Resource para informações do sistema (requer global API key)
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
        return this.http.get('/system/status');
    }

    /**
     * Obtém configurações do sistema
     * @returns {Promise<Object>}
     */
    async config() {
        return this.http.get('/system/config');
    }
}