// src/resources/GroupResource.js
/**
 * Resource para gerenciar grupos
 */
export class GroupResource {
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
        return this.http.get('/group/list');
    }

    /**
     * Obtém informações de um grupo específico
     * @param {Object} data
     * @param {string} data.groupJid - JID do grupo
     * @returns {Promise<Object>}
     */
    async info(data) {
        return this.http.post('/group/info', data);
    }

    /**
     * Cria um novo grupo
     * @param {Object} data
     * @param {string} data.subject - Nome do grupo
     * @param {Array<string>} data.participants - Array de JIDs dos participantes
     * @returns {Promise<Object>}
     */
    async create(data) {
        return this.http.post('/group/create', data);
    }

    /**
     * Atualiza a descrição do grupo
     * @param {Object} data
     * @param {string} data.groupJid - JID do grupo
     * @param {string} data.description - Nova descrição
     * @returns {Promise<Object>}
     */
    async updateDescription(data) {
        return this.http.post('/group/update-description', data);
    }

    /**
     * Atualiza o nome do grupo
     * @param {Object} data
     * @param {string} data.groupJid - JID do grupo
     * @param {string} data.subject - Novo nome
     * @returns {Promise<Object>}
     */
    async updateSubject(data) {
        return this.http.post('/group/update-subject', data);
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
        return this.http.post('/group/ParticipantsUpdate', data);
    }

    /**
     * Sai do grupo
     * @param {Object} data
     * @param {string} data.groupJid - JID do grupo
     * @returns {Promise<Object>}
     */
    async leave(data) {
        return this.http.post('/group/leave', data);
    }

    /**
     * Atualiza configurações do grupo
     * @param {Object} data
     * @param {string} data.groupJid - JID do grupo
     * @param {string} data.setting - 'announcement' | 'not_announcement' | 'locked' | 'unlocked'
     * @returns {Promise<Object>}
     */
    async updateSettings(data) {
        return this.http.post('/group/up-setting', data);
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
}