// src/errors/FlashApiError.js
/**
 * Classe base para erros da Flash API.
 * Todos os outros erros herdam desta classe.
 */
export class FlashApiError extends Error {
    /**
     * @param {string} message - Mensagem de erro
     * @param {number} code - Código de erro
     * @param {object} data - Dados adicionais do erro
     */
    constructor(message, code = null, data = null) {
        super(message);
        this.name = 'FlashApiError';
        this.code = code;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }

    /**
     * Retorna uma representação em string do erro
     * @returns {string}
     */
    toString() {
        return `${this.name}: ${this.message}${this.code ? ` (${this.code})` : ''}`;
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
            timestamp: this.timestamp,
        };
    }
}