import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const TABS = ["assistant", "scheme", "complaint", "document"];
const LANGS = ["English", "Hindi", "Bengali", "Tamil", "Marathi"];
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function App() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "assistant";
  const [tab, setTab] = useState(TABS.includes(initialTab) ? initialTab : "assistant");
  const [language, setLanguage] = useState("English");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState(
    JSON.parse(localStorage.getItem("complaints") || "[]")
  );

  const [profile, setProfile] = useState({
    age: "", occupation: "", income: "", gender: "", state: "", education: ""
  });

  async function handleSubmit() {
    setLoading(true);
    setResult(null);
    const query = tab === "scheme" ? profile : input;
    try {
      const res = await axios.post(`${API_BASE}/api/ask`, {
        mode: tab, query, language,
      });
      setResult(res.data);

      if (tab === "complaint") {
        const newComplaint = {
          id: Date.now(),
          ...res.data,
          status: "Registered",
          raw: input,
        };
        const updated = [newComplaint, ...complaints];
        setComplaints(updated);
        localStorage.setItem("complaints", JSON.stringify(updated));
      }
    } catch (e) {
      setResult({ error: "Something went wrong. Check server." });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold">CivicAI</h1>
        <Link to="/" className="text-sm text-slate-400 hover:text-white">← Home</Link>
      </div>
      <p className="text-slate-400 mb-6">Your AI Government Assistant</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setResult(null); setInput(""); }}
            className={`px-4 py-2 rounded-lg capitalize ${
              tab === t ? "bg-blue-600" : "bg-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="ml-auto bg-slate-800 px-3 py-2 rounded-lg"
        >
          {LANGS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 mb-6">
        {tab === "scheme" ? (
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(profile).map((key) => (
              <input
                key={key}
                placeholder={key}
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="bg-slate-800 p-2 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              tab === "assistant" ? "e.g. I lost my Aadhaar card" :
              tab === "complaint" ? "e.g. My road is broken near XYZ" :
              "e.g. I want a passport"
            }
            className="w-full bg-slate-800 p-3 rounded-lg h-24"
          />
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-3 bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Submit"}
        </button>
      </div>

      {result && (
        <pre className="bg-slate-900 p-4 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {tab === "complaint" && complaints.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Complaint Tracker</h2>
          {complaints.map((c) => (
            <div key={c.id} className="bg-slate-900 p-3 rounded-lg mb-2">
              <p className="font-semibold">{c.department} — {c.priority}</p>
              <p className="text-sm text-slate-400">{c.formalComplaint}</p>
              <p className="text-xs text-blue-400 mt-1">Status: {c.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}