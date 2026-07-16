// src/websocket/WebSocketClient.js
import { EventEmitter } from 'events';
import { WebSocketError } from '../errors/index.js';

// Todos os eventos suportados pelo WebSocketService da Flash API
const DEFAULT_EVENTS = [
    'connection_update',
    'creds_update',
    'messaging_history_set',
    'messaging_history_status',

    'chats_upsert',
    'chats_update',
    'chats_delete',
    'chats_lock',

    'lid_mapping_update',
    'presence_update',

    'contacts_upsert',
    'contacts_update',

    'messages_upsert',
    'messages_update',
    'messages_delete',
    'messages_media_update',
    'messages_reaction',
    'message_receipt_update',
    'message_capping_update',

    'groups_upsert',
    'groups_update',
    'group_participants_update',
    'group_join_request',
    'group_member_tag_update',

    'blocklist_set',
    'blocklist_update',

    'call',

    'labels_edit',
    'labels_association',

    'newsletter_reaction',
    'newsletter_view',
    'newsletter_participants_update',
    'newsletter_settings_update',

    'settings_update',
];

/**
 * Cliente WebSocket com reconexão automática e gerenciamento de eventos
 *
 * A autenticação e a filtragem de eventos acontecem no handshake de conexão
 * (headers `apikey` e `events`) - o servidor não implementa um fluxo de
 * mensagens AUTH/SUBSCRIBE após a conexão aberta.
 */
export class WebSocketClient extends EventEmitter {
    /**
     * @param {object} config - Configurações
     * @param {string} config.url - URL do WebSocket
     * @param {string} config.secret - Chave usada no header `apikey` (apikey da sessão ou a chave global do WebSocket)
     * @param {Array<string>} config.events - Eventos a serem recebidos (padrão: todos)
     * @param {number} config.reconnectAttempts - Tentativas de reconexão (padrão: 5)
     * @param {number} config.reconnectDelay - Delay inicial em ms (padrão: 1000)
     * @param {number} config.heartbeatInterval - Intervalo de heartbeat em ms (padrão: 30000)
     */
    constructor(config = {}) {
        super();

        this.url = config.url || 'ws://localhost:3000/ws';
        this.secret = config.secret;
        this.events = config.events || DEFAULT_EVENTS;
        this.reconnectAttempts = config.reconnectAttempts ?? 5;
        this.reconnectDelay = config.reconnectDelay ?? 1000;
        this.heartbeatInterval = config.heartbeatInterval ?? 30000;

        this.ws = null;
        this.reconnectAttempt = 0;
        this.heartbeatTimer = null;
        this.messageQueue = [];
        this.isAuthenticated = false;
        this.isConnecting = false;
        this.subscriptions = new Map();
    }

    /**
     * Conecta ao WebSocket
     * @returns {Promise<void>}
     */
    connect() {
        return new Promise((resolve, reject) => {
            if (this.isConnecting) {
                return reject(new WebSocketError('Conexão já em progresso'));
            }

            this.isConnecting = true;

            try {
                // Importar WebSocket dinamicamente (Node.js)
                import('ws').then((wsModule) => {
                    const WS = wsModule.default;

                    this.ws = new WS(this.url, [],
                        {
                            headers: {
                                apikey: this.secret,
                                events: JSON.stringify(this.events)
                            }
                        }
                    );

                    this.ws.onopen = () => {
                        this.isConnecting = false;
                        this.reconnectAttempt = 0;

                        // A autenticação é feita pelo servidor no handshake (headers apikey/events),
                        // não há troca de mensagens AUTH depois da conexão aberta.
                        // this.isAuthenticated é confirmado ao receber a mensagem 'welcome'.

                        // Iniciar heartbeat
                        this._startHeartbeat();

                        // Processar fila de mensagens
                        this._processQueue();

                        this.emit('open', 'conectado com a flashapi');
                        resolve();
                    };

                    this.ws.onmessage = (event) => {
                        try {
                            const payload = JSON.parse(event.data);
                            this._handleMessage(payload);
                        } catch (error) {
                            this.emit('error', new WebSocketError('Erro ao parsear mensagem', error));
                        }
                    };

                    this.ws.onerror = (error) => {
                        this.isConnecting = false;
                        this.emit('error', new WebSocketError('Erro de conexão WebSocket', error));
                        reject(new WebSocketError('Falha ao conectar', error));
                    };

                    this.ws.onclose = () => {
                        this._stopHeartbeat();
                        this.isAuthenticated = false;
                        this.emit('close', 'desconectado');
                        this._attemptReconnect();
                    };
                });
            } catch (error) {
                this.isConnecting = false;
                reject(new WebSocketError('Erro ao importar módulo WebSocket', error));
            }
        });
    }

    /**
     * Desconecta do WebSocket
     */
    disconnect() {
        this._stopHeartbeat();
        if (this.ws) {
            this.ws.close(1000, 'Desconexão intencional');
        }
        this.isAuthenticated = false;
    }

    /**
     * Reconecta ao WebSocket
     */
    reconnect() {
        this.disconnect();
        return this.connect();
    }

    /**
     * Trata mensagens recebidas
     * @private
     */
    _handleMessage(payload) {

        // Enviada pelo servidor logo após a conexão ser aceita (autenticação via headers)
        if (payload.type === 'welcome') {
            this.isAuthenticated = true;
            this.emit('authenticated', { clientId: payload.clientId, events: payload.events });
            return;
        }

        if (payload.type === 'error') {
            this.emit('error', new WebSocketError(payload.message || 'Erro no WebSocket'));
            return;
        }

        // Emitir evento específico
        if (payload.event) {
            this.emit(payload.event, payload.data);
        }

        // Emitir evento genérico 'message'
        this.emit('message', payload);
    }

    /**
     * Envia mensagem via WebSocket
     * @param {object} message - Mensagem
     */
    send(message) {
        if (this.ws && this.ws.readyState === 1) {
            // readyState 1 = OPEN
            this.ws.send(JSON.stringify(message));
        } else {
            // Adicionar à fila se não estiver conectado
            this.messageQueue.push(message);
        }
    }

    /**
     * Se inscreve em um evento. A filtragem de quais eventos chegam do servidor
     * já é definida no handshake de conexão (config.events); subscribe/unsubscribe
     * apenas gerenciam os listeners localmente.
     * @param {string} event - Nome do evento
     * @param {function} callback - Função callback
     */
    subscribe(event, callback) {
        if (!this.subscriptions.has(event)) {
            this.subscriptions.set(event, []);
        }
        this.subscriptions.get(event).push(callback);

        // Registrar listener
        this.on(event, callback);
    }

    /**
     * Se desinscreve de um evento
     * @param {string} event - Nome do evento
     * @param {function} callback - Função callback
     */
    unsubscribe(event, callback) {
        if (this.subscriptions.has(event)) {
            const callbacks = this.subscriptions.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }

        // Remover listener
        this.off(event, callback);
    }

    /**
     * Inicia heartbeat
     * @private
     */
    _startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === 1) {
                this.ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, this.heartbeatInterval);
    }

    /**
     * Para heartbeat
     * @private
     */
    _stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    /**
     * Processa fila de mensagens
     * @private
     */
    _processQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.send(message);
        }
    }

    /**
     * Tenta reconectar com backoff exponencial
     * @private
     */
    _attemptReconnect() {
        if (this.reconnectAttempt < this.reconnectAttempts) {
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempt);
            this.reconnectAttempt++;

            setTimeout(() => {
                this.connect().catch(() => {
                    // Erro já foi emitido, continuar tentando
                });
            }, delay);
        } else {
            this.emit('error', new WebSocketError('Máximo de tentativas de reconexão excedido'));
        }
    }

    /**
     * Retorna se está conectado
     * @returns {boolean}
     */
    isConnected() {
        return this.ws && this.ws.readyState === 1 && this.isAuthenticated;
    }
}