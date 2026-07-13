import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Menu, X, ChevronRight } from 'lucide-react';

/**
 * Pragati AI - Professional Civic Navigation Bar
 *
 * Adapted to this project's navigation model: the app uses a single
 * `activeTab` state in App.jsx plus an `onNavigate(tab)` callback passed down
 * through every page, rather than URL-based routing / react-router-dom. So
 * this component takes `onNavigate` + `activeTab` as props instead of using
 * <Link>/<NavLink>, which require a Router that isn't set up here.
 *
 * Public-facing only: used on Landing, Login, and Register. Authenticated
 * pages (Dashboard/Portal/Assistant/Settings) show the dark Sidebar with the
 * real logged-in user instead — "Sign In"/"Sign Up" wouldn't make sense there.
 */
export default function Navbar({ onNavigate, activeTab = 'landing' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // About/Features/Contact don't have dedicated pages or landing-page anchor
  // sections yet — they scroll to the closest existing equivalent for now.
  // Flagging this: build real About/Contact content, or point these at real
  // sections, whenever those exist. Anchor scrolling only works from the
  // Landing page itself; from Login/Register these just navigate to Landing.
  const navLinks = [
    { name: 'About', anchor: '#top', id: 'nav-link-about' },
    { name: 'Features', anchor: '#features', id: 'nav-link-features' },
    { name: 'Contact', anchor: '#resources', id: 'nav-link-contact' },
  ];

  const handleAnchorClick = (anchor) => (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (activeTab !== 'landing') {
      onNavigate('landing');
      return;
    }
    if (anchor === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goTo = (tab) => () => {
    setIsOpen(false);
    onNavigate(tab);
  };

  return (
    <nav
      id="navbar"
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[#131b2e]/98 shadow-xl border-white/10 py-3'
          : 'bg-[#131b2e]/95 backdrop-blur-md border-white/5 py-5'
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-10 max-w-[1280px] mx-auto h-16">
        
        {/* Brand Logo */}
        <button
          id="navbar-logo-container"
          onClick={goTo('landing')}
          className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md shadow-teal-500/25">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
            Pragati AI
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8" id="navbar-desktop-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.anchor}
              id={link.id}
              onClick={handleAnchorClick(link.anchor)}
              className="text-sm font-medium tracking-wide transition-colors duration-200 relative py-1.5 text-slate-300 hover:text-white cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4" id="navbar-desktop-actions">
          <button
            id="nav-btn-signin"
            onClick={goTo('login')}
            className={`transition-colors duration-200 font-semibold text-sm px-4 py-2 cursor-pointer ${
              activeTab === 'login' ? 'text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            id="nav-btn-signup"
            onClick={goTo('register')}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-teal-900/20 hover:shadow-teal-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile & Tablet Control Buttons */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            id="nav-btn-signup-mobile"
            onClick={goTo('register')}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-teal-900/20 active:scale-95 cursor-pointer"
          >
            Sign Up
          </button>
          
          <button
            id="nav-btn-mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-teal-400 p-1.5 transition-colors duration-200 focus:outline-none rounded-lg hover:bg-white/5 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="navbar-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-[#131b2e] border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={link.anchor}
                      id={`${link.id}-mobile`}
                      onClick={handleAnchorClick(link.anchor)}
                      className="flex items-center justify-between text-base font-medium py-2 border-b border-white/5 transition-colors text-slate-200 hover:text-white cursor-pointer"
                    >
                      {link.name}
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </a>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-3 pt-4 border-t border-white/10"
              >
                <button
                  id="nav-btn-signin-mobile"
                  onClick={goTo('login')}
                  className="w-full text-center py-3 rounded-lg text-slate-200 hover:text-white font-semibold text-sm transition-colors border border-white/10 hover:bg-white/5 cursor-pointer"
                >
                  Sign In
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
