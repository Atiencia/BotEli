import { Router } from 'express';
import { simulateChat, simulateAudioChat } from '../controllers/simulateController';

const router = Router();

// Endpoint publico, no usa authMiddleware
router.post('/', simulateChat);
router.post('/audio', simulateAudioChat);

export default router;
