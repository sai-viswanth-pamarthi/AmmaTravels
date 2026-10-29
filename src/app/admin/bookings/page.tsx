'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  KeyRound,
  Car,
  AlertCircle,
  FileCheck2,
  Search,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { store } from '@/lib/store';
import { Booking, BookingStatus } from '@/lib/types';
import { formatINR } from '@/lib/pricing';
import { BookingStatusBadge } from '@/components/StatusBadge';
import { BookingTimeline } from '@/components/BookingTimeline';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Transition Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const refreshBookings = () => {
    const list = store.getBookings();
    setBookings(list);
    if (selectedBooking) {
      const updated = list.find((b) => b.id === selectedBooking.id);
      if (updated) setSelectedBooking(updated);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  const handleTransition = (targetStatus: BookingStatus, notes?: string) => {
    if (!selectedBooking) return;
    setActionError(null);

    const result = store.updateBookingStatus(
      selectedBooking.id,
      targetStatus,
      'admin',
      notes
    );

    if (!result.success) {
      setActionError(result.error || 'Failed to update booking status.');
      return;
    }

    setRejectModalOpen(false);
    setRejectionReason('');
    refreshBookings();
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        b.bookingRef.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.vehicleName.toLowerCase().includes(q) ||
        b.userPhone.includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
          Reservations & Dispatch
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Booking Management & Approvals
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review pending customer requests, verify availability, confirm bookings, and manage dispatch life-cycle.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'ready_for_pickup', label: 'Ready for Pickup' },
            { key: 'active', label: 'Active On-Road' },
            { key: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.key
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : 'bg-navy-950 text-slate-300 hover:bg-navy-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search ref, customer, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Grid: Bookings Table Left, Inspection Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Reservations List ({filteredBookings.length})
          </h3>

          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No bookings match current filter.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredBookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-navy-850 border-gold-500 shadow-lg'
                        : 'bg-navy-950/70 border-navy-800 hover:border-navy-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-gold-400">
                          {b.bookingRef}
                        </span>
                        <h4 className="font-bold text-sm text-white">{b.vehicleName}</h4>
                        <p className="text-xs text-slate-300">
                          {b.userName} • {b.userPhone}
                        </p>
                      </div>
                      <BookingStatusBadge status={b.status} />
                    </div>

                    <div className="mt-3 pt-2 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Pickup: {new Date(b.pickupTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      <span className="font-bold text-white">{formatINR(b.totalAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Booking Admin Review Drawer (5 cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
          {selectedBooking ? (
            <div className="space-y-6">
              <div className="pb-4 border-b border-navy-800">
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest font-mono">
                  {selectedBooking.bookingRef}
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {selectedBooking.vehicleName}
                </h3>
                <div className="mt-2">
                  <BookingStatusBadge status={selectedBooking.status} />
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Renter Information
                </h4>
                <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 space-y-1.5">
                  <p className="font-bold text-white text-sm">{selectedBooking.userName}</p>
                  <p className="text-slate-300">Phone: {selectedBooking.userPhone}</p>
                  <p className="text-slate-400">Email: {selectedBooking.userEmail}</p>
                  {selectedBooking.customerNotes && (
                    <p className="text-amber-300/90 italic pt-1 border-t border-navy-800">
                      Notes: {selectedBooking.customerNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Trip Schedule */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Schedule & Location
                </h4>
                <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pickup:</span>
                    <span className="font-semibold text-white">
                      {new Date(selectedBooking.pickupTime).toLocaleString('en-IN')}
                    </span>
                    <p className="text-gold-400 text-[11px]">{selectedBooking.pickupLocation}</p>
                  </div>
                  <div className="pt-2 border-t border-navy-800">
                    <span className="text-slate-400 block text-[11px]">Return:</span>
                    <span className="font-semibold text-white">
                      {new Date(selectedBooking.returnTime).toLocaleString('en-IN')}
                    </span>
                    <p className="text-gold-400 text-[11px]">{selectedBooking.returnLocation}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Rental Charge:</span>
                  <span className="text-white">{formatINR(selectedBooking.rentalCharge)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Refundable Deposit:</span>
                  <span className="text-white">{formatINR(selectedBooking.depositCharge)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-navy-800">
                  <span>Total Payable:</span>
                  <span className="text-gold-400">{formatINR(selectedBooking.totalAmount)}</span>
                </div>
              </div>

              {/* Operational Action Transitions */}
              <div className="space-y-2.5 pt-4 border-t border-navy-800">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-xs">
                  Operational Status Actions
                </h4>

                {/* If Pending or Under Review -> Approve or Reject */}
                {(selectedBooking.status === 'pending' || selectedBooking.status === 'under_review') && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTransition('confirmed', 'Approved by operations manager')}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Request</span>
                    </button>
                    <button
                      onClick={() => setRejectModalOpen(true)}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900 flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {/* If Confirmed -> Mark Ready for Pickup */}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => handleTransition('ready_for_pickup', 'Vehicle cleaned and waiting at Hub')}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Mark Ready for Pickup at Depot</span>
                  </button>
                )}

                {/* If Ready for Pickup -> Vehicle Handover (Start Active) */}
                {selectedBooking.status === 'ready_for_pickup' && (
                  <button
                    onClick={() => handleTransition('active', 'Vehicle handed over to customer post physical DL check')}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Car className="w-4 h-4" />
                    <span>Handover Keys & Start Active Rental</span>
                  </button>
                )}

                {/* If Active -> Complete Rental */}
                {selectedBooking.status === 'active' && (
                  <button
                    onClick={() => handleTransition('completed', 'Vehicle returned in safe condition; security deposit processed')}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Rental & Refund Deposit</span>
                  </button>
                )}

                {/* Quick WhatsApp message to customer */}
                <a
                  href={getWhatsAppUrl(
                    `Hello ${selectedBooking.userName}, regarding your Amma Travels booking ${selectedBooking.bookingRef} for ${selectedBooking.vehicleName}...`,
                    selectedBooking.userPhone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message Customer on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select a booking from the list to review details and approve.
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white text-rose-400">Reject Booking Request</h3>
            <p className="text-xs text-slate-300">
              Provide a clear reason for rejecting booking <strong className="text-white">{selectedBooking.bookingRef}</strong>. The customer will see this message.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold">Reason for Rejection</label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g. Vehicle scheduled for unscheduled maintenance or invalid license document..."
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="flex gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-semibold bg-navy-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleTransition('rejected', rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white disabled:bg-slate-800"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
