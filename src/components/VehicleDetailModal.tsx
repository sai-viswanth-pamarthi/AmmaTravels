import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Car,
  Bike,
  Settings,
  Fuel,
  Users,
  Shield,
  Gauge,
  Briefcase,
  Wind,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  Maximize2
} from 'lucide-react';
import { Vehicle } from '@/types';
import { getVehicleWhatsAppUrl } from '@/lib/whatsapp';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectInterest: (vehicle: Vehicle, selectedColor?: string) => void;
}

// Curated realistic vehicle images by color family
const COLOR_IMAGE_MAP: Record<string, { car: string; bike: string }> = {
  white: {
    car: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    bike: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1200&q=80',
  },
  red: {
    car: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    bike: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
  },
  black: {
    car: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    bike: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
  },
  blue: {
    car: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    bike: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80',
  },
  silver: {
    car: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    bike: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80',
  },
  grey: {
    car: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    bike: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
  },
  green: {
    car: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    bike: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
  },
  bronze: {
    car: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    bike: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80',
  },
};

const DEFAULT_CAR_COLORS = [
  { name: 'Pearl Arctic White', hex: '#F8FAFC' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Midnight Black', hex: '#0F172A' },
  { name: 'Magma Grey', hex: '#4B5563' },
  { name: 'Nexa Blue', hex: '#1E3A8A' },
  { name: 'Silky Silver', hex: '#CBD5E1' },
];

const DEFAULT_BIKE_COLORS = [
  { name: 'Stealth Black', hex: '#18181B' },
  { name: 'Fireball Red', hex: '#B91C1C' },
  { name: 'Chrome Bronze', hex: '#78350F' },
  { name: 'Halcyon Green', hex: '#14532D' },
  { name: 'Pure White', hex: '#F1F5F9' },
];

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSelectInterest,
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);

  // Strict background scroll-locking: stops Lenis momentum scroll and locks body & html
  useEffect(() => {
    if (isOpen) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
      };
    }
  }, [isOpen]);

  if (!isOpen || !vehicle) return null;

  const isBike = vehicle.type === 'bike';

  // Compute available colors
  const availableColors = useMemo(() => {
    if (vehicle.colors && vehicle.colors.length > 0) {
      return vehicle.colors.map((c) => {
        if (typeof c === 'string') {
          const lower = c.toLowerCase();
          let hex = '#4B5563';
          if (lower.includes('white')) hex = '#F8FAFC';
          else if (lower.includes('red') || lower.includes('maroon') || lower.includes('crimson')) hex = '#DC2626';
          else if (lower.includes('black') || lower.includes('stealth')) hex = '#0F172A';
          else if (lower.includes('blue') || lower.includes('nexa')) hex = '#1D4ED8';
          else if (lower.includes('silver')) hex = '#CBD5E1';
          else if (lower.includes('green') || lower.includes('halcyon')) hex = '#15803D';
          else if (lower.includes('bronze') || lower.includes('brown')) hex = '#78350F';
          else if (lower.includes('grey') || lower.includes('gray')) hex = '#4B5563';
          return { name: c, hex };
        }
        return c;
      });
    }
    return isBike ? DEFAULT_BIKE_COLORS : DEFAULT_CAR_COLORS;
  }, [vehicle, isBike]);

  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors[0]?.name || 'Standard Factory'
  );

  // Photo gallery list
  const galleryImages = useMemo(() => {
    const list = [vehicle.primaryImage];
    if (vehicle.gallery && vehicle.gallery.length > 0) {
      vehicle.gallery.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    // Add additional contextual model shots if less than 3
    if (list.length < 3) {
      if (isBike) {
        list.push('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80');
        list.push('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80');
      } else {
        list.push('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
        list.push('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80');
      }
    }
    return list;
  }, [vehicle, isBike]);

  // Dynamically resolve image based on chosen color!
  const currentVehicleImage = useMemo(() => {
    const colLower = selectedColor.toLowerCase();
    for (const [key, mapping] of Object.entries(COLOR_IMAGE_MAP)) {
      if (colLower.includes(key)) {
        return isBike ? mapping.bike : mapping.car;
      }
    }
    // Default to primary vehicle image
    return vehicle.primaryImage;
  }, [selectedColor, vehicle.primaryImage, isBike]);

  const engineCc = vehicle.specs?.engineCc || (isBike ? 350 : 1197);
  const mileage = vehicle.specs?.mileageKmpl || (isBike ? 36 : 21);
  const bootSpace = vehicle.specs?.bootSpaceLiters || (isBike ? 25 : 378);

  const handleInterestClick = () => {
    onSelectInterest(vehicle, selectedColor);
    onClose();
  };

  const whatsappUrl = getVehicleWhatsAppUrl(
    `${vehicle.name} (${selectedColor} color)`
  );

  return (
    <>
      {/* --- MAIN VEHICLE DETAILS DIALOG (SCROLL IS ISOLATED TO THIS DIALOG ONLY) --- */}
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      >
        <div
          data-lenis-prevent
          className="relative w-full max-w-5xl bg-[#FFFDF7] dark:bg-slate-900 rounded-[2rem] border border-[#E8DFCF] dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Sticky Modal Top Bar with Brand & Gallery Button */}
          <div className="px-5 sm:px-6 py-4 border-b border-[#E8DFCF] dark:border-slate-800 flex items-center justify-between bg-[#F8F3E6]/90 dark:bg-slate-950/80 backdrop-blur-md flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isBike
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                }`}
              >
                {isBike ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white truncate">
                    {vehicle.name}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isBike
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {isBike ? 'Two Wheeler (Bike / Scooter)' : 'Four Wheeler (Car / SUV)'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {vehicle.brand} • {vehicle.subType} • Model Year {vehicle.year}
                </p>
              </div>
            </div>

            {/* Gallery Button & Close Trigger */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Photo Gallery Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setGalleryActiveIndex(0);
                  setIsGalleryOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all active:scale-95 btn-interactive"
                title="Open photo gallery"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">View Photo Gallery</span>
                <span className="text-[11px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  {galleryImages.length}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors focus-visible:outline-none"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Container (Isolated Scrollable Area) */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* === LEFT COLUMN: COLOR SELECTION ON TOP + DYNAMIC VEHICLE IMAGE + DETAILED SPECS === */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. COLOR OPTIONS ON TOP OF VEHICLE IMAGE */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-[#E8DFCF] dark:border-slate-800 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                      <span>Choose Color Variant:</span>
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/40">
                      Active: {selectedColor}
                    </span>
                  </div>

                  {/* Clickable Color Swatches */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {availableColors.map((col, idx) => {
                      const isSelected = selectedColor === col.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColor(col.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-105'
                              : 'bg-[#FAF6EC] dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: col.hex }}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white drop-shadow" />}
                          </span>
                          <span className="truncate max-w-[130px]">{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. DYNAMIC VEHICLE IMAGE DISPLAY (CHANGES ON COLOR SELECTION) */}
                <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-gradient-to-tr from-[#F4EEDF] to-[#FAF6EC] dark:from-slate-950 dark:to-slate-850 border border-[#E8DFCF] dark:border-slate-800 shadow-xl flex items-center justify-center p-4 group">
                  <img
                    key={currentVehicleImage}
                    src={currentVehicleImage}
                    alt={`${vehicle.name} in ${selectedColor}`}
                    className="w-full h-full object-contain filter drop-shadow-xl transition-all duration-300 animate-in fade-in"
                  />

                  {/* Top Left: SubType & Status Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-md shadow-sm">
                      {vehicle.subType}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                        vehicle.status === 'Available'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Bottom Right: Quick Photo Gallery Pill */}
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryActiveIndex(0);
                      setIsGalleryOpen(true);
                    }}
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-slate-900/85 hover:bg-blue-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Photos ({galleryImages.length})</span>
                  </button>

                  {/* Bottom Left: Selected Color Indicator Pill */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white backdrop-blur-md border border-[#E8DFCF] dark:border-slate-700 shadow-md flex items-center gap-1.5">
                      <span>Live Color:</span>
                      <strong className="text-blue-600 dark:text-blue-400">{selectedColor}</strong>
                    </span>
                  </div>
                </div>

                {/* 3. MEANINGFUL TECHNICAL SPECIFICATION CARDS */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span>Technical Specifications</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      OEM Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Gearbox / Transmission */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Gearbox</span>
                        <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Settings className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          {vehicle.transmission}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">Smooth shifting</span>
                      </div>
                    </div>

                    {/* Displacement / Engine CC */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Engine</span>
                        <div className="w-6 h-6 rounded-lg bg-orange-50 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                          <Gauge className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          {engineCc} CC
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">Power plant</span>
                      </div>
                    </div>

                    {/* Fuel & Mileage */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Efficiency</span>
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <Fuel className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block truncate">
                          {vehicle.fuel}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">~{mileage} km/l</span>
                      </div>
                    </div>

                    {/* Seating */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Cabin</span>
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          {vehicle.seats} {vehicle.seats === 1 ? 'Rider' : 'Persons'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">Comfort seats</span>
                      </div>
                    </div>

                    {/* Luggage Space */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Boot Space</span>
                        <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          {bootSpace} L
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {isBike ? 'Pannier ready' : 'Luggage trunk'}
                        </span>
                      </div>
                    </div>

                    {/* Climate / Comfort */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Comfort</span>
                        <div className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                          <Wind className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          {isBike ? 'Free Helmet' : 'Chilled AC'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">Included</span>
                      </div>
                    </div>

                    {/* Safety */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Safety</span>
                        <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          {isBike ? 'Disc ABS' : 'Dual Airbags'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">Verified security</span>
                      </div>
                    </div>

                    {/* Usage Allowance */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Daily Run</span>
                        <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          {vehicle.kmLimit} KM / Day
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">₹{vehicle.excessKmRate}/extra km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* === RIGHT COLUMN: KEY TARIFFS & ACTIONS === */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Tariff Card */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/20 space-y-4">
                  <div className="flex items-baseline justify-between border-b border-white/20 pb-3">
                    <div>
                      <span className="text-xs uppercase font-bold text-blue-200 tracking-wider block">
                        Rental Tariff
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="font-display font-black text-3xl sm:text-4xl text-white">
                          ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-blue-100 font-medium">/ 24 Hours</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-md text-white border border-white/30">
                      Standard
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15">
                      <span className="text-[10px] text-blue-200 uppercase font-bold block">7-Day Weekly Rate</span>
                      <span className="font-black text-sm text-white">₹{vehicle.pricePerWeek.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15">
                      <span className="text-[10px] text-blue-200 uppercase font-bold block">Security Deposit</span>
                      <span className="font-black text-sm text-white">₹{vehicle.deposit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-blue-100 flex items-center gap-1.5 pt-1">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Fuel not included. Deposit refunded on return.</span>
                  </div>
                </div>

                {/* Selected Color Confirmation Box */}
                <div className="p-4 rounded-2xl bg-[#FAF6EC] dark:bg-slate-950 border border-[#E8DFCF] dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Selected Variant Color:
                    </span>
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {selectedColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Applied to vehicle</span>
                  </div>
                </div>

                {/* Features & Inclusions List */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-950 border border-[#E8DFCF] dark:border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Included With Your Rental
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Original RC & Comprehensive Insurance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Sanitized & Cleaned Before Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>24/7 Roadside Assistance in Kakinada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Zero Advance Payment to Express Interest</span>
                    </div>
                    {vehicle.features && vehicle.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleInterestClick}
                    className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>I'm Interested in This Vehicle</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center shadow-md shadow-emerald-600/20"
                    >
                      <span>💬 WhatsApp Enquiry</span>
                    </a>

                    <a
                      href="tel:+918885757966"
                      className="py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center border border-slate-200 dark:border-slate-700"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                      <span>Call Support</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PHOTO GALLERY LIGHTBOX (WHEN USER CLICKS VIEW PHOTO GALLERY) --- */}
      {isGalleryOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-5xl h-[88vh] flex flex-col justify-between">
            {/* Gallery Lightbox Top Bar */}
            <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base sm:text-lg">
                  {vehicle.name} — Photo Gallery
                </h3>
                <span className="text-xs text-slate-400">
                  ({galleryActiveIndex + 1} of {galleryImages.length})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close photo gallery"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Active Photo with Prev/Next Controls */}
            <div className="relative flex-1 my-3 rounded-3xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
              <img
                src={galleryImages[galleryActiveIndex]}
                alt={`${vehicle.name} view ${galleryActiveIndex + 1}`}
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-all duration-300"
              />

              {/* Prev Button */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setGalleryActiveIndex((prev) =>
                      prev === 0 ? galleryImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl transition-transform active:scale-90"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setGalleryActiveIndex((prev) =>
                      prev === galleryImages.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl transition-transform active:scale-90"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails Strip */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setGalleryActiveIndex(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    galleryActiveIndex === idx
                      ? 'border-blue-500 scale-105 shadow-lg'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
