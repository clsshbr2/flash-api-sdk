import FlashApi from "./src/index.js";


const client = new FlashApi({
    baseUrl: 'http://nodejs-flash-api-1-0-6.yftbqi.easypanel.host/api',
    apiKey: '333da6c5-006a-4d6f-8cc4-5042ebd5ffca',
});

// Enviar mensagem
const teste = await client.chat.sendText({
    jid: '5521974963583@s.whatsapp.net',
    text: 'Olá mundo! 🚀',
});
console.log(teste)