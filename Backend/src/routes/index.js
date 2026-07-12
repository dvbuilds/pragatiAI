import { Router } from 'express';
import authRoutes from './auth.routes.js';
import issueRoutes from './issue.routes.js';
import complaintRoutes from './complaint.routes.js';
import documentRoutes from './document.routes.js';
import schemeRoutes from './scheme.routes.js';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/issues', issueRoutes);
router.use('/api/complaints', complaintRoutes);
router.use('/api/documents', documentRoutes);
router.use('/api/schemes', schemeRoutes);

export default router;
