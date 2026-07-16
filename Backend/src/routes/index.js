import { Router } from 'express';
import authRoutes from './auth.routes.js';
import issueRoutes from './issue.routes.js';
import complaintRoutes from './complaint.routes.js';
import documentRoutes from './document.routes.js';
import schemeRoutes from './scheme.routes.js';
import assistantRoutes from './assistant.routes.js';

const router = Router();

console.log("✅ routes/index.js loaded");

router.use('/auth', authRoutes);
router.use('/issues', issueRoutes);
router.use('/complaints', complaintRoutes);
router.use('/documents', documentRoutes);
router.use('/schemes', schemeRoutes);
router.use('/assistant', assistantRoutes);

export default router;
