import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero, BookingSearchParams } from './components/Hero';
import { WebsiteMotoBanner } from './components/WebsiteMotoBanner';
import { VehicleCatalogue } from './components/VehicleCatalogue';
import { VehiclesPage } from './components/VehiclesPage';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingConstructionCard } from './components/FloatingConstructionCard';
import { LocationsModal } from './components/LocationsModal';
import { ShuttleTrackerModal } from './components/ShuttleTrackerModal';
import { EnquiryTracker } from './components/EnquiryTracker';
import { VehicleInterestModal } from './components/VehicleInterestModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPortal } from './components/admin/AdminPortal';
import Lenis from 'lenis';

import { Vehicle, InterestSubmission, User } from '@/types';
import { api } from '@/lib/api';
import { CheckCircle2, X, ChevronDown, Sparkles } from 'lucide-react';

export function App() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // View state: 'public' (Home page) | 'vehicles-page' (Full vehicles list) | 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'vehicles-page' | 'admin'>('public');

  // Modals state
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  const [selectedVehicleForInterest, setSelectedVehicleForInterest] = useState<Vehicle | null>(null);
  const [selectedColorForInterest, setSelectedColorForInterest] = useState<string | undefined>(undefined);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [isShuttleTrackerOpen, setIsShuttleTrackerOpen] = useState(false);

  // Interactive filters and promo state
  const [activePromoCode, setActivePromoCode] = useState<string | null>(null);
  const [externalFilterCategory, setExternalFilterCategory] = useState<string | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<BookingSearchParams | null>(null);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dark mode (defaults to system preference, persisted in localStorage)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('at_theme');
      if (saved !== null) {
        return saved === 'dark';
      }
      const legacySaved = localStorage.getItem('at_dark_mode');
      if (legacySaved !== null) {
        return legacySaved === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // minimal modern dark by default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('at_theme', 'dark');
      localStorage.setItem('at_dark_mode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('at_theme', 'light');
      localStorage.setItem('at_dark_mode', 'false');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Fetch initial fleet and user session
  useEffect(() => {
    const init = async () => {
      try {
        const list = await api.getVehicles();
        setVehicles(list);
        const user = api.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Failed to initialize fleet', err);
      }
    };
    init();

    const handleAuthChange = () => {
      setCurrentUser(api.getCurrentUser());
    };
    window.addEventListener('at_auth_changed', handleAuthChange);
    return () => window.removeEventListener('at_auth_changed', handleAuthChange);
  }, []);

  // Navigation handlers
  const handleSelectSection = (sectionId: string) => {
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdminTrigger = () => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCurrentView('public');
  };

  const handleVehicleInterestSuccess = (submission: InterestSubmission) => {
    setToastMessage(`Your reservation enquiry is recorded! Ref ID: ${submission.refId}`);
  };

  // Handle Search Submission from Hero "I'm Interested" card
  const handleSearchBooking = (params: BookingSearchParams) => {
    setLastSearchParams(params);
    setToastMessage(`Showing vehicles for ${params.pickupLocation} (${params.pickupDate} to ${params.returnDate}). Choose your vehicle and click "I'm Interested".`);
    handleSelectSection('vehicles');
  };

  // Floating orange button scroll handler
  const handleFloatingScrollDown = () => {
    const scrollSections = ['vehicles', 'how-it-works', 'testimonials', 'faq', 'contact'];
    const currentScroll = window.scrollY + 300;
    for (const sec of scrollSections) {
      const el = document.getElementById(sec);
      if (el && el.offsetTop > currentScroll) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // If near bottom, scroll back up to hero
    const heroEl = document.getElementById('hero');
    heroEl?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Modern Accessible Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-[#FFFDF7] dark:bg-slate-900 text-stone-900 dark:text-slate-100 border border-[#E8DFCF] dark:border-slate-800 shadow-xl shadow-stone-900/10 dark:shadow-blue-500/10 flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold leading-relaxed">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Navigation Animated Container */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: ADMIN PORTAL */}
        {currentView === 'admin' && currentUser ? (
          <motion.div
            key="admin-page-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <AdminPortal
              currentUser={currentUser}
              onLogout={handleLogout}
              onReturnToUserSite={() => setCurrentView('public')}
              onOpen360={(v) => setSelectedVehicleForDetails(v)}
            />
          </motion.div>
        ) : currentView === 'vehicles-page' ? (
          /* VIEW 2: DEDICATED SEPARATE VEHICLES PAGE */
          <motion.div
            key="all-vehicles-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <VehiclesPage
              vehicles={vehicles}
              onBackToHome={() => {
                setCurrentView('public');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDetails={(v) => setSelectedVehicleForDetails(v)}
              onOpen360={(v) => setSelectedVehicleForDetails(v)}
              onSelectInterest={(v) => {
                setSelectedColorForInterest(undefined);
                setSelectedVehicleForInterest(v);
              }}
              lastSearchParams={lastSearchParams}
              darkMode={darkMode}
            />
          </motion.div>
        ) : (
          /* VIEW 3: PUBLIC HOME PAGE */
          <motion.div
            key="home-page-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-200 font-sans selection:bg-blue-600 selection:text-white ${darkMode ? 'dark' : ''}`}
          >
            {/* Top Navigation */}
            <Navbar
              currentUser={currentUser}
              onOpenAdmin={handleOpenAdminTrigger}
              onOpenTrack={() => setIsTrackerOpen(true)}
              onOpenLocations={() => setIsLocationsOpen(true)}
              onOpenShuttleTracker={() => setIsShuttleTrackerOpen(true)}
              onSelectSection={handleSelectSection}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />

            <main id="hero">
              {/* Hero Section with Official Centered Banner & Floating Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Hero
                  onSearchBooking={handleSearchBooking}
                  activePromoCode={null}
                  onApplyPromo={() => {}}
                  onSelectOption={handleSelectSection}
                  onOpenLocationsModal={() => setIsLocationsOpen(true)}
                  onOpenShuttleTracker={() => setIsShuttleTrackerOpen(true)}
                />
              </motion.div>

              {/* 3-Step Website Moto Visual Guide */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <WebsiteMotoBanner
                  onExploreFleet={() => handleSelectSection('vehicles')}
                />
              </motion.div>

              {/* Vehicles Catalogue */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <VehicleCatalogue
                  vehicles={vehicles}
                  onOpenDetails={(v) => setSelectedVehicleForDetails(v)}
                  onOpen360={(v) => setSelectedVehicleForDetails(v)}
                  onSelectInterest={(v) => {
                    setSelectedColorForInterest(undefined);
                    setSelectedVehicleForInterest(v);
                  }}
                  onViewAllVehicles={() => {
                    setCurrentView('vehicles-page');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  externalFilterCategory={externalFilterCategory}
                  activePromoCode={null}
                />
              </motion.div>

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <HowItWorks
                  onSelectOption={() => {
                    handleSelectSection('vehicles');
                  }}
                />
              </motion.div>

              {/* Real Customer Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Testimonials />
              </motion.div>

              {/* FAQs */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <FAQ />
              </motion.div>

              {/* Contact & Hub Details */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Contact />
              </motion.div>
            </main>

            {/* Footer */}
            <Footer
              onSelectSection={handleSelectSection}
              onOpenTrack={() => setIsTrackerOpen(true)}
              onOpenAdmin={handleOpenAdminTrigger}
            />

            {/* Persistent On-Scroll Construction Card */}
            <FloatingConstructionCard />

            {/* Floating Action Button */}
            <button
              onClick={handleFloatingScrollDown}
              className="fixed bottom-7 right-7 z-40 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
              aria-label="Scroll to next section"
            >
              <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- GLOBAL MODALS --- */}

      {/* Locations & Hubs Modal */}
      <LocationsModal
        isOpen={isLocationsOpen}
        onClose={() => setIsLocationsOpen(false)}
        onSelectHub={(hub) => {
          setToastMessage(`Pickup location updated to: ${hub}`);
          handleSelectSection('hero');
        }}
      />

      {/* Complimentary Shuttle Tracker Modal */}
      <ShuttleTrackerModal
        isOpen={isShuttleTrackerOpen}
        onClose={() => setIsShuttleTrackerOpen(false)}
      />

      {/* Vehicle Detail Modal with Color Selection & Rich Specs */}
      {selectedVehicleForDetails && (
        <VehicleDetailModal
          vehicle={selectedVehicleForDetails}
          isOpen={!!selectedVehicleForDetails}
          onClose={() => setSelectedVehicleForDetails(null)}
          onSelectInterest={(v, color) => {
            setSelectedVehicleForDetails(null);
            setSelectedColorForInterest(color);
            setSelectedVehicleForInterest(v);
          }}
        />
      )}

      {/* Vehicle Booking Interest Modal */}
      {selectedVehicleForInterest && (
        <VehicleInterestModal
          vehicle={selectedVehicleForInterest}
          isOpen={!!selectedVehicleForInterest}
          onClose={() => {
            setSelectedVehicleForInterest(null);
            setSelectedColorForInterest(undefined);
          }}
          selectedColor={selectedColorForInterest}
          onSuccess={handleVehicleInterestSuccess}
          initialParams={lastSearchParams}
        />
      )}

      {/* Public Reservation & Enquiry Tracker Modal */}
      <EnquiryTracker
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
