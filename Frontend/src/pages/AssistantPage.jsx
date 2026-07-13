import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, Mic, Paperclip, ChevronRight, HelpCircle, Check, 
  ArrowRight, ShieldCheck, AlertCircle, Info, Landmark, Compass, Globe
} from 'lucide-react';
import api from '../lib/api';
import Sidebar from '../components/Sidebar';

export default function AssistantPage({ onNavigate, onLogout, currentUser, onAddRequest }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hi, I'm CivicPulse AI. Ask me about permits, parking, sanitation schedules, zoning, local taxes, or anything else civic — I'll do my best to help.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Interactive mini-form assistance state inside the chat
  const [activeFormType, setActiveFormType] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [formBusinessName, setFormBusinessName] = useState('');
  const [formRevenue, setFormRevenue] = useState('');
  
  const chatEndRef = useRef(null);

  // Auto scroll to chat bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, activeFormType]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Snapshot history (sender/text only, what the backend expects) before adding the new message
    const history = messages.map(m => ({ sender: m.sender, text: m.text }));

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const { data } = await api.post('/assistant/chat', { message: textToSend, history });
      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: data.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: `msg-ai-error-${Date.now()}`,
        sender: 'ai',
        text: err?.response?.data?.message || "I couldn't reach the assistant service just now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const startFormAssistance = (formType) => {
    setActiveFormType(formType);
    setFormStep(1);
    setFormBusinessName('');
    setFormRevenue('');
  };

  const handleFormNext = () => {
    if (formStep === 1) {
      if (!formBusinessName.trim()) {
        alert("Please enter a business or occupancy name.");
        return;
      }
      setFormStep(2);
    } else if (formStep === 2) {
      if (!formRevenue.trim()) {
        alert("Please specify estimated annual gross receipts.");
        return;
      }
      setFormStep(3);
    }
  };

  const handleFormSubmit = () => {
    // Add new request to dashboard
    const title = activeFormType === 'tax-exemption' 
      ? `Tax Exemption: ${formBusinessName}` 
      : activeFormType === 'parking-permit' 
      ? 'Residential Parking Pass' 
      : 'Bulk Sanitation Request';
    
    const type = activeFormType === 'tax-exemption' ? 'tax' : activeFormType === 'parking-permit' ? 'parking' : 'sanitation';
    
    onAddRequest(title, type);
    
    // Add success message to chat
    const successMsg = {
      id: `msg-success-${Date.now()}`,
      sender: 'ai',
      text: `✓ Success! Your form "${title}" has been successfully submitted and logged inside your Citizen Dashboard. Representative review is estimated within 2 business days.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, successMsg]);
    setActiveFormType(null);
  };

  const suggestedTopics = [
    { title: "Business License Help", prompt: "I need help registering a new LLC business license in Ward 4." },
    { title: "Tax Clarification", prompt: "What are the current property tax exemption rates for senior citizens?" },
    { title: "Zoning Inquiries", prompt: "Do I need a building permit to add a small backyard storage shed?" },
    { title: "Permit Renewals", prompt: "I need to renew my residential parking permit for license plate CP-882." }
  ];

  const handleSidebarNavigate = (key) => {
    if (key === 'report') {
      // No issue-report modal lives on this page; send the user to Dashboard,
      // where the sidebar's Report item opens it directly.
      onNavigate('dashboard');
      return;
    }
    onNavigate(key);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex font-sans">
      
      <Sidebar 
        activeTab="assistant" 
        onNavigate={handleSidebarNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser} 
      />

      {/* SideNavBar/Assistant Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 p-4 gap-6 bg-[#f2f4f6] border-r border-[#c6c6cd]/30 w-72 shadow-sm flex-shrink-0">
        <div className="px-4 py-2">
          <button 
            onClick={() => onNavigate('landing')}
            className="font-extrabold text-xl text-black hover:text-teal-700 transition-colors text-left"
          >
            CivicPulse AI
          </button>
        </div>

        {/* Civic Guide Status card */}
        <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-50 rounded-full blur-xl" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0c9488] to-[#89f5e7] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Civic Guide</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online &amp; Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Topics list */}
        <div className="flex-grow space-y-4 text-left px-2">
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Suggested Topics</h5>
          <div className="space-y-1.5">
            {suggestedTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(topic.prompt)}
                className="w-full text-left bg-white hover:bg-[#d5e3fd]/25 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-bold hover:text-slate-950 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <span>{topic.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Pro Tip Card */}
        <div className="bg-slate-250 border border-slate-300 rounded-2xl p-4 text-xs text-left leading-relaxed text-slate-500 font-medium">
          <p className="font-bold text-slate-800 mb-1">💡 Pro Tip:</p>
          You can upload tax documents directly to clarify exemptions or fast-track permit validation.
        </div>
      </aside>
 
      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        
        {/* Top bar */}
        <header className="h-16 border-b border-[#c6c6cd]/45 bg-white flex items-center justify-between px-6 md:px-12 z-30 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="lg:hidden text-slate-500 font-bold text-xs"
            >
              ← Back
            </button>
            <div className="text-left">
              <h2 className="font-extrabold text-sm text-slate-900 leading-tight">AI Service Assistant</h2>
              <p className="text-[10px] text-slate-400 font-semibold">Instant legal guidance and document pre-filling</p>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-bold text-teal-600 hover:underline cursor-pointer"
          >
            Go to Dashboard
          </button>
        </header>

        {/* Chat Stream Window */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-6 bg-slate-50/50">
          
          {/* Welcome Alert */}
          <div className="bg-teal-50/40 border border-teal-100 rounded-2xl p-5 max-w-2xl mx-auto flex gap-4 text-left">
            <ShieldCheck className="w-6 h-6 text-teal-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-teal-900 text-sm">Official Secure Portal</h3>
              <p className="text-xs text-teal-700 leading-relaxed mt-1">
                Your data is fully encrypted under municipal privacy guidelines. All conversations remain anonymous until you choose to submit formal applications to a department.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} text-left`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4.5 space-y-3.5 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 rounded-tl-none text-slate-800'
                  }`}>
                    {/* Header */}
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span className="font-extrabold text-[10px] text-teal-800 uppercase tracking-widest">AI Analysis Report</span>
                      </div>
                    )}

                    {/* Message Body */}
                    <p className="text-xs leading-relaxed font-medium">
                      {msg.text}
                    </p>

                    {/* Bullet Points */}
                    {msg.bullets && msg.bullets.length > 0 && (
                      <ul className="list-disc ml-4 space-y-2 text-xs text-slate-600">
                        {msg.bullets.map((b, idx) => (
                          <li key={idx} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    )}

                    {/* Actions / Interactive Forms Form widget */}
                    {msg.formAssistance && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                        <div className="text-left space-y-0.5">
                          <p className="font-bold text-xs text-slate-900">{msg.formAssistance.title}</p>
                          <p className="text-[10px] text-slate-500">{msg.formAssistance.description}</p>
                        </div>
                        <button 
                          onClick={() => startFormAssistance(msg.formAssistance.formType)}
                          className="bg-[#0c9488] hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg whitespace-nowrap transition-all shadow-xs cursor-pointer"
                        >
                          {msg.formAssistance.buttonText}
                        </button>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-[9px] text-right ${msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>

            {/* Simulated interactive form assistance layout directly in stream */}
            <AnimatePresence>
              {activeFormType && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  className="bg-white border-2 border-teal-600 rounded-3xl p-6 text-left space-y-4 shadow-xl relative"
                >
                  <button 
                    onClick={() => setActiveFormType(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>

                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-teal-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                      Smart Assistant Form Filling (Step {formStep} of 3)
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#0c9488] h-full transition-all duration-300" 
                      style={{ width: `${(formStep / 3) * 100}%` }}
                    />
                  </div>

                  {formStep === 1 && (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700">Business or Occupant Name</label>
                      <input 
                        type="text" 
                        value={formBusinessName}
                        onChange={(e) => setFormBusinessName(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-teal-600" 
                        placeholder="e.g. Alex's Creative Writing Studio" 
                      />
                      <p className="text-[10px] text-slate-400">Specify the legal name of your entity as it appears on official documents.</p>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700">Annual Gross Receipts / Estimates</label>
                      <input 
                        type="text" 
                        value={formRevenue}
                        onChange={(e) => setFormRevenue(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-teal-600" 
                        placeholder="e.g. Under $5,000" 
                      />
                      <p className="text-[10px] text-slate-400">We will verify this against Schedule C filing to authorize exemption waivers.</p>
                    </div>
                  )}

                  {formStep === 3 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 text-sm">Form Verification Summary</h4>
                      <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2">
                        <p><span className="text-slate-400">Business:</span> <strong>{formBusinessName}</strong></p>
                        <p><span className="text-slate-400">Revenue Estimate:</span> <strong>{formRevenue}</strong></p>
                        <p><span className="text-slate-400">Ward District:</span> <strong>District 4 (Ward 4)</strong></p>
                      </div>
                      <p className="text-[10px] text-emerald-700 font-semibold">✓ Meets home-based tax exemption thresholds.</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button 
                      onClick={() => formStep > 1 ? setFormStep(formStep - 1) : setActiveFormType(null)}
                      className="px-4 py-2 font-bold text-xs text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {formStep === 1 ? 'Cancel' : 'Back'}
                    </button>
                    <button 
                      onClick={formStep < 3 ? handleFormNext : handleFormSubmit}
                      className="bg-black hover:bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-1 transition-all active:scale-98"
                    >
                      <span>{formStep < 3 ? 'Next' : 'Submit Application'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isTyping && (
              <div className="flex justify-start text-left">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

        </div>

        {/* Input area */}
        <div className="p-4 md:p-6 bg-white border-t border-[#c6c6cd]/40 flex-shrink-0 z-20 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
              className="bg-[#f2f4f6] rounded-2xl p-2 flex items-center gap-2 shadow-inner border border-[#c6c6cd]/30 focus-within:ring-2 focus-within:ring-teal-600/10 focus-within:border-teal-500 transition-all"
            >
              <button 
                type="button" 
                onClick={() => handleSendMessage("Renew my parking permit")}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl"
                title="Attach Document"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs md:text-sm text-slate-800 placeholder-slate-400"
                placeholder="Ask Civic Guide anything about local laws, permits, or waste collection..." 
              />
              
              <div className="flex items-center gap-1">
                <button 
                  type="button" 
                  onClick={() => handleSendMessage("Trash collection guidelines")}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hidden sm:block"
                  title="Voice Input"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-black hover:bg-slate-900 text-white p-2.5 rounded-xl disabled:opacity-40 disabled:hover:bg-black transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              CivicPulse AI Guide is powered by AI and may be inaccurate. Recommendations do not override statutory filings — verify with official sources.
            </p>
          </div>
        </div>

      </main>

    </div>
  );
}
