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
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/40 px-3.5 py-1.5 rounded-full border border-saffron-200 dark:border-saffron-800">
          Turnkey Event Logistics
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-charcoal-900 dark:text-warm-50 tracking-tight mt-3">
          Event Management & VIP Fleets
        </h2>
        <p className="mt-3 text-base text-charcoal-600 dark:text-warm-200/80">
          From grand destination weddings to high-profile executive summits and Godavari group expeditions — Amma Travels orchestrates complete luxury transit and celebrations.
        </p>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-900 text-saffron-400 shadow-md scale-105'
                  : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-warm-300 hover:bg-warm-100 border border-warm-200 dark:border-charcoal-700'
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
              className="bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image banner with overlay */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-charcoal-950 group">
                <img
                  src={pkg.gallery[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-teal-950/90 text-saffron-400 border border-saffron-500/30 backdrop-blur-md">
                    {pkg.eventType}
                  </span>
                  {pkg.isFeatured && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500 text-teal-950">
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Guest Capacity Tag */}
                <div className="absolute bottom-4 left-4 text-xs font-semibold text-warm-100 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                  <Users className="w-3.5 h-3.5 text-saffron-400" />
                  <span>{pkg.guestCapacity}</span>
                </div>

                {/* Price range */}
                <div className="absolute bottom-4 right-4 text-right">
                  <p className="text-[11px] text-warm-300 font-medium">Estimated Package</p>
                  <p className="text-lg sm:text-xl font-extrabold text-saffron-400 font-display">
                    {pkg.priceRange}
                  </p>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-charcoal-900 dark:text-warm-50">
                    {pkg.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-teal-700 dark:text-saffron-400">
                    {pkg.tagline}
                  </p>
                  <p className="mt-3 text-sm text-charcoal-600 dark:text-warm-200/80 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Highlights Bar */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {pkg.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-warm-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-warm-200 border border-warm-200 dark:border-charcoal-700 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-saffron-500" />
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Included Services Checklist */}
                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-charcoal-500 dark:text-warm-400">
                      What's Included:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-700 dark:text-warm-200">
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
                <div className="pt-5 border-t border-warm-200 dark:border-charcoal-800 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => onSelectInterest(pkg)}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-bold text-sm tracking-wide shadow-md shadow-saffron-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>I'm Interested — Plan Event</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-warm-100 dark:bg-charcoal-800 hover:bg-warm-200 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-warm-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-warm-200 dark:border-charcoal-700"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enquire via WhatsApp</span>
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
