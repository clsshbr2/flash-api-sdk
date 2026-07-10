// src/errors/InternalServerError.js
import { FlashApiError } from './FlashApiError.js';

/**
 * Erro 500 - Erro interno do servidor
 */
export class InternalServerError extends FlashApiError {
    constructor(message = 'Erro interno do servidor', data = null) {
        super(message, 'INTERNAL_SERVER_ERROR', data);
        this.name = 'InternalServerError';
    }
}