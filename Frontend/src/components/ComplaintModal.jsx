import { useState } from "react";
import { X, Sparkles, Send, Loader2, Mail, AlertCircle } from "lucide-react";
import api from "../lib/api";
import { useLanguage } from "../i18n/LanguageContext";

const CATEGORY_OPTIONS = [
  { value: "waterlogging", labelKey: "complaints.modal.option.waterlogging" },
  { value: "inefficient_service", labelKey: "complaints.modal.option.inefficient_service" },
  { value: "crime_rate", labelKey: "complaints.modal.option.crime_rate" },
];

/**
 * NewComplaintModal — drafts and sends a formal complaint email via the
 * backend (Gemini-drafted subject/body, sent through Nodemailer).
 *
 * Usage:
 *   <NewComplaintModal open={open} onClose={() => setOpen(false)} onSent={(complaint) => {}} />
 */
export default function NewComplaintModal({ open, onClose, onSent = () => {}, onDrafted = () => {} }) {
  const { t, language, languages } = useLanguage();
  const languageName = languages.find((l) => l.code === language)?.native || language;
  const [issueCategory, setIssueCategory] = useState("waterlogging");
  const [area, setArea] = useState("");
  const [details, setDetails] = useState("");
  const [draft, setDraft] = useState(null); // { _id, generatedSubject, generatedBody }
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleGenerate = async () => {
    if (!area.trim() || !details.trim()) {
      setError(t("complaints.modal.fillRequired"));
      return;
    }
    setError("");
    setIsDrafting(true);
    try {
      const { data } = await api.post("/complaints/draft", { issueCategory, area, details });
      setDraft(data.data);
      onDrafted(data.data);
    } catch (err) {
      setError(err?.response?.data?.message || t("complaints.modal.generateError"));
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSend = async () => {
    if (!draft?._id) return;
    setError("");
    setIsSending(true);
    try {
      const { data } = await api.post(`/complaints/${draft._id}/send`, {
        recipientEmail: recipientEmail.trim() || undefined,
      });
      onSent(data.data);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || t("complaints.modal.sendError"));
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setIssueCategory("waterlogging");
    setArea("");
    setDetails("");
    setDraft(null);
    setRecipientEmail("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ncm-title"
    >
      <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-md" onClick={handleClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <h3 id="ncm-title" className="text-xl font-black text-black tracking-tight">
            {t("complaints.modal.title")}
          </h3>
          <button
            className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            onClick={handleClose}
            aria-label={t("complaints.modal.close")}
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t("complaints.modal.issueType")}</label>
            <select
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
              disabled={!!draft}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-600 outline-none transition-all disabled:opacity-60"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t("complaints.modal.area")}</label>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              disabled={!!draft}
              placeholder={t("complaints.modal.areaPlaceholder")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-600 outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t("complaints.modal.details")}</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              disabled={!!draft}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-teal-600 outline-none transition-all min-h-[100px] disabled:opacity-60"
              placeholder={t("complaints.modal.detailsPlaceholder")}
            />
            {language !== "en" && (
              <p className="text-[11px] text-slate-500">{t("complaints.modal.languageNote", { language: languageName })}</p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!draft && (
            <div className="flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={isDrafting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-teal-700 text-teal-700 font-bold text-sm hover:bg-teal-700/5 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isDrafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isDrafting ? t("complaints.modal.generating") : t("complaints.modal.generate")}
              </button>
            </div>
          )}

          {draft && (
            <div className="p-6 rounded-xl bg-teal-700/5 border border-teal-700/10 space-y-4">
              <div className="flex items-center gap-2 text-teal-700">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{t("complaints.modal.draftPreview")}</span>
              </div>
              <div className="space-y-3">
                <div className="pb-3 border-b border-teal-700/10">
                  <p className="text-xs text-slate-600 font-bold uppercase">{t("complaints.modal.subject")}</p>
                  <p className="text-base font-semibold text-slate-900">{draft.generatedSubject}</p>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {draft.generatedBody}
                </div>
              </div>
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  {t("complaints.modal.sendTo")}
                </label>
                <input
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="official@gov.in"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-4 shrink-0">
          <button onClick={handleClose} className="px-6 py-3 text-slate-600 font-bold text-sm hover:text-slate-900 cursor-pointer">
            {t("complaints.modal.cancel")}
          </button>
          {draft && (
            <button
              onClick={handleSend}
              disabled={isSending}
              className="bg-teal-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSending ? t("complaints.modal.sending") : t("complaints.modal.send")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
