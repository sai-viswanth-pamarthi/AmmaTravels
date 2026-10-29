'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarCheck,
  Clock,
  Car,
  FileCheck2,
  Shield,
  MapPin,
  AlertCircle,
  XCircle,
  Phone,
  ArrowRight,
  User,
  CheckCircle2,
} from 'lucide-react';
import { store } from '@/lib/store';
import { Booking, CustomerDocument, UserProfile } from '@/lib/types';
import { formatINR } from '@/lib/pricing';
import { BookingStatusBadge, DocumentStatusBadge } from '@/components/StatusBadge';
import { BookingTimeline } from '@/components/BookingTimeline';
import { DocumentUploader } from '@/components/DocumentUploader';
import { BookingWhatsAppSupportButton } from '@/components/WhatsAppButton';

export default function CustomerDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => store.getCurrentUser());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Cancellation modal state
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState<string | null>(null);

  const refreshData = () => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
    const userBookings = store.getBookings({ userId: user.id });
    setBookings(userBookings);
    setDocuments(store.getCustomerDocuments(user.id));
    if (userBookings.length > 0 && !selectedBooking) {
      setSelectedBooking(userBookings[0]);
    } else if (selectedBooking) {
      const updated = userBookings.find((b) => b.id === selectedBooking.id);
      if (updated) setSelectedBooking(updated);
    }
  };

  useEffect(() => {
    refreshData();
    const handleAuth = () => refreshData();
    window.addEventListener('amma-auth-changed', handleAuth);
    return () => window.removeEventListener('amma-auth-changed', handleAuth);
  }, []);

  const handleCancelBooking = () => {
    if (!cancelModalBooking) return;
    setCancelError(null);

    const result = store.updateBookingStatus(
      cancelModalBooking.id,
      'cancelled',
      currentUser.role,
      cancelReason || 'Customer requested cancellation'
    );

    if (!result.success) {
      setCancelError(result.error || 'Failed to cancel booking.');
      return;
    }

    setCancelModalBooking(null);
    setCancelReason('');
    refreshData();
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'under_review');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'ready_for_pickup');
  const activeRentals = bookings.filter((b) => b.status === 'active');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Bar */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-gold-500/20">
            {currentUser.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-navy-950 text-gold-400 border border-gold-500/30 uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.email} • {currentUser.phone}
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-navy-950 border border-navy-800 text-center">
            <span className="block text-xl font-black text-gold-400">{bookings.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Bookings</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-navy-950 border border-navy-800 text-center">
            <span className="block text-xl font-black text-emerald-400">{documents.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Documents</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Bookings Left, Detail / Documents Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bookings Lists (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-gold-400" />
              My Bookings ({bookings.length})
            </h2>
            <Link
              href="/#search-section"
              className="text-xs font-bold text-gold-400 hover:text-gold-300"
            >
              + Book Another Ride
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-10 text-center space-y-3">
              <Car className="w-10 h-10 mx-auto text-slate-500 opacity-40" />
              <p className="text-sm font-semibold text-white">No rental bookings yet</p>
              <p className="text-xs text-slate-400">
                Explore our fleet of cars and bikes in Kakinada and book your next journey.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs"
              >
                Browse Fleet
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-navy-850 border-gold-500/60 shadow-lg shadow-gold-500/5'
                        : 'bg-navy-900 border-navy-800 hover:border-navy-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-gold-400">
                          {b.bookingRef}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-0.5 line-clamp-1">
                          {b.vehicleName}
                        </h4>
                      </div>
                      <BookingStatusBadge status={b.status} />
                    </div>

                    <div className="mt-3 pt-2 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>{new Date(b.pickupTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      <span className="font-bold text-white">{formatINR(b.totalAmount)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Booking Detail & Timeline + Document Upload (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {selectedBooking ? (
            <div className="space-y-6">
              {/* Timeline Component */}
              <BookingTimeline
                status={selectedBooking.status}
                rejectionReason={selectedBooking.rejectionReason}
                cancellationReason={selectedBooking.cancellationReason}
              />

              {/* Booking Details Card */}
              <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
                  <div>
                    <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest font-mono">
                      {selectedBooking.bookingRef}
                    </span>
                    <h3 className="text-xl font-black text-white mt-0.5">
                      {selectedBooking.vehicleName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookingStatusBadge status={selectedBooking.status} />
                    {(selectedBooking.status === 'pending' || selectedBooking.status === 'under_review') && (
                      <button
                        onClick={() => setCancelModalBooking(selectedBooking)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>

                {/* Pickup & Dropoff Route Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 space-y-1">
                    <span className="text-slate-400 font-medium block">Pickup Schedule & Hub</span>
                    <p className="font-bold text-white">
                      {new Date(selectedBooking.pickupTime).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                    <p className="text-gold-400/90">{selectedBooking.pickupLocation}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 space-y-1">
                    <span className="text-slate-400 font-medium block">Return Schedule & Hub</span>
                    <p className="font-bold text-white">
                      {new Date(selectedBooking.returnTime).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                    <p className="text-gold-400/90">{selectedBooking.returnLocation}</p>
                  </div>
                </div>

                {/* Pricing Snapshot Breakdown */}
                <div className="space-y-2 text-xs pt-2">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                    Locked Rate Breakdown
                  </h4>
                  <div className="flex justify-between text-slate-400">
                    <span>Base Rental:</span>
                    <span className="text-white font-medium">{formatINR(selectedBooking.rentalCharge)}</span>
                  </div>
                  {selectedBooking.addonsCharge > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Add-ons (Helmets / Protection):</span>
                      <span className="text-white font-medium">{formatINR(selectedBooking.addonsCharge)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Refundable Deposit:</span>
                    <span className="text-white font-medium">{formatINR(selectedBooking.depositCharge)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Included KM Allowance:</span>
                    <span>{selectedBooking.kmLimitSnapshot} km/day (Excess ₹{selectedBooking.excessKmRateSnapshot}/km)</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-navy-800 font-bold text-sm text-white">
                    <span>Total Amount</span>
                    <span className="text-gold-400 text-lg">{formatINR(selectedBooking.totalAmount)}</span>
                  </div>
                </div>

                {/* WhatsApp Support Button */}
                <div className="pt-2">
                  <BookingWhatsAppSupportButton
                    bookingRef={selectedBooking.bookingRef}
                    vehicleName={selectedBooking.vehicleName}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Document Verification Section */}
          <div className="pt-2">
            <DocumentUploader
              userId={currentUser.id}
              onUploadSuccess={() => refreshData()}
            />
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Cancel Booking Request?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to cancel booking <strong className="text-gold-400">{cancelModalBooking.bookingRef}</strong> for {cancelModalBooking.vehicleName}?
            </p>

            {cancelError && (
              <p className="text-xs text-rose-400">{cancelError}</p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Cancellation Reason</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g. Change of travel schedule..."
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-xs bg-navy-800 text-slate-300"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
