// tests/flashapi.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { FlashApi } from '../client/FlashApi.js';

describe('FlashApi', () => {
    let client;

    beforeEach(() => {
        client = new FlashApi({
            baseUrl: 'http://localhost:3000',
            apiKey: 'test-key',
            wsUrl: 'ws://localhost:3000/ws',
        });
    });

    it('deve criar instância com config padrão', () => {
        const defaultClient = new FlashApi();
        expect(defaultClient.options.baseUrl).toBe('http://localhost:3000');
        expect(defaultClient.options.timeout).toBe(30000);
    });

    it('deve ter todos os recursos disponíveis', () => {
        expect(client.chat).toBeDefined();
        expect(client.config).toBeDefined();
        expect(client.contact).toBeDefined();
        expect(client.group).toBeDefined();
        expect(client.session).toBeDefined();
        expect(client.system).toBeDefined();
    });

    it('deve ter WebSocket disponível', () => {
        expect(client.ws).toBeDefined();
        expect(typeof client.connect).toBe('function');
        expect(typeof client.disconnect).toBe('function');
    });

    it('deve definir nova API Key', () => {
        client.setApiKey('new-key');
        expect(client.options.apiKey).toBe('new-key');
    });

    it('deve definir nova URL base', () => {
        client.setBaseUrl('http://localhost:3001');
        expect(client.options.baseUrl).toBe('http://localhost:3001');
    });

    it('deve retornar informações da SDK', () => {
        const info = client.getInfo();
        expect(info.name).toBe('flash-api-sdk');
        expect(info.version).toBe('1.0.0');
        expect(info.license).toBe('MIT');
    });

    it('deve registrar listeners', () => {
        const callback = () => { };
        expect(() => {
            client.on('message', callback);
        }).not.toThrow();
    });

    it('deve adicionar middleware', () => {
        const middleware = (config) => config;
        expect(() => {
            client.use(middleware);
        }).not.toThrow();
    });
});