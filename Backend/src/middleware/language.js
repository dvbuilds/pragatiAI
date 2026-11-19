import { resolveLanguage } from '../config/languages.js';

/**
 * Resolves the caller's language once per request into `req.language`.
 *
 * Order: `X-App-Language` header (set by the frontend's axios client for every
 * call) → `language` in the JSON body → `Accept-Language` → English.
 * Controllers pass `req.language` to the AI service so replies follow the
 * language the user picked in the UI.
 */
export const attachLanguage = (req, res, next) => {
  const raw = req.get('x-app-language') || req.body?.language || req.get('accept-language');
  req.language = resolveLanguage(raw);
  res.setHeader('Content-Language', req.language);
  next();
};
