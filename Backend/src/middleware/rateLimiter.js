import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: (Number(process.env.RATE_LIMIT_WINDOW_MIN) || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Tighter limits on sensitive/expensive routes (auth, AI generation, email sending)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests to this endpoint, slow down.' },
});

// Emergency lookups: read-only and public-data, so the cap is generous enough
// that a worried person retrying, changing radius or switching category never
// hits it, while still protecting the shared OpenStreetMap servers behind it.
export const sosLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.SOS_RATE_LIMIT_MAX) || 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many lookups in a short time. If this is an emergency, call 112 now.',
  },
});
