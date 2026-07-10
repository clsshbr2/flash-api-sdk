// src/utils/validator.js
/**
 * Valida parâmetros comuns
 */
export class Validator {
    /**
     * Valida JID no formato correto
     * @param {string} jid - JID a validar
     * @returns {boolean}
     */
    static isValidJid(jid) {
        if (!jid || typeof jid !== 'string') return false;
        return /^[0-9]+@(s\.whatsapp\.net|g\.us)$/.test(jid);
    }

    /**
     * Valida número de telefone
     * @param {string} number - Número a validar
     * @returns {boolean}
     */
    static isValidNumber(number) {
        if (!number || typeof number !== 'string') return false;
        return /^[0-9]{10,15}$/.test(number);
    }

    /**
     * Valida URL
     * @param {string} url - URL a validar
     * @returns {boolean}
     */
    static isValidUrl(url) {
        if (!url || typeof url !== 'string') return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Valida base64
     * @param {string} str - String a validar
     * @returns {boolean}
     */
    static isBase64(str) {
        if (!str || typeof str !== 'string') return false;
        try {
            return Buffer.from(str, 'base64').toString('base64') === str;
        } catch {
            return false;
        }
    }

    /**
     * Valida se é um objeto
     * @param {*} obj - Objeto a validar
     * @returns {boolean}
     */
    static isObject(obj) {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    }

    /**
     * Valida se é um array
     * @param {*} arr - Array a validar
     * @returns {boolean}
     */
    static isArray(arr) {
        return Array.isArray(arr);
    }

    /**
     * Valida se é uma string não vazia
     * @param {*} str - String a validar
     * @returns {boolean}
     */
    static isNonEmptyString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }
}