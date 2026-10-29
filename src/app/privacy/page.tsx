import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
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
          <Lock className="w-4 h-4" />
          <span>Data Protection & Privacy</span>
        </div>
        <h1 className="text-3xl font-black text-white">Privacy Policy & Document Retention</h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026 • Amma Travels, Kakinada, Andhra Pradesh
        </p>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Purpose of Data Collection
          </h2>
          <p>
            Amma Travels collects customer contact information (name, mobile number, email) and identity verification documents (Driving License, Aadhaar proof) solely for the legitimate business purpose of executing vehicle rental contracts, verifying legal authorization to drive under the Indian Motor Vehicles Act, and ensuring fleet safety.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Secure Storage & Access Controls
          </h2>
          <p>
            All uploaded identification documents are stored in restricted private cloud vaults protected by encrypted channels and Row Level Security (RLS) policies. Document files are never made publicly accessible or indexed by search engines. Only authorized operations personnel have access to review documents during the verification window.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Document Retention Policy
          </h2>
          <p>
            Rental agreements, trip logs, and verification metadata are retained only as required by statutory commercial record-keeping and transport law obligations. Customers may request secure purge of inactive profile documents following trip completion and deposit settlement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Third-Party Sharing Restrictions
          </h2>
          <p>
            Amma Travels does not sell, lease, or monetize customer identity data or phone numbers. Personal data is disclosed only to law enforcement authorities if compelled by official statutory legal process or insurance underwriters in the event of an accident investigation.
          </p>
        </section>
      </div>
    </div>
  );
}
