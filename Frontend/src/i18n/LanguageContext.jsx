import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setApiLanguage } from '../lib/api';
import {
  DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_BY_CODE, LANGUAGE_STORAGE_KEY, matchLanguage,
} from './languages';
import { englishDictionary, interpolate, loadDictionary } from './loader';

const LanguageContext = createContext(null);

function initialLanguage() {
  try {
    const stored = matchLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    if (stored) return stored;
  } catch { /* storage can be unavailable (private mode) */ }
  for (const tag of navigator.languages || [navigator.language]) {
    const hit = matchLanguage(tag);
    if (hit) return hit;
  }
  return DEFAULT_LANGUAGE;
}

// Tell the API layer the saved language before anything renders, so requests
// fired on first load (e.g. the session check) already carry the right header
// instead of waiting for the dictionary to download.
setApiLanguage(initialLanguage());

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [dictionary, setDictionary] = useState(englishDictionary);
  const [loading, setLoading] = useState(false);

  const setLanguage = useCallback(async (code) => {
    const next = matchLanguage(code) || DEFAULT_LANGUAGE;
    setApiLanguage(next); // the AI should follow the choice immediately
    setLoading(true);
    try {
      // Swap only once the dictionary is ready, so the UI never flashes raw keys.
      const dict = await loadDictionary(next);
      setDictionary(dict);
      setLanguageState(next);
      try { localStorage.setItem(LANGUAGE_STORAGE_KEY, next); } catch { /* ignore */ }
    } catch (err) {
      console.error('Could not load language', next, err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const first = initialLanguage();
    if (first !== DEFAULT_LANGUAGE) setLanguage(first);
  }, [setLanguage]);

  // Keep <html lang> in step with the choice. The API header is set directly in
  // setLanguage() (and at module load) so it never lags behind the dictionary
  // download or reverts to English while that is in flight.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key, vars) => {
    const template = dictionary[key] ?? englishDictionary[key];
    if (template === undefined) {
      if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`);
      return key;
    }
    return interpolate(template, vars);
  }, [dictionary]);

  const value = useMemo(
    () => ({ language, locale: LANGUAGE_BY_CODE[language].locale, setLanguage, t, languages: LANGUAGES, loading }),
    [language, setLanguage, t, loading]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
