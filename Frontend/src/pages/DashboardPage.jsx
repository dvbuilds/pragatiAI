import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Bell, ChevronRight, Sparkles, ArrowRight, ChevronLeft, Calendar, 
  MapPin, CheckCircle, AlertCircle, FileText, Settings, ExternalLink, Loader2, UserCog
} from 'lucide-react';
import IssueWizardModal from '../components/IssueWizardModal';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';

export default function DashboardPage({ onNavigate, requests, onAddRequest, onUpdateRequest, currentUser, onLogout }) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // AI-matched government scheme recommendations (real backend call, replaces
  // the old hardcoded "Community Garden" / "E-Waste" cards)
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [recsError, setRecsError] = useState('');
  const profileIncomplete = !currentUser?.profile?.age || !currentUser?.profile?.gender || currentUser?.profile?.annualIncome === undefined;

  useEffect(() => {
    let cancelled = false;
    const fetchRecommendations = async () => {
      setRecsLoading(true);
      setRecsError('');
      try {
        const { data } = await api.post('/schemes/match', {});
        if (!cancelled) setRecommendations(data.data.matches || []);
      } catch (err) {
        if (!cancelled) setRecsError(err?.response?.data?.message || 'Could not load recommendations right now.');
      } finally {
        if (!cancelled) setRecsLoading(false);
      }
    };
    fetchRecommendations();
    return () => { cancelled = true; };
  }, [currentUser]);
  
  // Notification States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your Parking Permit renewal is in review by City Transit.", read: false, time: "2 hours ago" },
    { id: 2, text: "Action required: Upload income verification for Property Tax Exemption.", read: false, time: "1 day ago" },
    { id: 3, text: "District 4 Budget Meeting starts in 3 days. RSVP now.", read: true, time: "2 days ago" }
  ]);

  // Selected event modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Active detail modal for service requests
  const [selectedRequest, setSelectedRequest] = useState(null);

  // File upload state for property tax "Missing Info" correction
  const [exemptionUploading, setExemptionUploading] = useState(false);

  // Profile image hotlinked from HTML
  const alexAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuAslx00ZDXEeuyGt5P3zUS0AVLlEfeM0L6tiYHlI1FcTb3U6wjSihKCmJ5YfZpdOzqlaSxWOvwGUBUB36RQDc27t_3jL1A1Wk_7OWXTcdOA3_DBKGdPFPQudsqBsa0Ht730tiIv7sO8LrNVoSAMLLme_ipwMEYaWY2uVyDmqnlQeFOriaDuAA5CV0gr666jJri6W8itzhC0eIHlf8MQCui_NJkLfCL7G0nhE2ddT8_WXJWle-aowvKkjw";

  // Events list hotlinked from HTML
  const events = [
    {
      id: "ev-1",
      title: "Zoning & Urban Planning Board",
      date: "Oct 24 • 6:30 PM",
      location: "Central Library Auditorium",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvA0zSwXlkO9Ax6W9ffT8-KHLaJfMrKUXgHNi7APWcYgf8fSQV4Oau1xLDX8fx5pjyNZVYuQP0hYBHSZQ-DSeNoBFumW_AmH2pCVim9rcGT2wOP8eX8mIbJGQjxQMEm7u9buJESqiC-PwcaDzp1uq9bpGeVRi-Whgjk4BD_lZMOejpLZqUK8gBHanrtZ_mUn1IWhcbFiaCO3vfzjyEN2-Hp9_v3DRBgs6Ge7A-0NbNNxGX8J98CaS0EA",
      description: "Discussing proposed high-density mixed-use developments along Maple Avenue. Public comments welcome."
    },
    {
      id: "ev-2",
      title: "Public Safety Q&A Session",
      date: "Oct 26 • 5:00 PM",
      location: "Maplewood Community Center",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU5fU4dwrpgshL5r_J2VtpB03yH0HDLmdjHGgZ_LIH8UBy4xU3evuZm5OAHVqy0hYs20C9IJux8v-JqsMPrTGmesJUvEK3wxQr5-Toa6JWLu1yXkhY3sVBxagapMUFYgyQDRBV5a56DWZaYfuWCDyoJu6PWpN83PS0v_jZKDPWnOmQm1jMV_eue4Otgropn-lLwOgQd1kuB236Vsav45y0MaL-eIOUmROEdkT-e0hbb_6_0kyb7el7xw",
      description: "Annual meeting with District 4 precinct commander. Share concerns about local lighting, speed limits, and safety guidelines."
    },
    {
      id: "ev-3",
      title: "Sustainable Transit Workshop",
      date: "Oct 28 • 12:00 PM",
      location: "Online (Link via Email)",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM3nScuQhZPHmiuvv4AEgmVY4z9G-skv3O-KroClfojWyrAI2GaQyVGR4TWc0XX_AGSXdcV-Xk3fbdp9MwegZpsl0mx6UXXT-2jRNnGx1wOvM1G1Jh1vFBFHn610nEJ6kC_fhsPq1wld5s6126p3q5djEG5lorzlcoXm6jvr1rxvqratRgwcglAspB5HpQpGeCgjlAR68Bs69gWTTEbuRZqbO-MBpDIonVr5Yar_LM9HTvSTTGicGIug",
      isVirtual: true,
      description: "A collaborative session mapping future cycling paths, electric scooter docking hubs, and bus routes inside District 4."
    },
    {
      id: "ev-4",
      title: "District 4 Budget Proposal",
      date: "Nov 02 • 7:00 PM",
      location: "City Hall - Room 302",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJxgdiTjGif-yvSgFzfy4Q38UVPRaxxtSzWn5XsXsROa2ZhlYQiKd7dGwidq0NMthI4eyELC2jCkUfR0r_jDHNYoY_-8r_Bb-csVlvpsCcTHwzdHa1OI2HhZpRK-E5SSP19MvLfyAGabh1oNOKbpanDypLDM7PNoXmg0o_DZ_WP4167w3-GgBA1IVs8jAIpaa-crk0NEhmSt8IjtmB3SeA7fY85d3_9ysPtYcfAb48pBHaK_B9NgkvqQ",
      description: "Review of proposed municipal expenditures for infrastructure, parks, and school facilities inside District 4."
    }
  ];

  const handleFixTaxExemption = () => {
    setExemptionUploading(true);
    setTimeout(() => {
      onUpdateRequest(selectedRequest.id, {
        status: "In Review",
        description: "Income verification document uploaded. Verification in progress."
      });
      setExemptionUploading(false);
      setSelectedRequest(null);
      alert("Document uploaded! Status has been updated to 'In Review'.");
    }, 1500);
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().toLowerCase().includes("issue") || searchQuery.trim().toLowerCase().includes("report") || searchQuery.trim().toLowerCase().includes("map")) {
      onNavigate('portal');
    } else {
      onNavigate('assistant');
    }
  };

  const handleSidebarNavigate = (key) => {
    if (key === 'report') {
      setIsWizardOpen(true);
      return;
    }
    onNavigate(key);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex font-sans">
      
      <Sidebar 
        activeTab="dashboard" 
        onNavigate={handleSidebarNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* TopAppBar Component */}
        <header className="flex justify-between items-center w-full px-6 md:px-12 h-16 border-b border-[#c6c6cd]/40 bg-white sticky top-0 z-40 shadow-sm">
          <div className="lg:hidden">
            <button onClick={() => onNavigate('landing')} className="font-extrabold text-lg text-black">
              CivicPulse AI
            </button>
          </div>
          
          <div className="hidden lg:block text-slate-500 text-xs font-medium">
            Citizen Dashboard • <span className="text-black font-bold">District 4</span>
          </div>
          
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#f2f4f6] border border-[#c6c6cd]/50 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-teal-600/25 transition-all w-48 sm:w-64"
                placeholder="Search services..." 
              />
            </form>
            
            <div className="flex items-center gap-4">
              {/* Notification bell */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="text-slate-600 hover:text-black transition-colors relative p-1.5 rounded-full hover:bg-slate-100"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl w-80 overflow-hidden z-50 text-left p-1"
                    >
                      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">Recent Notifications</span>
                        <button 
                          onClick={markAllNotificationsRead}
                          className="text-[10px] font-bold text-teal-600 hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-3 text-xs leading-relaxed transition-colors ${n.read ? 'bg-white' : 'bg-teal-50/20'}`}>
                            <p className="text-slate-700">{n.text}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-4 w-[1px] bg-[#c6c6cd]/50" />

              <button 
                onClick={() => setIsWizardOpen(true)}
                className="bg-black text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Request</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <section className="p-6 md:p-12 max-w-7xl w-full mx-auto flex-grow space-y-10">
          
          <div className="space-y-1">
            <h1 className="font-bold text-3xl tracking-tight text-slate-950">Hello, Alex</h1>
            <p className="text-slate-500 text-sm">Here's what's happening with your city services today.</p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* At a Glance: Active Requests (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-[#c6c6cd]/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-lg text-slate-950">At a Glance</h2>
                  <button 
                    onClick={() => onNavigate('assistant')}
                    className="text-teal-600 font-semibold text-xs hover:underline cursor-pointer"
                  >
                    View All Requests
                  </button>
                </div>

                <div className="space-y-4">
                  {requests.map((req) => (
                    <div 
                      key={req.id} 
                      onClick={() => setSelectedRequest(req)}
                      className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          req.type === 'parking' 
                            ? 'bg-[#d5e3fd] text-[#0d1c2f]' 
                            : req.type === 'tax'
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {req.type === 'parking' ? '🅿' : req.type === 'tax' ? '📄' : '⚙'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{req.title}</h4>
                          <p className="text-xs text-slate-400">ID: {req.id} • Submitted {req.dateSubmitted}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'In Review' 
                            ? 'bg-[#b9c7e0]/30 text-[#0d1c2f]' 
                            : req.status === 'Missing Info'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {req.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations (5 cols) */}
            <div className="lg:col-span-5 border border-teal-200/50 bg-teal-50/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-35" />
              
              <div>
                <div className="flex items-center gap-2 mb-6 relative z-10">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h2 className="font-bold text-lg text-teal-950">AI Recommendations</h2>
                </div>

                {profileIncomplete ? (
                  <div className="bg-white p-4 rounded-2xl border border-teal-100/45 shadow-sm relative z-10">
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Add your age, gender, and income in Settings so CivicPulse AI can match you against real government welfare schemes.
                    </p>
                    <button 
                      onClick={() => onNavigate('settings')}
                      className="text-teal-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                    >
                      <UserCog className="w-3.5 h-3.5" />
                      <span>Complete your profile</span>
                    </button>
                  </div>
                ) : recsLoading ? (
                  <div className="bg-white p-6 rounded-2xl border border-teal-100/45 shadow-sm flex items-center justify-center gap-2 relative z-10">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                    <span className="text-xs text-slate-500">Matching schemes to your profile...</span>
                  </div>
                ) : recsError ? (
                  <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm relative z-10">
                    <p className="text-xs text-rose-600">{recsError}</p>
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="bg-white p-4 rounded-2xl border border-teal-100/45 shadow-sm relative z-10">
                    <p className="text-xs text-slate-500">No confident matches found yet — check back after completing more of your profile.</p>
                  </div>
                ) : (
                  <div className="space-y-4 relative z-10">
                    {recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="bg-white p-4 rounded-2xl border border-teal-100/45 shadow-sm">
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[9px] font-bold uppercase rounded-md tracking-wider mb-2.5 inline-block">
                          Scheme Match
                        </span>
                        <h4 className="font-bold text-sm text-slate-950 mb-1">{rec.name}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          {rec.whyEligible}
                        </p>
                        <a 
                          href={rec.officialLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-teal-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all cursor-pointer w-fit"
                        >
                          <span>Apply Now</span> 
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Town Hall Calendar */}
          <div className="bg-white border border-[#c6c6cd]/40 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="font-bold text-lg text-slate-950">Upcoming Town Halls &amp; Events</h2>
                <p className="text-xs text-slate-400">Stay engaged with your local representatives.</p>
              </div>
              <div className="flex gap-1.5">
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="group cursor-pointer space-y-3 text-left"
                >
                  <div className="h-36 w-full rounded-2xl overflow-hidden relative shadow-sm border border-slate-100">
                    {event.isVirtual && (
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
                        <span className="text-white font-extrabold text-[10px] tracking-widest uppercase border border-white/30 px-3 py-1 bg-black/30 rounded-full">
                          Virtual Only
                        </span>
                      </div>
                    )}
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={event.image} 
                      alt={event.title} 
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">{event.date}</p>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-600 transition-colors leading-tight">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                      <span>{event.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Footer */}
        <footer className="w-full py-12 px-6 md:px-12 mt-auto bg-[#eceef0] border-t border-[#c6c6cd]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <span className="font-extrabold text-lg text-black mb-1 block">CivicPulse AI</span>
              <p className="text-xs text-slate-500 max-w-sm">
                Empowering citizens through transparent, intelligent, and accessible government services.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-500 font-semibold">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Accessibility Standard</a>
              <a href="#" className="hover:underline">Contact Support</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#c6c6cd]/40 text-left">
            <p className="text-[11px] text-slate-400">© 2026 Digital Government Services. All rights reserved. Powered by CivicPulse AI.</p>
          </div>
        </footer>

      </main>

      {/* Interactive Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Request Details</span>
                  <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedRequest.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block font-semibold">Submission Date</span>
                    <span className="font-bold text-slate-800">{selectedRequest.dateSubmitted}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Request ID</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedRequest.id}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Active Status</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      selectedRequest.status === 'In Review' 
                        ? 'bg-slate-100 text-slate-800' 
                        : selectedRequest.status === 'Missing Info'
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {selectedRequest.status === 'Missing Info' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      <span>{selectedRequest.status}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Status Report &amp; Notes</span>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {selectedRequest.description || "The municipal board has initiated preliminary document verification. No action is required at this time."}
                  </p>
                </div>

                {/* Handle Missing Info correction workflow */}
                {selectedRequest.status === 'Missing Info' && (
                  <div className="border-t border-slate-100 pt-4 mt-6">
                    <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-xs space-y-3">
                      <p className="font-semibold text-rose-950">Missing Form: Income Verification Statement</p>
                      <p className="text-rose-800">
                        Please upload your tax filing document to qualify for the 2026 property tax relief program.
                      </p>
                      
                      <button 
                        onClick={handleFixTaxExemption}
                        disabled={exemptionUploading}
                        className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {exemptionUploading ? (
                          <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        ) : (
                          <><span>Upload &amp; Resubmit</span></>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selected Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="h-44 w-full rounded-2xl overflow-hidden shadow-sm relative border border-slate-100">
                <img className="w-full h-full object-cover" src={selectedEvent.image} alt={selectedEvent.title} />
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">{selectedEvent.date}</span>
                  <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedEvent.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-4">
                <div>
                  <span className="text-slate-400 block font-semibold">Location</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{selectedEvent.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Access</span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {selectedEvent.isVirtual ? 'Join Virtual Zoom Link' : 'Open Seat Admission'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    alert("Added to calendar! A calendar invitation has been sent to Alex's verified email.");
                    setSelectedEvent(null);
                  }}
                  className="flex-grow py-3 bg-black hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md text-center transition-all cursor-pointer"
                >
                  Add to Calendar
                </button>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="py-3 px-5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl text-center transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Wizard Modal */}
      <IssueWizardModal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)}
        onIssueCreated={(newMarker) => {
          // Mock registering issue as a service request as well!
          const newReq = {
            id: newMarker.id,
            title: newMarker.title,
            status: "In Review",
            dateSubmitted: "Just now",
            type: newMarker.type === 'pothole' ? 'permit' : 'other',
            description: newMarker.description
          };
          onAddRequest(newReq);
        }}
      />

    </div>
  );
}
