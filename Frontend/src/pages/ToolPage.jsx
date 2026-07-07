import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import TabBar, { TABS } from "../components/TabBar";
import QueryForm from "../components/QueryForm";
import ResultView from "../components/ResultView";
import ComplaintTracker from "../components/ComplaintTracker";
import EmergencyContacts from "../components/EmergencyContacts";
import NearbyOffices from "../components/NearbyOffices";
import { useTheme } from "../components/ThemeContext";

export default function ToolPage() {
  const { dark, toggle } = useTheme();
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

  function resetForm() {
    setResult(null);
    setInput("");
  }

  async function handleSubmit() {
    setLoading(true);
    setResult(null);
    const query = tab === "scheme" ? profile : input;
    try {
      const res = await api.post(`/api/ask`, { mode: tab, query, language });
      setResult(res.data);

      if (tab === "complaint") {
        const newComplaint = { id: Date.now(), ...res.data, status: "Registered", raw: input };
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
    <div className={`min-h-screen p-6 ${dark ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold">CivicAI</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className={`text-sm px-3 py-1 rounded-lg ${dark ? "bg-slate-800" : "bg-gray-200"}`}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <Link to="/" className={`text-sm ${dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>← Home</Link>
        </div>
      </div>
      <p className={`mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>Your AI Government Assistant</p>

      <TabBar tab={tab} setTab={setTab} language={language} setLanguage={setLanguage} resetForm={resetForm} />
      <QueryForm
        tab={tab}
        input={input}
        setInput={setInput}
        profile={profile}
        setProfile={setProfile}
        language={language}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <ResultView result={result} />
      {tab === "complaint" && <ComplaintTracker complaints={complaints} setComplaints={setComplaints} />}
      <NearbyOffices />
      <EmergencyContacts />
    </div>
  );
}
