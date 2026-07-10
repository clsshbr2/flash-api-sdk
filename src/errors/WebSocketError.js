// src/errors/WebSocketError.js
import { FlashApiError } from './FlashApiError.js';

/**
 * Erro de WebSocket - Problemas com conexão
 */
export class WebSocketError extends FlashApiError {
    constructor(message = 'Erro de WebSocket', data = null) {
        super(message, 'WEBSOCKET_ERROR', data);
        this.name = 'WebSocketError';
    }
}