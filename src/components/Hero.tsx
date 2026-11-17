import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Bus,
  Headphones,
  Star,
  Coins,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useBusinessSettings } from '@/lib/settings';

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

// --- LAPTOP-STYLE DATE PICKER COMPONENT ---
// Operates manually via calendar grid navigation (No typing directly!)
interface LaptopDatePickerProps {
  label: string;
  value: string; // 'YYYY-MM-DD'
  onChange: (date: string) => void;
  minDate?: string;
}

const LaptopDatePicker: React.FC<LaptopDatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Month & Year state for calendar navigation
  const [viewYear, setViewYear] = useState(() => {
    const d = value ? new Date(value + 'T00:00:00') : new Date();
    return isNaN(d.getFullYear()) ? new Date().getFullYear() : d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = value ? new Date(value + 'T00:00:00') : new Date();
    return isNaN(d.getMonth()) ? new Date().getMonth() : d.getMonth();
  });

  // Keep view synchronized with value
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handleSelectDay = (day: number) => {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const fullDate = `${viewYear}-${mStr}-${dStr}`;
    onChange(fullDate);
    setIsOpen(false);
  };

  const formattedDisplay = useMemo(() => {
    if (!value) return 'Select Date';
    try {
      const d = new Date(value + 'T00:00:00');
      if (isNaN(d.getTime())) return value;
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return value;
    }
  }, [value]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left focus:outline-none group flex items-center justify-between"
      >
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400 block truncate">
            {label}
          </span>
          <span className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white truncate block">
            {formattedDisplay}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 dark:text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Laptop Calendar Flyout */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header with Month/Year Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-black text-sm text-slate-900 dark:text-white">
              {monthNames[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 pt-2.5 pb-1 text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Day Buttons Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-8" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const mStr = String(viewMonth + 1).padStart(2, '0');
              const dStr = String(day).padStart(2, '0');
              const dateStr = `${viewYear}-${mStr}-${dStr}`;
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;
              const isDisabled = minDate ? dateStr < minDate : false;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 sm:h-9 sm:w-9 mx-auto rounded-lg text-xs font-bold transition-all flex items-center justify-center relative ${
                    isDisabled
                      ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                      : isToday
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 hover:bg-blue-100'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                const today = `${now.getFullYear()}-${m}-${d}`;
                if (!minDate || today >= minDate) {
                  onChange(today);
                  setIsOpen(false);
                }
              }}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-200"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- LAPTOP-STYLE TIME STEPPER COMPONENT ---
// Operates manually via Hour ▲/▼, Minute ▲/▼, and AM/PM toggle (No typing directly & no fixed time slot chips!)
interface LaptopTimePickerProps {
  label: string;
  value: string; // 'HH:mm' 24hr format
  onChange: (time: string) => void;
}

const LaptopTimePicker: React.FC<LaptopTimePickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const parsed = useMemo(() => {
    const [hStr, mStr] = (value || '10:00').split(':');
    let h24 = parseInt(hStr || '10', 10);
    if (isNaN(h24)) h24 = 10;
    let m = parseInt(mStr || '00', 10);
    if (isNaN(m)) m = 0;
    const isPM = h24 >= 12;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const ampm: 'AM' | 'PM' = isPM ? 'PM' : 'AM';
    return { h12, m, ampm, h24 };
  }, [value]);

  const updateTime = (h12: number, min: number, period: 'AM' | 'PM') => {
    let hour24 = h12 % 12;
    if (period === 'PM') hour24 += 12;
    const hStr = String(hour24).padStart(2, '0');
    const mStr = String(min).padStart(2, '0');
    onChange(`${hStr}:${mStr}`);
  };

  const stepHourUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextH = parsed.h12 === 12 ? 1 : parsed.h12 + 1;
    updateTime(nextH, parsed.m, parsed.ampm);
  };

  const stepHourDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextH = parsed.h12 === 1 ? 12 : parsed.h12 - 1;
    updateTime(nextH, parsed.m, parsed.ampm);
  };

  const stepMinuteUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextM = (parsed.m + 15) % 60;
    updateTime(parsed.h12, nextM, parsed.ampm);
  };

  const stepMinuteDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextM = (parsed.m - 15 + 60) % 60;
    updateTime(parsed.h12, nextM, parsed.ampm);
  };

  const toggleAmPm = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextPeriod = parsed.ampm === 'AM' ? 'PM' : 'AM';
    updateTime(parsed.h12, parsed.m, nextPeriod);
  };

  const formattedDisplay = useMemo(() => {
    const hStr = String(parsed.h12).padStart(2, '0');
    const mStr = String(parsed.m).padStart(2, '0');
    return `${hStr}:${mStr} ${parsed.ampm}`;
  }, [parsed]);

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left focus:outline-none group flex items-center justify-between"
      >
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400 block truncate flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-500 inline" />
            {label}
          </span>
          <span className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white truncate block">
            {formattedDisplay}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 dark:text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Laptop Time Stepper Flyout */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Laptop Time Stepper
            </span>
          </div>

          {/* Stepper Dials: Hour : Minute AM/PM */}
          <div className="py-4 flex items-center justify-center gap-3">
            {/* Hour Column */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={stepHourUp}
                className="w-9 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all active:scale-90"
                title="Increase Hour"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <div className="my-2 w-12 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-black text-lg text-slate-900 dark:text-white select-none">
                {String(parsed.h12).padStart(2, '0')}
              </div>
              <button
                type="button"
                onClick={stepHourDown}
                className="w-9 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all active:scale-90"
                title="Decrease Hour"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Hour</span>
            </div>

            <div className="font-black text-2xl text-slate-400 select-none -mt-4">:</div>

            {/* Minute Column */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={stepMinuteUp}
                className="w-9 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all active:scale-90"
                title="Increase Minute (+15m)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <div className="my-2 w-12 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-black text-lg text-slate-900 dark:text-white select-none">
                {String(parsed.m).padStart(2, '0')}
              </div>
              <button
                type="button"
                onClick={stepMinuteDown}
                className="w-9 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all active:scale-90"
                title="Decrease Minute (-15m)"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Min</span>
            </div>

            {/* AM/PM Toggle Column */}
            <div className="flex flex-col items-center ml-1">
              <button
                type="button"
                onClick={toggleAmPm}
                className="w-9 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all active:scale-90"
                title="Toggle AM/PM"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={toggleAmPm}
                className="my-2 w-12 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-black text-sm text-blue-600 dark:text-blue-400 select-none hover:bg-blue-100 transition-colors"
                title="Click to toggle AM/PM"
              >
                {parsed.ampm}
              </button>
              <button
                type="button"
                onClick={toggleAmPm}
                className="w-9 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all active:scale-90"
                title="Toggle AM/PM"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">AM/PM</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const h = String(now.getHours()).padStart(2, '0');
                const m = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, '0');
                onChange(`${h}:${m}`);
              }}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Current Time
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({
  onSearchBooking,
  activePromoCode,
  onApplyPromo,
  onSelectOption,
  onOpenLocationsModal,
  onOpenShuttleTracker,
}) => {
  const [businessSettings] = useBusinessSettings();
  const pickupLocations = useMemo(() => {
    return businessSettings.locations && businessSettings.locations.length > 0
      ? businessSettings.locations
      : KAKINADA_LOCATIONS;
  }, [businessSettings.locations]);

  // Booking Form State
  const [pickupLocation, setPickupLocation] = useState(pickupLocations[0] || 'Kakinada Central Hub (Main Road)');
  const [returnLocation, setReturnLocation] = useState(pickupLocations[0] || 'Kakinada Central Hub (Main Road)');
  const [isDifferentReturn, setIsDifferentReturn] = useState(false);

  // Sync if settings locations change
  useEffect(() => {
    if (pickupLocations.length > 0 && !pickupLocations.includes(pickupLocation)) {
      setPickupLocation(pickupLocations[0]);
    }
    if (pickupLocations.length > 0 && !pickupLocations.includes(returnLocation)) {
      setReturnLocation(pickupLocations[0]);
    }
  }, [pickupLocations]);

  // Default dates: tomorrow to day-after-tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultPickupDate = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const defaultReturnDate = dayAfter.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(defaultPickupDate);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [returnTime, setReturnTime] = useState('10:00');

  // Dynamic trip duration & live calculation
  const durationInfo = useMemo(() => {
    try {
      const p = new Date(`${pickupDate}T${pickupTime}:00`);
      const r = new Date(`${returnDate}T${returnTime}:00`);
      const diffMs = r.getTime() - p.getTime();
      if (diffMs <= 0) {
        return { totalDays: 1, totalHours: 24, label: '1 Day (Min. Booking)', isValid: false };
      }
      const totalHours = Math.round(diffMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const remainingHours = totalHours % 24;
      const billedDays = days + (remainingHours > 2 ? 1 : 0);
      let label = '';
      if (days > 0 && remainingHours > 0) {
        label = `${days} Day${days > 1 ? 's' : ''}, ${remainingHours} Hr${remainingHours > 1 ? 's' : ''}`;
      } else if (days > 0) {
        label = `${days} Day${days > 1 ? 's' : ''} (${totalHours} hrs)`;
      } else {
        label = `${totalHours} Hours`;
      }
      return { totalDays: Math.max(1, billedDays), totalHours, label, isValid: true };
    } catch {
      return { totalDays: 1, totalHours: 24, label: '24 Hours', isValid: true };
    }
  }, [pickupDate, pickupTime, returnDate, returnTime]);

  // Dynamic preset handlers
  const handleApplyPresetDays = (days: number) => {
    try {
      const start = new Date(`${pickupDate}T${pickupTime}:00`);
      const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
      setReturnDate(end.toISOString().split('T')[0]);
      setReturnTime(pickupTime);
    } catch {}
  };

  const handleApplyWeekendPreset = () => {
    try {
      const now = new Date();
      const currentDay = now.getDay();
      const daysToFriday = (5 - currentDay + 7) % 7 || 7;
      const friday = new Date(now.getTime() + daysToFriday * 24 * 60 * 60 * 1000);
      const sunday = new Date(friday.getTime() + 2 * 24 * 60 * 60 * 1000);
      setPickupDate(friday.toISOString().split('T')[0]);
      setPickupTime('17:00');
      setReturnDate(sunday.toISOString().split('T')[0]);
      setReturnTime('21:00');
    } catch {}
  };

  const handlePickupDateChange = (newDate: string) => {
    setPickupDate(newDate);
    // Dynamically advance return date if pickup exceeds or equals return date
    if (newDate >= returnDate) {
      const p = new Date(`${newDate}T${pickupTime}:00`);
      const nextDay = new Date(p.getTime() + 24 * 60 * 60 * 1000);
      setReturnDate(nextDay.toISOString().split('T')[0]);
    }
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
      promoCode: '',
    });
  };

  return (
    <section className="relative w-full pt-0 pb-12 sm:pb-16 flex flex-col items-center justify-start overflow-hidden">
      {/* --- HERO BANNER (USER'S OFFICIAL IMAGE CENTERED IN MIDDLE - ENTIRE TEXT 100% VISIBLE) --- */}
      <div className="relative w-full bg-[#0d3765] flex flex-col items-center justify-center pt-20 pb-16 sm:pt-24 sm:pb-24 px-3 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Center Container for the Official Banner Image */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>AMMA ENTERPRISES · SELF-DRIVE CARS & RENTAL BIKES · KAKINADA</span>
          </div>

          {/* The Official Banner Image - Centered, Unenlarged, Full Text & Visuals Completely Visible */}
          <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 bg-[#0d3765]">
            <img
              src="/hero-banner.jpg"
              alt="Amma Travels Official Banner - Self Drive Cars and Bikes Kakinada"
              className="w-full h-auto max-h-[460px] sm:max-h-[520px] object-contain object-center filter drop-shadow-2xl"
            />
          </div>

          <p className="text-xs sm:text-sm text-blue-100/90 text-center max-w-2xl font-medium pt-1">
            Browse verified cars and bikes in Kakinada. Choose your dates below and click <strong className="text-white">"I'm Interested"</strong> — zero upfront payment, direct team contact.
          </p>
        </div>

        {/* Empty bottom spacer for overlapping search card */}
        <div className="h-10 sm:h-14 lg:h-16" />
      </div>

      {/* --- FLOATING BOOKING & INTEREST CARD --- */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 lg:-mt-28">
        <form
          onSubmit={handleFormSubmit}
          className="rounded-[2rem] bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5 transition-colors"
        >
          {/* Card Caption & Dynamic Duration Bar */}
          <div className="space-y-3 pb-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Dates & Express Interest
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Zero advance payment • Direct team contact
              </span>
            </div>

            {/* Dynamic Interactive Duration & Presets Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  ⏱️
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block leading-none">
                    Calculated Duration
                  </span>
                  <span className="font-extrabold text-blue-700 dark:text-blue-300 text-sm">
                    {durationInfo.label}
                  </span>
                </div>
              </div>

              {/* Dynamic Duration Preset Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
                  Quick Duration:
                </span>
                <button
                  type="button"
                  onClick={() => handleApplyPresetDays(1)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    durationInfo.totalDays === 1
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  1 Day
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetDays(2)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    durationInfo.totalDays === 2
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  2 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetDays(3)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    durationInfo.totalDays === 3
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  3 Days
                </button>
                <button
                  type="button"
                  onClick={handleApplyWeekendPreset}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all"
                >
                  🌴 Weekend Getaway
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetDays(7)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
                >
                  1 Week
                </button>
              </div>
            </div>
          </div>

          {/* Top Inputs Row with Laptop-Style Manual Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            
            {/* Input 1: PICK-UP LOCATION (4 Cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-[#E8DFCF] dark:border-slate-800 p-3 sm:p-3.5 hover:border-orange-500/70 transition-all bg-[#F6F0DF]/60 dark:bg-slate-950/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-neutral-400 block">
                  PICK-UP LOCATION
                </span>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm sm:text-base text-stone-900 dark:text-white focus:outline-none cursor-pointer truncate"
                >
                  {pickupLocations.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#FFFDF7] dark:bg-neutral-900 text-black dark:text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input 2: PICK-UP DATE & TIME (Laptop Controls: Calendar Grid + Clock Stepper, No Typing) (3 Cols) */}
            <div className="lg:col-span-3 rounded-2xl border border-[#E8DFCF] dark:border-slate-800 p-3 sm:p-3.5 hover:border-orange-500/70 transition-all bg-[#F6F0DF]/60 dark:bg-slate-950/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                <LaptopDatePicker
                  label="PICK-UP"
                  value={pickupDate}
                  onChange={handlePickupDateChange}
                  minDate={new Date().toISOString().split('T')[0]}
                />
                <div className="pl-2 border-l border-[#E8DFCF] dark:border-slate-800">
                  <LaptopTimePicker
                    label="TIME"
                    value={pickupTime}
                    onChange={setPickupTime}
                  />
                </div>
              </div>
            </div>

            {/* Input 3: RETURN DATE & TIME (Laptop Controls: Calendar Grid + Clock Stepper, No Typing) (3 Cols) */}
            <div className="lg:col-span-3 rounded-2xl border border-[#E8DFCF] dark:border-slate-800 p-3 sm:p-3.5 hover:border-orange-500/70 transition-all bg-[#F6F0DF]/60 dark:bg-slate-950/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                <LaptopDatePicker
                  label="RETURN"
                  value={returnDate}
                  onChange={setReturnDate}
                  minDate={pickupDate}
                />
                <div className="pl-2 border-l border-[#E8DFCF] dark:border-slate-800">
                  <LaptopTimePicker
                    label="TIME"
                    value={returnTime}
                    onChange={setReturnTime}
                  />
                </div>
              </div>
            </div>

            {/* CTA Button: I'M INTERESTED (2 Cols) */}
            <div className="lg:col-span-2 flex items-stretch">
              <button
                type="submit"
                className="w-full py-4 px-4 sm:px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer btn-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>I'm Interested</span>
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
                  {pickupLocations.map((loc) => (
                    <option key={loc} value={loc} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Bottom Toggles Row */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {/* Toggle: Return to a different location */}
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

            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              * Click "I'm Interested" to browse fleet matching your schedule
            </span>
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
