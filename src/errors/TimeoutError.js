// src/errors/TimeoutError.js
import { FlashApiError } from './FlashApiError.js';

/**
 * Erro de timeout - Requisição excedeu o tempo limite
 */
export class TimeoutError extends FlashApiError {
    constructor(message = 'Requisição expirou', data = null) {
        super(message, 'TIMEOUT_ERROR', data);
        this.name = 'TimeoutError';
    }
}