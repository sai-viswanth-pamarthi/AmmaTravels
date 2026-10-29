import React, { useState, useMemo } from 'react';
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
  FilterX
} from 'lucide-react';
import { Vehicle } from '@/types';
import { getVehicleWhatsAppUrl } from '@/lib/whatsapp';

interface VehicleCatalogueProps {
  vehicles: Vehicle[];
  onOpen360: (vehicle: Vehicle) => void;
  onSelectInterest: (vehicle: Vehicle) => void;
}

export const VehicleCatalogue: React.FC<VehicleCatalogueProps> = ({
  vehicles,
  onOpen360,
  onSelectInterest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'car' | 'bike'>('all');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [selectedSeats, setSelectedSeats] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'default' | 'low-to-high' | 'high-to-low'>('default');

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
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

        // Transmission
        if (selectedTransmission !== 'all' && v.transmission !== selectedTransmission) return false;

        // Fuel
        if (selectedFuel !== 'all' && v.fuel !== selectedFuel) return false;

        // Seats
        if (selectedSeats !== 'all' && String(v.seats) !== selectedSeats) return false;

        return true;
      })
      .sort((a, b) => {
        if (priceSort === 'low-to-high') return a.pricePerDay - b.pricePerDay;
        if (priceSort === 'high-to-low') return b.pricePerDay - a.pricePerDay;
        return 0;
      });
  }, [vehicles, searchTerm, selectedType, selectedTransmission, selectedFuel, selectedSeats, priceSort]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedTransmission('all');
    setSelectedFuel('all');
    setSelectedSeats('all');
    setPriceSort('default');
  };

  return (
    <section id="vehicles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/40 px-3.5 py-1.5 rounded-full border border-saffron-200 dark:border-saffron-800">
          Amma Travels Fleet
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-charcoal-900 dark:text-warm-50 tracking-tight mt-3">
          Self-Drive Cars & Adventure Bikes
        </h2>
        <p className="mt-3 text-base text-charcoal-600 dark:text-warm-200/80">
          100% verified ownership, sanitized before every delivery, with comprehensive insurance and 360° virtual view.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-charcoal-900 rounded-2xl p-4 sm:p-6 border border-warm-200 dark:border-charcoal-800 shadow-sm mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand, car model (e.g. Swift, Fortuner, Royal Enfield)..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Vehicle Type Tabs (3 cols) */}
          <div className="md:col-span-3 flex bg-warm-100 dark:bg-charcoal-800 p-1 rounded-xl">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-charcoal-900 text-teal-950 dark:text-saffron-400 shadow-sm'
                  : 'text-charcoal-600 dark:text-warm-300'
              }`}
            >
              All ({vehicles.length})
            </button>
            <button
              onClick={() => setSelectedType('car')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                selectedType === 'car'
                  ? 'bg-white dark:bg-charcoal-900 text-teal-950 dark:text-saffron-400 shadow-sm'
                  : 'text-charcoal-600 dark:text-warm-300'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              Cars
            </button>
            <button
              onClick={() => setSelectedType('bike')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                selectedType === 'bike'
                  ? 'bg-white dark:bg-charcoal-900 text-teal-950 dark:text-saffron-400 shadow-sm'
                  : 'text-charcoal-600 dark:text-warm-300'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Bikes
            </button>
          </div>

          {/* Additional Quick Dropdowns (4 cols) */}
          <div className="md:col-span-4 grid grid-cols-3 gap-2">
            {/* Transmission */}
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="py-2 px-2.5 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none"
              aria-label="Filter by transmission"
            >
              <option value="all">Gear: All</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>

            {/* Fuel */}
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="py-2 px-2.5 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none"
              aria-label="Filter by fuel"
            >
              <option value="all">Fuel: All</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>

            {/* Price Sort */}
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="py-2 px-2.5 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none"
              aria-label="Sort by price"
            >
              <option value="default">Sort: Default</option>
              <option value="low-to-high">₹ Low to High</option>
              <option value="high-to-low">₹ High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter count & reset */}
        {(searchTerm || selectedType !== 'all' || selectedTransmission !== 'all' || selectedFuel !== 'all' || priceSort !== 'default') && (
          <div className="mt-3 pt-3 border-t border-warm-200 dark:border-charcoal-800 flex items-center justify-between text-xs text-charcoal-600 dark:text-warm-300">
            <span>Showing {filteredVehicles.length} of {vehicles.length} vehicles</span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-saffron-600 dark:text-saffron-400 font-semibold hover:underline"
            >
              <FilterX className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-charcoal-900 rounded-3xl border border-dashed border-warm-300 dark:border-charcoal-800">
          <p className="text-base text-charcoal-600 dark:text-warm-300 font-medium">
            No vehicles match your active search or filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-semibold text-xs rounded-xl transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => {
            const whatsappUrl = getVehicleWhatsAppUrl(vehicle.name);

            return (
              <div
                key={vehicle.id}
                className="group relative bg-white dark:bg-charcoal-900 rounded-2xl border border-warm-200 dark:border-charcoal-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-700/60 dark:hover:border-saffron-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Badges */}
                <div className="relative h-48 bg-gradient-to-tr from-warm-100 to-warm-50 dark:from-charcoal-950 dark:to-charcoal-800 overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={vehicle.primaryImage}
                    alt={vehicle.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-md"
                    loading="lazy"
                  />

                  {/* Top Left: Subtype Tag */}
                  <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-charcoal-950/75 text-warm-100 backdrop-blur-sm">
                    {vehicle.subType}
                  </span>

                  {/* Top Right: Status Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md ${
                      vehicle.status === 'Available'
                        ? 'bg-emerald-500/90 text-white'
                        : vehicle.status === 'Booked'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    {vehicle.status}
                  </span>

                  {/* 360° Studio Quick Trigger Pill */}
                  <button
                    onClick={() => onOpen360(vehicle)}
                    className="absolute bottom-3 right-3 px-2.5 py-1 bg-teal-950/85 hover:bg-teal-900 text-saffron-400 text-xs font-semibold rounded-lg border border-saffron-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                    title="Open 360 interactive rotation"
                  >
                    <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>360° View</span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-charcoal-900 dark:text-warm-50 group-hover:text-teal-900 dark:group-hover:text-saffron-400 transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-charcoal-500 dark:text-warm-400">
                      {vehicle.brand} • {vehicle.year}
                    </p>

                    {/* Key Specs Pills */}
                    <div className="grid grid-cols-3 gap-2 my-4 text-[11px] text-charcoal-600 dark:text-warm-300">
                      <div className="flex items-center gap-1 bg-warm-100/70 dark:bg-charcoal-800 p-1.5 rounded-lg">
                        <Settings className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                        <span className="truncate">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-warm-100/70 dark:bg-charcoal-800 p-1.5 rounded-lg">
                        <Fuel className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                        <span className="truncate">{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-warm-100/70 dark:bg-charcoal-800 p-1.5 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                        <span>{vehicle.seats} Seats</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-3 border-t border-warm-200 dark:border-charcoal-800">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-xl font-extrabold text-charcoal-900 dark:text-warm-50 font-display">
                          ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-charcoal-500 dark:text-warm-400"> / 24 hrs</span>
                      </div>
                      <span className="text-[11px] text-charcoal-500 dark:text-warm-400">
                        {vehicle.kmLimit} km included
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* 360 Viewer trigger */}
                      <button
                        onClick={() => onOpen360(vehicle)}
                        className="w-full py-2 px-2 text-xs font-semibold rounded-xl bg-warm-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-charcoal-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-teal-700 dark:text-saffron-400" />
                        <span>Inspect 360°</span>
                      </button>

                      {/* Interest form trigger */}
                      <button
                        onClick={() => onSelectInterest(vehicle)}
                        disabled={vehicle.status === 'Maintenance'}
                        className="w-full py-2 px-2 text-xs font-bold rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>I'm Interested</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
