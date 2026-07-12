import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Menu, X, ChevronRight } from 'lucide-react';

/**
 * Pragati AI - Professional Civic Navigation Bar
 * Built with React, Tailwind CSS, React Router, and Motion.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll state to add depth and transition visual properties of the navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', path: '/about', id: 'nav-link-about' },
    { name: 'Features', path: '/features', id: 'nav-link-features' },
    { name: 'Contact', path: '/contact', id: 'nav-link-contact' },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[#131b2e]/98 shadow-xl border-white/10 py-3'
          : 'bg-[#131b2e]/95 backdrop-blur-md border-white/5 py-5'
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-10 max-w-[1280px] mx-auto h-16">
        
        {/* Brand Logo */}
        <Link
          to="/"
          id="navbar-logo-container"
          className="flex items-center gap-2.5 group focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md shadow-teal-500/25">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
            Pragati AI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8" id="navbar-desktop-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              id={link.id}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors duration-200 relative py-1.5 ${
                  isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4" id="navbar-desktop-actions">
          <Link
            to="/signin"
            id="nav-btn-signin"
            className="text-slate-300 hover:text-white transition-colors duration-200 font-semibold text-sm px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            id="nav-btn-signup"
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-teal-900/20 hover:shadow-teal-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile & Tablet Control Buttons */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Accent Sign Up Button - Remains visible on small screens for higher CTR */}
          <Link
            to="/signup"
            id="nav-btn-signup-mobile"
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-teal-900/20 active:scale-95"
          >
            Sign Up
          </Link>
          
          <button
            id="nav-btn-mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-teal-400 p-1.5 transition-colors duration-200 focus:outline-none rounded-lg hover:bg-white/5"
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
                    <NavLink
                      to={link.path}
                      id={`${link.id}-mobile`}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between text-base font-medium py-2 border-b border-white/5 transition-colors ${
                          isActive ? 'text-teal-400 font-semibold' : 'text-slate-200 hover:text-white'
                        }`
                      }
                    >
                      {link.name}
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-3 pt-4 border-t border-white/10"
              >
                <Link
                  to="/signin"
                  id="nav-btn-signin-mobile"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-lg text-slate-200 hover:text-white font-semibold text-sm transition-colors border border-white/10 hover:bg-white/5"
                >
                  Sign In
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
