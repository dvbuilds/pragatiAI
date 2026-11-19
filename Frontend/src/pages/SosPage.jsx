import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, AlertTriangle, Clock, Loader2, LocateFixed, MapPin, Navigation, Phone,
  PhoneCall, RefreshCw, Search, Siren,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SosMap from '../components/SosMap';
import useGeolocation from '../hooks/useGeolocation';
import { useLanguage } from '../i18n/LanguageContext';
import { SLOT, withSlot } from '../i18n/slot';
import { fetchNearbyServices, geocodePlace, sosErrorMessage } from '../lib/sosService';
import {
  CATEGORY_BY_KEY, DEFAULT_RADIUS_KM, EMERGENCY_NUMBERS, PRIMARY_EMERGENCY, RADIUS_OPTIONS_KM,
  SOS_CATEGORIES, formatDistance, googleMapsDirectionsUrl, telHref,
} from '../lib/emergency';

// Validates the manual-location box before we bother the server.
function validateQuery(raw, t) {
  const q = raw.trim();
  if (q.length < 3) return t('sos.search.tooShort');
  if (/^\d+$/.test(q) && !/^[1-9]\d{5}$/.test(q)) return t('sos.search.badPin');
  return '';
}

function ServiceCard({ service, selected, onSelect }) {
  const { t } = useLanguage();
  const cat = CATEGORY_BY_KEY[service.category];
  const [primary, ...otherPhones] = service.phones;

  return (
    <li
      id={`sos-${service.id}`}
      className={`bg-white rounded-2xl border p-4 transition-shadow ${
        selected ? 'border-red-400 ring-2 ring-red-200 shadow-md' : 'border-[#c6c6cd]/50 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
          style={{ background: cat?.color }}
          aria-hidden="true"
        >
          {cat?.glyph}
        </span>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={() => onSelect(service.id)} className="text-left cursor-pointer w-full">
            <h3 className="font-bold text-sm text-slate-900 leading-snug break-words">{service.name}</h3>
          </button>
          <p className="text-xs text-slate-500 mt-0.5">
            {cat ? t(cat.labelKey) : service.categoryLabel} ·{' '}
            {withSlot(
              t('sos.card.away', { distance: SLOT }),
              <span className="font-semibold text-slate-700">{formatDistance(service.distanceMeters)}</span>
            )}
            {service.open24x7 && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <Clock className="w-3 h-3" /> {t('sos.card.open24x7')}
              </span>
            )}
          </p>
          <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
            <span>{service.address || t('sos.card.noAddress')}</span>
          </p>
          {service.phones.length === 0 && (
            <p className="text-xs text-amber-700 mt-1.5">
              {withSlot(
                t('sos.card.noPhone', { number: SLOT }),
                <a className="font-bold underline" href={telHref('112')}>112</a>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {primary && (
          <a
            href={telHref(primary.tel)}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
            aria-label={t('sos.card.callAria', { name: service.name, number: primary.display })}
          >
            <PhoneCall className="w-3.5 h-3.5" /> {t('sos.card.call', { number: primary.display })}
          </a>
        )}
        <a
          href={googleMapsDirectionsUrl(service.lat, service.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
          aria-label={t('sos.card.navigateAria', { name: service.name })}
        >
          <Navigation className="w-3.5 h-3.5" /> {t('sos.card.navigate')}
        </a>
        <button
          type="button"
          onClick={() => onSelect(service.id)}
          className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" /> {t('sos.card.showOnMap')}
        </button>
      </div>

      {otherPhones.length > 0 && (
        <p className="text-xs text-slate-500 mt-2">
          {t('sos.card.otherNumbers')}{' '}
          {otherPhones.map((p, i) => (
            <span key={p.tel}>
              {i > 0 && ', '}
              <a href={telHref(p.tel)} className="font-semibold text-red-700 underline">{p.display}</a>
            </span>
          ))}
        </p>
      )}
    </li>
  );
}

export default function SosPage({ onNavigate, onLogout, currentUser }) {
  const { t } = useLanguage();
  const geo = useGeolocation();
  const { refresh: refreshGps } = geo;

  const [manualOrigin, setManualOrigin] = useState(null); // { lat, lng, label }
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeError, setPlaceError] = useState('');
  const [placeOptions, setPlaceOptions] = useState([]);
  const [searchingPlace, setSearchingPlace] = useState(false);

  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadTick, setReloadTick] = useState(0);

  // Manual choice wins; otherwise a *real* GPS fix. useGeolocation falls back
  // to a default city on failure — never treat that as the user's position.
  const gpsOk = geo.status === 'success' && !geo.isDefault;
  const origin = useMemo(() => {
    if (manualOrigin) return { ...manualOrigin, source: 'manual' };
    if (gpsOk) return { lat: geo.location.lat, lng: geo.location.lng, label: 'Your current location', source: 'gps' };
    return null;
  }, [manualOrigin, gpsOk, geo.location.lat, geo.location.lng]);

  const locating = !origin && (geo.status === 'idle' || geo.status === 'locating');
  const gpsUnavailable = !origin && !locating; // denied / unsupported / error

  // Fetch nearby services whenever the origin, radius or a manual retry changes.
  useEffect(() => {
    if (!origin) return undefined;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setSelectedId(null);

    fetchNearbyServices({ lat: origin.lat, lng: origin.lng, radiusKm }, controller.signal)
      .then((data) => setServices(data.services || []))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setServices([]);
        setError(sosErrorMessage(err, t('sos.results.error')));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [origin?.lat, origin?.lng, radiusKm, reloadTick]); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => {
    const c = {};
    services.forEach((s) => { c[s.category] = (c[s.category] || 0) + 1; });
    return c;
  }, [services]);

  const visible = useMemo(
    () => (activeCategory === 'all' ? services : services.filter((s) => s.category === activeCategory)),
    [services, activeCategory]
  );

  // Scroll the list to the card for whichever pin was tapped on the map.
  useEffect(() => {
    if (!selectedId) return;
    document.getElementById(`sos-${selectedId}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  const handlePlaceSearch = useCallback(async (e) => {
    e.preventDefault();
    const problem = validateQuery(placeQuery, t);
    setPlaceError(problem);
    if (problem) return;

    setSearchingPlace(true);
    setPlaceOptions([]);
    try {
      const results = await geocodePlace(placeQuery.trim());
      const [first, ...rest] = results;
      setManualOrigin({ lat: first.lat, lng: first.lng, label: first.label });
      setPlaceOptions(rest);
    } catch (err) {
      setPlaceError(sosErrorMessage(err, t('sos.search.failed')));
    } finally {
      setSearchingPlace(false);
    }
  }, [placeQuery, t]);

  const useMyLocation = () => {
    setManualOrigin(null);
    setPlaceOptions([]);
    setPlaceError('');
    refreshGps();
  };

  const handleSidebarNavigate = (key) => {
    if (key === 'report') {
      onNavigate('dashboard');
      return;
    }
    onNavigate(key);
  };

  const showFinder = Boolean(origin);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen overflow-hidden flex font-sans">
      <Sidebar activeTab="sos" onNavigate={handleSidebarNavigate} onLogout={onLogout} currentUser={currentUser} />

      <div className="flex-1 h-screen overflow-y-auto">
        <main className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 cursor-pointer"
              aria-label={t('sos.header.back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#131b2e] tracking-tight">{t('sos.header.title')}</h1>
              <p className="text-slate-500 text-sm">{t('sos.header.subtitle')}</p>
            </div>
          </div>

          {/* 112 — always visible, never depends on location or network */}
          <section aria-label={t('sos.call.section')} className="bg-red-600 text-white rounded-3xl p-5 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-red-100">{t('sos.call.heading')}</p>
                <p className="text-sm text-red-50 mt-1 max-w-md">{t('sos.call.description')}</p>
              </div>
              <a
                href={telHref(PRIMARY_EMERGENCY.number)}
                className="inline-flex items-center justify-center gap-3 bg-white text-red-700 hover:bg-red-50 rounded-2xl px-8 py-4 text-3xl font-black shadow-md transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                aria-label={t('sos.call.buttonAria')}
              >
                <PhoneCall className="w-7 h-7" /> {t('sos.call.button')}
              </a>
            </div>
            <ul className="flex flex-wrap gap-2 mt-5">
              {EMERGENCY_NUMBERS.map((n) => (
                <li key={n.number}>
                  <a
                    href={telHref(n.number)}
                    className="inline-flex items-center gap-2 bg-red-700/70 hover:bg-red-800 rounded-xl px-3.5 py-2 text-sm transition-colors"
                    aria-label={t('sos.call.numberAria', { label: t(n.labelKey), number: n.number })}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-bold">{n.number}</span>
                    <span className="text-red-100">{t(n.labelKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Honest scope note */}
          <p className="text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {t('sos.disclaimer.main')} <strong>{t('sos.disclaimer.call')}</strong>
            </span>
          </p>

          {/* Location */}
          <section aria-label={t('sos.location.section')} className="bg-white border border-[#c6c6cd]/50 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0" aria-live="polite">
                {locating && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> {t('sos.location.detecting')}
                  </p>
                )}
                {origin && (
                  <p className="text-sm text-slate-700 flex items-start gap-2">
                    <LocateFixed className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
                    <span className="break-words">
                      {withSlot(
                        t('sos.location.showingNear', { place: SLOT }),
                        <strong>{origin.source === 'gps' ? t('sos.location.here') : origin.label}</strong>
                      )}
                    </span>
                  </p>
                )}
                {gpsUnavailable && (
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      {geo.status === 'denied'
                        ? t('sos.location.denied')
                        : geo.status === 'unsupported'
                          ? t('sos.location.unsupported')
                          : t('sos.location.failed')}
                    </span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={useMyLocation}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 cursor-pointer"
              >
                <LocateFixed className="w-3.5 h-3.5" /> {gpsOk && !manualOrigin ? t('sos.location.refresh') : t('sos.location.use')}
              </button>
            </div>

            <form onSubmit={handlePlaceSearch} className="flex flex-col sm:flex-row gap-2" noValidate>
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  inputMode="search"
                  value={placeQuery}
                  onChange={(e) => setPlaceQuery(e.target.value)}
                  placeholder={t('sos.search.placeholder')}
                  aria-label={t('sos.search.aria')}
                  aria-invalid={Boolean(placeError)}
                  aria-describedby={placeError ? 'sos-place-error' : undefined}
                  maxLength={100}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd]/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>
              <button
                type="submit"
                disabled={searchingPlace}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                {searchingPlace ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {t('sos.search.submit')}
              </button>
            </form>
            {placeError && <p id="sos-place-error" role="alert" className="text-xs text-rose-600 -mt-2">{placeError}</p>}

            {placeOptions.length > 0 && (
              <div className="text-xs text-slate-600">
                <p className="font-semibold mb-1">{t('sos.search.otherMatches')}</p>
                <ul className="space-y-1">
                  {placeOptions.map((p) => (
                    <li key={`${p.lat},${p.lng}`}>
                      <button
                        type="button"
                        onClick={() => { setManualOrigin({ lat: p.lat, lng: p.lng, label: p.label }); setPlaceOptions([]); }}
                        className="text-left text-teal-700 hover:underline cursor-pointer"
                      >
                        {p.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Finder */}
          {showFinder && (
            <section aria-label={t('sos.results.section')} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2" role="group" aria-label={t('sos.filter.group')}>
                  {[{ key: 'all', labelKey: 'sos.category.all', color: '#0f172a' }, ...SOS_CATEGORIES].map((c) => {
                    const active = activeCategory === c.key;
                    const n = c.key === 'all' ? services.length : counts[c.key] || 0;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setActiveCategory(c.key)}
                        aria-pressed={active}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                          active ? 'text-white border-transparent' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                        style={active ? { background: c.color } : undefined}
                      >
                        {t(c.labelKey)} <span className={active ? 'opacity-80' : 'text-slate-400'}>{n}</span>
                      </button>
                    );
                  })}
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  {t('sos.radius.label')}
                  <select
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold"
                  >
                    {RADIUS_OPTIONS_KM.map((r) => <option key={r} value={r}>{t('sos.radius.option', { km: r })}</option>)}
                  </select>
                </label>
              </div>

              {error && (
                <div role="alert" className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-800 flex flex-wrap items-center gap-3">
                  <span className="flex-1 min-w-[12rem]">{error}</span>
                  <button
                    type="button"
                    onClick={() => setReloadTick((t) => t + 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg px-3 py-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> {t('common.retry')}
                  </button>
                  <a href={telHref('112')} className="text-xs font-bold underline">{t('sos.call.button')}</a>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3 h-[320px] sm:h-[420px] lg:h-[600px] lg:sticky lg:top-4 rounded-2xl overflow-hidden border border-[#c6c6cd]/50 shadow-sm relative z-0">
                  <SosMap
                    origin={origin}
                    services={visible}
                    radiusKm={radiusKm}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                  />
                  {loading && (
                    <div className="absolute inset-0 z-[500] bg-white/60 flex items-center justify-center">
                      <span className="bg-white shadow rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> {t('sos.results.loading')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 lg:max-h-[600px] lg:overflow-y-auto lg:pr-1">
                  {!loading && !error && visible.length === 0 && (
                    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center text-sm text-slate-600">
                      {activeCategory === 'all'
                        ? t('sos.results.emptyAny', { km: radiusKm })
                        : t('sos.results.emptyCategory', { category: t(CATEGORY_BY_KEY[activeCategory].labelKey), km: radiusKm })}
                      {radiusKm < RADIUS_OPTIONS_KM[RADIUS_OPTIONS_KM.length - 1] && ` ${t('sos.results.widen')}`}
                      <br />
                      {withSlot(
                        t('sos.results.incomplete', { number: SLOT }),
                        <a href={telHref('112')} className="font-bold text-red-700 underline">112</a>
                      )}
                    </div>
                  )}
                  <ul className="space-y-3">
                    {visible.map((s) => (
                      <ServiceCard key={s.id} service={s} selected={s.id === selectedId} onSelect={setSelectedId} />
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('sos.results.source')}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
