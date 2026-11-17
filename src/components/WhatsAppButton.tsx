import React from 'react';
import { MessageCircle } from 'lucide-react';
import {
  getGeneralSupportWhatsAppUrl,
  getVehicleEnquiryWhatsAppUrl,
  getBookingSupportWhatsAppUrl,
} from '@/lib/whatsapp';

export function FloatingWhatsAppButton() {
  const url = getGeneralSupportWhatsAppUrl();

  return (
    <aside aria-label="WhatsApp Support Assistance" className="fixed bottom-22 right-6 sm:bottom-24 sm:right-7 z-50 print:hidden">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Amma Travels on WhatsApp"
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-full shadow-2xl shadow-emerald-950/30 transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-400/40"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-white/20 transition-transform group-hover:rotate-12" />
        <span className="tracking-wide">Chat on WhatsApp</span>
      </a>
    </aside>
  );
}

export function VehicleWhatsAppEnquiryButton({
  vehicleName,
  pickupDate,
  returnDate,
  className = '',
}: {
  vehicleName: string;
  pickupDate?: string;
  returnDate?: string;
  className?: string;
}) {
  const url = getVehicleEnquiryWhatsAppUrl(vehicleName, pickupDate, returnDate);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-white/20" />
      <span>Enquire via WhatsApp</span>
    </a>
  );
}

export function BookingWhatsAppSupportButton({
  bookingRef,
  vehicleName,
  className = '',
}: {
  bookingRef: string;
  vehicleName?: string;
  className?: string;
}) {
  const url = getBookingSupportWhatsAppUrl(bookingRef, vehicleName);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 active:scale-95 ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-white/20" />
      <span>Quick WhatsApp Support</span>
    </a>
  );
}
