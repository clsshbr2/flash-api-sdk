// src/index.d.ts
// Definições de tipos para autocompletar em IDEs (o SDK em si é 100% JavaScript)

export interface FlashApiConfig {
    /** URL base da API, sem o prefixo /api (padrão: http://localhost:3000) */
    baseUrl?: string;
    /** Chave de API da sessão */
    apiKey?: string;
    /** Chave de API global/admin (necessária para session.create/list/health/delete e system.status/config) */
    globalApiKey?: string;
    /** Timeout em ms (padrão: 30000) */
    timeout?: number;
    /** Tentativas de requisição (padrão: 3) */
    retries?: number;
    /** URL do WebSocket (padrão: derivada de baseUrl, sem o sufixo /api, + /ws) */
    wsUrl?: string;
    /** Chave usada para autenticar no WebSocket: apikey da sessão, ou o GLOBAL_WEBSOCKET_SECRET para receber eventos de todas as sessões (padrão: apiKey) */
    wsSecret?: string;
    /** Eventos que o WebSocket deve receber (padrão: todos) */
    events?: (keyof FlashApiEvents)[];
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
    sendImage(data: { jid: string; image: string; caption?: string; fileName?: string; mimetype?: string }): Promise<ApiResponse>;
    sendVideo(data: { jid: string; video: string; caption?: string; gifPlayback?: boolean }): Promise<ApiResponse>;
    sendAudio(data: { jid: string; audio: string; ptt?: boolean }): Promise<ApiResponse>;
    sendDocument(data: { jid: string; document: string; fileName?: string; mimetype?: string; caption?: string }): Promise<ApiResponse>;
    sendLocation(data: { jid: string; location: { degreesLatitude: number; degreesLongitude: number; name?: string; address?: string } }): Promise<ApiResponse>;
    sendContact(data: { jid: string; displayName?: string; contact: Record<string, any> }): Promise<ApiResponse>;
    sendSticker(data: { jid: string; sticker: string }): Promise<ApiResponse>;
    sendReaction(data: { jid: string; react: { messageId: string; emoji: string }; delay?: number }): Promise<ApiResponse>;
    sendPoll(data: { jid: string; poll: { name: string; values: string[]; selectableCount?: number } }): Promise<ApiResponse>;
    sendList(data: Record<string, any>): Promise<ApiResponse>;
    sendButtons(data: Record<string, any>): Promise<ApiResponse>;
    sendInteractiveMessage(data: Record<string, any>): Promise<ApiResponse>;
    sendCarouselMessage(data: Record<string, any>): Promise<ApiResponse>;
    typing(data: { jid: string; typing: boolean; audio?: boolean; delay?: number }): Promise<ApiResponse>;
    markRead(data: { jid: string; messageId: string }): Promise<ApiResponse>;
    getMessages(params?: { jid?: string; limit?: number; offset?: number }): Promise<ApiResponse>;
    getChats(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse>;
    deleteMessage(idMessage: string): Promise<ApiResponse>;
    mediaToBase64(data: { message: Record<string, any> }): Promise<ApiResponse>;
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
    connect(data?: { phoneNumber?: string }): Promise<ApiResponse>;
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

export interface FlashApiEvents {
    connection_update: (data: any) => void;
    creds_update: (data: any) => void;
    messaging_history_set: (data: any) => void;
    messaging_history_status: (data: any) => void;

    chats_upsert: (data: any) => void;
    chats_update: (data: any) => void;
    chats_delete: (data: any) => void;
    chats_lock: (data: any) => void;

    lid_mapping_update: (data: any) => void;
    presence_update: (data: any) => void;

    contacts_upsert: (data: any) => void;
    contacts_update: (data: any) => void;

    messages_upsert: (data: any) => void;
    messages_update: (data: any) => void;
    messages_delete: (data: any) => void;
    messages_media_update: (data: any) => void;
    messages_reaction: (data: any) => void;
    message_receipt_update: (data: any) => void;
    message_capping_update: (data: any) => void;

    groups_upsert: (data: any) => void;
    groups_update: (data: any) => void;
    group_participants_update: (data: any) => void;
    group_join_request: (data: any) => void;
    group_member_tag_update: (data: any) => void;

    blocklist_set: (data: any) => void;
    blocklist_update: (data: any) => void;

    call: (data: any) => void;

    labels_edit: (data: any) => void;
    labels_association: (data: any) => void;

    newsletter_reaction: (data: any) => void;
    newsletter_view: (data: any) => void;
    newsletter_participants_update: (data: any) => void;
    newsletter_settings_update: (data: any) => void;

    settings_update: (data: any) => void;
    
    welcome: (data: any) => void;
    error: (data: any) => void;
    message: (data: any) => void;
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
    setGlobalApiKey(globalApiKey: string): void;
    setBaseUrl(baseUrl: string): void;
    connect(): Promise<void>;
    disconnect(): void;
    reconnect(): Promise<void>;
    isConnected(): boolean;
    on<K extends keyof FlashApiEvents>(
        event: K,
        callback: FlashApiEvents[K]
    ): void;
    once(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    subscribe(event: string, callback: (...args: any[]) => void): void;
    unsubscribe(event: string, callback: (...args: any[]) => void): void;
    use(fn: (config: any) => any): void;
    addInterceptor(fn: (response: any) => any): void;
    getInfo(): { version: string; name: string; description: string; repository: string; license: string };
}

export default FlashApi;