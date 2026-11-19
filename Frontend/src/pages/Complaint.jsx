import React, { useState, useEffect, useMemo } from "react";
import { Plus, Eye, X, Loader2, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import NewComplaintModal from "../components/ComplaintModal";
import api from "../lib/api";
import { useLanguage } from "../i18n/LanguageContext";

// Enum values come from the API; the label keys are only for display.
const CATEGORY_LABEL_KEYS = {
  waterlogging: "complaints.category.waterlogging",
  inefficient_service: "complaints.category.inefficient_service",
  crime_rate: "complaints.category.crime_rate",
};

const FILTERS = [
  { key: "all", labelKey: "complaints.filter.all" },
  { key: "drafted", labelKey: "complaints.filter.drafted" },
  { key: "sent", labelKey: "complaints.filter.sent" },
  { key: "failed", labelKey: "complaints.filter.failed" },
];

function StatusBadge({ status }) {
  const { t } = useLanguage();
  const map = {
    sent: { icon: CheckCircle2, cls: "bg-emerald-100 text-emerald-800", label: t("complaints.status.sent") },
    drafted: { icon: Clock, cls: "bg-amber-100 text-amber-800", label: t("complaints.status.drafted") },
    failed: { icon: XCircle, cls: "bg-rose-100 text-rose-800", label: t("complaints.status.failed") },
  };
  const s = map[status] || map.drafted;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${s.cls} text-[11px] font-bold uppercase tracking-wider`}>
      <s.icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

export default function Complaint({ onNavigate, onLogout, currentUser }) {
  const { t, locale } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchComplaints = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.get("/complaints");
      setComplaints(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || t("complaints.list.loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const stats = useMemo(() => ({
    total: complaints.length,
    sent: complaints.filter((c) => c.status === "sent").length,
    drafted: complaints.filter((c) => c.status === "drafted").length,
    failed: complaints.filter((c) => c.status === "failed").length,
  }), [complaints]);

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  const handleSidebarNavigate = (key) => {
    if (key === "report") {
      onNavigate("dashboard");
      return;
    }
    onNavigate(key);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen overflow-hidden flex font-sans">
      <Sidebar activeTab="complaints" onNavigate={handleSidebarNavigate} onLogout={onLogout} currentUser={currentUser} />

      <div className="flex-1 h-screen overflow-y-auto">
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#131b2e] tracking-tight">
                {t("complaints.page.title")}
              </h2>
              <p className="text-slate-500 mt-1 max-w-xl">
                {t("complaints.page.intro")}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              {t("complaints.page.newButton")}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: t("complaints.stats.total"), value: stats.total },
              { label: t("complaints.stats.sent"), value: stats.sent },
              { label: t("complaints.stats.drafted"), value: stats.drafted },
              { label: t("complaints.stats.failed"), value: stats.failed },
            ].map((s) => (
              <div key={s.label} className="bg-white p-6 rounded-xl border border-[#c6c6cd]/40 shadow-sm">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{s.label}</span>
                <div className="text-3xl font-black text-[#131b2e] mt-2">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-8 mb-6 border-b border-[#c6c6cd]/40">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`pb-4 text-sm font-bold transition-all cursor-pointer ${
                  filter === f.key ? "border-b-2 border-teal-700 text-[#131b2e]" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("complaints.list.loading")}
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-[#c6c6cd]/40">
              <p className="text-slate-500 text-sm">
                {complaints.length === 0
                  ? t("complaints.list.emptyNone")
                  : t("complaints.list.emptyFiltered")}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#c6c6cd]/40 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#c6c6cd]/40">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t("complaints.table.category")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t("complaints.table.subject")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t("complaints.table.date")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t("complaints.table.status")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">{t("complaints.table.action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6c6cd]/30">
                  {filtered.map((c) => (
                    <React.Fragment key={c._id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 text-sm text-slate-600">{CATEGORY_LABEL_KEYS[c.issueCategory] ? t(CATEGORY_LABEL_KEYS[c.issueCategory]) : c.issueCategory}</td>
                        <td className="px-6 py-5">
                          <div className="max-w-xs">
                            <p className="text-sm font-semibold text-[#131b2e] truncate">{c.generatedSubject}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{c.area}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-500 text-sm">{new Date(c.createdAt).toLocaleDateString(locale)}</td>
                        <td className="px-6 py-5"><StatusBadge status={c.status} /></td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-500"
                            aria-label={t("complaints.table.toggle")}
                          >
                            {expandedId === c._id ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      {expandedId === c._id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-5 bg-slate-50 text-sm text-slate-700 whitespace-pre-line">
                            {c.generatedBody}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <NewComplaintModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDrafted={fetchComplaints}
        onSent={() => {
          setIsModalOpen(false);
          fetchComplaints();
        }}
      />
    </div>
  );
}