'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Gauge,
  Fuel,
  Settings2,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Vehicle } from '@/lib/types';
import { calculateRentalPrice, formatINR } from '@/lib/pricing';
import { VehicleWhatsAppEnquiryButton } from './WhatsAppButton';

export function VehicleCard({
  vehicle,
  pickupIso,
  returnIso,
}: {
  vehicle: Vehicle;
  pickupIso?: string;
  returnIso?: string;
}) {
  // If rental dates are specified, calculate estimated live cost
  const priceInfo =
    pickupIso && returnIso
      ? calculateRentalPrice(vehicle, pickupIso, returnIso)
      : null;

  const bookUrl =
    pickupIso && returnIso
      ? `/book/${vehicle.id}?pickup=${encodeURIComponent(pickupIso)}&return=${encodeURIComponent(returnIso)}`
      : `/book/${vehicle.id}`;

  const detailUrl =
    pickupIso && returnIso
      ? `/vehicles/${vehicle.id}?pickup=${encodeURIComponent(pickupIso)}&return=${encodeURIComponent(returnIso)}`
      : `/vehicles/${vehicle.id}`;

  return (
    <div className="group rounded-2xl bg-navy-900 border border-navy-800 hover:border-gold-500/40 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-500/5">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
        <Image
          src={vehicle.primaryImageUrl}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-black/20" />

        {/* Sub-Category Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-navy-950/90 backdrop-blur-md text-gold-400 border border-gold-500/30">
            {vehicle.subCategory}
          </span>
          {vehicle.category === 'bike' && (
            <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              Free Helmet
            </span>
          )}
        </div>

        {/* Brand Tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-black/60 backdrop-blur-md text-slate-300">
            {vehicle.brand}
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-lg text-white group-hover:text-gold-400 transition-colors line-clamp-1">
            {vehicle.name}
          </h3>
          <p className="text-xs text-slate-300 font-medium">{vehicle.model} • {vehicle.year}</p>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="p-4 bg-navy-900/90 border-b border-navy-800/80">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-lg bg-navy-950/70 border border-navy-800">
            <Settings2 className="w-4 h-4 mx-auto text-gold-400 mb-1" />
            <span className="block text-[11px] font-semibold text-white truncate">
              {vehicle.transmission}
            </span>
            <span className="block text-[9px] text-slate-400 uppercase">Gear</span>
          </div>

          <div className="p-2 rounded-lg bg-navy-950/70 border border-navy-800">
            <Fuel className="w-4 h-4 mx-auto text-gold-400 mb-1" />
            <span className="block text-[11px] font-semibold text-white truncate">
              {vehicle.fuelType}
            </span>
            <span className="block text-[9px] text-slate-400 uppercase">Fuel</span>
          </div>

          <div className="p-2 rounded-lg bg-navy-950/70 border border-navy-800">
            <Users className="w-4 h-4 mx-auto text-gold-400 mb-1" />
            <span className="block text-[11px] font-semibold text-white">
              {vehicle.seatingCapacity} {vehicle.seatingCapacity === 1 ? 'Seat' : 'Seats'}
            </span>
            <span className="block text-[9px] text-slate-400 uppercase">Seats</span>
          </div>

          <div className="p-2 rounded-lg bg-navy-950/70 border border-navy-800">
            <Gauge className="w-4 h-4 mx-auto text-gold-400 mb-1" />
            <span className="block text-[11px] font-semibold text-white truncate">
              {vehicle.mileageKmpl ? `${vehicle.mileageKmpl} km/l` : `${vehicle.engineCc} cc`}
            </span>
            <span className="block text-[9px] text-slate-400 uppercase">Mileage</span>
          </div>
        </div>

        {/* Km limit & deposit policy banner */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 bg-navy-950/40 px-2.5 py-1.5 rounded-lg border border-navy-800/60">
          <span>{vehicle.kmLimitPerDay} km/day (Excess ₹{vehicle.excessKmRate}/km)</span>
          <span className="text-gold-400/90 font-medium">Deposit: {formatINR(vehicle.depositAmount)}</span>
        </div>
      </div>

      {/* Price & Action Footer */}
      <div className="p-4 mt-auto space-y-3 bg-navy-900">
        <div className="flex items-baseline justify-between">
          <div>
            {priceInfo ? (
              <div>
                <span className="text-xl font-extrabold text-gold-400">
                  {formatINR(priceInfo.baseRentalCharge)}
                </span>
                <span className="text-xs text-slate-400 ml-1.5">
                  for {priceInfo.formattedDuration}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-black text-white">
                  {formatINR(vehicle.dailyRate)}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ day</span>
                <span className="text-[11px] text-slate-400 block">
                  or {formatINR(vehicle.hourlyRate)}/hr
                </span>
              </div>
            )}
          </div>

          <span className="text-[11px] font-medium text-slate-400 bg-navy-950 px-2 py-1 rounded border border-navy-800">
            Excludes Fuel
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={detailUrl}
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-center border border-navy-700 bg-navy-800/80 hover:bg-navy-800 text-slate-200 transition-colors flex items-center justify-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            Specs & Policy
          </Link>
          <Link
            href={bookUrl}
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-center bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 hover:from-gold-300 hover:to-gold-400 shadow-md shadow-gold-500/10 transition-all flex items-center justify-center gap-1 active:scale-98"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* WhatsApp Enquiry button */}
        <VehicleWhatsAppEnquiryButton
          vehicleName={vehicle.name}
          pickupDate={pickupIso ? new Date(pickupIso).toLocaleDateString('en-IN') : undefined}
          returnDate={returnIso ? new Date(returnIso).toLocaleDateString('en-IN') : undefined}
          className="w-full text-xs py-1.5"
        />
      </div>
    </div>
  );
}
