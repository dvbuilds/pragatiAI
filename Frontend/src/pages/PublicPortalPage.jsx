import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, AlertCircle, CheckCircle, Sparkles, Plus, 
  Info, Zap, Trash2, Share2, Globe
} from 'lucide-react';
import IssueWizardModal from '../components/IssueWizardModal';
import Sidebar from '../components/Sidebar';

export default function PublicPortalPage({ onNavigate, onLogout, currentUser, issues, onAddIssue }) {
  const [selectedIssue, setSelectedIssue] = useState(issues[0] || null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [mapSearch, setMapSearch] = useState('');
  
  // Category filters
  const [activeFilter, setActiveFilter] = useState('all');

  // Portrait image hotlinked from HTML
  const alexPortrait = "https://lh3.googleusercontent.com/aida-public/AB6AXuBWqINPv6Z2M91XrcOVuPpgtGz0DE4osfPZKXFFxZNNkK7sS6njt9U7G-9thun3jnJvGfCeAmvEoIkzh1NTNuhqe3dE_5CBFviULIHA7qxBHxixsVGaDLSFIFqFcp9fAUJx-jZM4gfmzMcLwlZV5HWjgys1vas_FOJMb2-smcCEuoMdzV5H2uvSVjLU1MNpL5fU13jbgak18j78YUvmPulvhZ23gkBaKBeesYLn7omGk6LTaeYoBV9xBQ";

  // Map aerial image hotlinked from HTML
  const mapImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDqprU5sIXzx4mO1EaKui8FTDpgpb9V0nz42hAJ8PaD1COx4kqf9ursfJBeBm41wFP_j6iEUhj71mC9gazfYoYSfhGHGUGfttQ1U0Ijqp1agrRKiSEj17IlFGOkkHuMNcV2FAMylB5EfcPOYco0_zFDvsuqlNzp8M0MpFjlKZt_dBsfANxb0CSNfjWr7sjtJxQw1haOoaffUb2AhM1S8qV_hJycm3bZRGkAQxYDsszDwpRSHMgnLyL9PQ";

  // Recently Resolved Feed images hotlinked from HTML
  const resolvedItems = [
    {
      id: "res-1",
      title: "Broken Streetlight - 5th Ave",
      time: "Today, 10:24 AM",
      description: "Crew replaced the sensor. Area is now lit.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7U7YcMLKTgEAJ_C4tRdTkPebFEssfvz-H9MOAZjep0VaffZSp6kmg7qvnrrAyhj7P5zHUPpHsALJHGd96pg647e5IkSFrlxU_hIEmepeE65A6M8mGzLTA7mO-VI9DPxMnRxref2Nq0HpIAWILRoAL5-mkEd_tUIqXfsYV4wS8Ji06bcaYRffO0kQFYtqwe2zxiqyF41TLxjEgs44mPI376CCfZcJnd0jVTQWi-txJaWF68C2HHBse_A"
    },
    {
      id: "res-2",
      title: "Major Pothole - West Gate",
      time: "Yesterday",
      description: "Repaving complete. Road fully reopened.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPZrjd8vtZTBPkX-SA1V4097LJORBr6MbHhoraK5yXt6MH4EJbM601LfKtQVpYbRRZ2NT231lyJIWmVzvVihxo3Pj1c-ju2xlj1LEemGLF67uGKr2gZGYKrhGrNl_uJY8JbVZdMluih7j1Cee9qO98ISo-AEHRPUn_hau72cWZXX_nYjPeKSxsLhCsHXm00TvI4wYFk5mwWV71u_Wam2oHde7sfthtJ4aO1ftONGNnHmATQMzv13L_fw"
    },
    {
      id: "res-3",
      title: "Sanitation - Central Park",
      time: "Oct 24",
      description: "Overflowing bins cleared and scheduled.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjIxFbggGISi63BxX7Vj9hXpmzDpc0vWDFXF8Mu9a0LpgHvC5lfTktXlxVOOyaqyze9PRq5CNQzdtPGIH_H2jVT7npueTma5sVStx6amjNH21XxfX0V-zfl8h222GlYrAudufKVTJLZQq5ST3tVv_94V36-nn7t1dnLy_gZi1T2JmnwiSzSR2v0Hs7krVaVmRRztq2Jk5hf6WWnObzmi0Sce43xpxMUIG4fbMBhN_zzCnHZqYmgsvZBw"
    }
  ];

  // Filter issues based on select category
  const filteredIssues = issues.filter(issue => {
    // Search query match
    const matchesSearch = mapSearch === '' || 
      issue.title.toLowerCase().includes(mapSearch.toLowerCase()) || 
      issue.description.toLowerCase().includes(mapSearch.toLowerCase());

    // Category filter match
    const matchesCategory = activeFilter === 'all' || issue.type === activeFilter;

    return matchesSearch && matchesCategory;
  });

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
        activeTab="portal" 
        onNavigate={handleSidebarNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser} 
      />

      <div className="flex-1 flex flex-col min-h-screen">

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
                <span className="font-bold text-xs text-[#0c9488]">42 Issues Fixed This Week</span>
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
              </div>

              {/* Integrated Map Element */}
              <div className="w-full h-full bg-[#e6e8ea] flex items-center justify-center relative select-none">
                <div className="absolute inset-0 grayscale-[0.2] opacity-85">
                  <img className="w-full h-full object-cover" src={mapImage} alt="Detailed Civic Neighborhood Map" />
                </div>

                {/* Pin Overlays */}
                {filteredIssues.map((marker) => {
                  const isActive = selectedIssue?.id === marker.id;
                  return (
                    <button
                      key={marker.id}
                      onClick={() => setSelectedIssue(marker)}
                      style={{ top: marker.top, left: marker.left }}
                      className={`absolute w-8 h-8 -mt-4 -ml-4 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all duration-300 ${
                        isActive ? 'scale-125 z-30' : 'scale-100 z-20 opacity-90'
                      } ${
                        marker.status === 'resolved' 
                          ? 'bg-emerald-600 text-white' 
                          : marker.type === 'pothole'
                          ? 'bg-amber-600 text-white'
                          : marker.type === 'lighting'
                          ? 'bg-teal-700 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {marker.status === 'resolved' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : marker.type === 'pothole' ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : marker.type === 'lighting' ? (
                        <Zap className="w-3.5 h-3.5" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Issue display overlay bottom right */}
              <AnimatePresence mode="wait">
                {selectedIssue && (
                  <motion.div 
                    key={selectedIssue.id}
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
                    <p className="font-bold text-slate-900 text-sm mb-1">{selectedIssue.title}</p>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                      {selectedIssue.description} • Reported {selectedIssue.timeReported}.
                    </p>
                    <button 
                      onClick={() => alert(`Showing report details for ${selectedIssue.title}`)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
                    >
                      View Details
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: AI Insight & Activity Feed */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-full">
              
              {/* AI Insight Card */}
              <div className="bg-white border border-teal-100 p-6 rounded-3xl shadow-sm flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-teal-800">AI Neighborhood Insight</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 relative z-10 font-medium">
                  "Reported issues in your area have decreased by 15% this month. Lighting improvements on Oak Ave have significantly improved perceived safety."
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] relative z-10">
                  <span className="text-slate-400 font-semibold">Data verified by CivicPulse</span>
                  <button 
                    onClick={() => alert("Full district AI report is dispatched to registered voters.")}
                    className="text-teal-600 font-bold hover:underline cursor-pointer"
                  >
                    Full Report
                  </button>
                </div>
              </div>

              {/* Recently Resolved Feed */}
              <div className="bg-white border border-[#c6c6cd]/50 rounded-3xl p-6 shadow-sm flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-base text-slate-950">Recently Resolved</h3>
                  <button 
                    onClick={() => alert("All completed municipal requests are archived in public records.")}
                    className="text-slate-400 hover:text-black font-bold text-xs"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-6">
                  {resolvedItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start text-left">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm border border-slate-150">
                        <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">
                            Fixed
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">{item.description}</p>
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
        onIssueCreated={(newIssue) => {
          onAddIssue(newIssue);
          setSelectedIssue(newIssue);
        }}
      />

    </div>
  );
}
