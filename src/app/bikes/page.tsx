'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Bike,
  Filter,
  Search,
  Calendar,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { VehicleCard } from '@/components/VehicleCard';
import { store } from '@/lib/store';
import { Vehicle } from '@/lib/types';
import { calculateRentalDuration } from '@/lib/pricing';

function BikesCatalogueContent() {
  const searchParams = useSearchParams();
  const pickupParam = searchParams.get('pickup') || '';
  const returnParam = searchParams.get('return') || '';
  const locationParam = searchParams.get('location') || 'Kakinada Hub (Main Road)';

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc'>('price_asc');

  useEffect(() => {
    const list = store.getVehicles({
      category: 'bike',
      pickupTime: pickupParam || undefined,
      returnTime: returnParam || undefined,
    });
    setVehicles(list);
  }, [pickupParam, returnParam]);

  const durationInfo = useMemo(() => {
    if (!pickupParam || !returnParam) return null;
    return calculateRentalDuration(pickupParam, returnParam);
  }, [pickupParam, returnParam]);

  // Client-side filtering & sorting
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (subCategoryFilter !== 'all' && v.subCategory !== subCategoryFilter) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const match =
            v.name.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.brand.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.dailyRate - b.dailyRate;
        return b.dailyRate - a.dailyRate;
      });
  }, [vehicles, subCategoryFilter, searchTerm, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSubCategoryFilter('all');
    setSortBy('price_asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Schedule Context Banner */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Bike className="w-4 h-4" />
              <span>Two-Wheeler Fleet</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Bikes & Scooters for Rent</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore Kakinada on Honda Activas, Royal Enfield cruisers, and Yamaha sport bikes. Complimentary sanitized helmet included.
            </p>
          </div>

          {/* Schedule Banner if dates are active */}
          {durationInfo && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-navy-900 border border-gold-500/30 text-xs">
              <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
              <div>
                <span className="text-slate-400">Rental Duration: </span>
                <span className="text-gold-400 font-bold">{durationInfo.formattedDuration}</span>
                <p className="text-[11px] text-slate-400">{locationParam}</p>
              </div>
            </div>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Activa, Classic 350, MT-15..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>

          {/* Sub-Category Filter */}
          <div className="lg:col-span-2">
            <select
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40 cursor-pointer"
            >
              <option value="all">All Styles (Scooters & Motorcycles)</option>
              <option value="Scooter">Scooters (Automatic)</option>
              <option value="Cruiser">Cruisers (Royal Enfield)</option>
              <option value="Roadster">Roadsters & Street</option>
              <option value="Sports / Naked">Sports Bikes</option>
            </select>
          </div>

          {/* Sort By Price */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-gold-400 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500/40 cursor-pointer"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-navy-900 border border-navy-800 rounded-3xl p-12 text-center space-y-4">
          <Bike className="w-12 h-12 mx-auto text-slate-400 opacity-40" />
          <h3 className="text-lg font-bold text-white">No bikes match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or vehicle type filter to view available bikes.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-bold hover:bg-gold-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((bike) => (
            <VehicleCard
              key={bike.id}
              vehicle={bike}
              pickupIso={pickupParam || undefined}
              returnIso={returnParam || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BikesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-sm">Loading bike catalogue...</div>}>
      <BikesCatalogueContent />
    </Suspense>
  );
}
