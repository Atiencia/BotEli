require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const Groq = require('groq-sdk');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test(question, label) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  const { data: botConfig } = await supabase.from('bot_configs').select('*').limit(1).single();
  const { data: fallbackData } = await supabase
    .from('knowledge').select('content').eq('user_id', botConfig.user_id).limit(50);
  const knowledgeText = fallbackData?.map(k => k.content).join('\n\n') || '';

  // Simular pre-verificación por palabras clave (NUEVO)
  const queryWords = question.toLowerCase()
    .replace(/[¿?¡!.,]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  const knowledgeItems = knowledgeText.split('\n\n');
  const matchingItems = [];
  
  for (const item of knowledgeItems) {
    const itemLower = item.toLowerCase();
    const matchCount = queryWords.filter(word => itemLower.includes(word)).length;
    if (queryWords.length > 0 && matchCount / queryWords.length >= 0.4) {
      matchingItems.push(item);
    }
  }
  
  let knowledgeHint = '';
  if (matchingItems.length > 0) {
    knowledgeHint = `\n\n>>> NOTA IMPORTANTE: La respuesta a la pregunta del cliente SÍ ESTÁ en tu Base de Conocimiento. Usa esta información para responder directamente. NO uses [HANDOFF]:\n${matchingItems.join('\n')}\n<<<`;
  }

  const fullSystemPrompt = `
=== QUIÉN ERES ===
${botConfig.system_prompt || 'Eres un asistente virtual útil y amable.'}
Eres un HUMANO real atendiendo clientes por redes sociales. Jamás rompas este personaje.

=== BASE DE CONOCIMIENTO ===
${knowledgeText + knowledgeHint}

=== CÓMO RESPONDER (sigue estos pasos EN ORDEN) ===

PASO 1: ¿La respuesta está en la Base de Conocimiento de arriba?
- SÍ → Responde con esa información de forma corta y amigable (máximo 2-3 oraciones).
- NO → Ve al PASO 2.

PASO 2: ¿Es una pregunta general simple (saludo, agradecimiento, pregunta sobre productos/precios/envíos que SÍ están arriba)?
- SÍ → Responde normalmente.
- NO → Escribe EXACTAMENTE: [HANDOFF] seguido de una frase natural como si fueras a verificar tú mismo. Ejemplo: "[HANDOFF] Dejame chequear eso y te confirmo enseguida 😊"

=== REGLAS DE FORMATO ===
- Respuestas cortas (2-3 oraciones máximo).
- Emojis moderados.
- URLs sin formato Markdown (NO uses [texto](url), escribe la URL directa).
- NUNCA digas "Lo siento", "Disculpa", "No tengo información", "Como asistente", "Según mi base de datos" ni nada que suene a robot.
- NUNCA digas que eres un bot.
`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: fullSystemPrompt },
      { role: 'user', content: question }
    ],
    model: botConfig.model || 'openai/gpt-oss-20b',
    temperature: botConfig.temperature ?? 0.7,
    max_tokens: 1024,
  });

  let response = completion.choices[0]?.message?.content;
  let hasHandoff = /\[.*?HANDOFF.*?\]/i.test(response);
  
  console.log(`\n=== ${label} ===`);
  console.log(`Keywords matched: ${matchingItems.length > 0 ? matchingItems.length + ' items' : 'NONE'}`);
  console.log(`Hint injected: ${knowledgeHint ? 'YES' : 'NO'}`);
  console.log(`Pregunta: ${question}`);
  console.log(`Respuesta: ${response}`);
  console.log(`HANDOFF: ${hasHandoff ? 'SÍ' : 'NO'}`);
}

(async () => {
  // Run the same test 3 times to check consistency
  for (let i = 1; i <= 3; i++) {
    await test('¿Cuál es la dirección del centro comercial donde tienen la sucursal en Buenos Aires?', `TEST ${i}: Dirección (run ${i}/3)`);
  }
  await test('¿Tienen una sucursal en el Centro Comercial shopping?', 'TEST 4: Sucursales');
  await test('¿Cuánto cuestan las camisetas oversize?', 'TEST 5: Precios');
  await test('¿A qué hora abren la sucursal de Unicenter?', 'TEST 6: Horario (NO en conocimiento)');
})();
