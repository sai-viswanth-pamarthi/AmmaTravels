import React, { useState } from 'react';
import {
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  Compass
} from 'lucide-react';
import { EventPackage } from '@/types';
import { getEventWhatsAppUrl } from '@/lib/whatsapp';

interface EventPackagesProps {
  packages: EventPackage[];
  onSelectInterest: (pkg: EventPackage) => void;
}

export const EventPackages: React.FC<EventPackagesProps> = ({
  packages,
  onSelectInterest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Packages' },
    { id: 'Wedding', label: 'Weddings' },
    { id: 'Corporate', label: 'Corporate' },
    { id: 'Birthday', label: 'Birthdays' },
    { id: 'TourGroup', label: 'Tour Groups' },
  ];

  const filteredPackages =
    selectedCategory === 'all'
      ? packages
      : packages.filter(
          (p) => p.eventType.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-4 py-1.5 rounded-full border border-amber-200 dark:border-amber-800">
          Turnkey Event Logistics
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-black text-ink-900 dark:text-cream-50 tracking-tight mt-3">
          Event Management & VIP Fleets
        </h2>
        <p className="mt-3 text-base text-ink-600 dark:text-cream-300">
          From grand destination weddings to high-profile executive summits and Godavari group expeditions — Amma Travels orchestrates complete luxury transit and celebrations.
        </p>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-ink-900 dark:bg-cream-100 text-cream-50 dark:text-ink-950 shadow-md scale-105'
                  : 'bg-white dark:bg-ink-900 text-ink-700 dark:text-cream-200 hover:bg-cream-100 border border-cream-200 dark:border-ink-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPackages.map((pkg) => {
          const whatsappUrl = getEventWhatsAppUrl(pkg.title);

          return (
            <div
              key={pkg.id}
              className="bg-white dark:bg-ink-900 rounded-3xl border border-cream-200 dark:border-ink-800 overflow-hidden soft-card-shadow hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image banner with overlay */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-ink-950 group">
                <img
                  src={pkg.gallery[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-ink-950/90 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                    {pkg.eventType}
                  </span>
                  {pkg.isFeatured && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-ink-950">
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Guest Capacity Tag */}
                <div className="absolute bottom-4 left-4 text-xs font-bold text-cream-50 flex items-center gap-1.5 bg-black/60 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{pkg.guestCapacity}</span>
                </div>

                {/* Price range */}
                <div className="absolute bottom-4 right-4 text-right">
                  <p className="text-[11px] text-cream-300 font-medium">Estimated Package</p>
                  <p className="text-lg sm:text-xl font-black text-amber-400 font-display">
                    {pkg.priceRange}
                  </p>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-black text-ink-900 dark:text-cream-50">
                    {pkg.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {pkg.tagline}
                  </p>
                  <p className="mt-3 text-sm text-ink-600 dark:text-cream-300 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Highlights Bar */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {pkg.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-cream-100 dark:bg-ink-800 text-ink-800 dark:text-cream-200 border border-cream-200 dark:border-ink-700 flex items-center gap-1.5 font-medium"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Included Services Checklist */}
                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-cream-400">
                      What's Included:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-700 dark:text-cream-200">
                      {pkg.includedServices.map((service, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer CTAs */}
                <div className="pt-5 border-t border-cream-200 dark:border-ink-800 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => onSelectInterest(pkg)}
                    className="w-full sm:flex-1 py-3 px-4 rounded-full bg-amber-500 hover:bg-amber-400 text-ink-950 font-extrabold text-sm tracking-wide shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Plan Event with Coordinator</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-5 rounded-full bg-cream-100 dark:bg-ink-800 hover:bg-cream-200 text-ink-800 dark:text-cream-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-cream-200 dark:border-ink-700"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
