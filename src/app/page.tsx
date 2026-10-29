'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Car,
  Bike,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
  HelpCircle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { SearchWidget } from '@/components/SearchWidget';
import { VehicleCard } from '@/components/VehicleCard';
import { store } from '@/lib/store';
import { Vehicle } from '@/lib/types';
import { getGeneralSupportWhatsAppUrl } from '@/lib/whatsapp';

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    setVehicles(store.getVehicles());
  }, []);

  const featuredBikes = vehicles.filter((v) => v.category === 'bike').slice(0, 3);
  const featuredCars = vehicles.filter((v) => v.category === 'car').slice(0, 3);
  const whatsappUrl = getGeneralSupportWhatsAppUrl();

  const faqs = [
    {
      q: 'What documents are required to rent a vehicle in Kakinada?',
      a: 'A valid original Driving License and an original Government Photo ID (Aadhaar Card or Passport) are mandatory. Digital photos or DigiLocker can be verified during online request, but original physical documents must be presented at vehicle handover.',
    },
    {
      q: 'How does the fuel policy work?',
      a: 'We operate on a "Customer Fills" policy. Every vehicle is handed over with sufficient fuel to reach the nearest petrol bunk. Customers purchase fuel as required. There is no refund or credit for remaining fuel upon return.',
    },
    {
      q: 'What is the security deposit and when is it refunded?',
      a: 'A refundable deposit (₹1,000 for two-wheelers, ₹3,000–₹5,000 for cars) is held during the rental period. It is refunded to your UPI or bank account within 24 hours of safe vehicle return after standard condition inspection.',
    },
    {
      q: 'Is there a kilometre limit on rentals?',
      a: 'Yes, standard bookings include 150–200 km per day for two-wheelers and 250–300 km per day for cars. Additional kilometres are charged at straightforward rates (₹4–6/km for bikes, ₹10–13/km for cars).',
    },
    {
      q: 'What is the cancellation policy?',
      a: 'Cancellations made more than 24 hours before pickup are 100% free with full refund. Cancellations between 6 to 24 hours incur a 50% rental deduction. Cancellations within 6 hours of pickup are non-refundable.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 pb-20 overflow-hidden">
        {/* Automotive Background with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80"
            alt="Amma Travels Fleet Background"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/85 to-navy-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900/80 border border-gold-500/30 backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              Premier Car & Bike Rentals in Kakinada
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
            Your Ride. <span className="gold-gradient-text">Your Journey.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover cars and bikes for your next journey with Amma Travels. Transparent rates, verified fleet, and seamless booking right here in Kakinada, Andhra Pradesh.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#search-section"
              className="px-8 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 hover:from-gold-300 hover:to-gold-400 shadow-xl shadow-gold-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Explore Vehicles
            </a>
            <a
              href="#search-section"
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-navy-900/90 text-slate-200 hover:text-white border border-navy-700 hover:border-gold-500/40 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
            >
              Book Your Ride
            </a>
          </div>
        </div>

        {/* 2. SEARCH PANEL WIDGET */}
        <div id="search-section" className="relative z-10 w-full mt-14 scroll-mt-28">
          <SearchWidget />
        </div>
      </section>

      {/* 3. FEATURED BIKES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Bike className="w-4 h-4" />
              <span>Two-Wheelers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Bikes & Scooters for Rent
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              From nimble Activa scooters for city errands to Royal Enfield cruisers for highway escapades.
            </p>
          </div>
          <Link
            href="/bikes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 group"
          >
            <span>View All Bikes ({vehicles.filter((v) => v.category === 'bike').length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBikes.map((bike) => (
            <VehicleCard key={bike.id} vehicle={bike} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED CARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Car className="w-4 h-4" />
              <span>Four-Wheelers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Cars for Rent in Kakinada
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Self-drive hatchbacks, automatic cruisers, SUVs, and 7-seaters for family holidays.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 group"
          >
            <span>View All Cars ({vehicles.filter((v) => v.category === 'car').length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <VehicleCard key={car.id} vehicle={car} />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="bg-navy-900/90 border border-navy-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How the Booking Process Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Quick, hassle-free rental flow inspired by industry leaders with local Kakinada hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Select Your Ride',
                desc: 'Browse our verified fleet of scooters, cruiser bikes, hatchbacks, and SUVs in Kakinada.',
              },
              {
                step: '02',
                title: 'Choose Dates & Hub',
                desc: 'Select pickup & dropoff date-times. Real-time availability checks eliminate double-booking.',
              },
              {
                step: '03',
                title: 'Review Terms & ID',
                desc: 'Upload your Driving License and Aadhaar ID securely. Snapshot rates guarantee no price surprises.',
              },
              {
                step: '04',
                title: 'Collect & Enjoy',
                desc: 'Pick up your sanitized vehicle with helmet/keys at our Kakinada Hub or choose delivery.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-navy-950/80 border border-navy-800/90 relative group hover:border-gold-500/40 transition-colors"
              >
                <span className="text-3xl font-black text-gold-500/30 group-hover:text-gold-400 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white mt-2 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE AMMA TRAVELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Local Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why Choose Amma Travels?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Transparent & Fair Pricing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No hidden fees, surprise surge charges, or confusing fuel markups. Everything from daily rate to deposit is itemized upfront before you commit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Maintained & Clean Fleet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Regularly serviced, sanitized, and inspected vehicles. From brakes and tyres to clean interiors and complimentary sanitized helmets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">24/7 Roadside Assistance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Travel with complete peace of mind across Kakinada, Rajahmundry, Yanam, and throughout East Godavari with direct on-call roadside support.
            </p>
          </div>
        </div>
      </section>

      {/* 7. WHATSAPP ENQUIRY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/70 via-navy-900 to-navy-950 border border-emerald-500/30 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Instant WhatsApp Support
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need a Custom Rental or Group Booking?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Connect with Amma Travels on WhatsApp for wedding bookings, weekend outstation packages, or instant questions about our fleet.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Message on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 8. FAQS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold-400 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. HUB LOCATION INFO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-navy-900 border border-navy-800 p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              Convenient Pickup Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Located in the Heart of Kakinada
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our central hub is strategically positioned near Bhanugudi Junction & Main Road, ensuring effortless connectivity to Kakinada Town Railway Station, port area, and major national highways.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Bhanugudi Junction / Main Road, Kakinada, AP 533003</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Operating Hours: 06:00 AM – 10:30 PM Daily</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-navy-700 bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
            <MapPin className="w-10 h-10 text-gold-400 mb-2 animate-bounce" />
            <h4 className="text-base font-bold text-white">Kakinada Hub (Main Road)</h4>
            <p className="text-xs text-slate-400 mt-1">
              Amma Travels Central Depot & Handover Station
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/contact"
                className="px-4 py-2 rounded-lg text-xs font-bold bg-navy-800 hover:bg-navy-750 text-gold-400 border border-gold-500/30"
              >
                View Directions & Contacts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
