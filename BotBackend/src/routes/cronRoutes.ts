import { Router } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../config/logger';

const router = Router();

// Endpoint invocado por Vercel Cron para mantener viva la BD (prevenir pausa por inactividad)
router.get('/ping', async (_req, res) => {
  try {
    // Consulta muy ligera solo para hacer actividad en Supabase
    const { data, error } = await supabase
      .from('bot_configs')
      .select('id')
      .limit(1);

    if (error) throw error;
    
    logger.info('Cron Ping exitoso: DB está viva');
    res.status(200).json({ status: 'ok', message: 'DB ping successful' });
  } catch (error) {
    logger.error('Error en Cron Ping:', error);
    res.status(500).json({ status: 'error', error });
  }
});

export default router;
