import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { getMatchedSchemes, listAllSchemes } from '../controllers/scheme.controller.js';

const router = Router();

router.get('/', listAllSchemes);
router.post('/match', verifyJWT, strictLimiter, getMatchedSchemes);

export default router;
