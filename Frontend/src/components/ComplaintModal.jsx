import { useState } from "react";
/**
 * NewComplaintModal — single-file React component (JS).
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <NewComplaintModal open={open} onClose={() => setOpen(false)} onSend={(data) => {}} />
 *
 * Requires Tailwind CSS. Uses Material Symbols + Inter (loaded once on mount).
 */
export default function NewComplaintModal({
  open = true,
  onClose = () => {},
  onSend = () => {},
  initialDescription = "",
  initialDraft = {
    subject: "Urgent: Infrastructure Repair Request - Ward 12",
    body:
      "Dear Municipal Commissioner,\n\nI am writing to formally register a complaint regarding the deteriorating state of public infrastructure in Ward 12. Specifically, the flickering street lights near the Metro Station have become a safety concern for commuters during late hours.\n\nI request your immediate attention to this matter to ensure the safety and well-being of the residents. Thank you for your prompt action.\n\nSincerely,\n[Citizen Name]",
  },
}) {
  const [description, setDescription] = useState(initialDescription);
  const [draft, setDraft] = useState(initialDraft);
  const [generating, setGenerating] = useState(false);
  // Load fonts + material symbols once (safe no-op if already present)
  if (typeof document !== "undefined" && !document.getElementById("__ncm_fonts")) {
    const l1 = document.createElement("link");
    l1.id = "__ncm_fonts";
    l1.rel = "stylesheet";
    l1.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap";
    document.head.appendChild(l1);
    const l2 = document.createElement("link");
    l2.rel = "stylesheet";
    l2.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    document.head.appendChild(l2);
  }
  if (!open) return null;
  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setDraft({
        subject: description
          ? `Complaint: ${description.slice(0, 60)}${description.length > 60 ? "…" : ""}`
          : initialDraft.subject,
        body: initialDraft.body,
      });
      setGenerating(false);
    }, 600);
  };
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ fontFamily: "Inter, sans-serif" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ncm-title"
    >
      <div
        className="absolute inset-0 bg-slate-800/40 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 id="ncm-title" className="text-xl font-black text-black tracking-tight">
            Register New Complaint
          </h3>
          <button
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-slate-600">close</span>
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Describe your issue
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-teal-600 outline-none transition-all min-h-[120px]"
              placeholder="Please provide details about the civic issue you are facing..."
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-teal-700 text-teal-700 font-bold text-sm hover:bg-teal-700/5 transition-all active:scale-95 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              {generating ? "Generating…" : "Generate AI Email"}
            </button>
          </div>
          <div className="p-6 rounded-xl bg-teal-700/5 border border-teal-700/10 space-y-4">
            <div className="flex items-center gap-2 text-teal-700">
              <span className="material-symbols-outlined text-sm">mail</span>
              <span className="text-xs font-bold uppercase tracking-widest">
                AI Draft Preview
              </span>
            </div>
            <div className="space-y-3">
              <div className="pb-3 border-b border-teal-700/10">
                <p className="text-xs text-slate-600 font-bold uppercase">Subject:</p>
                <p className="text-base font-semibold text-slate-900">{draft.subject}</p>
              </div>
              <div className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {draft.body}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-600 font-bold text-sm hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend({ description, ...draft })}
            className="bg-teal-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">send</span>
            Send via Gmail
          </button>
        </div>
      </div>
    </div>
  );
}
