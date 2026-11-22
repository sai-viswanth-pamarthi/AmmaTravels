import React from 'react';
import {
  Car,
  Calendar,
  Search,
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowUp,
  Construction,
  Code2,
  Sparkles
} from 'lucide-react';
import { useBusinessSettings } from '@/lib/settings';
import { getGeneralSupportWhatsAppUrl } from '@/lib/whatsapp';

interface FooterProps {
  onSelectSection: (section: string) => void;
  onOpenTrack: () => void;
  onOpenAdmin?: () => void;
  onSecretAdminTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectSection,
  onOpenTrack,
  onOpenAdmin,
  onSecretAdminTrigger,
}) => {
  const [settings] = useBusinessSettings();
  const secretClickRef = React.useRef<{ count: number; timer: NodeJS.Timeout | null }>({ count: 0, timer: null });

  const handleSecretClick = () => {
    secretClickRef.current.count += 1;
    if (secretClickRef.current.count >= 4) {
      if (secretClickRef.current.timer) clearTimeout(secretClickRef.current.timer);
      secretClickRef.current.count = 0;
      if (onSecretAdminTrigger) {
        onSecretAdminTrigger();
      } else if (onOpenAdmin) {
        onOpenAdmin();
      }
      return;
    }

    if (secretClickRef.current.timer) clearTimeout(secretClickRef.current.timer);
    secretClickRef.current.timer = setTimeout(() => {
      secretClickRef.current.count = 0;
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="AmmaTravelskkd Logo"
                className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-md flex-shrink-0"
              />
              <span className="font-display font-black text-2xl tracking-tight text-white">
                Amma<span className="text-blue-500">Travels</span><span className="text-blue-500 font-extrabold lowercase text-lg">kkd</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Kakinada’s premier self-drive automotive and bike rental service.
              Dedicated to safe journeys, transparent tariffs, verified fleet, and pure Godavari hospitality.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                AP Commercial Fleet Permit
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                100% Sanitized
              </span>
            </div>
          </div>

          {/* Vehicle Fleet Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">
              Fleet Rentals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:text-blue-400"
                >
                  2023 BMW M3 Touring (High Performance)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:text-blue-400"
                >
                  Audi A6 C8 Limousine (Executive Sedan)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:text-blue-400"
                >
                  Royal Enfield Himalayan 450
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:text-blue-400"
                >
                  Royal Enfield Classic 350
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:text-blue-400"
                >
                  Honda Activa 6G
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('vehicles')}
                  className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:text-blue-400"
                >
                  Yamaha Aerox 155
                </button>
              </li>
            </ul>
          </div>

          {/* Rental Assurances */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">
              Rental Assurances
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Verified Multi-Point Inspection</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Zero Hidden Deposit Traps</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>100% Sanitized Fleet</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>24/7 Roadside Assistance</span>
              </li>
              <li>
                <button
                  onClick={onOpenTrack}
                  className="text-blue-400 hover:text-blue-300 font-bold transition-colors flex items-center gap-1 mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track Your Interest</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Hub Location & Admin */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">
              Kakinada Hub
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{settings.primaryAddress}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{settings.phone}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{settings.secondaryEmail || settings.email}</span>
              </p>
              <div className="pt-1">
                <a
                  href={getGeneralSupportWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 text-xs font-semibold transition-all"
                >
                  <span>💬 WhatsApp Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* --- Under Construction & Beta Preview Notice --- */}
        <div className="my-10 p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/30 shadow-inner">
              <Construction className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Website Still Under Active Construction
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                The Amma Travels self-drive web portal is currently undergoing active construction and development.
                Online reservation flows, fleet telemetry, and tariffs are operating in interactive preview mode.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 tracking-wider uppercase">
              Beta Development Preview
            </span>
          </div>
        </div>

        {/* --- Built by Pivot Tech Developer & Contact Panel --- */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-black text-base sm:text-lg text-white tracking-tight">
                    Built by Pivot Tech
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Official Dev
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Custom Web Engineering, 3D Interactive Studios & Enterprise Cloud Solutions
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs w-full lg:w-auto">
            {/* Phone 1 */}
            <a
              href="tel:8885757966"
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 flex-1 xs:flex-initial justify-center"
              title="Call Pivot Tech Contact 1"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="font-semibold whitespace-nowrap">+91 88857 57966</span>
            </a>

            {/* Phone 2 */}
            <a
              href="tel:9346105182"
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 flex-1 xs:flex-initial justify-center"
              title="Call Pivot Tech Contact 2"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="font-semibold whitespace-nowrap">+91 93461 05182</span>
            </a>

            {/* Email */}
            <a
              href="mailto:saiviswanth55@gmail.com"
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 border border-blue-500/40 transition-all flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-full xs:w-auto justify-center max-w-full"
              title="Email Pivot Tech"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="font-semibold truncate">saiviswanth55@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-800/80">
          <p
            onClick={handleSecretClick}
            className="cursor-default select-none"
          >
            © {new Date().getFullYear()} Amma Travels. All rights reserved. Platform engineered by <span className="text-white font-bold">Pivot Tech</span>.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectSection('hero')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-blue-400 min-h-[44px] flex items-center"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onSelectSection('hero')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-blue-400 min-h-[44px] flex items-center"
            >
              Rental Terms
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
