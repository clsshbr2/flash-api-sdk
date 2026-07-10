// src/resources/ContactResource.js
/**
 * Resource para gerenciar contatos
 */
export class ContactResource {
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
        return this.http.get('/contact/list');
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
        return this.http.post('/contact/check', data);
    }

    /**
     * Bloqueia ou desbloqueia um contato
     * @param {Object} data
     * @param {string} data.jid - JID do contato
     * @param {string} data.action - 'block' ou 'unblock'
     * @returns {Promise<Object>}
     */
    async block(data) {
        return this.http.post('/contact/block', data);
    }

    /**
     * Converte LID para JID
     * @param {Object} data
     * @param {string} data.lid - Local ID
     * @returns {Promise<Object>}
     */
    async lidToJid(data) {
        return this.http.post('/contact/lid-to-jid', data);
    }
}