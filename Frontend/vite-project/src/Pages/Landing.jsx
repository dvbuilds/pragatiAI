import { Link } from "react-router-dom";

const SERVICES = [
  { icon: "🤖", title: "AI Assistant", desc: "Ask any government question, get instant answers", path: "/app?tab=assistant" },
  { icon: "🎯", title: "Scheme Finder", desc: "Discover schemes you qualify for", path: "/app?tab=scheme" },
  { icon: "📝", title: "Complaint Generator", desc: "Turn your issue into a formal complaint", path: "/app?tab=complaint" },
  { icon: "📄", title: "Document Assistant", desc: "Know exactly what documents you need", path: "/app?tab=document" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm mb-6">
          Powered by Gemini 2.5 Flash
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          CivicAI
        </h1>
        <p className="text-xl text-slate-400 mb-2">Your AI Government Assistant</p>
        <p className="text-slate-500 max-w-xl mx-auto mb-10">
          Ask questions, discover schemes, generate complaints, and understand
          government processes — all in your own language.
        </p>
        <Link
          to="/app"
          className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          Get Started →
        </Link>
      </section>

      {/* Quick Services */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-6 text-center">Quick Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              to={s.path}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl p-5 transition hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-3xl font-bold text-blue-400">5+</p>
          <p className="text-slate-500 text-sm">Languages</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-400">4</p>
          <p className="text-slate-500 text-sm">Core Features</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-400">24/7</p>
          <p className="text-slate-500 text-sm">AI Availability</p>
        </div>
      </section>
    </div>
  );
}