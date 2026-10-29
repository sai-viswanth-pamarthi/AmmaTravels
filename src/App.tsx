import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleCatalogue } from './components/VehicleCatalogue';
import { Vehicle360Viewer } from './components/Vehicle360Viewer';
import { EventPackages } from './components/EventPackages';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { EnquiryTracker } from './components/EnquiryTracker';
import { VehicleInterestModal } from './components/VehicleInterestModal';
import { EventInterestModal } from './components/EventInterestModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPortal } from './components/admin/AdminPortal';

import { Vehicle, EventPackage, InterestSubmission, User } from '@/types';
import { api } from '@/lib/api';
import { CheckCircle2, X } from 'lucide-react';

export function App() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [packages, setPackages] = useState<EventPackage[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // View state
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  // Modals state
  const [selected360Vehicle, setSelected360Vehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleForInterest, setSelectedVehicleForInterest] = useState<Vehicle | null>(null);
  const [selectedPackageForInterest, setSelectedPackageForInterest] = useState<EventPackage | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('at_dark_mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('at_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('at_dark_mode', 'false');
    }
  }, [darkMode]);

  // Load Initial Vehicles & Packages
  useEffect(() => {
    const initData = async () => {
      try {
        const [vList, pList] = await Promise.all([
          api.getVehicles(),
          api.getPackages(),
        ]);
        setVehicles(vList);
        setPackages(pList);
        setCurrentUser(api.getCurrentUser());
      } catch (err) {
        console.error('Initialization error', err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    initData();
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
    setToastMessage(`Booking inquiry registered! Reference ID: ${submission.refId}`);
  };

  const handleEventInterestSuccess = (submission: InterestSubmission) => {
    setToastMessage(`Event inquiry registered! Reference ID: ${submission.refId}`);
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

        {/* 360 Viewer accessible even within Admin */}
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
    <div className={`min-h-screen bg-warm-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-warm-100 transition-colors duration-300 font-sans selection:bg-saffron-500 selection:text-teal-950 ${darkMode ? 'dark' : ''}`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-teal-950 text-warm-50 border border-saffron-500/60 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-saffron-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-teal-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenTrack={() => setIsTrackerOpen(true)}
        onSelectSection={handleSelectSection}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <main id="hero">
        {/* Parallax Hero */}
        <Hero
          onSelectOption={(choice) => {
            handleSelectSection(choice === 'vehicles' ? 'vehicles' : 'events');
          }}
        />

        {/* Vehicles Catalogue (Cars & Bikes with Multi-Filters & 360 Studio) */}
        <VehicleCatalogue
          vehicles={vehicles}
          onOpen360={(v) => setSelected360Vehicle(v)}
          onSelectInterest={(v) => setSelectedVehicleForInterest(v)}
        />

        {/* Event Management Packages */}
        <EventPackages
          packages={packages}
          onSelectInterest={(pkg) => setSelectedPackageForInterest(pkg)}
        />

        {/* How It Works */}
        <HowItWorks
          onSelectOption={(choice) => {
            handleSelectSection(choice === 'vehicles' ? 'vehicles' : 'events');
          }}
        />

        {/* Real Customer Testimonials */}
        <Testimonials />

        {/* FAQs */}
        <FAQ />

        {/* Contact & Kakinada Hub Details */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer
        onSelectSection={handleSelectSection}
        onOpenTrack={() => setIsTrackerOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* --- MODALS --- */}

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

      {/* Event Package Interest Modal */}
      {selectedPackageForInterest && (
        <EventInterestModal
          eventPackage={selectedPackageForInterest}
          isOpen={!!selectedPackageForInterest}
          onClose={() => setSelectedPackageForInterest(null)}
          onSuccess={handleEventInterestSuccess}
        />
      )}

      {/* Public Enquiry Tracker Modal */}
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
