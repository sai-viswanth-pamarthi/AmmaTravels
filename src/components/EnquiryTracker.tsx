import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Car,
  FileCheck,
  X,
  PhoneCall,
  AlertCircle,
  HelpCircle,
  MapPin,
  Sparkles
} from 'lucide-react';
import { InterestSubmission } from '@/types';
import { api } from '@/lib/api';
import { getBookingSupportWhatsAppUrl } from '@/lib/whatsapp';

interface EnquiryTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  prefillRefId?: string;
  prefillPhone?: string;
}

export const EnquiryTracker: React.FC<EnquiryTrackerProps> = ({
  isOpen,
  onClose,
  prefillRefId = '',
  prefillPhone = '',
}) => {
  const [refId, setRefId] = useState(prefillRefId);
  const [phone, setPhone] = useState(prefillPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enquiry, setEnquiry] = useState<InterestSubmission | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId.trim() || !phone.trim()) {
      setError('Please enter both your Reference ID and your 10-digit Phone Number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.trackEnquiry(refId.trim().toUpperCase(), phone.trim());
      if (data) {
        setEnquiry(data);
      } else {
        setError('No active enquiry found matching that Reference ID and Phone Number. Please check your details.');
      }
    } catch {
      setError('An error occurred while tracking. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'Submitted', label: 'Enquiry Received', desc: 'Logged in Amma Travels system' },
    { key: 'Contacted', label: 'Team Contacted', desc: 'Coordinator reviewing availability' },
    { key: 'Confirmed', label: 'Booking Confirmed', desc: 'Slot reserved & fleet assigned' },
    { key: 'Completed', label: 'Journey Completed', desc: 'Service fulfilled successfully' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ['Submitted', 'Contacted', 'Confirmed', 'Completed'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (currentStatus === 'Cancelled') {
      return stepKey === 'Submitted' ? 'completed' : 'cancelled';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-2xl overflow-hidden my-auto p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-charcoal-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
              Live Status Check
            </span>
            <h3 className="font-display text-2xl font-bold text-charcoal-900 dark:text-warm-50 mt-1">
              Track Your Enquiry
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-100 rounded-full hover:bg-warm-100 dark:hover:bg-charcoal-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleLookup} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                Reference ID
              </label>
              <input
                type="text"
                value={refId}
                onChange={(e) => setRefId(e.target.value.toUpperCase())}
                placeholder="e.g. AT-V-1001 or AT-E-2001"
                className="w-full px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 font-mono text-sm placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                Registered Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-sm placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-teal-900 hover:bg-teal-800 text-warm-50 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Clock className="w-4 h-4 animate-spin text-saffron-400" />
            ) : (
              <Search className="w-4 h-4 text-saffron-400" />
            )}
            <span>{loading ? 'Checking status...' : 'Track Booking'}</span>
          </button>
        </form>

        {/* Result Area */}
        {enquiry && (
          <div className="mt-8 pt-6 border-t border-warm-200 dark:border-charcoal-800 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-warm-50 dark:bg-charcoal-800/80 border border-warm-200 dark:border-charcoal-700">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-saffron-400">
                  {enquiry.type === 'vehicle' ? 'Vehicle Rental' : 'Event Package'}
                </span>
                <h4 className="font-display text-lg font-bold text-charcoal-900 dark:text-warm-50">
                  {enquiry.vehicleName || enquiry.packageName}
                </h4>
                <p className="text-xs text-charcoal-500 dark:text-warm-400">
                  Ref ID: <span className="font-mono font-bold text-teal-900 dark:text-saffron-400">{enquiry.refId}</span> • Registered to {enquiry.name}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    enquiry.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : enquiry.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : enquiry.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  Status: {enquiry.status}
                </span>
                <p className="text-[11px] text-charcoal-500 dark:text-warm-400 mt-1">
                  Stage: {enquiry.progressStage}
                </p>
              </div>
            </div>

            {/* 4-Step Visual Progress Timeline */}
            <div className="relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-warm-200 dark:bg-charcoal-700 -z-0" />
              <div className="grid grid-cols-4 gap-2 relative z-10">
                {steps.map((st) => {
                  const state = getStepStatus(st.key, enquiry.status);
                  return (
                    <div key={st.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : state === 'current'
                            ? 'bg-saffron-500 text-teal-950 ring-4 ring-saffron-500/20 animate-pulse'
                            : 'bg-warm-200 dark:bg-charcoal-700 text-charcoal-500 dark:text-warm-400'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </div>
                      <p className="font-semibold text-xs text-charcoal-800 dark:text-warm-200 mt-2">
                        {st.label}
                      </p>
                      <p className="text-[10px] text-charcoal-500 dark:text-warm-400 hidden sm:block">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-warm-50 dark:bg-charcoal-800/40 p-4 rounded-xl border border-warm-200 dark:border-charcoal-700">
              {enquiry.pickupDate && (
                <div>
                  <span className="text-charcoal-500 dark:text-warm-400">Pickup Date: </span>
                  <span className="font-semibold text-charcoal-900 dark:text-warm-100">{enquiry.pickupDate}</span>
                </div>
              )}
              {enquiry.returnDate && (
                <div>
                  <span className="text-charcoal-500 dark:text-warm-400">Return Date: </span>
                  <span className="font-semibold text-charcoal-900 dark:text-warm-100">{enquiry.returnDate}</span>
                </div>
              )}
              {enquiry.eventDate && (
                <div>
                  <span className="text-charcoal-500 dark:text-warm-400">Event Date: </span>
                  <span className="font-semibold text-charcoal-900 dark:text-warm-100">{enquiry.eventDate}</span>
                </div>
              )}
              {enquiry.guestCount && (
                <div>
                  <span className="text-charcoal-500 dark:text-warm-400">Guests: </span>
                  <span className="font-semibold text-charcoal-900 dark:text-warm-100">{enquiry.guestCount}</span>
                </div>
              )}
              {enquiry.pickupLocation && (
                <div>
                  <span className="text-charcoal-500 dark:text-warm-400">Location: </span>
                  <span className="font-semibold text-charcoal-900 dark:text-warm-100">{enquiry.pickupLocation}</span>
                </div>
              )}
              {enquiry.followUpDate && (
                <div>
                  <span className="text-charcoal-500 dark:text-warm-400">Next Follow-up: </span>
                  <span className="font-semibold text-charcoal-900 dark:text-warm-100">{enquiry.followUpDate}</span>
                </div>
              )}
            </div>

            {/* Help / WhatsApp Support */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs text-charcoal-500 dark:text-warm-400">
                Need immediate help with this booking?
              </span>
              <a
                href={getBookingSupportWhatsAppUrl(enquiry.refId, enquiry.vehicleName || enquiry.packageName)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat with Coordinator</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
