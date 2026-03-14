const wppconnect = require('@wppconnect-team/wppconnect');
const fs = require('fs');
const perguntarIA = require('./ia');
const transcrever = require('./transcrever');
const ehAgricola = require('./filtro');

wppconnect.create().then(client => start(client));

function start(client){

  client.onMessage(async (message) => {

    if(message.isGroupMsg) return;

    if(message.fromMe) return;
    // TEXTO
    if(message.type === 'chat'){
      console.log("Mensagem recebida");
      /*if(!ehAgricola(message.body)){
        client.sendText(message.from,
          "🌱 Eu sou especializado apenas em plantação.");
        return;
      }*/

      client.sendText(message.from,"🌾 Analisando...");
      console.log("Enviando para IA, pergunta: ", message.body);
      const resposta = await perguntarIA(message.body);
      console.log("Resposta IA:", resposta);
      client.sendText(message.from, resposta);
    }

    // ÁUDIO
    if(message.type === 'ptt' || message.type === 'audio'){

      client.sendText(message.from,"🎤 Transcrevendo áudio...");

      const buffer = await client.decryptFile(message);
      const caminho = `audio/${Date.now()}.ogg`;

      fs.writeFileSync(caminho, buffer);

      const texto = await transcrever(caminho);

      if(!ehAgricola(texto)){
        client.sendText(message.from,
          "🌱 Eu só respondo perguntas sobre plantação.");
        return;
      }

      client.sendText(message.from,"🌾 Consultando especialista agrícola...");

      const resposta = await perguntarIA(texto);
      client.sendText(message.from, resposta);

      fs.unlinkSync(caminho);
    }

  });

}