import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Car,
  Bus,
  Headphones,
  Star,
  Coins,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export interface BookingSearchParams {
  pickupLocation: string;
  returnLocation: string;
  isDifferentReturn: boolean;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  promoCode: string;
}

interface HeroProps {
  onSearchBooking: (params: BookingSearchParams) => void;
  activePromoCode: string | null;
  onApplyPromo: (code: string) => void;
  onSelectOption: (section: string) => void;
  onOpenLocationsModal?: () => void;
  onOpenShuttleTracker?: () => void;
}

export const KAKINADA_LOCATIONS = [
  'Kakinada Central Hub (Main Road)',
  'Bhanugudi Junction Hub',
  'Kakinada Town Railway Station',
  'Rajahmundry Airport (RJA) Express Point',
  'Doorstep Delivery (Kakinada City Limits)',
  'Uppada Beach Scenic Road Hub',
];

export const Hero: React.FC<HeroProps> = ({
  onSearchBooking,
  activePromoCode,
  onApplyPromo,
  onSelectOption,
  onOpenLocationsModal,
  onOpenShuttleTracker,
}) => {
  // Booking Form State
  const [pickupLocation, setPickupLocation] = useState(KAKINADA_LOCATIONS[0]);
  const [returnLocation, setReturnLocation] = useState(KAKINADA_LOCATIONS[0]);
  const [isDifferentReturn, setIsDifferentReturn] = useState(false);

  // Default dates: tomorrow to day-after-tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultPickupDate = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const defaultReturnDate = dayAfter.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(defaultPickupDate);
  const [pickupTime, setPickupTime] = useState('11:00');
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [returnTime, setReturnTime] = useState('11:00');

  // Promo code toggle & value
  const [hasPromoCode, setHasPromoCode] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoAppliedAlert, setPromoAppliedAlert] = useState(false);

  // Sync activePromoCode prop
  useEffect(() => {
    if (activePromoCode) {
      setHasPromoCode(true);
      setPromoCodeInput(activePromoCode);
      setPromoAppliedAlert(true);
      const timer = setTimeout(() => setPromoAppliedAlert(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [activePromoCode]);

  const handleApplyHeroBannerPromo = () => {
    onApplyPromo('FALL15');
    setHasPromoCode(true);
    setPromoCodeInput('FALL15');
    setPromoAppliedAlert(true);
    setTimeout(() => setPromoAppliedAlert(false), 4000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchBooking({
      pickupLocation,
      returnLocation: isDifferentReturn ? returnLocation : pickupLocation,
      isDifferentReturn,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      promoCode: hasPromoCode ? promoCodeInput : '',
    });
  };

  // Helper date formatter for visual display (e.g. "Nov 10, 2026")
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Helper time formatter (e.g. "11:00 AM")
  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return '11:00 AM';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  return (
    <section className="relative w-full pt-28 pb-12 sm:pt-32 sm:pb-16 flex flex-col items-center justify-start overflow-hidden">
      {/* --- HERO BANNER & SCENIC ROAD BACKGROUND (MATCHING SCREENSHOT 1) --- */}
      <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-10 sm:py-16 overflow-hidden">
        {/* Layer 1: High Resolution Aerial Scenic Winding Autumn Road */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=2400&q=85"
            alt="Scenic winding road through autumn hills"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />
          {/* Subtle gradient vignette to make white typography readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        {/* Layer 2: Overhead Blue Adventure 4x4 / Jeep (Right side element matching Screenshot 1) */}
        <div className="hidden lg:block absolute right-[10%] top-[40%] -translate-y-1/2 z-10 w-72 lg:w-96 pointer-events-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]">
          <img
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80"
            alt="Blue 4x4 Trail Adventure Vehicle"
            className="w-full h-auto object-contain rounded-3xl -rotate-12 filter contrast-110 brightness-105"
          />
        </div>

        {/* Layer 3: Hero Content (Badge, Huge Bold Title, Glass Promo Banner) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 text-left">
          {/* Seasonal Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>AMMA TRAVELS · CAR & BIKE RENTALS</span>
          </div>

          {/* Huge Bold Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-3xl drop-shadow-lg font-display">
            Drive Into Your <br className="hidden sm:inline" />
            Next Adventure
          </h1>

          {/* Glassmorphic Promo Card */}
          <div className="max-w-xl rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/20 p-5 sm:p-6 shadow-2xl relative overflow-hidden text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider block">
                  SAVE 15% OFF ON YOUR RENTAL
                </span>
                <p className="text-xs text-slate-200 leading-relaxed max-w-sm">
                  Valid on all Pay Now bookings. Minimum rental period of 2 days required. Promotion active in Kakinada.
                </p>
              </div>

              {/* Tap To Apply Button */}
              <button
                type="button"
                onClick={handleApplyHeroBannerPromo}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 flex-shrink-0 btn-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>FALL15</span>
                <span className="text-[10px] bg-black/25 px-1.5 py-0.5 rounded font-bold">APPLY</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty bottom spacer for overlapping search card */}
        <div className="h-10 sm:h-14 lg:h-16" />
      </div>

      {/* --- FLOATING BOOKING SEARCH CARD --- */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 lg:-mt-28">
        <form
          onSubmit={handleFormSubmit}
          className="rounded-[2rem] bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5 transition-colors"
        >
          {/* Promo code confirmation banner if activated */}
          {promoAppliedAlert && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Promo code <strong>{promoCodeInput}</strong> has been applied! 15% discount will be calculated on your rental.</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
          )}

          {/* Top Inputs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            
            {/* Input 1: PICK-UP LOCATION */}
            <div className="lg:col-span-4 rounded-2xl border border-[#E8DFCF] dark:border-slate-800 p-3 sm:p-3.5 hover:border-orange-500/70 transition-all bg-[#F6F0DF]/60 dark:bg-slate-950/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-neutral-400 block">
                  PICK-UP
                </span>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm sm:text-base text-stone-900 dark:text-white focus:outline-none cursor-pointer truncate"
                >
                  {KAKINADA_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#FFFDF7] dark:bg-neutral-900 text-black dark:text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input 2: PICK-UP DATE & TIME (3 Cols) */}
            <div className="lg:col-span-3 rounded-2xl border border-[#E8DFCF] dark:border-slate-800 p-3 sm:p-3.5 hover:border-orange-500/70 transition-all bg-[#F6F0DF]/60 dark:bg-slate-950/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 block">
                    PICK-UP
                  </span>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-500 inline" />
                    TIME
                  </span>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Input 3: RETURN DATE & TIME (3 Cols) */}
            <div className="lg:col-span-3 rounded-2xl border border-[#E8DFCF] dark:border-slate-800 p-3 sm:p-3.5 hover:border-orange-500/70 transition-all bg-[#F6F0DF]/60 dark:bg-slate-950/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    RETURN
                  </span>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500 inline" />
                    TIME
                  </span>
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* CTA Button: BOOK NOW (2 Cols) */}
            <div className="lg:col-span-2 flex items-stretch">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base tracking-wide shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer btn-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>Book Now</span>
              </button>
            </div>
          </div>

          {/* Conditional Drop-off Location */}
          {isDifferentReturn && (
            <div className="p-3.5 rounded-2xl border border-blue-500/50 bg-blue-500/5 animate-in fade-in flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  RETURN / DROP-OFF LOCATION
                </span>
                <select
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {KAKINADA_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Conditional Promo Code Input */}
          {hasPromoCode && (
            <div className="p-3.5 rounded-2xl border border-blue-500/50 bg-blue-500/5 animate-in fade-in flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Enter Promotional Coupon Code:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. FALL15 or MOVE15"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (promoCodeInput.trim()) {
                      onApplyPromo(promoCodeInput.trim());
                      setPromoAppliedAlert(true);
                      setTimeout(() => setPromoAppliedAlert(false), 3000);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition-colors btn-interactive"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Bottom Toggles Row */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {/* Toggle 1: Return to a different location */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span>Return to a different location</span>
              <div
                onClick={() => setIsDifferentReturn(!isDifferentReturn)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                  isDifferentReturn ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    isDifferentReturn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>

            {/* Toggle 2: Have a Promo Code? */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span>Have a Promo Code?</span>
              <div
                onClick={() => setHasPromoCode(!hasPromoCode)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                  hasPromoCode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    hasPromoCode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>
          </div>
        </form>

        {/* --- FEATURE HIGHLIGHTS BAR --- */}
        <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-between gap-6 py-4 px-2 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-500" />
            <span>Latest Models</span>
          </div>

          <div
            onClick={onOpenShuttleTracker}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors"
          >
            <Bus className="w-4 h-4 text-blue-500" />
            <span>Free Shuttle</span>
          </div>

          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-blue-500" />
            <span>24/7 Support</span>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>4.8★ (2.5k+ Reviews)</span>
          </div>

          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-blue-500" />
            <span>Affordable Rates</span>
          </div>
        </div>
      </div>
    </section>
  );
};
