export interface AIProvider {
  /**
   * Genera una respuesta basada en el contexto y el historial de mensajes.
   * @param systemPrompt Las instrucciones base de cómo debe comportarse el bot.
   * @param knowledge El texto plano con la información de la empresa.
   * @param chatHistory El historial de la conversación actual.
   * @param userMessage El nuevo mensaje del usuario.
   * @param model El identificador del modelo (ej. 'llama-3.1-8b-instant').
   * @param temperature Nivel de creatividad del 0 al 1.
   */
  generateResponse(
    systemPrompt: string,
    knowledge: string,
    chatHistory: { role: 'user' | 'assistant' | 'system', content: string }[],
    userMessage: string,
    model: string,
    temperature: number
  ): Promise<string>;

  /**
   * Transcribe un archivo de audio a texto usando un modelo de STT (Speech-to-Text).
   * @param audioPath Ruta absoluta al archivo temporal de audio.
   * @returns Un objeto con el texto transcrito y la duración en segundos.
   */
  transcribeAudio(audioPath: string): Promise<{ text: string; duration: number }>;
}
