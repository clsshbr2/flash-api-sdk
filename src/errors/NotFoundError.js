// src/errors/NotFoundError.js
import { FlashApiError } from './FlashApiError.js';

/**
 * Erro 404 - Recurso não encontrado
 */
export class NotFoundError extends FlashApiError {
    constructor(message = 'Recurso não encontrado', data = null) {
        super(message, 'NOT_FOUND_ERROR', data);
        this.name = 'NotFoundError';
    }
}