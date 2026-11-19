/**
 * Languages the AI layer can be asked to reply in.
 *
 * Covers English plus all 22 languages of the Eighth Schedule of the Indian
 * Constitution. Which of these the *UI* offers is decided on the frontend
 * (a language shows up there once it has a translation dictionary); the
 * backend accepts any of them so adding a UI language never needs a backend
 * change.
 */
export const LANGUAGES = {
  en: { name: 'English', native: 'English' },
  hi: { name: 'Hindi', native: 'हिन्दी' },
  bn: { name: 'Bengali', native: 'বাংলা' },
  ta: { name: 'Tamil', native: 'தமிழ்' },
  te: { name: 'Telugu', native: 'తెలుగు' },
  mr: { name: 'Marathi', native: 'मराठी' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', native: 'മലയാളം' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  or: { name: 'Odia', native: 'ଓଡ଼ିଆ' },
  as: { name: 'Assamese', native: 'অসমীয়া' },
  ur: { name: 'Urdu', native: 'اردو' },
  sa: { name: 'Sanskrit', native: 'संस्कृतम्' },
  ne: { name: 'Nepali', native: 'नेपाली' },
  sd: { name: 'Sindhi', native: 'سنڌي' },
  ks: { name: 'Kashmiri', native: 'कॉशुर' },
  kok: { name: 'Konkani', native: 'कोंकणी' },
  mai: { name: 'Maithili', native: 'मैथिली' },
  doi: { name: 'Dogri', native: 'डोगरी' },
  mni: { name: 'Manipuri (Meitei)', native: 'ꯃꯩꯇꯩꯂꯣꯟ' },
  sat: { name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  brx: { name: 'Bodo', native: 'बड़ो' },
};

export const DEFAULT_LANGUAGE = 'en';

/**
 * Normalises whatever the client sent ("hi", "hi-IN", "HI_in", " bn ") to a
 * supported code. Anything unknown → English, never an error: a bad language
 * header must not break an otherwise valid request.
 */
export function resolveLanguage(input) {
  if (typeof input !== 'string') return DEFAULT_LANGUAGE;
  const code = input.trim().toLowerCase().split(/[-_,;\s]/)[0];
  return Object.hasOwn(LANGUAGES, code) ? code : DEFAULT_LANGUAGE;
}

/**
 * Prompt fragment telling the model which language to write in. Empty for
 * English so existing English prompts stay byte-for-byte unchanged.
 *
 * `keep` lists machine-readable fields that other code depends on and so must
 * stay in English even when the prose around them is translated.
 */
export function languageDirective(code, { keep = [] } = {}) {
  const lang = LANGUAGES[resolveLanguage(code)];
  if (resolveLanguage(code) === DEFAULT_LANGUAGE) return '';
  const keepLine = keep.length
    ? `\n- Keep these exactly as specified, in English / unchanged: ${keep.join('; ')}.`
    : '';
  return `

LANGUAGE REQUIREMENT:
- Write every human-readable text value in ${lang.name} (${lang.native}), in its native script — not transliterated into English letters.
- JSON keys and structure must stay exactly as shown; only translate the text values.
- Keep URLs, email addresses, numbers and official names of documents/schemes/laws recognisable (you may add the ${lang.name} name alongside).${keepLine}`;
}
