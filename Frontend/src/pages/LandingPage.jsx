import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Search, ArrowRight, FileText, Vote, HeartPulse, Bus, Leaf, 
  CheckCircle, Star, Send, ArrowUpRight, Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LandingPage({ onNavigate }) {
  const [searchVal, setSearchVal] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Quick search keywords
  const tryQueries = [
    "Renew parking permit",
    "Trash collection schedule",
    "Building codes"
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    // Go to Assistant with search value as state, or just switch tab
    onNavigate('assistant');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div id="top" className="bg-[#f7f9fb] text-[#191c1e] min-h-screen selection:bg-teal-500/20 font-sans">
      
      <Navbar onNavigate={onNavigate} activeTab="landing" />

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-gradient from-teal-50/40 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d5e3fd] text-[#3a485c] rounded-full text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>Now powering 50+ City Services</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.1]"
            >
              Government services, <br />
              <span className="text-[#0c9488]">simplified by AI.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-[#515f74] max-w-2xl mx-auto leading-relaxed"
            >
              Access municipal resources, manage permits, and engage with your local government through a single, intuitive dashboard.
            </motion.p>
          </div>

          {/* Main Search Hero UI */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-2xl mx-auto w-full"
          >
            <form 
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 rounded-2xl flex items-center shadow-xl border border-teal-100/30 focus-within:ring-2 focus-within:ring-teal-600/15 focus-within:border-teal-500 transition-all group"
            >
              <Search className="ml-4 text-teal-600 w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full border-none focus:outline-none focus:ring-0 px-4 py-3 text-sm md:text-base text-slate-800 placeholder-slate-400"
                placeholder="How can the city help you today?"
              />
              <button 
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-xl text-xs font-semibold hover:bg-slate-900 transition-all active:scale-98"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-2 items-center">
              <span className="text-xs text-[#515f74]">Try:</span>
              {tryQueries.map((query, idx) => (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => setSearchVal(query)}
                  className="text-xs text-black font-medium hover:underline hover:text-teal-700 cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Services Grid */}
      <section id="features" className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Key City Services</h2>
            <p className="text-sm text-[#515f74] max-w-md">
              Streamlined pathways for the most common municipal tasks, updated in real-time by CivicPulse.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-black font-semibold text-xs flex items-center gap-1 group hover:text-teal-700 transition-colors cursor-pointer"
          >
            <span>View All Services</span> 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Permits - 8 cols */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="md:col-span-8 bg-white border border-[#c6c6cd]/40 rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group h-64"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-slate-950">Permits &amp; Licensing</h3>
              <p className="text-sm text-[#515f74] max-w-md">
                Apply for building permits, business licenses, or residential parking in under 5 minutes.
              </p>
            </div>
          </div>

          {/* Voting - 4 cols */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="md:col-span-4 bg-black text-white rounded-3xl p-8 flex flex-col justify-between hover:bg-slate-900 transition-all cursor-pointer h-64"
          >
            <div className="p-3 bg-white/10 rounded-2xl w-fit">
              <Vote className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-white">Voting &amp; Elections</h3>
              <p className="text-sm text-slate-300">
                Register to vote, find your polling station, and view upcoming ballot information.
              </p>
            </div>
          </div>

          {/* Health - 4 cols */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="md:col-span-4 bg-white border border-[#c6c6cd]/40 rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-64"
          >
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-slate-950">Public Health</h3>
              <p className="text-sm text-[#515f74]">
                Access clinic schedules, health alerts, and community wellness programs.
              </p>
            </div>
          </div>

          {/* Transit - 4 cols */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="md:col-span-4 bg-[#e6e8ea] rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-64 border border-transparent hover:border-slate-300"
          >
            <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
              <Bus className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-slate-950">Transit</h3>
              <p className="text-sm text-[#515f74]">
                Live bus tracking, route planning, and digital fare card management.
              </p>
            </div>
          </div>

          {/* Environment - 4 cols */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="md:col-span-4 bg-white border border-teal-100 rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-64"
          >
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl w-fit">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-slate-950">Environment</h3>
              <p className="text-sm text-[#515f74]">
                Waste management, park services, and sustainability reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Companion Section */}
      <section className="py-20 bg-[#f2f4f6]/70 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
                The AI Companion that <br />speaks your language.
              </h2>
              <p className="text-base text-[#515f74] leading-relaxed">
                CivicPulse AI acts as a 24/7 personal assistant for city living. It translates complex legal jargon into plain English and helps you navigate bureaucracy effortlessly.
              </p>
            </div>
            
            <ul className="space-y-4">
              {[
                "Instant answers to city policy questions",
                "Automated form pre-filling & document review",
                "Proactive alerts for deadlines and hearings"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span className="font-medium text-slate-800 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onNavigate('assistant')}
              className="bg-black hover:bg-slate-900 text-white px-8 py-3.5 rounded-xl text-xs font-semibold shadow-md active:scale-98 transition-all hover:-translate-y-0.5"
            >
              Meet Your Assistant
            </button>
          </div>

          {/* AI Interactive Chat Representation */}
          <div className="relative">
            <div className="absolute -inset-4 bg-teal-300/10 rounded-full blur-3xl" />
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0c9488] to-[#89f5e7] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-xs text-slate-800">CivicPulse AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-semibold text-emerald-600 tracking-wider uppercase">Active</span>
                </div>
              </div>

              <div className="p-6 space-y-4 min-h-[250px] flex flex-col justify-end bg-slate-50/30">
                <div className="self-end bg-[#d5e3fd] text-[#0d1c2f] px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[80%] text-xs font-semibold leading-relaxed">
                  I need to build a deck in my backyard. What permits do I need?
                </div>
                
                <div className="self-start bg-white text-slate-800 px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] border border-teal-100 flex flex-col gap-2 text-xs shadow-sm">
                  <p className="font-bold text-slate-950">Based on your address in Ward 4:</p>
                  <ul className="list-disc ml-4 space-y-1.5 text-[#515f74]">
                    <li>Standard Residential Building Permit</li>
                    <li>Zoning variance (if &gt; 200 sq ft)</li>
                  </ul>
                  <button 
                    onClick={() => onNavigate('assistant')}
                    className="text-teal-600 font-bold hover:underline text-left mt-1 cursor-pointer flex items-center gap-1"
                  >
                    <span>Start Application</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Proof Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#515f74]/70 mb-12">
          Trusted by citizens and municipalities worldwide
        </h3>
        
        {/* Logo Wall */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60 text-slate-600 font-bold text-sm tracking-wider">
          <span className="flex items-center gap-1.5 text-[#515f74]">🏛️ METRO CITY</span>
          <span className="flex items-center gap-1.5 text-[#515f74]">🛡️ STATE GOV</span>
          <span className="flex items-center gap-1.5 text-[#515f74]">🏙️ URBAN HUB</span>
          <span className="flex items-center gap-1.5 text-[#515f74]">💻 CIVIC TECH</span>
        </div>

        {/* Testimonials and Stats Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          {/* Sarah J */}
          <div className="p-8 border border-slate-200/80 rounded-3xl bg-white space-y-4 shadow-sm flex flex-col justify-between">
            <div className="flex text-teal-600 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "Finally, a government portal that feels like it was built in this century. I finished my permit in minutes."
            </p>
            <p className="font-bold text-xs text-slate-900">— Sarah J., Local Business Owner</p>
          </div>

          {/* Stat 1 */}
          <div className="p-8 border border-slate-200/80 rounded-3xl bg-white space-y-4 shadow-sm">
            <div className="text-3xl font-extrabold text-black">1.2 Million</div>
            <h4 className="font-bold text-sm text-slate-900">Requests Processed</h4>
            <p className="text-xs text-[#515f74] leading-relaxed">
              Processed through our digital channels this year with a verified 94% satisfaction rating from city residents.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="p-8 border border-slate-200/80 rounded-3xl bg-white space-y-4 shadow-sm">
            <div className="text-3xl font-extrabold text-[#0c9488]">ISO 27001</div>
            <h4 className="font-bold text-sm text-slate-900">Security Standard</h4>
            <p className="text-xs text-[#515f74] leading-relaxed">
              Enterprise-grade military encryption and data privacy standards protecting your digital identity and logs.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-black rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>
          
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready for a better city experience?
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Join thousands of citizens using CivicPulse AI to stay informed, engaged, and productive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="bg-white text-black px-8 py-3.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all active:scale-98"
              >
                Get Started Free
              </button>
              <button 
                onClick={() => onNavigate('assistant')}
                className="border border-white/20 text-white px-8 py-3.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-all active:scale-98"
              >
                Contact City Hall
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="resources" className="bg-[#eceef0] border-t border-[#c6c6cd] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="font-extrabold text-xl text-black">CivicPulse AI</div>
              <p className="text-xs text-[#515f74] leading-relaxed">
                Building the bridge between government and the digital age with transparency and trust.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-black">Platform</h4>
              <ul className="space-y-2 text-xs text-[#515f74]">
                <li><button onClick={() => onNavigate('dashboard')} className="hover:underline hover:text-black">Citizen Dashboard</button></li>
                <li><button onClick={() => onNavigate('assistant')} className="hover:underline hover:text-black">AI Assistant</button></li>
                <li><button onClick={() => onNavigate('portal')} className="hover:underline hover:text-black">Public Portal</button></li>
                <li><a href="#" className="hover:underline hover:text-black">Developer API</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-black">Community</h4>
              <ul className="space-y-2 text-xs text-[#515f74]">
                <li><a href="#" className="hover:underline hover:text-black">Public Hearings</a></li>
                <li><a href="#" className="hover:underline hover:text-black">Open Data Initiative</a></li>
                <li><a href="#" className="hover:underline hover:text-black">Local Events</a></li>
                <li><a href="#" className="hover:underline hover:text-black">Volunteering</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-black">Stay Updated</h4>
              <p className="text-xs text-[#515f74]">Subscribe to city alerts and municipal news.</p>
              
              <form onSubmit={handleSubscribe} className="flex gap-1.5">
                <input 
                  type="email" 
                  required
                  placeholder="Email address" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white border border-[#c6c6cd] rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-black placeholder-slate-400"
                />
                <button 
                  type="submit"
                  className="bg-black text-white px-3.5 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              
              {subscribed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-700 text-[10px] font-bold block"
                >
                  ✓ Subscribed successfully!
                </motion.span>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-[#c6c6cd]/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-[#515f74]">
            <p>© 2026 Digital Government Services. All rights reserved. Powered by CivicPulse AI.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Accessibility Standards</a>
              <a href="#" className="hover:underline">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
