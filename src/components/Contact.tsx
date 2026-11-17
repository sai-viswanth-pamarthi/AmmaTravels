import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useBusinessSettings } from '@/lib/settings';

export const Contact: React.FC = () => {
  const [settings] = useBusinessSettings();
  const whatsappUrl = getWhatsAppUrl('Hello Amma Travels, I would like to enquire about your services in Kakinada.');

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
                KM 65.0 // Basecamp Hub
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900">
                Visit or Call Us
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
              We're Located in Central <span className="text-blue-600 dark:text-blue-400 hand-drawn-underline">Kakinada</span>
            </h2>

            <div className="mt-2 font-hand text-xl text-blue-500 font-bold -rotate-1">
              <span>Drop by for keys & quick test drive ⤵</span>
            </div>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Drop by our hub for vehicle keys, document verification, or quick test rides on our cars and bikes.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 soft-card-shadow card-interactive">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-blue-950/60 border border-orange-200 dark:border-blue-900 flex items-center justify-center text-orange-600 dark:text-blue-400 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  Main Operating Hub
                </h4>
                <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
                  {settings.primaryAddress}
                </p>
                {settings.landmark && (
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
                    Landmark: {settings.landmark}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 soft-card-shadow card-interactive">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-blue-950/60 border border-orange-200 dark:border-blue-900 flex items-center justify-center text-orange-600 dark:text-blue-400 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  Phone & Reservations
                </h4>
                <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
                  {settings.phone}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  24/7 Roadside Breakdown Hotline Active
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 soft-card-shadow card-interactive">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-blue-950/60 border border-orange-200 dark:border-blue-900 flex items-center justify-center text-orange-600 dark:text-blue-400 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  Hub Timings
                </h4>
                <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
                  {settings.operatingHours}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-slate-400">
                  Late night & early train drops coordinated via WhatsApp
                </p>
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors btn-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Direct WhatsApp Helpline</span>
          </a>
        </div>

        {/* Right: Map & Fast Inquiry Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF7] dark:bg-slate-900 rounded-3xl border border-[#E8DFCF] dark:border-slate-800 overflow-hidden soft-card-shadow flex flex-col">
          {/* Simulated Map / Route Header */}
          <div className="relative h-64 bg-slate-950 flex flex-col items-center justify-center text-center p-6 text-white border-b border-slate-800">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/60 flex items-center justify-center text-blue-400 mb-2">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              Kakinada City Hub Map
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Conveniently situated 2.1 km from Kakinada Town Railway Station and 3.5 km from Kakinada Beach Road.
            </p>
            <a
              href="https://maps.google.com/?q=Kakinada+Bhanugudi+Junction"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all btn-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Service Guarantee Banner */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  🚗 Fast 5-Min Handover
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  Digital KYC scan and instant odometer snapshot. You drive away without waiting.
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  🛡️ Zero Hidden Deductions
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  Security deposits returned immediately via UPI / bank transfer on check-in.
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Have questions about corporate invoicing or outstation GST billing? Reach our accounts team at{' '}
                <a href="mailto:billing@ammatravels.in" className="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-500">
                  billing@ammatravels.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
