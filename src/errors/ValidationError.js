// src/errors/ValidationError.js
import { FlashApiError } from './FlashApiError.js';

/**
 * Erro de validação - Parâmetros inválidos
 */
export class ValidationError extends FlashApiError {
    constructor(message = 'Validação falhou', data = null) {
        super(message, 'VALIDATION_ERROR', data);
        this.name = 'ValidationError';
    }
}