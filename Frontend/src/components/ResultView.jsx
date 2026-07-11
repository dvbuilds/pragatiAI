export default function ResultView({ result }) {
  if (!result) return null;

  function speak() {
    window.speechSynthesis.cancel();
    const text = Object.entries(result)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : JSON.stringify(v)}`)
      .join(". ");
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div>
      <button
        onClick={speak}
        className="mb-2 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded"
      >
        🔊 Listen
      </button>
      <pre className="bg-slate-900 p-4 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
