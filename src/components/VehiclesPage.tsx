import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  RotateCcw,
  Sparkles,
  Car,
  Bike,
  Fuel,
  Settings,
  Users,
  Shield,
  FilterX,
  SlidersHorizontal,
  ChevronDown,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Info
} from 'lucide-react';
import { Vehicle } from '@/types';
import { BookingSearchParams } from './Hero';
import { getGeneralSupportWhatsAppUrl } from '@/lib/whatsapp';
import { resolvePrimaryVehicleImage } from '@/lib/vehicleMedia';

interface VehiclesPageProps {
  vehicles: Vehicle[];
  onBackToHome: () => void;
  onOpen360?: (vehicle: Vehicle) => void;
  onOpenDetails?: (vehicle: Vehicle) => void;
  onSelectInterest: (vehicle: Vehicle) => void;
  lastSearchParams?: BookingSearchParams | null;
  darkMode?: boolean;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({
  vehicles,
  onBackToHome,
  onOpen360,
  onOpenDetails,
  onSelectInterest,
  lastSearchParams,
  darkMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'car' | 'bike'>('all');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [selectedSeats, setSelectedSeats] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'power'>('recommended');

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = v.name.toLowerCase().includes(q);
          const matchBrand = v.brand.toLowerCase().includes(q);
          const matchModel = v.model.toLowerCase().includes(q);
          const matchSub = v.subType.toLowerCase().includes(q);
          const matchFuel = v.fuel.toLowerCase().includes(q);
          const matchTrans = v.transmission.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchModel && !matchSub && !matchFuel && !matchTrans) {
            return false;
          }
        }

        // Type filter
        if (selectedType !== 'all' && v.type !== selectedType) {
          return false;
        }

        // Transmission
        if (selectedTransmission !== 'all' && v.transmission !== selectedTransmission) {
          return false;
        }

        // Fuel
        if (selectedFuel !== 'all' && v.fuel !== selectedFuel) {
          return false;
        }

        // Seats
        if (selectedSeats !== 'all' && String(v.seats) !== selectedSeats) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
        if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
        if (sortBy === 'power') {
          const powerA = a.specs?.engineCc || 0;
          const powerB = b.specs?.engineCc || 0;
          return powerB - powerA;
        }
        return 0; // recommended
      });
  }, [vehicles, searchTerm, selectedType, selectedTransmission, selectedFuel, selectedSeats, sortBy]);

  const carCount = useMemo(() => vehicles.filter((v) => v.type === 'car').length, [vehicles]);
  const bikeCount = useMemo(() => vehicles.filter((v) => v.type === 'bike').length, [vehicles]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedTransmission('all');
    setSelectedFuel('all');
    setSelectedSeats('all');
    setSortBy('recommended');
  };

  const whatsappUrl = getGeneralSupportWhatsAppUrl();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-200">
      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-40 bg-[#FAF6EC]/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-[#E8DFCF] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Back to Home Button */}
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Back to Home</span>
          </button>

          {/* Wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              AT
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                Amma<span className="text-blue-600 dark:text-blue-400">Travels</span><span className="text-blue-600 dark:text-blue-400 lowercase font-extrabold text-xs sm:text-sm">kkd</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Complete Inventory ({vehicles.length} Vehicles)
              </span>
            </div>
          </div>

          {/* Direct Support CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Kakinada Desk</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Banner Title */}
        <div className="text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>Verified Fleet & High-Definition Showcase</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Complete Vehicles List
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Browse our full garage of self-drive hatchbacks, executive sedans, 4x4 off-road SUVs, and adventure touring motorcycles in Kakinada. Inspect detailed specifications, choose custom colors, and click <strong>"I'm Interested"</strong> to register your booking without upfront advance.
          </p>

          {/* Selected trip dates banner if passed from hero search */}
          {lastSearchParams && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-700 dark:text-orange-300 text-xs font-semibold mt-2">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>
                Preferred Dates: <strong>{lastSearchParams.pickupDate}</strong> to <strong>{lastSearchParams.returnDate}</strong> at <strong>{lastSearchParams.pickupLocation}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Live Search and Multi-Filter Controls */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 shadow-xl space-y-5">
          {/* Top Search Bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by vehicle name, brand, model, transmission, or fuel (e.g. Fortuner, Swift, Diesel, Automatic)..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Pills & Dropdown Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Type Switcher Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedType === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({vehicles.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('car')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  selectedType === 'car'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Cars ({carCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('bike')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  selectedType === 'bike'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Bikes ({bikeCount})</span>
              </button>
            </div>

            {/* Dropdown Filters (Transmission, Fuel, Sort) */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Transmission */}
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>

              {/* Fuel */}
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="power">Engine Power / CC</option>
              </select>

              {/* Reset button if active filter */}
              {(searchTerm || selectedType !== 'all' || selectedTransmission !== 'all' || selectedFuel !== 'all' || sortBy !== 'recommended') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
          <span>Showing <strong>{filteredVehicles.length}</strong> vehicles matching your criteria</span>
          <span>Transparent 24hr tariffs • 100% verified RC</span>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              No vehicles matched your search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try adjusting your search keywords, clearing transmission/fuel filters, or view all fleet.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group rounded-3xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image and Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950/5 dark:bg-slate-950">
                  <img
                    src={resolvePrimaryVehicleImage(vehicle)}
                    alt={vehicle.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-white text-[11px] font-bold backdrop-blur-md shadow-sm ${
                      vehicle.type === 'bike'
                        ? 'bg-amber-600/90 border border-amber-400/40'
                        : 'bg-blue-600/90 border border-blue-400/40'
                    }`}>
                      {vehicle.type === 'bike' ? '🏍️ Two Wheeler' : '🚗 Four Wheeler'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-white text-[11px] font-bold backdrop-blur-md border border-white/20">
                      {vehicle.subType}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      vehicle.status === 'Available'
                        ? 'bg-emerald-500 text-white'
                        : vehicle.status === 'Booked'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {vehicle.brand} • {vehicle.year}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 my-4 text-[11px] text-slate-700 dark:text-slate-300">
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

                  {/* Pricing and Action CTAs */}
                  <div className="pt-3 border-t border-[#E8DFCF] dark:border-slate-800">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                          ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"> / 24 hrs</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {vehicle.kmLimit} km free run
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Show Details Trigger */}
                      <button
                        type="button"
                        onClick={() => onOpenDetails ? onOpenDetails(vehicle) : onOpen360?.(vehicle)}
                        className="w-full py-2.5 px-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 btn-interactive"
                      >
                        <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Show Details</span>
                      </button>

                      {/* I'm Interested Trigger */}
                      <button
                        type="button"
                        onClick={() => onSelectInterest(vehicle)}
                        disabled={vehicle.status === 'Maintenance'}
                        className="w-full py-2.5 px-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 btn-interactive"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>I'm Interested</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
