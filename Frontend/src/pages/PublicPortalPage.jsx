import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Sparkles, Plus, 
  Info, Share2, Globe, MapPin, RefreshCw, CheckCircle2
} from 'lucide-react';
import IssueWizardModal from '../components/IssueWizardModal';
import Sidebar from '../components/Sidebar';
import CivicMap from '../components/CivicMap';
import useGeolocation from '../hooks/useGeolocation';
import { fetchIssues, fetchPortalStats, getIssueTitle, timeAgo } from '../lib/issueService';

const SEARCH_RADIUS_KM = 10;

export default function PublicPortalPage({ onNavigate, onLogout, currentUser }) {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [mapSearch, setMapSearch] = useState('');
  
  // Category filters
  const [activeFilter, setActiveFilter] = useState('all');

  // Real nearby reports pulled from the backend, centered on the user's
  // current browser location.
  const { location, status: geoStatus, error: geoError, isDefault, refresh: refreshLocation } = useGeolocation();
  const [liveIssues, setLiveIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuesError, setIssuesError] = useState(null);

  // Real portal-wide stats (resolved-this-week count + recently resolved
  // feed) — pulled from the backend instead of being hardcoded.
  const [portalStats, setPortalStats] = useState({ resolvedThisWeek: 0, recentlyResolved: [] });
  const [statsLoading, setStatsLoading] = useState(true);

  const loadNearbyIssues = useCallback(async () => {
    setIssuesLoading(true);
    setIssuesError(null);
    try {
      const data = await fetchIssues({ near: location, radiusKm: SEARCH_RADIUS_KM });
      setLiveIssues(data);
    } catch (err) {
      setIssuesError(
        err?.response?.data?.message || 'Could not load nearby reports. Is the backend running?'
      );
    } finally {
      setIssuesLoading(false);
    }
  }, [location]);

  // Wait until geolocation has resolved (success/denied/error/unsupported)
  // before querying "nearby", so we don't fetch around (0,0) then refetch.
  useEffect(() => {
    if (geoStatus === 'idle' || geoStatus === 'locating') return;
    loadNearbyIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoStatus, location.lat, location.lng]);

  useEffect(() => {
    let cancelled = false;
    setStatsLoading(true);
    fetchPortalStats()
      .then((data) => { if (!cancelled) setPortalStats(data); })
      .catch(() => { /* non-critical — the badge/feed just stay empty */ })
      .finally(() => { if (!cancelled) setStatsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Filter live issues based on the search box + category pills
  const filteredIssues = useMemo(() => {
    return liveIssues.filter((issue) => {
      const haystack = `${getIssueTitle(issue)} ${issue.description || ''} ${issue.location?.address || ''}`.toLowerCase();
      const matchesSearch = mapSearch === '' || haystack.includes(mapSearch.toLowerCase());
      const matchesCategory = activeFilter === 'all' || issue.type === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [liveIssues, mapSearch, activeFilter]);

  // A real, data-driven insight computed from the nearby reports actually
  // loaded from the backend — not a static hardcoded quote.
  const neighborhoodInsight = useMemo(() => {
    if (liveIssues.length === 0) return null;
    const counts = {};
    let resolvedCount = 0;
    liveIssues.forEach((issue) => {
      counts[issue.type] = (counts[issue.type] || 0) + 1;
      if (issue.status === 'resolved') resolvedCount += 1;
    });
    const topType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topLabel = topType ? getIssueTitle({ type: topType }) : null;
    return {
      total: liveIssues.length,
      resolvedCount,
      topLabel,
    };
  }, [liveIssues]);

  // Keep a sensible default selection once reports load in
  useEffect(() => {
    if (!selectedIssue && filteredIssues.length > 0) {
      setSelectedIssue(filteredIssues[0]);
    }
    if (selectedIssue && !filteredIssues.some((i) => i._id === selectedIssue._id)) {
      setSelectedIssue(filteredIssues[0] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredIssues]);

  const handleSidebarNavigate = (key) => {
    if (key === 'report') {
      setIsWizardOpen(true);
      return;
    }
    onNavigate(key);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen overflow-hidden flex font-sans">
      
      <Sidebar 
        activeTab="portal" 
        onNavigate={handleSidebarNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* TopAppBar */}
        <header className="bg-white border-b border-[#c6c6cd]/50 sticky top-0 z-40 shadow-sm">
          <div className="flex justify-between items-center w-full px-6 md:px-12 h-16">
            <div className="lg:hidden">
              <span 
                onClick={() => onNavigate('landing')} 
                className="text-xl font-extrabold tracking-tight text-black cursor-pointer"
              >
                CivicPulse AI
              </span>
            </div>
            <div className="hidden lg:block text-slate-500 text-xs font-medium">
              Public Portal • <span className="text-black font-bold">Community Watch</span>
            </div>
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="bg-black text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <section className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-extrabold text-3xl tracking-tight text-slate-950 mb-1.5">Community Watch</h1>
              <p className="text-slate-500 text-xs md:text-sm max-w-xl leading-relaxed">
                Transparent reporting for a better neighborhood. Use our AI-powered portal to report infrastructure issues instantly.
              </p>
            </div>
            <div>
              <div className="bg-white border border-[#c6c6cd]/50 px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0c9488] animate-pulse"></span>
                <span className="font-bold text-xs text-[#0c9488]">
                  {statsLoading ? 'Loading stats...' : `${portalStats.resolvedThisWeek} Issue${portalStats.resolvedThisWeek === 1 ? '' : 's'} Fixed This Week`}
                </span>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Map View (Large, 8 columns) */}
            <div className="lg:col-span-8 bg-[#eceef0] rounded-3xl overflow-hidden shadow-sm border border-[#c6c6cd]/50 relative h-[550px] lg:h-[620px] flex flex-col">
              
              {/* Map Floating UI search */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-xs sm:max-w-md w-full pr-8">
                <div className="bg-white/85 backdrop-blur-md p-1.5 rounded-xl flex items-center gap-2 shadow-md border border-slate-200">
                  <Search className="text-teal-700 w-4.5 h-4.5 ml-2.5 flex-shrink-0" />
                  <input 
                    type="text" 
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-slate-800 placeholder-slate-400 w-full" 
                    placeholder="Search neighborhood..." 
                  />
                </div>
                
                {/* Filters */}
                <div className="flex gap-1.5 flex-wrap">
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-all cursor-pointer ${
                      activeFilter === 'all' 
                        ? 'bg-[#0c9488] text-white' 
                        : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white'
                    }`}
                  >
                    All Issues
                  </button>
                  <button 
                    onClick={() => setActiveFilter('pothole')}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-all cursor-pointer ${
                      activeFilter === 'pothole' 
                        ? 'bg-[#0c9488] text-white' 
                        : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white'
                    }`}
                  >
                    Potholes
                  </button>
                  <button 
                    onClick={() => setActiveFilter('lighting')}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-all cursor-pointer ${
                      activeFilter === 'lighting' 
                        ? 'bg-[#0c9488] text-white' 
                        : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white'
                    }`}
                  >
                    Lighting
                  </button>
                  <button 
                    onClick={() => setActiveFilter('sanitation')}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-all cursor-pointer ${
                      activeFilter === 'sanitation' 
                        ? 'bg-[#0c9488] text-white' 
                        : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white'
                    }`}
                  >
                    Sanitation
                  </button>
                </div>

                {/* Location / fetch status banner */}
                {(geoStatus === 'locating' || isDefault || issuesError) && (
                  <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-2 text-[10px] font-semibold text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
                    {geoStatus === 'locating' && <span>Finding your location...</span>}
                    {geoStatus !== 'locating' && isDefault && !issuesError && (
                      <span>{geoError || 'Showing Kolkata (default location).'}</span>
                    )}
                    {issuesError && <span className="text-rose-600">{issuesError}</span>}
                    {(geoStatus === 'denied' || geoStatus === 'error' || issuesError) && (
                      <button
                        onClick={geoStatus === 'denied' || geoStatus === 'error' ? refreshLocation : loadNearbyIssues}
                        className="ml-auto flex items-center gap-1 text-teal-700 hover:underline flex-shrink-0"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Real Google Map */}
              <div className="w-full h-full relative select-none">
                <CivicMap
                  center={location}
                  userLocation={!isDefault ? location : null}
                  issues={filteredIssues}
                  selectedIssue={selectedIssue}
                  onSelectIssue={setSelectedIssue}
                  onRecenter={refreshLocation}
                />

                {issuesLoading && (
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-2 text-[10px] font-bold text-slate-600">
                    <span className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    Loading nearby reports...
                  </div>
                )}

                {!issuesLoading && !issuesError && filteredIssues.length === 0 && (
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200 text-[10px] font-bold text-slate-500">
                    No reports found within {SEARCH_RADIUS_KM}km
                  </div>
                )}
              </div>

              {/* Active Issue display overlay bottom right */}
              <AnimatePresence mode="wait">
                {selectedIssue && (
                  <motion.div 
                    key={selectedIssue._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute bottom-4 right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 max-w-xs w-full z-20 text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-teal-600" />
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                        {selectedIssue.status === 'resolved' ? 'Resolved Issue' : 'Active Issue'}
                      </span>
                    </div>
                    {selectedIssue.photo?.url && (
                      <img
                        src={selectedIssue.photo.url}
                        alt={getIssueTitle(selectedIssue)}
                        className="w-full h-28 object-cover rounded-xl mb-2 border border-slate-100"
                      />
                    )}
                    <p className="font-bold text-slate-900 text-sm mb-1">{getIssueTitle(selectedIssue)}</p>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                      {selectedIssue.description}
                      {selectedIssue.location?.address ? ` • ${selectedIssue.location.address}` : ''}
                      {' • Reported '}{timeAgo(selectedIssue.createdAt)}.
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-bold pt-2 border-t border-slate-100">
                      <span className="text-slate-500">{selectedIssue.department}</span>
                      <span className={`px-2 py-0.5 rounded-full uppercase ${
                        selectedIssue.priority === 'High' ? 'bg-rose-50 text-rose-700'
                        : selectedIssue.priority === 'Medium' ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {selectedIssue.priority} Priority
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: AI Insight & Activity Feed */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-full">
              
              {/* AI Insight Card — computed from the real nearby reports pulled from the backend */}
              <div className="bg-white border border-teal-100 p-6 rounded-3xl shadow-sm flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-teal-800">Neighborhood Insight</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 relative z-10 font-medium">
                  {issuesLoading && 'Crunching nearby reports...'}
                  {!issuesLoading && !neighborhoodInsight && `No reports within ${SEARCH_RADIUS_KM}km yet — be the first to file one.`}
                  {!issuesLoading && neighborhoodInsight && (
                    <>
                      {neighborhoodInsight.total} report{neighborhoodInsight.total === 1 ? '' : 's'} within {SEARCH_RADIUS_KM}km,{' '}
                      {neighborhoodInsight.resolvedCount} already resolved.
                      {neighborhoodInsight.topLabel && ` The most common issue nearby is ${neighborhoodInsight.topLabel.toLowerCase()}.`}
                    </>
                  )}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 text-[11px] relative z-10">
                  <span className="text-slate-400 font-semibold">Live from CivicPulse reports</span>
                </div>
              </div>

              {/* Recently Resolved Feed — real resolved issues from the backend */}
              <div className="bg-white border border-[#c6c6cd]/50 rounded-3xl p-6 shadow-sm flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-base text-slate-950">Recently Resolved</h3>
                </div>

                <div className="space-y-6">
                  {statsLoading && (
                    <p className="text-xs text-slate-400">Loading recent activity...</p>
                  )}
                  {!statsLoading && portalStats.recentlyResolved.length === 0 && (
                    <p className="text-xs text-slate-400">No resolved reports yet.</p>
                  )}
                  {!statsLoading && portalStats.recentlyResolved.map((item) => (
                    <div key={item._id} className="flex gap-4 items-start text-left">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-teal-50 flex-shrink-0 shadow-sm border border-slate-150 flex items-center justify-center">
                        {item.photo?.url ? (
                          <img className="w-full h-full object-cover" src={item.photo.url} alt={getIssueTitle(item)} />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-teal-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">
                            Fixed
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{timeAgo(item.updatedAt)}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">{getIssueTitle(item)}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {item.location?.address || item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#eceef0] border-t border-[#c6c6cd] w-full py-12 px-6 md:px-12 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="max-w-xs space-y-3">
              <span className="font-extrabold text-lg text-black block">CivicPulse AI</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Empowering citizens through intelligent digital infrastructure and transparent governance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs text-slate-500 font-bold">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Accessibility Standard</a>
              <a href="#" className="hover:underline">Contact Support</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-[#c6c6cd]/50 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Digital Government Services. All rights reserved. Powered by CivicPulse AI.</p>
            <div className="flex gap-4">
              <button className="text-slate-400 hover:text-black"><Globe className="w-4 h-4" /></button>
              <button className="text-slate-400 hover:text-black"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
        </footer>
      </div>

      {/* Multi-Step Wizard Modal */}
      <IssueWizardModal 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        defaultCenter={location}
        onIssueCreated={(newIssue) => {
          // Real issue from the backend (with real lat/lng + AI-assigned
          // category/department/priority) — drop it straight onto the live
          // map alongside the nearby reports already being shown.
          setLiveIssues((prev) => [newIssue, ...prev]);
          setSelectedIssue(newIssue);
        }}
      />

    </div>
  );
}