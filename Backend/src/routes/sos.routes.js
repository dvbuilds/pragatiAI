import { Router } from 'express';
import { query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { sosLimiter } from '../middleware/rateLimiter.js';
import { getNearbyServices, geocode } from '../controllers/sos.controller.js';
import { CATEGORY_KEYS, MAX_RADIUS_KM } from '../services/sos.service.js';

const router = Router();

// Deliberately NOT behind verifyJWT: in an emergency a lookup must not fail
// because an access token expired. The routes are read-only, return only
// public map data, and are rate-limited instead.
router.use(sosLimiter);

router.get(
  '/nearby',
  [
    query('lat').isFloat({ min: -90, max: 90 }).withMessage('lat must be a number between -90 and 90'),
    query('lng').isFloat({ min: -180, max: 180 }).withMessage('lng must be a number between -180 and 180'),
    query('radiusKm')
      .optional()
      .isFloat({ min: 0.5, max: MAX_RADIUS_KM })
      .withMessage(`radiusKm must be between 0.5 and ${MAX_RADIUS_KM}`),
    query('categories')
      .optional()
      .custom((value) => {
        const list = String(value).split(',').map((c) => c.trim()).filter(Boolean);
        if (list.length === 0 || !list.every((c) => CATEGORY_KEYS.includes(c))) {
          throw new Error(`categories must be a comma-separated subset of: ${CATEGORY_KEYS.join(', ')}`);
        }
        return true;
      }),
  ],
  validate,
  getNearbyServices
);

router.get(
  '/geocode',
  [
    query('q')
      .isString()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Enter a 6-digit PIN code or an area name (3–100 characters)'),
  ],
  validate,
  geocode
);

export default router;
