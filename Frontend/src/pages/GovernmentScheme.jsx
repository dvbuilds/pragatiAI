import { useState } from "react";
const RECOMMENDATIONS = [
  {
    match: "98% Match",
    authority: "Central Government",
    title: "Pradhan Mantri Awas Yojana (PMAY)",
    benefitLabel: "Benefits up to",
    benefitValue: "₹2.67 Lakhs",
    description:
      "Incentives for affordable housing for urban and rural citizens. Based on your income, you qualify for the Middle Income Group (MIG-I) subsidy.",
    tags: ["Housing", "Subsidy"],
  },
  {
    match: "85% Match",
    authority: "State Government",
    title: "Skill Development & Entrepreneurship",
    benefitLabel: "Loan Assistance",
    benefitValue: "Low Interest",
    description:
      "Designed for individuals in your occupation looking to upscale their business. Includes 6 months of mentorship and capital funding support.",
    tags: ["Education", "Startup"],
  },
  {
    match: "76% Match",
    authority: "Central Government",
    title: "Ayushman Bharat - PMJAY",
    benefitLabel: "Health cover up to",
    benefitValue: "₹5 Lakhs",
    description:
      "Comprehensive health insurance for economically vulnerable families, covering secondary and tertiary care hospitalization across empaneled hospitals.",
    tags: ["Healthcare", "Insurance"],
  },
];
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
export default function GovernmentScheme() {
  const [showResults, setShowResults] = useState(true);
  const [form, setForm] = useState({ age: "", gender: "", occupation: "", income: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResults(true);
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
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
                      "radial-gradient(600px circle at 0% 0%, rgba(99,102,241,0.08), transparent 40%), radial-gradient(600px circle at 100% 100%, rgba(236,72,153,0.08), transparent 40%)",
                  }}
                />
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">AI Scheme Finder</h3>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Age">
                    <input
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      type="number"
                      placeholder="Enter your age"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                    />
                  </Field>
                  <Field label="Gender">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </Field>
                  <Field label="Occupation">
                    <select
                      name="occupation"
                      value={form.occupation}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                    >
                      <option value="">Select Occupation</option>
                      <option>Farmer</option>
                      <option>Student</option>
                      <option>Self-Employed</option>
                      <option>Private Sector</option>
                      <option>Unemployed</option>
                    </select>
                  </Field>
                  <Field label="Annual Income (₹)">
                    <input
                      name="income"
                      value={form.income}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g. 5,00,000"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                    />
                  </Field>
                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Find Matching Schemes
                    </button>
                  </div>
                </form>
              </section>
              {/* Recommendations */}
              {showResults && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h4 className="text-2xl font-semibold text-slate-900">AI Recommendations</h4>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                      {RECOMMENDATIONS.length} MATCHES FOUND
                    </span>
                  </div>
                  {RECOMMENDATIONS.map((rec) => (
                    <article
                      key={rec.title}
                      className="bg-white border border-slate-200 p-6 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                              {rec.match}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {rec.authority}
                            </span>
                          </div>
                          <h5 className="text-xl font-bold text-slate-900">{rec.title}</h5>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-slate-500 font-medium">{rec.benefitLabel}</p>
                          <p className="text-lg font-bold text-indigo-700">{rec.benefitValue}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-6">{rec.description}</p>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex gap-2 flex-wrap">
                          {rec.tags.map((t) => (
                            <span
                              key={t}
                              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <button className="px-6 py-2 border-2 border-slate-900 text-slate-900 font-bold rounded-lg hover:bg-slate-900 hover:text-white transition-colors">
                          View Details
                        </button>
                      </div>
                    </article>
                  ))}
                </section>
              )}
            </div>
            {/* Right Column: Trending */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-rose-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5-5 5M6 12h12"
                    />
                  </svg>
                  <h4 className="text-lg font-semibold text-slate-900">Trending Schemes</h4>
                </div>
                <ul className="space-y-4">
                  {TRENDING.map((t, i) => (
                    <li
                      key={t.title}
                      className="pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-slate-300 font-bold text-lg leading-none w-6">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wide">
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
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-md">
                <h4 className="text-lg font-bold mb-2">Need help applying?</h4>
                <p className="text-sm text-indigo-100 mb-4">
                  Our advisors can guide you through eligibility, documentation and application
                  submission — end to end.
                </p>
                <button className="w-full bg-white text-indigo-700 font-bold py-2.5 rounded-lg hover:bg-indigo-50 transition-colors">
                  Talk to an Advisor
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
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
