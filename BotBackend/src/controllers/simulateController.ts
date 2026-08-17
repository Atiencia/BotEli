import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../config/logger';
import { aiService } from '../services/AIService';
import { embeddingService } from '../services/EmbeddingService';

export const simulateChat = async (req: Request, res: Response) => {
  try {
    const { message, chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Para el demo publico, tomamos la configuracion del primer bot activo (el tuyo)
    const { data: botConfig, error: botError } = await supabase
      .from('bot_configs')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (botError || !botConfig) {
      return res.status(404).json({ error: 'No active bot found for simulation.' });
    }

    if (message.includes('[Imagen adjunta]')) {
      // Handoff silencioso inmediato para imágenes
      return res.status(200).json({ response: '', handoff: true });
    }

    let queryMessage = message;
    if (message.includes('[Nota de voz simulada]')) {
      // Simulamos que el backend transcribió el audio con una pregunta común
      queryMessage = '[Nota de voz transcrita]: Hola, ¿me puedes dar la dirección exacta de su tienda por favor?';
    }

    let knowledgeText = '';
    try {
      const queryEmbedding = await embeddingService.generateEmbedding(queryMessage);
      
      const { data: matches } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.1,
        match_count: 4,
        p_user_id: botConfig.user_id
      });

      if (matches && matches.length > 0) {
        knowledgeText = matches.map((m: any) => m.content).join('\n\n');
      }
    } catch (embErr) {
      logger.error('Simulation: Semantic search failed, using text fallback', embErr);
      const { data: fallbackData } = await supabase
        .from('knowledge')
        .select('content')
        .eq('user_id', botConfig.user_id)
        .limit(5);
      knowledgeText = fallbackData?.map(k => k.content).join('\n\n') || '';
    }

    let aiResponse = await aiService.getBotResponse(
      botConfig.system_prompt,
      knowledgeText,
      chatHistory,
      queryMessage,
      botConfig.model,
      botConfig.temperature
    );

    let isHandoff = false;
    if (aiResponse.includes('[HANDOFF]')) {
      isHandoff = true;
      aiResponse = aiResponse.replace(/\[HANDOFF\]/g, '').trim();
    }

    res.status(200).json({ response: aiResponse, handoff: isHandoff });
  } catch (err) {
    logger.error('Error in simulation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const simulateAudioChat = async (req: Request, res: Response) => {
  let tempFilePath = '';
  try {
    const { audioBase64, chatHistory = [] } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const { data: botConfig, error: botError } = await supabase
      .from('bot_configs')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (botError || !botConfig) {
      return res.status(404).json({ error: 'No active bot found for simulation.' });
    }

    // Guardar el audio en un archivo temporal
    const buffer = Buffer.from(audioBase64, 'base64');
    const os = require('os');
    const path = require('path');
    const fs = require('fs');
    tempFilePath = path.join(os.tmpdir(), `simulated_audio_${Date.now()}.webm`);
    fs.writeFileSync(tempFilePath, buffer);

    // Transcribir el audio con Groq Whisper
    const transcription = await aiService.transcribeAudio(tempFilePath);
    if (!transcription || !transcription.text) {
       throw new Error('Transcription failed or empty');
    }
    
    const queryMessage = `[Audio transcrito]: ${transcription.text}`;

    // Buscar en BD de conocimiento
    let knowledgeText = '';
    try {
      const queryEmbedding = await embeddingService.generateEmbedding(queryMessage);
      const { data: matches } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.1,
        match_count: 4,
        p_user_id: botConfig.user_id
      });
      if (matches && matches.length > 0) {
        knowledgeText = matches.map((m: any) => m.content).join('\n\n');
      }
    } catch (embErr) {
      const { data: fallbackData } = await supabase
        .from('knowledge')
        .select('content')
        .eq('user_id', botConfig.user_id)
        .limit(5);
      knowledgeText = fallbackData?.map(k => k.content).join('\n\n') || '';
    }

    // Obtener respuesta del LLM
    let aiResponse = await aiService.getBotResponse(
      botConfig.system_prompt,
      knowledgeText,
      chatHistory,
      queryMessage,
      botConfig.model,
      botConfig.temperature
    );

    let isHandoff = false;
    if (aiResponse.includes('[HANDOFF]')) {
      isHandoff = true;
      aiResponse = aiResponse.replace(/\[HANDOFF\]/g, '').trim();
    }

    res.status(200).json({ response: aiResponse, transcribedText: transcription.text, handoff: isHandoff });
  } catch (err) {
    logger.error('Error in audio simulation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    const fs = require('fs');
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};
