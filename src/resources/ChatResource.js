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
     * Envia áudio (convertido automaticamente para Opus/OGG pela API)
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.audio - URL ou base64 do áudio
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
     * @param {string} data.filename - Nome do arquivo
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
     * @param {number} data.latitude - Latitude
     * @param {number} data.longitude - Longitude
     * @returns {Promise<Object>}
     */
    async sendLocation(data) {
        return this.http.post('/chat/send-location', data);
    }

    /**
     * Envia cartão de contato (vCard)
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {Object} data.contact - Dados do contato a enviar
     * @returns {Promise<Object>}
     */
    async sendContact(data) {
        return this.http.post('/chat/send-contact', data);
    }

    /**
     * Cria e envia figurinha (sticker) a partir de imagem
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.image - URL ou base64 da imagem
     * @returns {Promise<Object>}
     */
    async sendSticker(data) {
        return this.http.post('/chat/send-sticker', data);
    }

    /**
     * Reage a uma mensagem com emoji
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.id_message - ID da mensagem a reagir
     * @param {string} data.emoji - Emoji da reação (string vazia remove a reação)
     * @returns {Promise<Object>}
     */
    async sendReaction(data) {
        return this.http.post('/chat/send-reaction', data);
    }

    /**
     * Cria uma enquete
     * @param {Object} data
     * @param {string} data.jid - Número/JID do destinatário
     * @param {string} data.name - Pergunta/título da enquete
     * @param {Array<string>} data.options - Opções da enquete
     * @param {number} data.selectableCount - Quantidade de opções selecionáveis (opcional)
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
     * @param {string} data.type - 'composing' (digitando) ou 'recording' (gravando áudio)
     * @returns {Promise<Object>}
     */
    async typing(data) {
        return this.http.post('/chat/typing', data);
    }

    /**
     * Marca mensagens como lidas
     * @param {Object} data
     * @param {string} data.jid - Número/JID da conversa
     * @param {Array<string>} data.ids - IDs das mensagens (opcional, dependendo da implementação)
     * @returns {Promise<Object>}
     */
    async markRead(data) {
        return this.http.post('/chat/mark-read', data);
    }

    /**
     * Lista mensagens de uma conversa
     * @param {Object} params - Parâmetros de query (ex: jid, limit, before)
     * @returns {Promise<Object>}
     */
    async getMessages(params = {}) {
        return this.http.get('/chat/messages', { params });
    }

    /**
     * Lista conversas da sessão
     * @returns {Promise<Object>}
     */
    async getChats() {
        return this.http.get('/chat/chats');
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
     * Converte mídia de uma mensagem recebida em base64
     * @param {Object} data
     * @param {string} data.id_message - ID da mensagem com mídia
     * @returns {Promise<Object>}
     */
    async mediaToBase64(data) {
        return this.http.post('/chat/midiaToBase64', data);
    }
}
