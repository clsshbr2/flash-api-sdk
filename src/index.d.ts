// src/index.d.ts
// Definições de tipos para autocompletar em IDEs (o SDK em si é 100% JavaScript)

export interface FlashApiConfig {
    /** URL base da API (padrão: http://localhost:3000) */
    baseUrl?: string;
    /** Chave de API (global ou de sessão) */
    apiKey?: string;
    /** Timeout em ms (padrão: 30000) */
    timeout?: number;
    /** Tentativas de requisição (padrão: 3) */
    retries?: number;
    /** URL do WebSocket (padrão: ws://localhost:3000/ws) */
    wsUrl?: string;
    /** Segredo do WebSocket (opcional) */
    wsSecret?: string;
    /** Tentativas de reconexão do WebSocket (padrão: 5) */
    wsReconnectAttempts?: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    [key: string]: any;
}

export declare class FlashApiError extends Error {
    code: string | number | null;
    data: any;
    timestamp: string;
    constructor(message: string, code?: string | number | null, data?: any);
    toString(): string;
    toJSON(): { name: string; message: string; code: string | number | null; data: any; timestamp: string };
}

export declare class AuthenticationError extends FlashApiError {
    constructor(message?: string, data?: any);
}

export declare class ValidationError extends FlashApiError {
    constructor(message?: string, data?: any);
}

export declare class RateLimitError extends FlashApiError {
    retryAfter: number | null;
    constructor(message?: string, retryAfter?: number | null);
}

export declare class NotFoundError extends FlashApiError {
    constructor(message?: string, data?: any);
}

export declare class TimeoutError extends FlashApiError {
    constructor(message?: string, data?: any);
}

export declare class InternalServerError extends FlashApiError {
    constructor(message?: string, data?: any);
}

export declare class WebSocketError extends FlashApiError {
    constructor(message?: string, data?: any);
}

export declare class ChatResource {
    sendText(data: { jid: string; text: string }): Promise<ApiResponse>;
    sendImage(data: { jid: string; image: string; caption?: string }): Promise<ApiResponse>;
    sendVideo(data: { jid: string; video: string; caption?: string }): Promise<ApiResponse>;
    sendAudio(data: { jid: string; audio: string }): Promise<ApiResponse>;
    sendDocument(data: { jid: string; document: string; filename?: string; caption?: string }): Promise<ApiResponse>;
    sendLocation(data: { jid: string; latitude: number; longitude: number }): Promise<ApiResponse>;
    sendContact(data: { jid: string; contact: Record<string, any> }): Promise<ApiResponse>;
    sendSticker(data: { jid: string; image: string }): Promise<ApiResponse>;
    sendReaction(data: { jid: string; id_message: string; emoji: string }): Promise<ApiResponse>;
    sendPoll(data: { jid: string; name: string; options: string[]; selectableCount?: number }): Promise<ApiResponse>;
    sendList(data: Record<string, any>): Promise<ApiResponse>;
    sendButtons(data: Record<string, any>): Promise<ApiResponse>;
    sendInteractiveMessage(data: Record<string, any>): Promise<ApiResponse>;
    sendCarouselMessage(data: Record<string, any>): Promise<ApiResponse>;
    typing(data: { jid: string; type: 'composing' | 'recording' }): Promise<ApiResponse>;
    markRead(data: Record<string, any>): Promise<ApiResponse>;
    getMessages(params?: Record<string, any>): Promise<ApiResponse>;
    getChats(): Promise<ApiResponse>;
    deleteMessage(idMessage: string): Promise<ApiResponse>;
    mediaToBase64(data: { id_message: string }): Promise<ApiResponse>;
}

export declare class ContactResource {
    list(): Promise<ApiResponse>;
    getAvatar(apiKey: string, jid: string): Promise<ApiResponse>;
    check(data: { number: string }): Promise<ApiResponse>;
    block(data: { jid: string; action: 'block' | 'unblock' }): Promise<ApiResponse>;
    lidToJid(data: { lid: string }): Promise<ApiResponse>;
}

export declare class GroupResource {
    list(): Promise<ApiResponse>;
    info(data: { groupJid: string }): Promise<ApiResponse>;
    create(data: { subject: string; participants: string[] }): Promise<ApiResponse>;
    updateDescription(data: { groupJid: string; description: string }): Promise<ApiResponse>;
    updateSubject(data: { groupJid: string; subject: string }): Promise<ApiResponse>;
    updateParticipants(data: { groupJid: string; participants: string[]; action: 'add' | 'remove' | 'promote' | 'demote' }): Promise<ApiResponse>;
    leave(data: { groupJid: string }): Promise<ApiResponse>;
    updateSettings(data: { groupJid: string; setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked' }): Promise<ApiResponse>;
    getInviteLink(groupJid: string): Promise<ApiResponse>;
    revokeInviteLink(groupJid: string): Promise<ApiResponse>;
}

export declare class ConfigResource {
    getSession(): Promise<ApiResponse>;
    updateConfig(data: { ignoreGroups?: boolean; autoRead?: boolean; rejectCall?: boolean; msg_rejectCall?: string }): Promise<ApiResponse>;
    updateWebhook(data: { webhookUrl: string; events: string[]; status_webhook: boolean }): Promise<ApiResponse>;
    updateProxy(data: { protocol: string; host: string; port: number; username?: string; password?: string; active: boolean }): Promise<ApiResponse>;
}

export declare class SessionResource {
    create(data: Record<string, any>): Promise<ApiResponse>;
    connect(data?: { numero?: string }): Promise<ApiResponse>;
    status(): Promise<ApiResponse>;
    getAvatar(apiKey: string): Promise<ApiResponse>;
    restart(): Promise<ApiResponse>;
    injectCredentials(data: Record<string, any>): Promise<ApiResponse>;
    list(): Promise<ApiResponse>;
    health(): Promise<ApiResponse>;
    delete(sessionId: string): Promise<ApiResponse>;
    disconnect(): Promise<ApiResponse>;
}

export declare class SystemResource {
    status(): Promise<ApiResponse>;
    config(): Promise<ApiResponse>;
}

export declare class FlashApi {
    chat: ChatResource;
    config: ConfigResource;
    contact: ContactResource;
    group: GroupResource;
    session: SessionResource;
    system: SystemResource;
    options: Required<FlashApiConfig>;

    constructor(config?: FlashApiConfig);

    setApiKey(apiKey: string): void;
    setBaseUrl(baseUrl: string): void;
    connect(): Promise<void>;
    disconnect(): void;
    reconnect(): Promise<void>;
    isConnected(): boolean;
    on(event: string, callback: (...args: any[]) => void): void;
    once(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    subscribe(event: string, callback: (...args: any[]) => void): void;
    unsubscribe(event: string, callback: (...args: any[]) => void): void;
    use(fn: (config: any) => any): void;
    addInterceptor(fn: (response: any) => any): void;
    getInfo(): { version: string; name: string; description: string; repository: string; license: string };
}

export default FlashApi;