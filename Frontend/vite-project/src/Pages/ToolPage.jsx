import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import TabBar, { TABS } from "../components/TabBar";
import QueryForm from "../components/QueryForm";
import ResultView from "../components/ResultView";
import ComplaintTracker from "../components/ComplaintTracker";
import EmergencyContacts from "../components/EmergencyContacts";
import NearbyOffices from "../components/NearbyOffices";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ToolPage() {
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
      const res = await axios.post(`${API_BASE}/api/ask`, { mode: tab, query, language });
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
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold">CivicAI</h1>
        <Link to="/" className="text-sm text-slate-400 hover:text-white">← Home</Link>
      </div>
      <p className="text-slate-400 mb-6">Your AI Government Assistant</p>

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
      {tab === "complaint" && <ComplaintTracker complaints={complaints} />}
      <NearbyOffices />
      <EmergencyContacts />
    </div>
  );
}
