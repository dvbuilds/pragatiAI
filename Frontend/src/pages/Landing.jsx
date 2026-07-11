import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SERVICES = [
  { icon: "🤖", title: "AI Assistant", desc: "Ask any government question, get instant answers", path: "/app?tab=assistant" },
  { icon: "🎯", title: "Scheme Finder", desc: "Discover schemes you qualify for", path: "/app?tab=scheme" },
  { icon: "📝", title: "Complaint Generator", desc: "Turn your issue into a formal complaint", path: "/app?tab=complaint" },
  { icon: "📄", title: "Document Assistant", desc: "Know exactly what documents you need", path: "/app?tab=document" },
  { icon: "📰", title: "Notice Summarizer", desc: "Understand government notices instantly", path: "/app?tab=summarize" },
];

const GOV_SCHEMES = [
  { icon: "🎓", name: "Scholarships", tag: "Education" },
  { icon: "🌾", name: "Farmer Schemes", tag: "PM-Kisan, KCC" },
  { icon: "👵", name: "Pension", tag: "Senior Citizens" },
  { icon: "🏠", name: "PMAY", tag: "Housing" },
  { icon: "💰", name: "Mudra Loan", tag: "Business" },
  { icon: "🚀", name: "Startup India", tag: "Entrepreneurship" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center"
      >
        <div className="inline-block px-4 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm mb-6">
          Powered by Gemini 2.5 Flash
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          PragatiAI
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
      </motion.section>

      {/* Quick Services */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-6 text-center">Quick Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={s.path}
                className="block bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl p-5 transition hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Government Schemes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {GOV_SCHEMES.map((s) => (
            <div key={s.name} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="text-xs text-slate-500">{s.tag}</p>
            </div>
          ))}
        </div>
      </section>

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
