/**
 * UI languages. A language appears in the picker once it is listed here AND
 * has a folder of dictionaries at ./locales/<code>/. To add a language:
 *   1. add it below,
 *   2. copy ./locales/en/*.js into ./locales/<code>/ and translate the values
 *      (keys and {placeholders} must stay identical — run `npm run i18n:check`).
 * Nothing else needs to change; the backend already accepts all 22 scheduled
 * languages (Backend/src/config/languages.js).
 */
export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', locale: 'en-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', locale: 'hi-IN' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', locale: 'bn-IN' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', locale: 'ta-IN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', locale: 'te-IN' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', locale: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', locale: 'gu-IN' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', locale: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', locale: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', locale: 'pa-IN' },
];

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_STORAGE_KEY = 'cp_language';
export const LANGUAGE_BY_CODE = Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));

/** "hi-IN" / "bn" / unknown → a supported code or null. */
export function matchLanguage(tag) {
  if (typeof tag !== 'string') return null;
  const code = tag.trim().toLowerCase().split(/[-_]/)[0];
  return LANGUAGE_BY_CODE[code] ? code : null;
}
