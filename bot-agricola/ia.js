const axios = require('axios');

async function perguntarIA(pergunta){

  const promptSistema = `
Você é um engenheiro agrônomo especialista em cultivo agrícola.

REGRAS:
- Responda apenas sobre plantação.
- Se não for agricultura, responda:
"Desculpe, eu só respondo perguntas sobre plantação."
- Seja técnico, claro e objetivo.
`;
  try{
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'phi3:mini',
        prompt: promptSistema + "\nPergunta: " + pergunta,
        stream: false,
        options: {
          num_predict: 200
        }
      }
    );

    return response.data.response;
  
  }catch(e){
    console.log("ERRO OLLAMA:");
    console.log(e.response?.data || e.message);

    return "Erro ao consultar especialista agrícola.";
  }
}

module.exports = perguntarIA;