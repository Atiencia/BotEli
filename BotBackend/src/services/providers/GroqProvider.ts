import fs from 'fs';
import Groq from 'groq-sdk';
import { AIProvider } from './AIProvider';
import { logger } from '../../config/logger';

export class GroqProvider implements AIProvider {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateResponse(
    systemPrompt: string,
    knowledge: string,
    chatHistory: { role: 'user' | 'assistant' | 'system', content: string }[],
    userMessage: string,
    model: string,
    temperature: number
  ): Promise<string> {
    
    // Inyectamos el conocimiento y las REGLAS DEL SISTEMA de forma transparente
    const fullSystemPrompt = `
=== QUIÉN ERES ===
${systemPrompt || 'Eres un asistente virtual útil y amable.'}
Eres un HUMANO real atendiendo clientes por redes sociales. Jamás rompas este personaje.

=== BASE DE CONOCIMIENTO ===
${knowledge || 'No hay información adicional.'}

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

    const messages = [
      { role: 'system' as const, content: fullSystemPrompt },
      ...chatHistory,
      { role: 'user' as const, content: userMessage }
    ];

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages,
        model: model || 'llama-3.1-8b-instant',
        temperature: temperature ?? 0.7,
        max_tokens: 1024,
      });

      return chatCompletion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
    } catch (error) {
      logger.error('Error in GroqProvider:', error);
      throw error;
    }
  }

  async transcribeAudio(audioPath: string): Promise<{ text: string; duration: number }> {
    try {
      logger.info(`Transcribing audio file: ${audioPath}`);
      const transcription = await this.groq.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: 'whisper-large-v3',
        response_format: 'verbose_json',
        language: 'es', // Podemos forzar español para mayor precisión y velocidad
        prompt: 'StyleAura, remeras oversize, camisetas oversize, talle, stock, ropa, tienda, envíos, Spanglish',
        temperature: 0.0
      });
      // @ts-ignore - The Groq SDK typings might not fully cover verbose_json return type for duration, but it is returned by the API.
      const duration = transcription.duration || 0;
      return { text: transcription.text, duration };
    } catch (error: any) {
      logger.error('Error transcribing audio with Groq Whisper:', error);
      throw new Error(`Audio transcription failed: ${error.message}`);
    }
  }

  async evaluateKnowledge(question: string, answer: string): Promise<{category: string, content: string} | null> {
    const systemPrompt = `
Eres un analista de datos evaluando interacciones entre un cliente y un humano (agente de ventas).
Tu objetivo es determinar si la Respuesta del humano contiene información de valor para el negocio (ej. precios, características, políticas, disponibilidad) que el bot debería aprender.

Reglas:
1. Si la respuesta es un saludo genérico ("Hola", "Buen día"), una disculpa genérica ("Lo siento"), o información irrelevante, responde EXACTAMENTE con la palabra: NO
2. Si la respuesta contiene información valiosa, genera un resumen completo que incluya TANTO la pregunta como la respuesta, para que cualquier persona pueda entender el dato sin necesidad de ver la pregunta original.
3. SIEMPRE debes responder ÚNICAMENTE con un objeto JSON válido con dos propiedades:
   - "categoria": la pregunta exacta del cliente
   - "conocimiento": un resumen COMPLETO y autocontenido que responda la pregunta de forma clara. Incluye todo el contexto necesario.
   No agregues formato Markdown (\`\`\`json) ni texto extra.

Ejemplo 1:
Pregunta: Hola
Respuesta: ¡Hola! ¿En qué te ayudo?
Tu salida: NO

Ejemplo 2:
Pregunta: ¿Cuál es la dirección de la sucursal de Unicenter?
Respuesta: Está en Jorge Newbery 152, Avenida Ecuador
Tu salida: {"categoria": "¿Cuál es la dirección de la sucursal de Unicenter?", "conocimiento": "La sucursal de Unicenter está ubicada en la dirección Jorge Newbery 152, Avenida Ecuador, Buenos Aires."}

Ejemplo 3:
Pregunta: ¿Tienen la remera oversize lila?
Respuesta: No tenemos ese color. Solo negro, blanco y beige.
Tu salida: {"categoria": "¿Tienen la remera oversize lila?", "conocimiento": "Las Remeras Oversize Urban Drop no están disponibles en color lila. Los colores disponibles son negro, blanco y beige."}
`;
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Pregunta: ${question}\nRespuesta: ${answer}` }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
      });

      const response = completion.choices[0]?.message?.content?.trim();
      if (!response || response === 'NO') return null;
      
      try {
        const json = JSON.parse(response);
        if (json.categoria && json.conocimiento) {
          return { category: json.categoria, content: json.conocimiento };
        }
      } catch (parseError) {
        logger.error('Error parsing JSON from Groq evaluation:', response);
      }
      return null;
    } catch (error) {
      logger.error('Error evaluating knowledge:', error);
      return null;
    }
  }
}
