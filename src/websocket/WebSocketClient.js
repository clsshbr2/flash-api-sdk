// src/websocket/WebSocketClient.js
import { EventEmitter } from 'events';
import { WebSocketError } from '../errors/index.js';

/**
 * Cliente WebSocket com reconexão automática e gerenciamento de eventos
 */
export class WebSocketClient extends EventEmitter {
    /**
     * @param {object} config - Configurações
     * @param {string} config.url - URL do WebSocket
     * @param {string} config.secret - Chave secreta para autenticação
     * @param {number} config.reconnectAttempts - Tentativas de reconexão (padrão: 5)
     * @param {number} config.reconnectDelay - Delay inicial em ms (padrão: 1000)
     * @param {number} config.heartbeatInterval - Intervalo de heartbeat em ms (padrão: 30000)
     */
    constructor(config = {}) {
        super();

        this.url = config.url || 'ws://localhost:3000/ws';
        this.secret = config.secret;
        this.reconnectAttempts = config.reconnectAttempts || 5;
        this.reconnectDelay = config.reconnectDelay || 1000;
        this.heartbeatInterval = config.heartbeatInterval || 30000;

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

                    this.ws = new WS(this.url);

                    this.ws.onopen = () => {
                        this.isConnecting = false;
                        this.reconnectAttempt = 0;

                        // Autenticar se houver secret
                        if (this.secret) {
                            this._authenticate();
                        } else {
                            this.isAuthenticated = true;
                        }

                        // Iniciar heartbeat
                        this._startHeartbeat();

                        // Processar fila de mensagens
                        this._processQueue();

                        this.emit('open');
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
                        this.emit('close');
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
     * Autentica no WebSocket
     * @private
     */
    _authenticate() {
        const authMessage = {
            type: 'AUTH',
            payload: { secret: this.secret },
        };
        this.ws.send(JSON.stringify(authMessage));
    }

    /**
     * Trata mensagens recebidas
     * @private
     */
    _handleMessage(payload) {
        if (payload.type === 'AUTH_SUCCESS') {
            this.isAuthenticated = true;
            this.emit('authenticated');
            return;
        }

        if (payload.type === 'AUTH_ERROR') {
            this.emit('error', new WebSocketError('Autenticação falhou'));
            this.disconnect();
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
     * Se inscreve em um evento
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

        // Notificar servidor sobre inscrição
        this.send({
            type: 'SUBSCRIBE',
            event,
        });
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

        // Notificar servidor
        this.send({
            type: 'UNSUBSCRIBE',
            event,
        });
    }

    /**
     * Inicia heartbeat
     * @private
     */
    _startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === 1) {
                this.ws.send(JSON.stringify({ type: 'PING' }));
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