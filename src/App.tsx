import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero, BookingSearchParams } from './components/Hero';
import { CurrentOffers } from './components/CurrentOffers';
import { TripPlannerSection, TripType } from './components/TripPlannerSection';
import { VehicleCatalogue } from './components/VehicleCatalogue';
import { Vehicle360Viewer } from './components/Vehicle360Viewer';
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

  // View state
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  // Modals state
  const [selected360Vehicle, setSelected360Vehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleForInterest, setSelectedVehicleForInterest] = useState<Vehicle | null>(null);
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

  // Synchronize with OS system theme if user has not explicitly chosen
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('at_theme');
      if (saved === null) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  // Auto-dismiss toast after 4.5 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Load Initial Vehicles
  useEffect(() => {
    const initData = async () => {
      try {
        const vList = await api.getVehicles();
        setVehicles(vList);
        setCurrentUser(api.getCurrentUser());
      } catch (err) {
        console.error('Initialization error', err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    initData();
  }, []);

  // Initialize smooth Lenis momentum scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSelectSection = (sectionId: string) => {
    if (currentView === 'admin') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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

  // Handle Promo Code application
  const handleApplyPromo = (code: string) => {
    setActivePromoCode(code);
    setToastMessage(`Discount Coupon "${code}" Applied! Enjoy 15% off across our entire fleet.`);
  };

  // Handle Search Submission from Hero Booking card
  const handleSearchBooking = (params: BookingSearchParams) => {
    setLastSearchParams(params);
    if (params.promoCode) {
      setActivePromoCode(params.promoCode);
    }
    setToastMessage(`Showing vehicles for ${params.pickupLocation} (${params.pickupDate} to ${params.returnDate})`);
    handleSelectSection('vehicles');
  };

  // Handle Trip Type Selection from "What kind of trip are you planning?"
  const handleSelectTripType = (trip: TripType) => {
    setExternalFilterCategory(trip.filterCategory);
    setToastMessage(`Showing vehicles curated for "${trip.title}" (${trip.suggestedVehicles})`);
    handleSelectSection('vehicles');
  };

  // Floating orange button scroll handler
  const handleFloatingScrollDown = () => {
    const scrollSections = ['offers', 'trip-planner', 'vehicles', 'contact'];
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

  // Admin View
  if (currentView === 'admin' && currentUser) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <AdminPortal
          currentUser={currentUser}
          onLogout={handleLogout}
          onReturnToUserSite={() => setCurrentView('public')}
          onOpen360={(v) => setSelected360Vehicle(v)}
        />

        {selected360Vehicle && (
          <Vehicle360Viewer
            vehicle={selected360Vehicle}
            isOpen={!!selected360Vehicle}
            onClose={() => setSelected360Vehicle(null)}
            onSelectInterest={(v) => {
              setSelected360Vehicle(null);
              setSelectedVehicleForInterest(v);
            }}
          />
        )}
      </div>
    );
  }

  // Public User View
  return (
    <div className={`min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-200 font-sans selection:bg-blue-600 selection:text-white ${darkMode ? 'dark' : ''}`}>
      {/* Modern Accessible Toast Alert with Blue Accent */}
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

      {/* Top Navigation (Matching Screenshot 1) */}
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
        {/* Hero Section with Floating Search Booking Card & Highlights Bar (Screenshot 1) */}
        <Hero
          onSearchBooking={handleSearchBooking}
          activePromoCode={activePromoCode}
          onApplyPromo={handleApplyPromo}
          onSelectOption={handleSelectSection}
          onOpenLocationsModal={() => setIsLocationsOpen(true)}
          onOpenShuttleTracker={() => setIsShuttleTrackerOpen(true)}
        />

        {/* Current Offers Section: "Deals made for your next trip" (Screenshot 2) */}
        <CurrentOffers
          onApplyPromo={handleApplyPromo}
          onBookNow={(category) => {
            if (category) setExternalFilterCategory(category);
            handleSelectSection('vehicles');
          }}
        />

        {/* Start with the Journey Section: "What kind of trip are you planning?" (Screenshot 3) */}
        <TripPlannerSection
          onSelectTripType={handleSelectTripType}
        />

        {/* Vehicles Catalogue (Cars, SUVs, Minivans, Bikes with 360 Studio & Multi-Filters) */}
        <VehicleCatalogue
          vehicles={vehicles}
          onOpen360={(v) => setSelected360Vehicle(v)}
          onSelectInterest={(v) => setSelectedVehicleForInterest(v)}
          externalFilterCategory={externalFilterCategory}
          activePromoCode={activePromoCode}
        />

        {/* How It Works */}
        <HowItWorks
          onSelectOption={() => {
            handleSelectSection('vehicles');
          }}
        />

        {/* Real Customer Testimonials */}
        <Testimonials />

        {/* FAQs */}
        <FAQ />

        {/* Contact & Hub Details */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer
        onSelectSection={handleSelectSection}
        onOpenTrack={() => setIsTrackerOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Persistent On-Scroll Construction & Pivot Tech Developer Card */}
      <FloatingConstructionCard />

      {/* Floating Action Button (Screenshot 2 & 3: Vibrant Orange Circle with Down Chevron) */}
      <button
        onClick={handleFloatingScrollDown}
        className="fixed bottom-7 right-7 z-40 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
      </button>

      {/* --- MODALS --- */}

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

      {/* 360 Interactive Studio Modal */}
      {selected360Vehicle && (
        <Vehicle360Viewer
          vehicle={selected360Vehicle}
          isOpen={!!selected360Vehicle}
          onClose={() => setSelected360Vehicle(null)}
          onSelectInterest={(v) => {
            setSelected360Vehicle(null);
            setSelectedVehicleForInterest(v);
          }}
        />
      )}

      {/* Vehicle Booking Interest Modal */}
      {selectedVehicleForInterest && (
        <VehicleInterestModal
          vehicle={selectedVehicleForInterest}
          isOpen={!!selectedVehicleForInterest}
          onClose={() => setSelectedVehicleForInterest(null)}
          onSuccess={handleVehicleInterestSuccess}
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
