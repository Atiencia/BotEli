require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const Groq = require('groq-sdk');

async function test() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log("Evaluating...");
    const systemPrompt = `
Eres un analista de datos evaluando interacciones entre un cliente y un humano (agente de ventas).
Tu objetivo es determinar si la Respuesta del humano contiene información de valor para el negocio (ej. precios, características, políticas, disponibilidad) que el bot debería aprender.

Reglas:
1. Si la respuesta es un saludo genérico ("Hola", "Buen día"), una disculpa genérica ("Lo siento"), o información irrelevante, responde EXACTAMENTE con la palabra: NO
2. Si la respuesta contiene información valiosa que responde a la pregunta, resume el aprendizaje en un formato limpio y directo (sin saludos ni despedidas) para agregarlo a la Base de Conocimiento.
`;
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Pregunta: ¿Tienen una sucursal en el Centro Comercial shopping?\nRespuesta: No contamos con ninguna sucursal en ese centro comercial, tenemos sucursales en centros comerciales como Unicenter y Abasto, solamente en la provincia de Buenos Aires y Entre Ríos` }
      ],
      model: 'openai/gpt-oss-20b',
      temperature: 0.1,
    });
    
    const result = completion.choices[0]?.message?.content;
    console.log("Groq Result:", result);
    
    if (result === 'NO') {
      console.log("Groq rejected it.");
      return;
    }
    
    console.log("Inserting to DB...");
    const { data, error } = await supabase.from('knowledge').insert({
      user_id: 'e06a33be-5121-4f51-b847-a2f026725225', 
      category: 'Aprendizaje Automático',
      content: `[Aprendido del Handoff] ${result}`
    });
    if (error) console.error("DB Error:", error);
    else console.log("Inserted!");
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
