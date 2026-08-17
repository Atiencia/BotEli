require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const axios = require('axios');

async function test() {
  const HF_API_URL = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) { console.log('NO API KEY'); return; }
  
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: 'Hola mundo', options: { wait_for_model: true } },
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );
    console.log('Success, length:', response.data.length);
  } catch (e) {
    console.error('API Error:', e.response?.data || e.message);
  }
}
test();
