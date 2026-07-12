import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  FileText, 
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!identity) {
      setError('Email or Citizen ID is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await login(identity, password);
      onNavigate('dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] relative overflow-hidden font-sans">
      
      {/* Background Decorative Atmosphere Spheres */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d5e3fd]/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#89f5e7]/10 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none z-0"></div>

      {/* Top Header Navigation */}
      <header className="w-full h-16 flex items-center justify-between px-6 md:px-10 max-w-[1280px] mx-auto z-10 relative">
        <button
          onClick={() => onNavigate('landing')}
          className="text-2xl font-bold text-[#131b2e] tracking-tight cursor-pointer"
        >
          CivicPulse AI
        </button>
        <div className="flex items-center gap-6">
          <span className="text-sm text-[#45464d] hidden md:inline">Need help?</span>
          <a href="#" className="text-sm font-semibold text-[#131b2e] hover:underline flex items-center gap-0.5">
            Contact Support
          </a>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-10 z-10 relative">
        
        {/* Core Auth Panel Card with Ambient AI Border glow */}
        <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl overflow-hidden border border-[#c6c6cd]/30 relative">
          
          {/* Subtle Outer Border Layer for glow effect */}
          <div className="absolute inset-0 rounded-xl border border-teal-500/10 pointer-events-none"></div>

          {/* Left Side: Refined Brand Canvas */}
          <div className="hidden md:flex flex-col justify-between p-12 bg-[#131b2e] text-white relative overflow-hidden">
            
            {/* Ambient Background Effects inside card */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#515f74]/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-20 -left-20 w-40 h-40 bg-[#6bd8cb]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="z-10">
              <h1 className="text-5xl font-bold tracking-tight leading-[56px] mb-6">
                Empowering Digital Governance
              </h1>
              <p className="text-[18px] leading-relaxed text-[#7c839b] font-normal">
                Securely access your citizen dashboard. CivicPulse AI provides transparent, reliable insights to help you navigate public services with confidence.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="z-10 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#89f5e7] shrink-0" />
                <span className="text-sm font-semibold text-[#7c839b] tracking-wide">
                  End-to-end Encrypted Sessions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#89f5e7] shrink-0" />
                <span className="text-sm font-semibold text-[#7c839b] tracking-wide">
                  GDPR &amp; ADA Compliant Interface
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Authentication Controls */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#131b2e] tracking-tight mb-2">Sign In</h2>
              <p className="text-sm text-[#45464d]">Welcome back to your civic portal.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded border border-red-100">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              {/* Identity field */}
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#45464d] uppercase mb-2" htmlFor="identity">
                  Email
                </label>
                <input 
                  id="identity"
                  type="text"
                  placeholder="e.g. alex.citizen@gov.us"
                  className="w-full h-12 px-4 rounded-lg border border-[#c6c6cd] focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all outline-none bg-[#f2f4f6] text-sm font-medium"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Password field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold tracking-wider text-[#45464d] uppercase" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-[#0c9488] hover:underline">
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <input 
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 rounded-lg border border-[#c6c6cd] focus:border-[#0c9488] focus:ring-2 focus:ring-[#0c9488]/20 transition-all outline-none bg-[#f2f4f6] text-sm font-medium tracking-widest"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#45464d] hover:text-[#131b2e] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#131b2e] text-white font-semibold text-sm rounded-lg hover:bg-[#131b2e]/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <LogIn className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Request Access Navigation */}
            <div className="mt-8 text-center">
              <span className="text-sm text-[#45464d]">New to CivicPulse?</span>
              <button
                onClick={() => onNavigate('register')}
                className="text-sm font-bold text-[#131b2e] hover:underline ml-2 cursor-pointer"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Elegant Public Footer */}
      <footer className="w-full py-8 px-6 md:px-10 border-t border-[#c6c6cd]/30 bg-[#f2f4f6]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-[#45464d]">
            © 2024 Digital Government Services. Powered by CivicPulse AI.
          </div>
          <div className="flex gap-6">
            <a className="text-xs text-[#45464d] hover:text-[#131b2e] transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs text-[#45464d] hover:text-[#131b2e] transition-colors" href="#">Terms of Service</a>
            <a className="text-xs text-[#45464d] hover:text-[#131b2e] transition-colors" href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
