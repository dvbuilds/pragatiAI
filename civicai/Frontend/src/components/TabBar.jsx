const TABS = ["assistant", "scheme", "complaint", "document", "summarize"];
const LANGS = ["English", "Hindi", "Bengali", "Tamil", "Marathi"];

export default function TabBar({ tab, setTab, language, setLanguage, resetForm }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => { setTab(t); resetForm(); }}
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
  );
}

export { TABS, LANGS };
