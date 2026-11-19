import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Language picker. Options show each language in its own script so people can
 * find theirs even when the current UI language is unreadable to them.
 * variant: 'light' (white bars) | 'dark' (the dark sidebar).
 */
export default function LanguageSwitcher({ variant = 'light', className = '' }) {
  const { language, setLanguage, languages, loading, t } = useLanguage();
  const dark = variant === 'dark';

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{t('common.language')}</span>
      <Languages className={`absolute left-2.5 w-4 h-4 pointer-events-none ${dark ? 'text-slate-400' : 'text-slate-500'}`} aria-hidden="true" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        disabled={loading}
        aria-label={t('common.language')}
        className={`${className.includes('w-full') ? 'w-full ' : ''}appearance-none cursor-pointer rounded-lg pl-8 pr-3 py-2 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-60 ${
          dark
            ? 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10'
            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
        }`}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} lang={l.code} className="text-slate-900">
            {l.native}{l.code !== 'en' ? ` · ${l.name}` : ''}
          </option>
        ))}
      </select>
    </label>
  );
}
