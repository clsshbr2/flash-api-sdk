// src/errors/RateLimitError.js
import { FlashApiError } from './FlashApiError.js';

/**
 * Erro de limite de taxa - Muitas requisições
 */
export class RateLimitError extends FlashApiError {
    constructor(message = 'Limite de taxa excedido', retryAfter = null) {
        super(message, 'RATE_LIMIT_ERROR', { retryAfter });
        this.name = 'RateLimitError';
        this.retryAfter = retryAfter;
    }
}