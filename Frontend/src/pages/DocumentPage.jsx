import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, Send, Loader2, CheckCircle2, ExternalLink,
  Fingerprint, ShoppingBasket, Banknote, ChevronRight, FileText, AlertCircle
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../lib/api";

const QUICK_GUIDES = [
  { icon: Fingerprint, title: "Birth Certificate", documentName: "Birth Certificate", action: "create" },
  { icon: Fingerprint, title: "Update Aadhaar", documentName: "Aadhaar", action: "update" },
  { icon: ShoppingBasket, title: "Ration Card", documentName: "Ration Card", action: "create" },
  { icon: Banknote, title: "Income Certificate", documentName: "Income Certificate", action: "create" },
];

export default function DocumentPage({ onNavigate, onLogout, currentUser }) {
  const [documentName, setDocumentName] = useState("");
  const [action, setAction] = useState("create");
  const [history, setHistory] = useState([]); // { documentName, action, guide?, error? }
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, isLoading]);

  const submitRequest = async (docName, docAction) => {
    if (!docName.trim() || isLoading) return;
    setIsLoading(true);
    const entry = { documentName: docName, action: docAction };
    setHistory((prev) => [...prev, entry]);

    try {
      const { data } = await api.post("/documents/guide", { documentName: docName, action: docAction });
      setHistory((prev) => prev.map((h) => (h === entry ? { ...h, guide: data.data } : h)));
    } catch (err) {
      const message = err?.response?.data?.message || "Could not generate a guide right now. Please try again.";
      setHistory((prev) => prev.map((h) => (h === entry ? { ...h, error: message } : h)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRequest(documentName, action);
    setDocumentName("");
  };

  const handleQuickGuide = (guide) => {
    submitRequest(guide.documentName, guide.action);
  };

  const handleSidebarNavigate = (key) => {
    if (key === "report") {
      onNavigate("dashboard");
      return;
    }
    onNavigate(key);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#f7f9fb] text-[#191c1e]">
      <Sidebar activeTab="documents" onNavigate={handleSidebarNavigate} onLogout={onLogout} currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <header className="border-b border-[#c6c6cd]/40 bg-white z-20 shrink-0">
          <div className="flex justify-between items-center px-6 h-16 w-full max-w-[1280px] mx-auto">
            <h2 className="text-xl font-bold text-[#131b2e]">Document AI Assistant</h2>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {/* Center: Conversation */}
          <section className="flex-1 flex flex-col min-w-0 h-full relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth">
              {/* Intro */}
              <div className="flex items-start gap-4 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-[#c6c6cd]/40 rounded-2xl rounded-tl-none p-5 shadow-sm">
                  <p className="text-sm leading-relaxed text-slate-700">
                    Hi, I'm your <span className="font-semibold text-teal-700">CivicPulse Document Assistant</span>.
                    Tell me which document you need — creating fresh or updating an existing one — and I'll
                    walk you through the steps, required paperwork, typical fees, and the official portal link.
                  </p>
                </div>
              </div>

              {history.map((entry, i) => (
                <React.Fragment key={i}>
                  {/* User request */}
                  <div className="flex items-start gap-4 max-w-3xl ml-auto flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-white text-xs font-bold">
                      {currentUser?.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="bg-slate-100 rounded-2xl rounded-tr-none p-5">
                      <p className="text-sm text-slate-800">
                        I need to {entry.action === "update" ? "update" : "apply for"} my <strong>{entry.documentName}</strong>. What's the process?
                      </p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex items-start gap-4 max-w-3xl">
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-[#c6c6cd]/40 rounded-2xl rounded-tl-none p-5 shadow-sm w-full">
                      {!entry.guide && !entry.error && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Looking up the process...
                        </div>
                      )}
                      {entry.error && (
                        <div className="flex items-center gap-2 text-rose-600 text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {entry.error}
                        </div>
                      )}
                      {entry.guide && (
                        <div>
                          <p className="text-xs mb-3 flex items-center gap-1 font-semibold text-teal-700 uppercase tracking-wide">
                            <CheckCircle2 className="w-4 h-4" /> Step-by-step process
                          </p>
                          <ol className="space-y-2 list-decimal list-inside text-sm text-slate-700">
                            {entry.guide.steps?.map((step, idx) => <li key={idx}>{step}</li>)}
                          </ol>

                          {entry.guide.requiredDocuments?.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Required Documents</p>
                              <ul className="space-y-1.5">
                                {entry.guide.requiredDocuments.map((doc, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                    {doc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-4 mt-4 text-xs text-slate-500">
                            {entry.guide.estimatedTime && <span><strong>Time:</strong> {entry.guide.estimatedTime}</span>}
                            {entry.guide.estimatedFee && <span><strong>Fee:</strong> {entry.guide.estimatedFee}</span>}
                          </div>

                          {entry.guide.notes && (
                            <p className="text-xs text-slate-500 mt-3 italic">{entry.guide.notes}</p>
                          )}

                          {entry.guide.officialLink && (
                            <a
                              href={entry.guide.officialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                            >
                              Apply on Official Portal
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-[#c6c6cd]/40 bg-white shrink-0">
              <div className="max-w-4xl mx-auto flex items-center gap-3">
                <input
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="e.g. Passport, Driving License, PAN Card..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-[#c6c6cd] rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                  disabled={isLoading}
                />
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="px-3 py-3 bg-slate-50 border border-[#c6c6cd] rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                  disabled={isLoading}
                >
                  <option value="create">Create New</option>
                  <option value="update">Update Existing</option>
                </select>
                <button
                  type="submit"
                  disabled={isLoading || !documentName.trim()}
                  className="w-11 h-11 shrink-0 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition-all active:scale-95 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-center text-[10px] mt-3 uppercase tracking-widest font-bold text-slate-400">
                Guidance is AI-generated — always confirm details on the official portal
              </p>
            </form>
          </section>

          {/* Right pane: Quick Guides */}
          <aside className="hidden lg:flex w-80 h-full flex-col p-6 gap-6 overflow-y-auto border-l border-[#c6c6cd]/40 bg-white shrink-0">
            <div>
              <h3 className="text-xs uppercase tracking-widest mb-4 text-slate-500 font-bold">Quick Guides</h3>
              <div className="space-y-3">
                {QUICK_GUIDES.map((g) => (
                  <button
                    key={g.title}
                    onClick={() => handleQuickGuide(g)}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#c6c6cd]/40 bg-slate-50 transition-all text-left group hover:shadow-md hover:border-teal-200 disabled:opacity-50 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <g.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{g.title}</p>
                      <p className="text-xs text-slate-500 capitalize">{g.action === "update" ? "Update existing" : "New application"}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto p-5 rounded-2xl bg-slate-900 text-white">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <h4 className="font-bold text-sm">Tip</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Name the exact document you need (e.g. "Voter ID" rather than "ID proof") for the most accurate steps.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
