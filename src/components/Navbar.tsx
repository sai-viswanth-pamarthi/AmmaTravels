import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  Calendar,
  Search,
  Phone,
  Moon,
  Sun,
  Menu,
  X,
  Bus,
  Tag,
  Globe,
  ChevronDown
} from 'lucide-react';
import { User } from '@/types';

interface NavbarProps {
  currentUser: User | null;
  onOpenAdmin?: () => void;
  onOpenTrack: () => void;
  onOpenLocations: () => void;
  onOpenShuttleTracker: () => void;
  onSelectSection: (sectionId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAdmin,
  onOpenTrack,
  onOpenLocations,
  onOpenShuttleTracker,
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? 'py-2.5 bg-[#FAF6EC]/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-[#E8DFCF] dark:border-slate-800/80'
          : 'py-3 sm:py-5 bg-[#FAF6EC]/85 dark:bg-slate-950/75 backdrop-blur-md border-b border-[#E8DFCF]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo Wordmark */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1"
          >
            <img
              src="/logo.jpg"
              alt="AmmaTravelskkd Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
            />
            <div className="flex flex-col text-left">
              <div className="flex items-baseline gap-0.5">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                  Amma<span className="text-blue-600 dark:text-blue-400">Travels</span><span className="text-blue-600 dark:text-blue-400 lowercase font-extrabold text-base sm:text-lg">kkd</span>
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight">
                Amma Enterprises
              </span>
            </div>
          </button>

          {/* Centered Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-[#F3EBD8]/90 dark:bg-slate-900/80 p-1.5 rounded-full border border-[#E8DFCF] dark:border-slate-800 backdrop-blur-md">
            <button
              onClick={() => handleNavClick('hero')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeSection === 'hero'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#FFFDF7] dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('vehicles')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeSection === 'vehicles'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#FFFDF7] dark:hover:bg-slate-800'
              }`}
            >
              Vehicles & Fleet
            </button>

            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeSection === 'how-it-works'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#FFFDF7] dark:hover:bg-slate-800'
              }`}
            >
              How It Works
            </button>

            <button
              onClick={onOpenTrack}
              className="px-4 py-1.5 text-xs font-semibold rounded-full text-stone-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-[#FFFDF7] dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Track Interest</span>
            </button>

            <button
              onClick={() => handleNavClick('testimonials')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeSection === 'testimonials'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#FFFDF7] dark:hover:bg-slate-800'
              }`}
            >
              Reviews
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeSection === 'contact'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#FFFDF7] dark:hover:bg-slate-800'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Items: Sun/Moon Toggle, Admin Portal, Menu Button */}
          <div className="flex items-center gap-2.5">
            {/* Sun / Moon Theme Toggle with 200ms transition */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-700 dark:text-slate-300 bg-[#F3EBD8] dark:bg-slate-900 hover:bg-[#EAE1CE] dark:hover:bg-slate-800 border border-[#E8DFCF] dark:border-slate-800 rounded-xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-900 dark:text-slate-100 bg-[#F3EBD8] dark:bg-slate-900 hover:bg-[#EAE1CE] dark:hover:bg-slate-800 border border-[#E8DFCF] dark:border-slate-800 rounded-xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FFFDF7]/98 dark:bg-slate-950/98 border-b border-[#E8DFCF] dark:border-slate-800 px-4 sm:px-6 pt-3 pb-6 space-y-3 mt-2 shadow-xl backdrop-blur-xl animate-in fade-in max-h-[calc(100dvh-5rem)] overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('hero')}
              className="w-full text-left px-4 py-3 min-h-[44px] text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('vehicles')}
              className="w-full text-left px-4 py-3 min-h-[44px] text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center justify-between"
            >
              <span>Vehicles & Fleet</span>
              <span className="text-[11px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold">
                Cars & Bikes
              </span>
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="w-full text-left px-4 py-3 min-h-[44px] text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrack();
              }}
              className="w-full text-left px-4 py-3 min-h-[44px] text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-2.5"
            >
              <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Track Your Interest</span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-4 py-3 min-h-[44px] text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center"
            >
              Contact Hub in Kakinada
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
