import React, { useState, useEffect } from 'react';
import {
  Car,
  Calendar,
  Search,
  Phone,
  Shield,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { User } from '@/types';

interface NavbarProps {
  currentUser: User | null;
  onOpenAdmin: () => void;
  onOpenTrack: () => void;
  onSelectSection: (sectionId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAdmin,
  onOpenTrack,
  onSelectSection,
  darkMode,
  onToggleDarkMode,
  activeSection = 'hero',
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onSelectSection(sectionId);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-teal-950/95 dark:bg-charcoal-950/95 backdrop-blur-md shadow-lg border-b border-teal-900/50 dark:border-charcoal-800 py-3'
          : 'bg-gradient-to-b from-teal-950/90 via-teal-950/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo Wordmark */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-800 to-saffron-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              AT
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-warm-50 group-hover:text-saffron-300 transition-colors">
                  Amma<span className="text-saffron-500">Travels</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-saffron-500/20 text-saffron-400 border border-saffron-500/30 rounded">
                  Kakinada
                </span>
              </div>
              <p className="text-[11px] text-teal-200/80 font-medium tracking-wide">
                Every journey, a celebration
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('vehicles')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSection === 'vehicles'
                  ? 'text-saffron-400 bg-teal-900/40'
                  : 'text-warm-100 hover:text-saffron-300 hover:bg-teal-900/30'
              }`}
            >
              <Car className="w-4 h-4 text-saffron-400" />
              <span>Cars & Bikes</span>
            </button>

            <button
              onClick={() => handleNavClick('events')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSection === 'events'
                  ? 'text-saffron-400 bg-teal-900/40'
                  : 'text-warm-100 hover:text-saffron-300 hover:bg-teal-900/30'
              }`}
            >
              <Calendar className="w-4 h-4 text-saffron-400" />
              <span>Event Packages</span>
            </button>

            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeSection === 'how-it-works'
                  ? 'text-saffron-400 bg-teal-900/40'
                  : 'text-warm-100 hover:text-saffron-300 hover:bg-teal-900/30'
              }`}
            >
              How It Works
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeSection === 'contact'
                  ? 'text-saffron-400 bg-teal-900/40'
                  : 'text-warm-100 hover:text-saffron-300 hover:bg-teal-900/30'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Actions: Track, Dark Mode, Admin */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Track Enquiry Button */}
            <button
              onClick={onOpenTrack}
              className="px-3.5 py-2 text-sm font-medium text-warm-100 hover:text-white bg-teal-900/50 hover:bg-teal-800/60 border border-teal-700/60 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              title="Track enquiry status with your Ref ID"
            >
              <Search className="w-3.5 h-3.5 text-saffron-400" />
              <span>Track Enquiry</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-warm-200 hover:text-white bg-teal-900/40 hover:bg-teal-800/50 border border-teal-800/60 rounded-lg transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-saffron-400" /> : <Moon className="w-4 h-4 text-teal-300" />}
            </button>

            {/* Admin Portal / User Status */}
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 text-sm font-semibold text-teal-950 bg-saffron-500 hover:bg-saffron-400 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-saffron-500/20 active:scale-95"
            >
              <Shield className="w-4 h-4 text-teal-950" />
              <span>{currentUser?.role === 'admin' ? 'Admin Ops' : 'Admin'}</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-warm-200 bg-teal-900/40 border border-teal-800/60 rounded-lg"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-saffron-400" /> : <Moon className="w-4 h-4 text-teal-300" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-warm-100 hover:text-white bg-teal-900/50 border border-teal-800/60 rounded-lg"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-teal-950/98 dark:bg-charcoal-950/98 border-b border-teal-900 px-4 pt-3 pb-6 space-y-3 mt-3 backdrop-blur-lg">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => handleNavClick('vehicles')}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-900/40 text-warm-100 text-sm font-medium"
            >
              <Car className="w-4 h-4 text-saffron-400" />
              <span>Cars & Bikes</span>
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-900/40 text-warm-100 text-sm font-medium"
            >
              <Calendar className="w-4 h-4 text-saffron-400" />
              <span>Event Packages</span>
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="w-full text-left px-3 py-2 text-sm text-warm-200 hover:text-white hover:bg-teal-900/30 rounded-md"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-3 py-2 text-sm text-warm-200 hover:text-white hover:bg-teal-900/30 rounded-md"
            >
              Contact Us & Location
            </button>
          </div>

          <div className="pt-2 border-t border-teal-900/60 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrack();
              }}
              className="w-full py-2.5 text-center text-sm font-medium text-warm-100 bg-teal-900/60 border border-teal-700/60 rounded-lg flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-saffron-400" />
              <span>Track Existing Enquiry</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-teal-950 bg-saffron-500 rounded-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Operations</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
