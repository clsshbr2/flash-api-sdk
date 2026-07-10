// tests/http.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpClient } from '../http/HttpClient.js';
import { ValidationError } from '../errors/ValidationError.js';

describe('HttpClient', () => {
    let httpClient;

    beforeEach(() => {
        httpClient = new HttpClient({
            baseUrl: 'http://localhost:3000',
            apiKey: 'test-key',
            timeout: 5000,
            retries: 1,
        });
    });

    it('deve criar instância com configurações padrão', () => {
        expect(httpClient.baseUrl).toBe('http://localhost:3000');
        expect(httpClient.apiKey).toBe('test-key');
        expect(httpClient.timeout).toBe(5000);
    });

    it('deve definir nova API Key', () => {
        httpClient.setApiKey('new-key');
        expect(httpClient.apiKey).toBe('new-key');
    });

    it('deve definir nova URL base', () => {
        httpClient.setBaseUrl('http://localhost:3001');
        expect(httpClient.baseUrl).toBe('http://localhost:3001');
    });

    it('deve adicionar middleware', () => {
        const middleware = (config) => {
            config.headers['X-Custom'] = 'value';
            return config;
        };

        httpClient.use(middleware);
        expect(httpClient.middleware.length).toBe(1);
    });

    it('deve adicionar interceptador', () => {
        const interceptor = (response) => response;
        httpClient.addInterceptor(interceptor);
        expect(httpClient.interceptors.length).toBe(1);
    });
});