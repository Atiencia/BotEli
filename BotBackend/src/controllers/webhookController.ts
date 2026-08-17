import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../config/logger';
import { metaService } from '../services/MetaService';
import { aiService } from '../services/AIService';
import { embeddingService } from '../services/EmbeddingService';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * GET: Verificación del Webhook por parte de Meta
 */
export const verifyWebhook = async (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token) {
    try {
      // Buscamos si existe algun bot con este verify_token
      const { data, error } = await supabase
        .from('bot_configs')
        .select('id')
        .eq('meta_verify_token', token)
        .single();

      if (data && !error) {
        logger.info('Webhook verified successfully by Meta.');
        return res.status(200).send(challenge);
      }
    } catch (err) {
      logger.error('Database error during webhook verification', err);
    }
    
    logger.warn(`Webhook verification failed for token: ${token}`);
    return res.sendStatus(403);
  }

  res.sendStatus(400);
};

/**
 * POST: Recepción de mensajes de Instagram/Messenger
 */
export const handleIncomingMessage = async (req: Request, res: Response) => {
  const body = req.body;

  // Verificamos si es un evento de pagina
  if (body.object === 'instagram' || body.object === 'page') {
    let platform = 'instagram';
    if (body.object === 'page') {
      platform = 'messenger';
    }
    for (const entry of body.entry) {
      // El ID de la pagina de Instagram/Facebook
      const pageId = entry.id;

      // Por ahora es un MVP. En un SaaS real, buscariamos el bot_config usando este pageId.
      // Como MVP, simplemente tomamos la configuracion del usuario activo.
      const { data: botConfig, error: botError } = await supabase
        .from('bot_configs')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (botError || !botConfig || !botConfig.meta_access_token) {
        logger.error(`No active bot config found to process message for page ${pageId}`);
        continue;
      }

      if (entry.messaging) {
        for (const webhookEvent of entry.messaging) {
          // Ignorar los "echoes" (mensajes que el propio bot o un humano mandó desde la página)
          if (webhookEvent.sender?.id === pageId) {
            continue;
          }

          // Procesamos mensajes de texto o de audio (ignoramos leídos, entregados, etc)
          const messageData = webhookEvent.message;
          if (messageData && (messageData.text || (messageData.attachments && messageData.attachments.length > 0))) {
            const senderId = webhookEvent.sender.id;
            const metaMessageId = messageData.mid;
            let messageText = messageData.text;
            let forceHandoff = false;

            // Si hay un adjunto y es de tipo audio, lo descargamos y transcribimos
            if (!messageText && messageData.attachments) {
              const attachment = messageData.attachments[0];
              if (attachment.type === 'audio' && attachment.payload && attachment.payload.url) {
                try {
                  const audioUrl = attachment.payload.url;
                  logger.info(`Downloading audio from: ${audioUrl}`);
                  
                  // Meta requiere el token para descargar el archivo
                  const response = await axios({
                    method: 'GET',
                    url: audioUrl,
                    responseType: 'stream',
                    headers: {
                      Authorization: `Bearer ${botConfig.meta_access_token}`
                    }
                  });

                  const tempFilePath = path.join(os.tmpdir(), `audio_${metaMessageId}.mp4`);
                  const writer = fs.createWriteStream(tempFilePath);
                  
                  await new Promise((resolve, reject) => {
                    response.data.pipe(writer);
                    let error: Error | null = null;
                    writer.on('error', (err: Error) => {
                      error = err;
                      writer.close();
                      reject(err);
                    });
                    writer.on('close', () => {
                      if (!error) resolve(true);
                    });
                  });

                  // Transcribir el audio usando Groq
                  logger.info(`Transcribing audio: ${tempFilePath}`);
                  const transcription = await aiService.transcribeAudio(tempFilePath);
                  
                  if (transcription.duration > 60) {
                    logger.info(`Audio too long (${transcription.duration}s). Triggering handoff.`);
                    messageText = `[Nota de voz recibida de ${transcription.duration.toFixed(0)} segundos. Es demasiado larga para el bot. Handoff a humano activado automáticamente]`;
                    forceHandoff = true;
                  } else {
                    messageText = `[Nota de voz transcrita]: ${transcription.text}`;
                  }
                  
                  // Limpiar archivo temporal
                  fs.unlinkSync(tempFilePath);
                } catch (err: any) {
                  logger.error('Error processing audio attachment:', err.message);
                  messageText = '[Nota de voz no procesada. Por favor, comunícate por texto o espera a un humano]';
                }
              } else if (attachment.type === 'image') {
                logger.info('Image attachment received. Triggering handoff.');
                messageText = `[Imagen adjunta] ${messageText || ''}`.trim();
                forceHandoff = true;
              } else {
                continue; // Ignoramos videos, stickers si no vienen acompañados de texto
              }
            }

            if (!messageText) continue;

            logger.info(`Received message from ${senderId}: ${messageText}`);

            try {
              // 1. Guardar mensaje del usuario en BD
              const { error: insertError } = await supabase.from('chats').insert({
                platform_user_id: senderId,
                user_id: botConfig.user_id,
                role: 'user',
                content: messageText,
                meta_message_id: metaMessageId,
                platform
              });

              if (insertError) {
                // 23505 es el código de error de PostgreSQL para Unique Violation
                if (insertError.code === '23505') {
                  logger.info(`Message ${metaMessageId} already processed. Ignoring duplicate.`);
                  continue; // Saltamos este mensaje ya que lo procesamos antes
                } else {
                  throw insertError; // Si es otro error, lo lanzamos
                }
              }

              // 2. Registrar cliente y comprobar si el bot está pausado (Handoff a humano)
              const { data: customerData } = await supabase
                .from('customers')
                .select('is_bot_active, profile_name')
                .eq('platform_user_id', senderId)
                .eq('user_id', botConfig.user_id)
                .single();

              // Si el cliente no existe, lo creamos
              if (!customerData) {
                // Obtenemos el nombre usando Graph API
                const profile = await metaService.getUserProfile(senderId, botConfig.meta_access_token, platform);
                
                await supabase.from('customers').insert({
                  platform_user_id: senderId,
                  user_id: botConfig.user_id,
                  platform,
                  profile_name: profile?.name || 'Error_Fetch_1',
                  is_bot_active: !forceHandoff // Si forzamos handoff, se crea pausado
                });
              } else {
                // Si el cliente ya existe pero no tiene nombre, intentamos actualizarlo
                let updateData: any = { updated_at: new Date().toISOString() };
                
                if (!customerData.profile_name || customerData.profile_name.startsWith('Error')) {
                  const profile = await metaService.getUserProfile(senderId, botConfig.meta_access_token, platform);
                  updateData.profile_name = profile?.name || 'Error_Fetch_2';
                }

                if (forceHandoff) {
                  updateData.is_bot_active = false;
                }

                await supabase.from('customers')
                  .update(updateData)
                  .eq('platform_user_id', senderId)
                  .eq('user_id', botConfig.user_id);
              }

              // Si un humano pauso el bot para este cliente, o hubo forceHandoff, no hacemos nada más
              if (forceHandoff || (customerData && customerData.is_bot_active === false)) {
                logger.info(`Bot is paused or forceHandoff triggered for customer ${senderId}. Skipping AI response.`);
                continue;
              }

              // 3. Búsqueda semántica de conocimiento (RAG real con pgvector)
              let knowledgeText = '';
              try {
                const queryEmbedding = await embeddingService.generateEmbedding(messageText);
                
                // Llamamos a la función de Postgres creada en supabase_setup.sql
                const { data: matches, error: matchError } = await supabase.rpc('match_knowledge', {
                  query_embedding: queryEmbedding,
                  match_threshold: 0.1, // Umbral muy bajo para ser permisivos
                  match_count: 4, // Traemos hasta los 4 fragmentos más relevantes
                  p_user_id: botConfig.user_id
                });

                if (matchError) throw matchError;

                if (matches && matches.length > 0) {
                  knowledgeText = matches.map((m: any) => m.content).join('\n\n');
                  logger.info(`Found ${matches.length} semantic matches for context.`);
                } else {
                  // Si pgvector no encuentra nada (o si los embeddings son null por error de API)
                  logger.info('No semantic matches found or embeddings are null, using full knowledge base as fallback.');
                  const { data: fallbackData } = await supabase
                    .from('knowledge')
                    .select('content')
                    .eq('user_id', botConfig.user_id)
                    .limit(50); // LLMs tienen gran contexto, podemos pasar hasta 50 items sin problema
                  knowledgeText = fallbackData?.map(k => k.content).join('\n\n') || '';
                }
              } catch (embErr) {
                logger.error('Error in semantic search, falling back to full knowledge:', embErr);
                const { data: fallbackData } = await supabase
                  .from('knowledge')
                  .select('content')
                  .eq('user_id', botConfig.user_id)
                  .limit(50);
                knowledgeText = fallbackData?.map(k => k.content).join('\n\n') || '';
              }

              // 4. Obtener Historial de Chat reciente (ultimos 10 mensajes)
              const { data: chatHistoryData } = await supabase
                .from('chats')
                .select('role, content')
                .eq('platform_user_id', senderId)
                .eq('user_id', botConfig.user_id)
                .order('timestamp', { ascending: false })
                .limit(20);

              const chatHistory = chatHistoryData 
                ? chatHistoryData
                    .reverse()
                    .filter(c => !c.content.startsWith('[SYSTEM'))
                    .slice(-6) // AHORRO DE TOKENS: Reducido de 10 a 6 mensajes de historial
                    .map(c => ({ role: c.role as 'user' | 'assistant', content: c.content }))
                : [];

              // 4.5 Pre-verificación por palabras clave: buscar si algún conocimiento responde la pregunta
              // Esto ayuda al modelo pequeño a no hacer HANDOFF cuando la respuesta SÍ está disponible
              const queryWords = messageText.toLowerCase()
                .replace(/[¿?¡!.,]/g, '')
                .split(/\s+/)
                .filter((w: string) => w.length > 3); // solo palabras de más de 3 letras
              
              const knowledgeItems = knowledgeText.split('\n\n');
              const matchingItems: string[] = [];
              
              for (const item of knowledgeItems) {
                const itemLower = item.toLowerCase();
                const matchCount = queryWords.filter((word: string) => itemLower.includes(word)).length;
                // Si al menos 40% de las palabras clave coinciden, es un match
                if (queryWords.length > 0 && matchCount / queryWords.length >= 0.4) {
                  matchingItems.push(item);
                }
              }
              
              let knowledgeHint = '';
              if (matchingItems.length > 0) {
                knowledgeHint = `\n\n>>> NOTA IMPORTANTE: La respuesta a la pregunta del cliente SÍ ESTÁ en tu Base de Conocimiento. Usa esta información para responder directamente. NO uses [HANDOFF]:\n${matchingItems.join('\n')}\n<<<`;
                logger.info(`Keyword pre-check found ${matchingItems.length} matching knowledge items.`);
              }

              // 5. Generar respuesta con IA
              let aiResponse = await aiService.getBotResponse(
                botConfig.system_prompt,
                knowledgeText + knowledgeHint,
                chatHistory,
                messageText,
                botConfig.model,
                botConfig.temperature
              );

              // 5.1 Red de seguridad: detectar frases robóticas que la IA no debería decir
              // Si la IA olvidó poner [HANDOFF] pero respondió como robot, lo convertimos a HANDOFF automáticamente
              const roboticPhrases = [
                'no tengo suficiente información',
                'no cuento con esa información',
                'no tengo acceso',
                'no tengo esa información',
                'no dispongo de esa información',
                'no tengo datos',
                'como asistente virtual',
                'como asistente de',
                'según mi base de datos',
                'no puedo proporcionar',
                'no tengo la información',
                'no poseo esa información',
                'lamentablemente no',
                'no tengo el dato exacto',
                'no cuento con el dato',
                'no tengo la dirección',
                'no tengo el horario',
              ];
              
              const lowerResponse = aiResponse.toLowerCase();
              const isRobotic = roboticPhrases.some(phrase => lowerResponse.includes(phrase));
              
              if (isRobotic && !/\[.*?HANDOFF.*?\]/i.test(aiResponse)) {
                logger.info(`Robotic response detected, auto-converting to HANDOFF: "${aiResponse.substring(0, 60)}..."`);
                aiResponse = '[HANDOFF] Dejame verificar eso y te confirmo enseguida 😊';
              }

              // 5.2 Auto-Handoff Secreto
              // Usamos Regex para atrapar cualquier variación (ej. [HANDOFF], [T HANDOFF], **[HANDOFF]**)
              if (/\[.*?HANDOFF.*?\]/i.test(aiResponse) || aiResponse.includes('[HANDOFF]')) {
                // Pausamos el bot automáticamente
                await supabase.from('customers')
                  .update({ is_bot_active: false, updated_at: new Date().toISOString() })
                  .eq('platform_user_id', senderId)
                  .eq('user_id', botConfig.user_id);
                  
                logger.info(`Auto-Handoff triggered for customer ${senderId}. Bot muted.`);
                
                // Handoff silencioso: No enviamos nada a Meta ni guardamos respuesta del bot.
                // Saltamos al siguiente mensaje.
                continue;
              }

              // 6. Enviar respuesta por Graph API
              const sent = await metaService.sendMessage(senderId, aiResponse, botConfig.meta_access_token);

              if (sent) {
                // 7. Guardar respuesta del bot en BD
                await supabase.from('chats').insert({
                  platform_user_id: senderId,
                  user_id: botConfig.user_id,
                  role: 'assistant',
                  content: aiResponse,
                  platform
                });
                logger.info(`Successfully replied to ${senderId}`);
              }
            } catch (err) {
              logger.error('Error processing webhook event:', err);
            }
          }
        }
      }
    }
    
    // IMPORTANTE: En Vercel enviamos el status 200 al FINAL de todo el proceso.
    // Si lo enviamos al inicio, Vercel mata la función y nunca se ejecuta la IA.
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};
