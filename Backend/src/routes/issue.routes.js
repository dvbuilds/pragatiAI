import { Router } from 'express';
import { verifyJWT, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createIssue,
  listIssues,
  getIssue,
  updateIssueStatus,
} from '../controllers/issue.controller.js';

const router = Router();

router.use(verifyJWT);

router.post('/', upload.single('photo'), createIssue);
router.get('/', listIssues);
router.get('/:id', getIssue);
router.patch('/:id/status', requireRole('admin'), updateIssueStatus);

export default router;
