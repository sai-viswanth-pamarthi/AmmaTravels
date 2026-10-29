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
    <aside aria-label="WhatsApp Support Assistance" className="fixed bottom-6 right-6 z-50">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Amma Travels on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-emerald-400/30"
      >
        <MessageCircle className="w-5 h-5 fill-white/20" />
        <span className="hidden sm:inline font-semibold">Chat with Us</span>
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
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
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
  vehicleName: string;
  className?: string;
}) {
  const url = getBookingSupportWhatsAppUrl(bookingRef, vehicleName);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-500 ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-white/20" />
      <span>Quick WhatsApp Support</span>
    </a>
  );
}
