import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { verifyJWT } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  updateProfile,
} from '../controllers/auth.controller.js';

const router = Router();

console.log("✅ auth.routes.js loaded");

router.post(
  '/register',
  strictLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  ],
  validate,
  register
);

router.post(
  '/login',
  strictLimiter,
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/refresh', refreshAccessToken);
router.post('/logout', verifyJWT, logout);
router.get('/me', verifyJWT, getMe);
router.patch('/me', verifyJWT, updateProfile);

export default router;
