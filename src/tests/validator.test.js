// tests/validator.test.js
import { describe, it, expect } from 'vitest';
import { Validator } from '../utils/validator.js';

describe('Validator', () => {
    it('deve validar JID válido', () => {
        expect(Validator.isValidJid('5511999999999@s.whatsapp.net')).toBe(true);
        expect(Validator.isValidJid('120363410719501700@g.us')).toBe(true);
    });

    it('deve rejeitar JID inválido', () => {
        expect(Validator.isValidJid('invalid')).toBe(false);
        expect(Validator.isValidJid('')).toBe(false);
        expect(Validator.isValidJid(null)).toBe(false);
    });

    it('deve validar número de telefone', () => {
        expect(Validator.isValidNumber('5511999999999')).toBe(true);
        expect(Validator.isValidNumber('11999999999')).toBe(true);
    });

    it('deve rejeitar número inválido', () => {
        expect(Validator.isValidNumber('123')).toBe(false);
        expect(Validator.isValidNumber('abc')).toBe(false);
    });

    it('deve validar URL', () => {
        expect(Validator.isValidUrl('http://localhost:3000')).toBe(true);
        expect(Validator.isValidUrl('https://example.com')).toBe(true);
    });

    it('deve rejeitar URL inválida', () => {
        expect(Validator.isValidUrl('not-a-url')).toBe(false);
        expect(Validator.isValidUrl('')).toBe(false);
    });

    it('deve validar string não vazia', () => {
        expect(Validator.isNonEmptyString('test')).toBe(true);
        expect(Validator.isNonEmptyString('   test   ')).toBe(true);
    });

    it('deve rejeitar string vazia', () => {
        expect(Validator.isNonEmptyString('')).toBe(false);
        expect(Validator.isNonEmptyString('   ')).toBe(false);
    });

    it('deve validar array', () => {
        expect(Validator.isArray([])).toBe(true);
        expect(Validator.isArray([1, 2, 3])).toBe(true);
    });

    it('deve rejeitar array inválido', () => {
        expect(Validator.isArray('not-array')).toBe(false);
        expect(Validator.isArray({})).toBe(false);
    });

    it('deve validar objeto', () => {
        expect(Validator.isObject({})).toBe(true);
        expect(Validator.isObject({ key: 'value' })).toBe(true);
    });

    it('deve rejeitar objeto inválido', () => {
        expect(Validator.isObject([])).toBe(false);
        expect(Validator.isObject('string')).toBe(false);
    });
});