// src/resources/ChatResource.js
/**
 * Resource para envio e gerenciamento de mensagens (chat)
 */
export class ChatResource {
    /**
     * @param {HttpClient} http - Cliente HTTP
     */
    constructor(http) {
        this.http = http;
    }

    /**
     * Envia mensagem de texto
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.text - Texto da mensagem
     * @returns {Promise<Object>}
     */
    async sendText(data) {
        return this.http.post('/chat/send-text', data);
    }

    /**
     * Envia imagem (URL ou base64)
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.image - URL ou base64 da imagem
     * @param {string} data.caption - Legenda (opcional)
     * @returns {Promise<Object>}
     */
    async sendImage(data) {
        return this.http.post('/chat/send-image', data);
    }

    /**
     * Envia vídeo
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.video - URL ou base64 do vídeo
     * @param {string} data.caption - Legenda (opcional)
     * @returns {Promise<Object>}
     */
    async sendVideo(data) {
        return this.http.post('/chat/send-video', data);
    }

    /**
     * Envia áudio (convertido automaticamente para Opus/OGG pela API quando ptt=true)
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.audio - URL ou base64 do áudio
     * @param {boolean} data.ptt - true envia como áudio gravado (voice note), false como arquivo de áudio normal
     * @returns {Promise<Object>}
     */
    async sendAudio(data) {
        return this.http.post('/chat/send-audio', data);
    }

    /**
     * Envia documento/arquivo
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.document - URL ou base64 do documento
     * @param {string} data.fileName - Nome do arquivo
     * @param {string} data.mimetype - Tipo MIME do arquivo
     * @param {string} data.caption - Legenda (opcional)
     * @returns {Promise<Object>}
     */
    async sendDocument(data) {
        return this.http.post('/chat/send-document', data);
    }

    /**
     * Envia localização
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {Object} data.location
     * @param {number} data.location.degreesLatitude - Latitude
     * @param {number} data.location.degreesLongitude - Longitude
     * @param {string} data.location.name - Nome do local (opcional)
     * @param {string} data.location.address - Endereço (opcional)
     * @returns {Promise<Object>}
     */
    async sendLocation(data) {
        return this.http.post('/chat/send-location', data);
    }

    /**
     * Envia cartão de contato (vCard)
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.displayName - Nome de exibição do contato (opcional)
     * @param {Object} data.contact
     * @param {string} data.contact.firstName - Primeiro nome
     * @param {string} data.contact.lastName - Sobrenome (opcional)
     * @param {string} data.contact.organization - Empresa (opcional)
     * @param {string} data.contact.jobTitle - Cargo (opcional)
     * @param {string} data.contact.phone - Telefone
     * @param {string} data.contact.email - E-mail (opcional)
     * @param {string} data.contact.website - Website (opcional)
     * @param {Object} data.contact.address - Endereço (opcional): street, city, state, zip, country
     * @returns {Promise<Object>}
     */
    async sendContact(data) {
        return this.http.post('/chat/send-contact', data);
    }

    /**
     * Cria e envia figurinha (sticker) a partir de imagem
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.sticker - URL ou base64 da imagem
     * @returns {Promise<Object>}
     */
    async sendSticker(data) {
        return this.http.post('/chat/send-sticker', data);
    }

    /**
     * Reage a uma mensagem com emoji
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {Object} data.react
     * @param {string} data.react.messageId - ID da mensagem a reagir
     * @param {string} data.react.emoji - Emoji da reação (string vazia remove a reação)
     * @param {number} data.delay - Delay em ms (opcional)
     * @returns {Promise<Object>}
     */
    async sendReaction(data) {
        return this.http.post('/chat/send-reaction', data);
    }

    /**
     * Cria uma enquete
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {Object} data.poll
     * @param {string} data.poll.name - Pergunta/título da enquete
     * @param {Array<string>} data.poll.values - Opções da enquete
     * @param {number} data.poll.selectableCount - Quantidade de opções selecionáveis (0 = múltipla escolha)
     * @returns {Promise<Object>}
     */
    async sendPoll(data) {
        return this.http.post('/chat/send-poll', data);
    }

    /**
     * Envia lista de opções
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.title - Título da lista
     * @param {string} data.description - Descrição/corpo da mensagem
     * @param {string} data.buttonText - Texto do botão que abre a lista
     * @param {Array<Object>} data.sections - Seções e linhas da lista
     * @returns {Promise<Object>}
     */
    async sendList(data) {
        return this.http.post('/chat/send-list', data);
    }

    /**
     * Envia mensagem com botões
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.text - Texto da mensagem
     * @param {Array<Object>} data.buttons - Botões a exibir
     * @returns {Promise<Object>}
     */
    async sendButtons(data) {
        return this.http.post('/chat/send-buttons', data);
    }

    /**
     * Envia mensagem interativa
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @returns {Promise<Object>}
     */
    async sendInteractiveMessage(data) {
        return this.http.post('/chat/send-interactiveMessage', data);
    }

    /**
     * Envia carrossel de cards
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {Array<Object>} data.cards - Cards do carrossel
     * @returns {Promise<Object>}
     */
    async sendCarouselMessage(data) {
        return this.http.post('/chat/send-carouselMessage', data);
    }

    /**
     * Simula "digitando…" ou "gravando áudio…"
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {boolean} data.typing - true inicia o status, false pausa
     * @param {boolean} data.audio - true exibe "gravando áudio", false exibe "digitando" (opcional)
     * @param {number} data.delay - Delay em ms antes de aplicar o status (opcional)
     * @returns {Promise<Object>}
     */
    async typing(data) {
        return this.http.post('/chat/typing', data);
    }

    /**
     * Marca uma mensagem como lida
     * @param {Object} data
     * @param {string} data.jid - Número/JID da conversa
     * @param {string} data.messageId - ID da mensagem a marcar como lida
     * @returns {Promise<Object>}
     */
    async markRead(data) {
        return this.http.post('/chat/mark-read', data);
    }

    /**
     * Lista mensagens de uma conversa
     * @param {Object} params - Parâmetros de query
     * @param {string} params.jid - JID da conversa
     * @param {number} params.limit - Quantidade de mensagens (padrão: 50)
     * @param {number} params.offset - Offset de paginação (padrão: 0)
     * @returns {Promise<Object>}
     */
    async getMessages(params = {}) {
        return this.http.get('/chat/messages', { params });
    }

    /**
     * Lista conversas da sessão
     * @param {Object} params - Parâmetros de query
     * @param {number} params.page - Página (padrão: 1)
     * @param {number} params.limit - Quantidade por página, máximo 100 (padrão: 50)
     * @param {string} params.search - Busca textual (opcional)
     * @returns {Promise<Object>}
     */
    async getChats(params = {}) {
        return this.http.get('/chat/chats', { params });
    }

    /**
     * Apaga uma mensagem
     * @param {string} idMessage - ID da mensagem a apagar
     * @returns {Promise<Object>}
     */
    async deleteMessage(idMessage) {
        return this.http.delete(`/chat/delete/${idMessage}`);
    }

    /**
     * Converte mídia de uma mensagem recebida (imagem, vídeo ou áudio) em base64
     * @param {Object} data
     * @param {Object} data.message - Objeto de mensagem bruto do Baileys contendo imageMessage, videoMessage ou audioMessage
     * @returns {Promise<Object>}
     */
    async mediaToBase64(data) {
        return this.http.post('/chat/midiaToBase64', data);
    }
}
