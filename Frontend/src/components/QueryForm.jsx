import { useState } from "react";

export default function QueryForm({ tab, input, setInput, profile, setProfile, language, onSubmit, loading }) {
  const [listening, setListening] = useState(false);

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "Hindi" ? "hi-IN" : "en-IN";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.start();
  }

  const placeholders = {
    assistant: "e.g. I lost my Aadhaar card",
    complaint: "e.g. My road is broken near XYZ",
    summarize: "Paste the government notice text here",
    document: "e.g. I want a passport",
  };

  return (
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
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[tab]}
            className="w-full bg-slate-800 p-3 rounded-lg h-24"
          />
          <button
            onClick={startVoiceInput}
            className={`mt-2 text-xs px-3 py-1 rounded ${listening ? "bg-red-600" : "bg-slate-800 hover:bg-slate-700"}`}
          >
            {listening ? "🎙️ Listening..." : "🎙️ Voice Input"}
          </button>
        </div>
      )}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="mt-3 bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 block"
      >
        {loading ? "Thinking..." : "Submit"}
      </button>
    </div>
  );
}
