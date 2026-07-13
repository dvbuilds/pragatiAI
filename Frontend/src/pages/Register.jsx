import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Building2,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Register({ onNavigate }) {
  const { register } = useAuth();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Validation - kept strict client-side (12 chars + symbol + digit);
  // backend enforces a lighter floor (8 chars + digit) as defense in depth.
  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (password.length < 12) {
      setErrorMessage("Password must be at least 12 characters long.");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
      setErrorMessage("Password must contain at least one symbol.");
      return false;
    }
    if (!/\d/.test(password)) {
      setErrorMessage("Password must contain at least one number.");
      return false;
    }
    if (!agreeToTerms) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await register({ fullName: name, email, password });
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(
        err?.response?.data?.message || "Something went wrong while creating your account. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans flex flex-col justify-between relative overflow-hidden selection:bg-[#0c9488]/20 selection:text-[#0c9488]">
      
      {/* Dynamic Ambient Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0c9488]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <Navbar onNavigate={onNavigate} activeTab="register" />

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-8 z-10 max-w-7xl w-full mx-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Brand Intro & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col gap-8 lg:pr-6">
            <div className="space-y-4">
              {/* Animated Accent Pill */}
              <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-[#0c9488]/10 text-[#0c9488] text-xs font-semibold rounded-full tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart City Digital Infrastructure</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-[#131b2e] tracking-tight leading-[1.15]">
                A smarter way to engage with your city.
              </h1>
              <p className="text-base md:text-lg text-[#45464d] leading-relaxed">
                Join thousands of citizens using CivicPulse AI to streamline public requests, track neighborhood updates, and receive personalized civic insights.
              </p>
            </div>

            {/* Bento Grid for Civic Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="p-5 rounded-xl bg-white border border-[#e2e8f0]/80 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 rounded-lg bg-[#0c9488]/10 flex items-center justify-center mb-4 text-[#0c9488] group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 fill-[#0c9488]/10" />
                </div>
                <h3 className="font-semibold text-sm text-[#131b2e] mb-1">AI Assistant</h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Get instant answers to complex city regulations, forms, and procedures.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-5 rounded-xl bg-white border border-[#e2e8f0]/80 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm text-[#131b2e] mb-1">Track Progress</h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Real-time status updates on every municipal service request you submit.
                </p>
              </div>

              {/* Feature 3 - Double-span Row */}
              <div className="p-5 rounded-xl bg-white border border-[#e2e8f0]/80 shadow-sm sm:col-span-2 flex flex-col sm:flex-row items-center gap-5 hover:shadow-md transition-shadow group">
                <div className="h-20 w-full sm:w-28 rounded-lg overflow-hidden flex-shrink-0 border border-[#e2e8f0] relative">
                  <img
                    alt="Civic Map Interface"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHXqU0C1W3QWRON3v_gMw6nV89l7d6r5mlHg5Hmty-9ASflSiBJ_U2U-X27OBhTfkHuGdfPZaVXIIEEFIpAEsKAL6wmvFHAm0Djstz-OxOS4ShZ1ZNs9Y7NKVSziQK2-KmFr24z2g1eg_FyqQTdenaeeCBZ-jV0IIfD_tNKXyrn_A0hx0bf9Zekj5hZlDbunhjz9B6wRX27Bl8yi2UTBjxUBYvNU3vXpcC8X5hb2RA6RbrHqrk9ySKJg"
                  />
                  <div className="absolute inset-0 bg-slate-900/5" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-1 text-[#0c9488]">
                    <ShieldCheck className="w-4 h-4" />
                    <h4 className="font-semibold text-sm text-[#131b2e]">Verified Security</h4>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Government-grade encryption protocols and secure storage for all your personal documentation and interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card Container */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-2xl border border-[#e2e8f0] shadow-xl shadow-slate-900/5 relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  /* --- REGISTRATION FORM --- */
                  <motion.div
                    key="form-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-[#131b2e] mb-1.5 tracking-tight">
                        Create Citizen Account
                      </h2>
                      <p className="text-sm text-[#45464d]">
                        Enter your details to start your digital journey.
                      </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                      
                      {/* Name Input */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#45464d] uppercase tracking-wider" htmlFor="name">
                          Full Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#76777d] group-focus-within:text-[#131b2e] transition-colors" />
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Alex Johnson"
                            required
                            disabled={isSubmitting}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-[#c6c6cd] rounded-lg focus:ring-2 focus:ring-[#0c9488]/20 focus:border-[#0c9488] focus:bg-white outline-none transition-all text-sm text-[#191c1e]"
                          />
                        </div>
                      </div>

                      {/* Email Input */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#45464d] uppercase tracking-wider" htmlFor="email">
                          Email Address
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#76777d] group-focus-within:text-[#131b2e] transition-colors" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@example.gov"
                            required
                            disabled={isSubmitting}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-[#c6c6cd] rounded-lg focus:ring-2 focus:ring-[#0c9488]/20 focus:border-[#0c9488] focus:bg-white outline-none transition-all text-sm text-[#191c1e]"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold text-[#45464d] uppercase tracking-wider" htmlFor="password">
                            Create Password
                          </label>
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#76777d] group-focus-within:text-[#131b2e] transition-colors" />
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={isSubmitting}
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-[#c6c6cd] rounded-lg focus:ring-2 focus:ring-[#0c9488]/20 focus:border-[#0c9488] focus:bg-white outline-none transition-all text-sm text-[#191c1e]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#131b2e] transition-colors focus:outline-none"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-[#45464d] leading-normal pt-0.5">
                          Must be at least 12 characters with a symbol and a number.
                        </p>
                      </div>

                      {/* Terms & Privacy checkbox */}
                      <div className="flex items-start gap-3 py-1">
                        <div className="relative flex items-center h-5">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            required
                            disabled={isSubmitting}
                            className="w-4 h-4 text-[#0c9488] border-[#c6c6cd] rounded focus:ring-[#0c9488]/40 accent-[#0c9488] cursor-pointer"
                          />
                        </div>
                        <label className="text-xs text-[#45464d] leading-normal select-none cursor-pointer" htmlFor="terms">
                          I agree to the{" "}
                          <a href="#" onClick={(e) => { e.preventDefault(); alert("Terms of Service details..."); }} className="text-[#0c9488] font-bold hover:underline">
                            Terms of Service
                          </a>{" "}
                          and acknowledge the{" "}
                          <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy Policy details..."); }} className="text-[#0c9488] font-bold hover:underline">
                            Privacy Policy
                          </a>{" "}
                          regarding AI data processing.
                        </label>
                      </div>

                      {/* Error Banner */}
                      {errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-[#ba1a1a]/10 border-l-4 border-[#ba1a1a] rounded text-[#ba1a1a] flex items-center gap-2.5 text-xs"
                        >
                          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                          <span className="font-medium">{errorMessage}</span>
                        </motion.div>
                      )}

                      {/* Submit CTA Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-sm py-3 px-4 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-slate-700 shadow-md shadow-slate-900/10 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#89f5e7]" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <ArrowRight className="w-4.5 h-4.5" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-[#45464d] lg:hidden">
                      Already have an account?{" "}
                      <button
                        onClick={() => onNavigate('login')}
                        className="text-[#0c9488] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  </motion.div>
                ) : (
                  /* --- REGISTRATION SUCCESS VIEW --- */
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#0c9488]/10 flex items-center justify-center mb-6 text-[#0c9488]">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#131b2e] mb-2 tracking-tight">
                      Welcome to CivicPulse!
                    </h2>
                    <p className="text-sm text-[#45464d] max-w-xs mb-8 leading-relaxed">
                      Hello <span className="font-semibold text-slate-800">{name}</span>, your citizen account has been successfully created. You can now access all AI-powered services.
                    </p>

                    {/* Next Steps List */}
                    <div className="w-full text-left bg-slate-50 rounded-xl p-4 border border-[#e2e8f0] mb-8 space-y-3">
                      <h4 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">Your Next Steps:</h4>
                      <div className="flex gap-2.5 items-start text-xs text-[#45464d]">
                        <Check className="w-4 h-4 text-[#0c9488] shrink-0 mt-0.5" />
                        <span>Complete your civic profile details</span>
                      </div>
                      <div className="flex gap-2.5 items-start text-xs text-[#45464d]">
                        <Check className="w-4 h-4 text-[#0c9488] shrink-0 mt-0.5" />
                        <span>Browse local council updates and news</span>
                      </div>
                      <div className="flex gap-2.5 items-start text-xs text-[#45464d]">
                        <Check className="w-4 h-4 text-[#0c9488] shrink-0 mt-0.5" />
                        <span>Ask our AI assistant about city guidelines</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="w-full bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-sm py-3 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Go to Citizen Portal
                        <ArrowRight className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 md:px-10 bg-white border-t border-[#e2e8f0] z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#45464d] font-medium text-center md:text-left">
            © {new Date().getFullYear()} Digital Government Services. Powered by CivicPulse AI.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs font-medium text-[#45464d] hover:text-[#131b2e] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs font-medium text-[#45464d] hover:text-[#131b2e] transition-colors">
              Accessibility
            </a>
            <a href="#" className="text-xs font-medium text-[#45464d] hover:text-[#131b2e] transition-colors">
              Support Services
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
