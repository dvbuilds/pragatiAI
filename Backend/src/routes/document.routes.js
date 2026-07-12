import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { getDocumentGuide } from '../controllers/document.controller.js';

const router = Router();

router.post('/guide', verifyJWT, strictLimiter, getDocumentGuide);

export default router;
