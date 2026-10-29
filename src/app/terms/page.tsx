import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Rental Agreement</span>
        </div>
        <h1 className="text-3xl font-black text-white">Terms & Conditions of Rental</h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026 • Amma Travels, Kakinada, Andhra Pradesh
        </p>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Eligibility & Document Verification
          </h2>
          <p>
            Renters must be at least 20 years old for two-wheelers (scooters/motorcycles) and 21 years old for four-wheelers (cars/SUVs). Renter must hold a valid, non-expired Indian Driving License (or International Driving Permit for foreign nationals) permitting the operation of the rented class of vehicle. Original physical driving license and government photo ID (Aadhaar or Passport) must be produced for inspection before vehicle key handover in Kakinada.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Fuel Policy (Customer Fills)
          </h2>
          <p>
            Vehicles are delivered with a baseline fuel reserve sufficient to reach the nearest fuel station. Renter is responsible for purchasing and refueling throughout the trip duration. Amma Travels does not provide refunds, credits, or adjustments for residual fuel left in the tank upon vehicle return.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Kilometre Limitations & Excess Charges
          </h2>
          <p>
            Standard rentals include 150–200 km per calendar day for two-wheelers and 250–300 km per calendar day for four-wheelers. Any excess distance logged beyond the bundled allowance is billed at the configured rate (₹4.00–₹6.00/km for two-wheelers, ₹10.00–₹13.00/km for cars) at the time of final odometer inspection upon return.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Security Deposit & Refund Processing
          </h2>
          <p>
            A refundable security deposit is collected prior to vehicle dispatch. Upon vehicle check-in, our staff will inspect for damages, traffic violations, and fuel status. The security deposit is refunded via UPI or NEFT/IMPS within 24 hours of safe vehicle return.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            5. Cancellation & Modification Policy
          </h2>
          <p>
            Cancellations initiated more than 24 hours prior to the scheduled pickup time are eligible for a 100% full refund. Cancellations made between 6 to 24 hours of pickup incur a 50% rental fee deduction. Cancellations requested under 6 hours or customer no-shows are non-refundable.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            6. Safe Operation & Prohibited Uses
          </h2>
          <p>
            Vehicles must not be operated under the influence of alcohol or narcotics, used for commercial passenger ferrying, racing, off-roading outside paved roadways, or sub-leased to third parties. All traffic laws under the Motor Vehicles Act must be strictly observed.
          </p>
        </section>
      </div>
    </div>
  );
}
