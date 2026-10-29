import React from 'react';
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
import { DEFAULT_WHATSAPP_NUMBER, getWhatsAppUrl } from '@/lib/whatsapp';

export const Contact: React.FC = () => {
  const whatsappUrl = getWhatsAppUrl('Hello Amma Travels, I would like to enquire about your services in Kakinada.');

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/40 px-3.5 py-1.5 rounded-full border border-saffron-200 dark:border-saffron-800">
              Visit or Call Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 dark:text-warm-50 mt-3">
              We're Located in Central Kakinada
            </h2>
            <p className="mt-3 text-sm text-charcoal-600 dark:text-warm-300">
              Drop by our hub for vehicle keys, document verification, or a hot cup of coffee while we plan your wedding fleet.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-warm-200 dark:border-charcoal-800">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-900 dark:text-saffron-400 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-charcoal-900 dark:text-warm-100">
                  Main Operating Hub
                </h4>
                <p className="text-xs text-charcoal-600 dark:text-warm-300 mt-0.5">
                  Door No. 12-4-15, Near Bhanugudi Junction, Main Road, Kakinada, Andhra Pradesh 533003
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-warm-200 dark:border-charcoal-800">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-900 dark:text-saffron-400 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-charcoal-900 dark:text-warm-100">
                  Phone & Reservations
                </h4>
                <p className="text-xs text-charcoal-600 dark:text-warm-300 mt-0.5">
                  +91 98765 43210 / +91 884 2345678
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  24/7 Roadside Breakdown Hotline Active
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-warm-200 dark:border-charcoal-800">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-900 dark:text-saffron-400 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-charcoal-900 dark:text-warm-100">
                  Hub Timings
                </h4>
                <p className="text-xs text-charcoal-600 dark:text-warm-300 mt-0.5">
                  Monday – Sunday: 6:00 AM – 10:30 PM
                </p>
                <p className="text-[11px] text-charcoal-500 dark:text-warm-400">
                  Late night & early train drops coordinated via WhatsApp
                </p>
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Direct WhatsApp Helpline</span>
          </a>
        </div>

        {/* Right: Map & Fast Inquiry Card (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 overflow-hidden shadow-sm flex flex-col">
          {/* Simulated Map / Route Header */}
          <div className="relative h-64 bg-teal-950 flex flex-col items-center justify-center text-center p-6 text-warm-100">
            <div className="w-12 h-12 rounded-full bg-saffron-500/20 border border-saffron-500/60 flex items-center justify-center text-saffron-400 mb-2">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="font-display text-xl font-bold text-warm-50">
              Kakinada City Hub Map
            </h3>
            <p className="text-xs text-warm-300 mt-1 max-w-sm">
              Conveniently situated 2.1 km from Kakinada Town Railway Station and 3.5 km from Kakinada Beach Road.
            </p>
            <a
              href="https://maps.google.com/?q=Kakinada+Bhanugudi+Junction"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 px-3 py-1.5 rounded-lg bg-teal-900/80 hover:bg-teal-800 text-saffron-400 text-xs font-semibold flex items-center gap-1 border border-teal-700 transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Service Guarantee Banner */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700">
                <span className="font-bold text-charcoal-900 dark:text-warm-100 block mb-1">
                  🚗 Fast 5-Min Handover
                </span>
                <span className="text-charcoal-600 dark:text-warm-300">
                  Digital KYC scan and instant odometer snapshot. You drive away without waiting.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700">
                <span className="font-bold text-charcoal-900 dark:text-warm-100 block mb-1">
                  🛡️ Zero Hidden Deductions
                </span>
                <span className="text-charcoal-600 dark:text-warm-300">
                  Security deposits returned immediately via UPI / bank transfer on check-in.
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-warm-200 dark:border-charcoal-800 text-center">
              <p className="text-xs text-charcoal-500 dark:text-warm-400">
                Have questions about corporate invoicing or outstation GST billing? Reach our accounts team at{' '}
                <a href="mailto:billing@ammatravels.in" className="text-teal-700 dark:text-saffron-400 font-semibold underline">
                  billing@ammatravels.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
