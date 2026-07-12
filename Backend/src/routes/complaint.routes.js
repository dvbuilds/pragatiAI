import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { draftComplaint, sendComplaint, listMyComplaints } from '../controllers/complaint.controller.js';

const router = Router();

router.use(verifyJWT);

router.post('/draft', strictLimiter, draftComplaint);
router.post('/:id/send', strictLimiter, sendComplaint);
router.get('/', listMyComplaints);

export default router;
