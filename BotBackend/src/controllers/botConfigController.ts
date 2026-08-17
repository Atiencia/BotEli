import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { supabase } from '../config/supabase';
import { logger } from '../config/logger';

export const getBotConfig = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Buscar configuración existente
    const { data, error } = await supabase
      .from('bot_configs')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      logger.error('Error fetching bot config:', error);
      return res.status(500).json({ error: 'Error fetching configuration' });
    }

    if (!data) {
      // Si no existe, devolver una estructura por defecto para el frontend
      return res.status(200).json({
        system_prompt: 'Eres un asistente útil.',
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        meta_access_token: '',
        meta_verify_token: '',
        is_active: true
      });
    }

    res.status(200).json(data);
  } catch (err) {
    logger.error('Controller Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBotConfig = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { 
      id, created_at, updated_at, user_id, 
      whatsapp_access_token, whatsapp_phone_id, whatsapp_verify_token, 
      ...cleanConfigData 
    } = req.body;
    
    // Buscamos si ya existe una configuración para este usuario
    const { data: existingConfig, error: fetchError } = await supabase
      .from('bot_configs')
      .select('id')
      .eq('user_id', userId)
      .single();

    let data, error;

    if (existingConfig) {
      // Update
      const result = await supabase
        .from('bot_configs')
        .update({ ...cleanConfigData, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert
      const result = await supabase
        .from('bot_configs')
        .insert({ user_id: userId, ...cleanConfigData, updated_at: new Date().toISOString() })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      logger.error('Error updating bot config:', error);
      return res.status(500).json({ error: 'Error updating configuration', details: error.message || error });
    }

    res.status(200).json(data);
  } catch (err: any) {
    logger.error('Controller Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message || err });
  }
};
