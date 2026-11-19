import React from 'react';
import { Siren } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * The dashboard's SOS entry point. It only navigates to the SOS page; it does
 * not call or dispatch anything by itself.
 *
 * compact → small pill for the top bar; default → large banner button.
 */
export default function SosButton({ onClick, compact = false }) {
  const { t } = useLanguage();
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={t('dashboard.sos.button.compactAria')}
        className="bg-red-600 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 hover:bg-red-700 active:scale-[0.97] transition-all shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
      >
        <Siren className="w-4 h-4" />
        {t('dashboard.sos.button.label')}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('dashboard.sos.button.aria')}
      className="relative shrink-0 w-24 h-24 rounded-full bg-red-600 text-white font-black text-2xl tracking-wider flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
    >
      <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping motion-reduce:animate-none" aria-hidden="true" />
      <Siren className="relative w-7 h-7" />
      <span className="relative">{t('dashboard.sos.button.label')}</span>
    </button>
  );
}
