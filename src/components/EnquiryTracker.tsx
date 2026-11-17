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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFFDF7] dark:bg-black rounded-3xl border border-[#E8DFCF] dark:border-zinc-800 shadow-2xl overflow-y-auto max-h-[90dvh] my-auto p-5 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Live Status Check
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-black dark:text-white mt-1">
              Track Your Interest Enquiry
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleLookup} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Reference ID
              </label>
              <input
                type="text"
                value={refId}
                onChange={(e) => setRefId(e.target.value.toUpperCase())}
                placeholder="e.g. AT-V-1001"
                className="w-full px-4 py-2.5 min-h-[44px] rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white font-mono text-base sm:text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Registered Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-2.5 min-h-[44px] rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white text-base sm:text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-interactive w-full py-3.5 px-4 min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-blue-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {loading ? (
              <Clock className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Search className="w-4 h-4 text-white" />
            )}
            <span>{loading ? 'Checking status...' : 'Track My Interest'}</span>
          </button>
        </form>

        {/* Result Area */}
        {enquiry && (
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Vehicle Rental Interest
                </span>
                <h4 className="font-display text-lg font-bold text-black dark:text-white">
                  {enquiry.vehicleName || 'Vehicle Enquiry'}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Ref ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{enquiry.refId}</span> • Registered to {enquiry.name}
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
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  Status: {enquiry.status}
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Stage: {enquiry.progressStage}
                </p>
              </div>
            </div>

            {/* 4-Step Visual Progress Timeline */}
            <div className="relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
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
                            ? 'bg-blue-600 text-white ring-4 ring-blue-600/20 animate-pulse'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </div>
                      <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 mt-2">
                        {st.label}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              {enquiry.pickupDate && (
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Pickup Date: </span>
                  <span className="font-semibold text-black dark:text-white">{enquiry.pickupDate}</span>
                </div>
              )}
              {enquiry.returnDate && (
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Return Date: </span>
                  <span className="font-semibold text-black dark:text-white">{enquiry.returnDate}</span>
                </div>
              )}
              {enquiry.pickupLocation && (
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Location: </span>
                  <span className="font-semibold text-black dark:text-white">{enquiry.pickupLocation}</span>
                </div>
              )}
              {enquiry.followUpDate && (
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Next Follow-up: </span>
                  <span className="font-semibold text-black dark:text-white">{enquiry.followUpDate}</span>
                </div>
              )}
            </div>

            {/* Help / WhatsApp Support */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Need immediate help with this interest?
              </span>
              <a
                href={getBookingSupportWhatsAppUrl(enquiry.refId, enquiry.vehicleName || 'Vehicle')}
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
