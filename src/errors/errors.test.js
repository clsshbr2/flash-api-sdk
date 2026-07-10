// tests/errors.test.js
import { describe, it, expect } from 'vitest';
import {
    FlashApiError,
    AuthenticationError,
    ValidationError,
    RateLimitError,
    TimeoutError,
    NotFoundError,
} from '../errors/index.js';

describe('Erros', () => {
    it('deve criar FlashApiError com mensagem', () => {
        const error = new FlashApiError('Test error', 'CODE_123');
        expect(error.message).toBe('Test error');
        expect(error.code).toBe('CODE_123');
        expect(error.name).toBe('FlashApiError');
    });

    it('deve criar AuthenticationError', () => {
        const error = new AuthenticationError('Invalid key');
        expect(error.name).toBe('AuthenticationError');
        expect(error.code).toBe('AUTH_ERROR');
    });

    it('deve criar ValidationError', () => {
        const error = new ValidationError('Invalid data');
        expect(error.name).toBe('ValidationError');
        expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('deve criar RateLimitError com retryAfter', () => {
        const error = new RateLimitError('Too many requests', 60);
        expect(error.name).toBe('RateLimitError');
        expect(error.retryAfter).toBe(60);
    });

    it('deve serializar erro para JSON', () => {
        const error = new FlashApiError('Test', 'CODE');
        const json = error.toJSON();
        expect(json.name).toBe('FlashApiError');
        expect(json.message).toBe('Test');
        expect(json.code).toBe('CODE');
        expect(json.timestamp).toBeDefined();
    });

    it('deve converter erro para string', () => {
        const error = new FlashApiError('Test message', 'CODE_001');
        expect(error.toString()).toBe('FlashApiError: Test message (CODE_001)');
    });
});