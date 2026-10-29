'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bike,
  Car,
  Calendar,
  Clock,
  MapPin,
  Search,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { calculateRentalDuration, MIN_RENTAL_HOURS } from '@/lib/pricing';

export const KAKINADA_LOCATIONS = [
  'Kakinada Hub (Main Road)',
  'Bhanugudi Junction Hub',
  'Kakinada Town Railway Station',
  'Kakinada Port Area',
  'Doorstep Delivery (Kakinada Municipal Limits)',
];

export function SearchWidget({
  defaultCategory = 'bike',
  className = '',
}: {
  defaultCategory?: 'bike' | 'car';
  className?: string;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<'bike' | 'car'>(defaultCategory);
  const [location, setLocation] = useState(KAKINADA_LOCATIONS[0]);

  // Default to tomorrow 09:00 AM to day-after-tomorrow 09:00 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const defaultPickupDate = `${yyyy}-${mm}-${dd}`;

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  const yyyy2 = dayAfter.getFullYear();
  const mm2 = String(dayAfter.getMonth() + 1).padStart(2, '0');
  const dd2 = String(dayAfter.getDate()).padStart(2, '0');
  const defaultReturnDate = `${yyyy2}-${mm2}-${dd2}`;

  const [pickupDate, setPickupDate] = useState(defaultPickupDate);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [returnTime, setReturnTime] = useState('09:00');

  const [durationText, setDurationText] = useState('1 Day');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Recalculate duration & validate
  useEffect(() => {
    const pickupIso = `${pickupDate}T${pickupTime}:00`;
    const returnIso = `${returnDate}T${returnTime}:00`;

    const { totalHours, formattedDuration } = calculateRentalDuration(pickupIso, returnIso);

    if (totalHours <= 0) {
      setValidationError('Return date and time must be after pickup date and time.');
      setDurationText('Invalid Duration');
    } else if (totalHours < MIN_RENTAL_HOURS) {
      setValidationError(`Minimum rental booking duration is ${MIN_RENTAL_HOURS} hours.`);
      setDurationText(formattedDuration);
    } else {
      setValidationError(null);
      setDurationText(formattedDuration);
    }
  }, [pickupDate, pickupTime, returnDate, returnTime]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) return;

    const pickupIso = `${pickupDate}T${pickupTime}:00`;
    const returnIso = `${returnDate}T${returnTime}:00`;

    const targetPath = category === 'car' ? '/cars' : '/bikes';
    const params = new URLSearchParams({
      pickup: pickupIso,
      return: returnIso,
      location,
    });

    router.push(`${targetPath}?${params.toString()}`);
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Category Toggle Tabs (Royal Brothers Style) */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setCategory('bike')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold transition-all ${
            category === 'bike'
              ? 'bg-navy-900 text-gold-400 border-t-2 border-gold-500 shadow-lg'
              : 'bg-navy-950/70 text-slate-400 hover:text-slate-200 border-t-2 border-transparent'
          }`}
        >
          <Bike className="w-5 h-5" />
          <span>Rent Bikes & Scooters</span>
        </button>
        <button
          type="button"
          onClick={() => setCategory('car')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold transition-all ${
            category === 'car'
              ? 'bg-navy-900 text-gold-400 border-t-2 border-gold-500 shadow-lg'
              : 'bg-navy-950/70 text-slate-400 hover:text-slate-200 border-t-2 border-transparent'
          }`}
        >
          <Car className="w-5 h-5" />
          <span>Rent Cars</span>
        </button>
      </div>

      {/* Main Search Panel */}
      <form
        onSubmit={handleSearch}
        className="glass-panel bg-navy-900/95 p-6 rounded-b-2xl rounded-tr-2xl shadow-2xl border border-navy-700/80 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          {/* Pickup Location */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              Pickup Hub in Kakinada
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 hover:border-gold-500/50 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              >
                {KAKINADA_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-navy-950 text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pickup Date & Time */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              Pickup Schedule
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-2.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-2.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>

          {/* Return Date & Time */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Return Schedule
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-2.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-2.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>

          {/* Search Action CTA */}
          <div className="lg:col-span-2 pt-2 lg:pt-5">
            <button
              type="submit"
              disabled={!!validationError}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                validationError
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 hover:from-gold-300 hover:to-gold-400 hover:shadow-gold-500/20 active:scale-98'
              }`}
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Fleet</span>
            </button>
          </div>
        </div>

        {/* Duration badge and error indicator */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-navy-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Selected Rental Duration:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 font-bold">
              <Sparkles className="w-3 h-3" />
              {durationText}
            </span>
          </div>

          {validationError && (
            <div className="flex items-center gap-1.5 text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {!validationError && (
            <div className="text-slate-400 hidden sm:block">
              Free helmet & 150-250 km included per day
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
