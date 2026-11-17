import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Bike,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Fuel,
  Settings,
  Users,
  Shield,
  PhoneCall,
  Sparkles,
  ChevronRight,
  FilterX,
  X,
  ArrowRight,
  Info
} from 'lucide-react';
import { Vehicle } from '@/types';
import { getVehicleWhatsAppUrl } from '@/lib/whatsapp';
import { resolvePrimaryVehicleImage } from '@/lib/vehicleMedia';

interface VehicleCatalogueProps {
  vehicles: Vehicle[];
  onOpen360?: (vehicle: Vehicle) => void;
  onOpenDetails?: (vehicle: Vehicle) => void;
  onSelectInterest: (vehicle: Vehicle) => void;
  onViewAllVehicles?: () => void;
  externalFilterCategory?: string | null;
  activePromoCode?: string | null;
  isLoading?: boolean;
}

export const VehicleSkeletonCard: React.FC = () => (
  <div className="bg-[#FFFDF7] dark:bg-slate-900 rounded-3xl border border-[#E8DFCF] dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
    <div className="h-52 skeleton-shimmer w-full relative" />
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <div className="h-5 w-3/4 skeleton-shimmer rounded-lg" />
        <div className="h-3.5 w-1/2 skeleton-shimmer rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-8 skeleton-shimmer rounded-xl" />
        <div className="h-8 skeleton-shimmer rounded-xl" />
        <div className="h-8 skeleton-shimmer rounded-xl" />
      </div>
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="h-6 w-24 skeleton-shimmer rounded-lg" />
        <div className="h-4 w-16 skeleton-shimmer rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="h-9 skeleton-shimmer rounded-full" />
        <div className="h-9 skeleton-shimmer rounded-full" />
      </div>
    </div>
  </div>
);

export const VehicleCatalogue: React.FC<VehicleCatalogueProps> = ({
  vehicles,
  onOpen360,
  onOpenDetails,
  onSelectInterest,
  onViewAllVehicles,
  externalFilterCategory,
  activePromoCode,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'car' | 'bike'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // React to external trip category selections
  useEffect(() => {
    if (externalFilterCategory) {
      if (externalFilterCategory === 'suv') {
        setSelectedType('car');
        setSearchTerm('SUV');
      } else if (externalFilterCategory === 'family') {
        setSelectedType('car');
        setSearchTerm('7');
      } else if (externalFilterCategory === 'compact') {
        setSelectedType('all');
        setSearchTerm('Compact');
      } else if (externalFilterCategory === 'roadtrip') {
        setSelectedType('all');
        setSearchTerm('');
      } else if (externalFilterCategory === 'business') {
        setSelectedType('car');
        setSearchTerm('Sedan');
      }
    }
  }, [externalFilterCategory]);

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchBrand = v.brand.toLowerCase().includes(q);
        const matchModel = v.model.toLowerCase().includes(q);
        const matchSubType = v.subType.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchModel && !matchSubType) return false;
      }

      // Type
      if (selectedType !== 'all' && v.type !== selectedType) return false;

      return true;
    });
  }, [vehicles, searchTerm, selectedType]);

  const carCount = useMemo(() => vehicles.filter((v) => v.type === 'car').length, [vehicles]);
  const bikeCount = useMemo(() => vehicles.filter((v) => v.type === 'bike').length, [vehicles]);

  const handleTabSwitch = (type: 'all' | 'car' | 'bike') => {
    setSelectedType(type);
    const gridEl = document.getElementById('vehicles-grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setIsSearchOpen(false);
  };

  // Display 15 vehicles on the home page showcase
  const displayedVehicles = useMemo(() => {
    return filteredVehicles.slice(0, 15);
  }, [filteredVehicles]);

  return (
    <section id="vehicles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            KM 12.4 // The Showroom Paddock
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-900">
            Amma Travels Fleet
          </span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
          Self-Drive <span className="text-blue-600 dark:text-blue-400 hand-drawn-underline">Cars</span> & Adventure Bikes
        </h2>

        <div className="mt-2 text-center font-hand text-xl text-blue-500 font-bold -rotate-1">
          <span>✓ Verified Fleet • Custom Colors & Full Technical Specs • Click "I'm Interested" ⤵</span>
        </div>

        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
          Browse verified cars and bikes in Kakinada, inspect detailed photo galleries, choose custom color variants, and express your interest with zero upfront advance.
        </p>
      </div>

      {/* Sticky Two-Section Switching Tabs (Car to Bike) on Scroll */}
      {/* Sticky Two-Section Switching Tabs (Car to Bike) on Scroll with Search Icon beside Car */}
      <div className="sticky top-20 z-30 mb-8 py-2">
        <div className="max-w-2xl mx-auto p-1.5 sm:p-2 rounded-full bg-[#FFFDF7]/95 dark:bg-slate-900/95 backdrop-blur-xl border border-[#E8DFCF] dark:border-slate-800 soft-card-shadow flex items-center justify-between gap-1 shadow-lg">
          {/* Search Icon Button beside the Car */}
          <button
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              if (!isSearchOpen) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }
            }}
            className={`p-2.5 sm:p-3 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 relative flex-shrink-0 ${
              isSearchOpen || searchTerm
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isSearchOpen ? 'Close search' : 'Search vehicles'}
            aria-label="Search vehicles"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {searchTerm && !isSearchOpen && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Cars Fleet Tab */}
          <button
            onClick={() => handleTabSwitch('car')}
            className={`relative flex-1 py-3 px-3 sm:px-6 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selectedType === 'car'
                ? 'text-white font-extrabold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {selectedType === 'car' && (
              <motion.div
                layoutId="activeFleetTabPill"
                className="absolute inset-0 rounded-full bg-blue-600 shadow-md shadow-blue-600/30 -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <Car className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedType === 'car' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
            <span className="tracking-tight">Cars Fleet</span>
            <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold ${
              selectedType === 'car' ? 'bg-white/20 text-white' : 'bg-amber-100/60 dark:bg-slate-800 text-stone-700 dark:text-slate-300'
            }`}>
              {carCount}
            </span>
          </button>

          {/* Bikes & Scooters Tab */}
          <button
            onClick={() => handleTabSwitch('bike')}
            className={`relative flex-1 py-3 px-3 sm:px-6 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selectedType === 'bike'
                ? 'text-white font-extrabold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {selectedType === 'bike' && (
              <motion.div
                layoutId="activeFleetTabPill"
                className="absolute inset-0 rounded-full bg-blue-600 shadow-md shadow-blue-600/30 -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <Bike className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedType === 'bike' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
            <span className="tracking-tight">Bikes & Scooters</span>
            <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold ${
              selectedType === 'bike' ? 'bg-white/20 text-white' : 'bg-amber-100/60 dark:bg-slate-800 text-stone-700 dark:text-slate-300'
            }`}>
              {bikeCount}
            </span>
          </button>

          {/* All Fleet Toggle */}
          <button
            onClick={() => handleTabSwitch('all')}
            className={`relative px-3 sm:px-4 py-3 rounded-full text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selectedType === 'all'
                ? 'text-white font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {selectedType === 'all' && (
              <motion.div
                layoutId="activeFleetTabPill"
                className="absolute inset-0 rounded-full bg-slate-800 dark:bg-slate-700 -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span>All ({vehicles.length})</span>
          </button>
        </div>

        {/* Expandable Search Input when search icon is clicked */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-w-md mx-auto mt-2.5 p-1.5 sm:p-2 rounded-full bg-[#FFFDF7]/95 dark:bg-slate-900/95 backdrop-blur-xl border border-[#E8DFCF] dark:border-slate-800 shadow-xl flex items-center gap-2"
            >
              <div className="pl-3 text-blue-600 dark:text-blue-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Swift, BMW, Thar, Himalayan, Activa..."
                className="flex-1 bg-transparent py-1 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus-visible:outline-none"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-none"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active search filter badge if search is closed but active */}
        {!isSearchOpen && searchTerm && (
          <div className="flex items-center justify-center mt-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300 shadow-sm">
              <Search className="w-3 h-3" />
              <span>Search: "<strong>{searchTerm}</strong>"</span>
              <button
                onClick={() => setSearchTerm('')}
                className="p-0.5 hover:text-blue-950 dark:hover:text-white"
                title="Clear filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Grid Anchor and Dynamic Category Header */}
      <div id="vehicles-grid" className="scroll-mt-36">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">
              {selectedType === 'car' ? '🚗' : selectedType === 'bike' ? '🏍️' : '✨'}
            </span>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {selectedType === 'car'
                  ? `Self-Drive Cars (${filteredVehicles.length} Models)`
                  : selectedType === 'bike'
                  ? `Adventure Bikes & Scooters (${filteredVehicles.length} Models)`
                  : `Complete Amma Travels Fleet (${filteredVehicles.length} Models)`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedType === 'car'
                  ? 'Hatchbacks, Sedans, 4x4 SUVs & 7-Seater MPVs • Unlimited AC'
                  : selectedType === 'bike'
                  ? 'Royal Enfield Classic, Hunter, Himalayan 450, Jawa & Scooters • Helmets Included'
                  : 'Browse all available self-drive cars, motorbikes, and scooters in Kakinada'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handleTabSwitch('car')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                selectedType === 'car'
                  ? 'bg-blue-600 text-white border-blue-600 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500'
              }`}
            >
              🚗 Cars ({carCount})
            </button>
            <button
              onClick={() => handleTabSwitch('bike')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                selectedType === 'bike'
                  ? 'bg-blue-600 text-white border-blue-600 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500'
              }`}
            >
              🏍️ Bikes ({bikeCount})
            </button>
          </div>
        </div>

        {/* Loading Skeleton View */}
        {isLoading ? (
          <VehicleSkeletonCard />
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFDF7] dark:bg-slate-900 rounded-3xl border border-dashed border-[#E8DFCF] dark:border-slate-800">
            <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
              No vehicles match your active search or filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full transition-all btn-interactive"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedVehicles.map((vehicle, index) => {
              return (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
                  className="group relative bg-[#FFFDF7] dark:bg-slate-900 rounded-3xl border border-[#E8DFCF] dark:border-slate-800 overflow-hidden card-interactive flex flex-col justify-between"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-52 bg-gradient-to-tr from-[#F4EEDF] to-[#FAF6EC] dark:from-slate-950 dark:to-slate-850 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={resolvePrimaryVehicleImage(vehicle)}
                      alt={vehicle.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-md"
                      loading="lazy"
                    />

                    {/* Top Left: Category & Subtype Tag */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white backdrop-blur-md shadow-sm ${
                        vehicle.type === 'bike'
                          ? 'bg-amber-600/90 border border-amber-400/40'
                          : 'bg-blue-600/90 border border-blue-400/40'
                      }`}>
                        {vehicle.type === 'bike' ? '🏍️ Two Wheeler' : '🚗 Four Wheeler'}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                        {vehicle.subType}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-stone-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {vehicle.name}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-slate-400">
                        {vehicle.brand} • {vehicle.year}
                      </p>

                      {/* Key Specs Pills */}
                      <div className="grid grid-cols-3 gap-2 my-4 text-[11px] text-stone-700 dark:text-slate-300">
                        <div className="flex items-center gap-1 bg-[#F4EEDF]/80 dark:bg-slate-800/80 p-2 rounded-xl">
                          <Settings className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span className="truncate">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#F4EEDF]/80 dark:bg-slate-800/80 p-2 rounded-xl">
                          <Fuel className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span className="truncate">{vehicle.fuel}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#F4EEDF]/80 dark:bg-slate-800/80 p-2 rounded-xl">
                          <Users className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{vehicle.seats} Seats</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Action Buttons */}
                    <div className="pt-3 border-t border-[#E8DFCF] dark:border-slate-800">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          {activePromoCode ? (
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                                  ₹{Math.round(vehicle.pricePerDay * 0.85).toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs text-slate-400 line-through">
                                  ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                <span>15% OFF ({activePromoCode})</span>
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                                ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"> / 24 hrs</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {vehicle.kmLimit} km included
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Show Details trigger */}
                        <button
                          type="button"
                          onClick={() => onOpenDetails ? onOpenDetails(vehicle) : onOpen360?.(vehicle)}
                          className="w-full py-2.5 px-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 btn-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Show Details</span>
                        </button>

                        {/* Interest form trigger */}
                        <button
                          type="button"
                          onClick={() => onSelectInterest(vehicle)}
                          disabled={vehicle.status === 'Maintenance'}
                          className="w-full py-2.5 px-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 active:scale-98 btn-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>I'm Interested</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Show More Vehicles Button - Navigates to full page */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col items-center gap-3 p-6 sm:p-8 rounded-3xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 shadow-xl max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Looking for More Vehicles?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                Showing 15 featured cars and bikes. Click below to explore our entire fleet inventory ({vehicles.length} vehicles) on a dedicated page with full multi-filters.
              </p>
            </div>
            <button
              type="button"
              onClick={onViewAllVehicles}
              className="mt-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all active:scale-95 btn-interactive cursor-pointer"
            >
              <span>Show More Vehicles ({vehicles.length} Available)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
