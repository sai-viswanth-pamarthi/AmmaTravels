'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  CalendarCheck2,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Shield,
  KeyRound,
} from 'lucide-react';
import { store } from '@/lib/store';
import { Vehicle, Booking, CustomerDocument } from '@/lib/types';
import { formatINR } from '@/lib/pricing';
import { BookingStatusBadge } from '@/components/StatusBadge';

export default function AdminOverviewPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);

  useEffect(() => {
    setVehicles(store.getVehicles({ includeUnpublished: true }));
    setBookings(store.getBookings());
    setDocuments(store.getAllDocuments());
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'under_review');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'ready_for_pickup');
  const activeRentals = bookings.filter((b) => b.status === 'active');
  const pendingDocs = documents.filter((d) => d.status === 'pending');

  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled' && b.status !== 'rejected')
    .reduce((sum, b) => sum + b.rentalCharge + b.addonsCharge, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Operations & Fleet Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Amma Travels Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time management for Kakinada car and bike operations.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/vehicles"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors"
          >
            + Add / Edit Vehicle
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Fleet</span>
            <Car className="w-4 h-4 text-gold-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{vehicles.length}</span>
            <span className="text-xs text-slate-400">
              ({vehicles.filter((v) => v.isPublished).length} published)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-amber-500/30 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Requests</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{pendingBookings.length}</span>
            <span className="text-xs text-slate-400">require review</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Rentals</span>
            <KeyRound className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400">{activeRentals.length}</span>
            <span className="text-xs text-slate-400">on road</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Docs</span>
            <FileCheck2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-400">{pendingDocs.length}</span>
            <span className="text-xs text-slate-400">for ID review</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Booking Action & Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Bookings (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-gold-400" />
              Recent Booking Activity
            </h3>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-navy-800">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-gold-400">
                      {b.bookingRef}
                    </span>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <p className="text-sm font-bold text-white mt-0.5">{b.vehicleName}</p>
                  <p className="text-[11px] text-slate-400">
                    Customer: {b.userName} ({b.userPhone}) • Total: {formatINR(b.totalAmount)}
                  </p>
                </div>

                <Link
                  href="/admin/bookings"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 self-start sm:self-auto"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet & Document Action Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-gold-400" />
                Customer Verification Desk
              </h3>
              <Link
                href="/admin/documents"
                className="text-xs font-bold text-gold-400 hover:text-gold-300"
              >
                View ({pendingDocs.length})
              </Link>
            </div>

            {pendingDocs.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">
                No customer documents awaiting review. All uploaded licenses are verified.
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingDocs.slice(0, 3).map((d) => (
                  <div key={d.id} className="p-3 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white capitalize">
                        {d.documentType.replace('_', ' ')}
                      </p>
                      <p className="text-[10px] text-slate-400">{d.fileName}</p>
                    </div>
                    <Link
                      href="/admin/documents"
                      className="px-2.5 py-1 rounded bg-gold-500 text-navy-950 font-bold text-[11px]"
                    >
                      Verify
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Kakinada Operations Hub
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Main Depot: Bhanugudi Junction & Main Road, Kakinada, AP. Remember to inspect physical original DL and Aadhaar card at handover before releasing vehicle keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
