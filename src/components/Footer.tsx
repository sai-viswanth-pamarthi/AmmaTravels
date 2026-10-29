import React from 'react';
import {
  Car,
  Calendar,
  Search,
  Shield,
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  onSelectSection: (section: string) => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectSection,
  onOpenTrack,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-teal-950 text-warm-200 border-t border-teal-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-teal-900/60">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-800 to-saffron-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                AT
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-warm-50">
                Amma<span className="text-saffron-500">Travels</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-teal-200/80 leading-relaxed max-w-sm">
              Kakinada’s premier automotive rental and turnkey event logistics company.
              Dedicated to safe journeys, transparent tariffs, and memorable Godavari celebrations.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-warm-300">
              <span className="px-2.5 py-1 rounded bg-teal-900/70 border border-teal-800">
                AP Govt Commercial Fleet Permit
              </span>
              <span className="px-2.5 py-1 rounded bg-teal-900/70 border border-teal-800">
                ISO 9001 Sanitized
              </span>
            </div>
          </div>

          {/* Vehicle Fleet Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-warm-50 uppercase tracking-wider">
              Fleet Rentals
            </h4>
            <ul className="space-y-2 text-xs text-warm-300">
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Swift & i20 Hatchbacks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Hyundai Creta & Honda City
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Innova Crysta 7-Seater
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Thar 4x4 & Fortuner SUV
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Royal Enfield Classic & Himalayan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Activa 6G Scooters
                </button>
              </li>
            </ul>
          </div>

          {/* Event Packages */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-warm-50 uppercase tracking-wider">
              Event Logistics
            </h4>
            <ul className="space-y-2 text-xs text-warm-300">
              <li>
                <button
                  onClick={() => onSelectSection('events')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Wedding Royal Convoys
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('events')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Corporate Delegations & Shuttles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('events')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Birthday & Private Celebrations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('events')}
                  className="hover:text-saffron-400 transition-colors"
                >
                  Godavari & Papikondalu Tours
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrack}
                  className="text-saffron-400 hover:text-saffron-300 font-semibold transition-colors flex items-center gap-1 mt-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track Existing Booking</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Hub Location & Admin */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-warm-50 uppercase tracking-wider">
              Kakinada Hub
            </h4>
            <div className="text-xs text-warm-300 space-y-2">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-saffron-400 flex-shrink-0 mt-0.5" />
                <span>Bhanugudi Junction, Kakinada, AP 533003</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-saffron-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-saffron-400 flex-shrink-0" />
                <span>rentals@ammatravels.in</span>
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="px-3 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-saffron-400 border border-teal-700/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Staff & Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-300/70">
          <p>© {new Date().getFullYear()} Amma Travels. All rights reserved. Registered in Andhra Pradesh, India.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectSection('hero')}
              className="hover:text-warm-100 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onSelectSection('hero')}
              className="hover:text-warm-100 transition-colors"
            >
              Rental Terms
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-saffron-400 transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
