// src/errors/AuthenticationError.js
import { FlashApiError } from './FlashApiError.js';

/**
 * Erro de autenticação - API Key inválida ou ausente
 */
export class AuthenticationError extends FlashApiError {
    constructor(message = 'Autenticação falhou', data = null) {
        super(message, 'AUTH_ERROR', data);
        this.name = 'AuthenticationError';
    }
}