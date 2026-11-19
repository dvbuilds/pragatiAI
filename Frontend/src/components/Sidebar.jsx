import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Landmark,
  AlertTriangle,
  Siren,
  Mail,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', labelKey: 'sidebar.nav.dashboard', icon: LayoutDashboard },
  { key: 'documents', labelKey: 'sidebar.nav.documents', icon: FileText },
  { key: 'portal', labelKey: 'sidebar.nav.portal', icon: MapPin },
  { key: 'schemes', labelKey: 'sidebar.nav.schemes', icon: Landmark },
  { key: 'complaints', labelKey: 'sidebar.nav.complaints', icon: Mail },
  { key: 'sos', labelKey: 'sidebar.nav.sos', icon: Siren, danger: true },
];

export default function Sidebar({ activeTab, onNavigate, onLogout, currentUser, statLabel }) {
  const { t } = useLanguage();
  const resolvedStatLabel = statLabel ?? t('sidebar.profile.statLabel');
  const avatarUrl =
    currentUser?.avatarUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAslx00ZDXEeuyGt5P3zUS0AVLlEfeM0L6tiYHlI1FcTb3U6wjSihKCmJ5YfZpdOzqlaSxWOvwGUBUB36RQDc27t_3jL1A1Wk_7OWXTcdOA3_DBKGdPFPQudsqBsa0Ht730tiIv7sO8LrNVoSAMLLme_ipwMEYaWY2uVyDmqnlQeFOriaDuAA5CV0gr666jJri6W8itzhC0eIHlf8MQCui_NJkLfCL7G0nhE2ddT8_WXJWle-aowvKkjw';

  return (
    <aside className="hidden lg:flex min-h-screen w-72 flex-shrink-0 bg-[#141414] text-white">
      {/* Inner layer stays pinned to the viewport (same as before) while the
          outer <aside> above stretches to match the page's real height —
          this keeps the dark background from ending early on pages whose
          content runs taller than one screen (e.g. Government Schemes with
          many matches, or the Public Portal map + activity feed). */}
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">
      {/* Profile block with concentric glow rings, matching the reference */}
      <div className="relative px-8 pt-10 pb-8">
        <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-white/[0.03] pointer-events-none" />
        <div className="absolute -top-4 left-2 w-40 h-40 rounded-full bg-white/[0.04] pointer-events-none" />

        <div className="relative flex flex-col gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
            <img className="w-full h-full object-cover" src={avatarUrl} alt={currentUser?.fullName || t('sidebar.profile.defaultName')} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2dd4bf] leading-tight">
              {currentUser?.fullName?.split(' ')[0] || t('sidebar.profile.defaultName')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{resolvedStatLabel}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ key, labelKey, icon: Icon, danger }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? danger ? 'text-red-400 font-bold' : 'text-[#2dd4bf] font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? (danger ? 'text-red-400' : 'text-[#2dd4bf]') : danger ? 'text-red-400/80' : 'text-slate-400'}`} />
              <span className="text-sm">{t(labelKey)}</span>
            </button>
          );
        })}

        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[#2dd4bf] font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
          }`}
        >
          <Settings className={`w-5 h-5 shrink-0 ${activeTab === 'settings' ? 'text-[#2dd4bf]' : 'text-slate-400'}`} />
          <span className="text-sm">{t('sidebar.nav.settings')}</span>
        </button>
      </nav>

      {/* Language picker + sign out, pinned to bottom */}
      <div className="px-4 pb-3 pt-4 border-t border-white/5">
        <LanguageSwitcher variant="dark" className="w-full" />
      </div>
      <div className="px-4 pb-8">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer w-full"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400" />
          <span className="text-sm font-medium">{t('sidebar.signOut')}</span>
        </button>
      </div>
      </div>
    </aside>
  );
}