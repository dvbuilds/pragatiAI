import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, User, Save, LogOut, Loader2, CheckCircle2, AlertCircle, ShieldCheck
} from 'lucide-react';
import api from '../lib/api';
import Sidebar from '../components/Sidebar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';

// Values are what the API stores; labelKey is only for display.
const GENDER_OPTIONS = [
  { value: '', labelKey: 'settings.gender.none' },
  { value: 'male', labelKey: 'settings.gender.male' },
  { value: 'female', labelKey: 'settings.gender.female' },
  { value: 'other', labelKey: 'settings.gender.other' },
];

const CATEGORY_OPTIONS = [
  { value: '', labelKey: 'settings.category.none' },
  { value: 'general', labelKey: 'settings.category.general' },
  { value: 'obc', labelKey: 'settings.category.obc' },
  { value: 'sc', labelKey: 'settings.category.sc' },
  { value: 'st', labelKey: 'settings.category.st' },
  { value: 'ews', labelKey: 'settings.category.ews' },
  { value: 'other', labelKey: 'settings.category.other' },
];

export default function SettingsPage({ onNavigate, onLogout, currentUser, onProfileUpdated }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: '',
    annualIncome: '',
    state: '',
    category: '',
    occupation: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    setForm({
      fullName: currentUser.fullName || '',
      phone: currentUser.phone || '',
      age: currentUser.profile?.age ?? '',
      gender: currentUser.profile?.gender || '',
      annualIncome: currentUser.profile?.annualIncome ?? '',
      state: currentUser.profile?.state || '',
      category: currentUser.profile?.category || '',
      occupation: currentUser.profile?.occupation || '',
    });
  }, [currentUser]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveState(null);
    setErrorMessage('');

    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        age: form.age === '' ? undefined : Number(form.age),
        gender: form.gender || undefined,
        annualIncome: form.annualIncome === '' ? undefined : Number(form.annualIncome),
        state: form.state || undefined,
        category: form.category || undefined,
        occupation: form.occupation || undefined,
      };
      const { data } = await api.patch('/auth/me', payload);
      onProfileUpdated?.(data.data);
      setSaveState('success');
    } catch (err) {
      setSaveState('error');
      setErrorMessage(err?.response?.data?.message || t('settings.save.error'));
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveState(null), 4000);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7f9fb] text-[#191c1e] font-sans flex">
      
      <Sidebar 
        activeTab="settings" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="w-full h-16 bg-white border-b border-[#c6c6cd]/40 flex items-center px-6 md:px-10 sticky top-0 z-30 shadow-sm">
          <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-sm font-semibold text-[#45464d] hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('settings.back')}
            </button>
            <span className="lg:hidden font-extrabold text-lg text-black">CivicPulse AI</span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-10 w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mb-1">{t('settings.title')}</h1>
            <p className="text-sm text-[#45464d]">
              {t('settings.intro')}
            </p>
          </div>

          <section className="bg-white border border-[#c6c6cd]/40 rounded-2xl shadow-sm p-6 md:p-8 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#131b2e]">{t('settings.language.title')}</h2>
              <p className="text-xs text-[#45464d] mt-1 max-w-md">{t('settings.language.description')}</p>
            </div>
            <LanguageSwitcher variant="light" className="shrink-0" />
          </section>

          <form onSubmit={handleSubmit} className="bg-white border border-[#c6c6cd]/40 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            {/* Basic info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#131b2e]">
              <User className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">{t('settings.basic.title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.basic.fullName')}</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-sm outline-none focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.basic.phone')}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder={t('settings.basic.phonePlaceholder')}
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-sm outline-none focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.basic.email')}</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-slate-100 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Scheme-matching profile */}
          <section className="space-y-4 pt-2 border-t border-[#c6c6cd]/30">
            <div className="flex items-center gap-2 text-[#131b2e]">
              <ShieldCheck className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">{t('settings.eligibility.title')}</h2>
            </div>
            <p className="text-xs text-[#45464d] -mt-2">{t('settings.eligibility.note')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.eligibility.age')}</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={form.age}
                  onChange={handleChange('age')}
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-sm outline-none focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.eligibility.gender')}</label>
                <select
                  value={form.gender}
                  onChange={handleChange('gender')}
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-sm outline-none focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all"
                >
                  {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.eligibility.income')}</label>
                <input
                  type="number"
                  min="0"
                  value={form.annualIncome}
                  onChange={handleChange('annualIncome')}
                  placeholder={t('settings.eligibility.incomePlaceholder')}
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-sm outline-none focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.eligibility.state')}</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={handleChange('state')}
                  placeholder={t('settings.eligibility.statePlaceholder')}
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-sm outline-none focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.eligibility.category')}</label>
                <select
                  value={form.category}
                  onChange={handleChange('category')}
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-sm outline-none focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all"
                >
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-1.5">{t('settings.eligibility.occupation')}</label>
                <input
                  type="text"
                  value={form.occupation}
                  onChange={handleChange('occupation')}
                  placeholder={t('settings.eligibility.occupationPlaceholder')}
                  className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-sm outline-none focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all"
                />
              </div>
            </div>
          </section>

          {saveState === 'success' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-100 rounded-lg p-3">
              <CheckCircle2 className="w-4 h-4" />
              {t('settings.save.success')}
            </motion.div>
          )}
          {saveState === 'error' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose-700 text-xs font-semibold bg-rose-50 border border-rose-100 rounded-lg p-3">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#c6c6cd]/30">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {t('settings.logout')}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="h-11 px-6 bg-[#131b2e] text-white font-semibold text-sm rounded-lg hover:bg-[#131b2e]/90 active:scale-[0.99] transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('settings.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('settings.saveChanges')}
                </>
              )}
            </button>
          </div>
        </form>
        </main>
      </div>
    </div>
  );
}