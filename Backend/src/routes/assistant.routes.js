import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { chat } from '../controllers/assistant.controller.js';

const router = Router();

router.post('/chat', verifyJWT, strictLimiter, chat);

export default router;
