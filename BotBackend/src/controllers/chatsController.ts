import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { supabase } from '../config/supabase';
import { logger } from '../config/logger';
import { metaService } from '../services/MetaService';
import { GroqProvider } from '../services/providers/GroqProvider';
import { embeddingService } from '../services/EmbeddingService';

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    logger.error('Error fetching chats:', err);
    res.status(500).json({ error: 'Error fetching chats' });
  }
};

export const sendChatMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { platform_user_id, platform, message, image_url } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    if (!platform_user_id || (!message && !image_url)) {
      res.status(400).json({ error: 'message o image_url son requeridos' });
      return;
    }

    // 1. Obtener la configuración completa del bot
    const { data: botConfig, error: configError } = await supabase
      .from('bot_configs')
      .select('meta_access_token')
      .eq('user_id', userId)
      .single();

    if (configError || !botConfig) {
      logger.error('Error obteniendo config:', configError);
      res.status(400).json({ error: 'Falta configurar los tokens' });
      return;
    }

    let finalContent = '';

    // Envío por Instagram/Messenger Graph API
    if (!botConfig.meta_access_token) {
      res.status(400).json({ error: 'Falta configurar el Token de Meta' });
      return;
    }

    if (image_url) {
      await metaService.sendImage(platform_user_id, image_url, botConfig.meta_access_token);
      finalContent += `[IMAGE: ${image_url}]\n`;
    }

    if (message && message.trim().length > 0) {
      await metaService.sendMessage(platform_user_id, message, botConfig.meta_access_token);
      finalContent += message;
    }

    // Guardar el mensaje enviado en la BD
    const { error: insertError } = await supabase
      .from('chats')
      .insert({
        user_id: userId,
        platform_user_id,
        role: 'assistant',
        content: finalContent.trim(),
        platform: 'instagram'
      });

    if (insertError) {
      logger.error('Error guardando mensaje manual:', insertError);
    }

    // AUTO-APRENDIZAJE: Obtener el último mensaje del usuario
    try {
      const { data: lastUserMsgData } = await supabase
        .from('chats')
        .select('content')
        .eq('platform_user_id', platform_user_id)
        .eq('role', 'user')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (lastUserMsgData?.content && !lastUserMsgData.content.includes('[Imagen adjunta]')) {
        const groq = new GroqProvider();
        const learnedInfo = await groq.evaluateKnowledge(lastUserMsgData.content, finalContent.trim());
        
        if (learnedInfo && learnedInfo.category && learnedInfo.content) {
          // Generar embedding semántico para que el bot pueda encontrarlo luego
          let embedding: number[] = [];
          try {
            embedding = await embeddingService.generateEmbedding(`${learnedInfo.category}: ${learnedInfo.content}`);
          } catch (embError) {
            logger.error('Error generating embedding in auto-learning:', embError);
          }

          // Si Llama 3 determinó que es información valiosa, la guardamos
          await supabase.from('knowledge').insert({
            user_id: userId,
            category: learnedInfo.category,
            content: learnedInfo.content,
            embedding: embedding.length > 0 ? embedding : null
          });
          logger.info(`Nueva pieza de conocimiento aprendida: ${learnedInfo.category}`);
        } else {
          logger.info('Auto-learning: Groq evaluated to null or NO.');
        }
      }
    } catch (learnError: any) {
      logger.error('Error en el módulo de auto-aprendizaje:', learnError);
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    logger.error('Error enviando mensaje manual:', err.message);
    res.status(500).json({ error: 'Error enviando mensaje' });
  }
};
