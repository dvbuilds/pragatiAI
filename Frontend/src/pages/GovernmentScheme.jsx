import { useState, useEffect } from "react";
import { Sparkles, Search, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../lib/api";

const TRENDING = [
  {
    title: "PM-KISAN Samman Nidhi",
    category: "Agriculture",
    benefit: "₹6,000/year direct benefit transfer to eligible farmers.",
  },
  {
    title: "Startup India Seed Fund",
    category: "Entrepreneurship",
    benefit: "Financial assistance for proof of concept and market entry.",
  },
  {
    title: "National Scholarship Portal",
    category: "Education",
    benefit: "Consolidated portal for central and state scholarships.",
  },
  {
    title: "Stand-Up India",
    category: "Finance",
    benefit: "Bank loans between ₹10L – ₹1Cr for SC/ST and women entrepreneurs.",
  },
];

export default function GovernmentScheme({ onNavigate, onLogout, currentUser }) {
  const [form, setForm] = useState({
    age: currentUser?.profile?.age ?? "",
    gender: currentUser?.profile?.gender ?? "",
    occupation: currentUser?.profile?.occupation ?? "",
    income: currentUser?.profile?.annualIncome ?? "",
  });
  const [matches, setMatches] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const runMatch = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError("");
    setHasSearched(true);
    try {
      const { data } = await api.post("/schemes/match", {
        age: form.age === "" ? undefined : Number(form.age),
        gender: form.gender || undefined,
        occupation: form.occupation || undefined,
        annualIncome: form.income === "" ? undefined : Number(form.income),
      });
      setMatches(data.data.matches || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not fetch scheme matches. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run once on load using whatever profile info is already saved
  useEffect(() => {
    runMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSidebarNavigate = (key) => {
    if (key === "report") {
      onNavigate("dashboard");
      return;
    }
    onNavigate(key);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900 font-sans flex">
      <Sidebar activeTab="schemes" onNavigate={handleSidebarNavigate} onLogout={onLogout} currentUser={currentUser} />

      <div className="flex-1 min-h-screen">
        <main className="p-6 md:p-10">
          <div className="max-w-[1280px] mx-auto">
            {/* Header */}
            <header className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2">
                Government Schemes
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                Discover and apply for state and central government programs tailored to your
                profile using our AI-driven matching engine.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8">
                {/* AI Finder Form */}
                <section className="relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 opacity-60"
                    style={{
                      background:
                        "radial-gradient(600px circle at 0% 0%, rgba(12,148,136,0.08), transparent 40%), radial-gradient(600px circle at 100% 100%, rgba(236,72,153,0.08), transparent 40%)",
                    }}
                  />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-teal-100 text-teal-700 p-2 rounded-lg">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900">AI Scheme Finder</h3>
                  </div>
                  <form onSubmit={runMatch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Age">
                      <input
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        type="number"
                        placeholder="Enter your age"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                      />
                    </Field>
                    <Field label="Gender">
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </Field>
                    <Field label="Occupation">
                      <input
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Student, Farmer, Self-Employed"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                      />
                    </Field>
                    <Field label="Annual Income (₹)">
                      <input
                        name="income"
                        value={form.income}
                        onChange={handleChange}
                        type="number"
                        placeholder="e.g. 500000"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                      />
                    </Field>
                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 cursor-pointer"
                      >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        {isLoading ? "Matching..." : "Find Matching Schemes"}
                      </button>
                    </div>
                  </form>
                </section>

                {/* Recommendations */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h4 className="text-2xl font-semibold text-slate-900">AI Recommendations</h4>
                    {matches && (
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                        {matches.length} MATCHES FOUND
                      </span>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  {!error && hasSearched && matches?.length === 0 && (
                    <p className="text-sm text-slate-500 p-4">
                      No confident matches yet — fill in more profile details above and try again.
                    </p>
                  )}

                  {matches?.map((rec, i) => (
                    <article
                      key={i}
                      className="bg-white border border-slate-200 p-6 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            AI Match
                          </span>
                          <h5 className="text-xl font-bold text-slate-900 mt-2">{rec.name}</h5>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-3">{rec.whyEligible}</p>
                      <p className="text-slate-500 text-sm mb-6">
                        <span className="font-semibold text-slate-700">How to apply: </span>
                        {rec.howToApply}
                      </p>
                      <a
                        href={rec.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2 border-2 border-slate-900 text-slate-900 font-bold rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </article>
                  ))}
                </section>
              </div>

              {/* Right Column: Trending (static/illustrative — not live-matched) */}
              <aside className="lg:col-span-3 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <h4 className="text-lg font-semibold text-slate-900">Popular Schemes</h4>
                  </div>
                  <ul className="space-y-4">
                    {TRENDING.map((t, i) => (
                      <li key={t.title} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <span className="text-slate-300 font-bold text-lg leading-none w-6">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <p className="text-xs text-teal-700 font-semibold uppercase tracking-wide">
                              {t.category}
                            </p>
                            <p className="font-semibold text-slate-900 mb-1">{t.title}</p>
                            <p className="text-sm text-slate-600">{t.benefit}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-slate-700 font-semibold">{label}</label>
      {children}
    </div>
  );
}
