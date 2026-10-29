'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  Fuel,
  Settings2,
  Gauge,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { store } from '@/lib/store';
import { Vehicle } from '@/lib/types';
import {
  calculateRentalDuration,
  calculateRentalPrice,
  formatINR,
  MIN_RENTAL_HOURS,
} from '@/lib/pricing';
import { checkVehicleAvailability } from '@/lib/availability';
import { VehicleWhatsAppEnquiryButton } from '@/components/WhatsAppButton';
import { KAKINADA_LOCATIONS } from '@/components/SearchWidget';

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Initial date-times from search params or default tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  const yyyy2 = dayAfter.getFullYear();
  const mm2 = String(dayAfter.getMonth() + 1).padStart(2, '0');
  const dd2 = String(dayAfter.getDate()).padStart(2, '0');

  const paramPickup = searchParams.get('pickup');
  const paramReturn = searchParams.get('return');

  const [pickupDate, setPickupDate] = useState(
    paramPickup ? paramPickup.split('T')[0] : `${yyyy}-${mm}-${dd}`
  );
  const [pickupTime, setPickupTime] = useState(
    paramPickup ? paramPickup.split('T')[1]?.slice(0, 5) || '09:00' : '09:00'
  );
  const [returnDate, setReturnDate] = useState(
    paramReturn ? paramReturn.split('T')[0] : `${yyyy2}-${mm2}-${dd2}`
  );
  const [returnTime, setReturnTime] = useState(
    paramReturn ? paramReturn.split('T')[1]?.slice(0, 5) || '09:00' : '09:00'
  );
  const [location, setLocation] = useState(
    searchParams.get('location') || KAKINADA_LOCATIONS[0]
  );

  const [helmetCount, setHelmetCount] = useState(1);
  const [damageProtection, setDamageProtection] = useState(false);

  useEffect(() => {
    const v = store.getVehicleById(resolvedParams.id);
    if (v) {
      setVehicle(v);
    }
  }, [resolvedParams.id]);

  const pickupIso = `${pickupDate}T${pickupTime}:00`;
  const returnIso = `${returnDate}T${returnTime}:00`;

  // Duration & Validation
  const durationInfo = useMemo(() => {
    return calculateRentalDuration(pickupIso, returnIso);
  }, [pickupIso, returnIso]);

  // Availability Check
  const availabilityResult = useMemo(() => {
    if (!vehicle) return { isAvailable: false };
    const bookings = store.getBookings();
    const maintenance = store.getMaintenanceBlocks();
    return checkVehicleAvailability(vehicle, pickupIso, returnIso, bookings, maintenance);
  }, [vehicle, pickupIso, returnIso]);

  // Pricing calculation
  const priceInfo = useMemo(() => {
    if (!vehicle || durationInfo.totalHours <= 0) return null;
    return calculateRentalPrice(vehicle, pickupIso, returnIso, {
      helmetCount,
      damageProtection,
    });
  }, [vehicle, pickupIso, returnIso, helmetCount, damageProtection, durationInfo.totalHours]);

  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested vehicle may be unpublished or does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
      </div>
    );
  }

  const gallery = vehicle.galleryImages && vehicle.galleryImages.length > 0
    ? vehicle.galleryImages
    : [vehicle.primaryImageUrl];

  const handleProceedToBook = () => {
    if (!availabilityResult.isAvailable) return;
    const params = new URLSearchParams({
      pickup: pickupIso,
      return: returnIso,
      location,
      helmets: String(helmetCount),
      protection: String(damageProtection),
    });
    router.push(`/book/${vehicle.id}?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-gold-400">Home</Link>
        <span>/</span>
        <Link
          href={vehicle.category === 'bike' ? '/bikes' : '/cars'}
          className="hover:text-gold-400 capitalize"
        >
          {vehicle.category === 'bike' ? 'Bikes & Scooters' : 'Cars'}
        </Link>
        <span>/</span>
        <span className="text-white font-medium">{vehicle.name}</span>
      </nav>

      {/* Main Grid: Details Left, Booking Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Media, Specs, Features, Policies */}
        <div className="lg:col-span-7 space-y-8">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 shadow-2xl">
              <Image
                src={gallery[activeImageIndex] || vehicle.primaryImageUrl}
                alt={vehicle.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-navy-950/90 backdrop-blur-md text-gold-400 border border-gold-500/30">
                  {vehicle.subCategory}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                  Verified Fleet
                </span>
              </div>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {gallery.length > 1 && (
              <div className="flex gap-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-gold-500 shadow-md'
                        : 'border-navy-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {vehicle.name}
            </h1>
            <p className="text-sm font-semibold text-gold-400">
              {vehicle.brand} • {vehicle.model} • Model Year {vehicle.year}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              {vehicle.description}
            </p>
          </div>

          {/* Technical Specifications */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <Settings2 className="w-4 h-4 text-gold-400 mb-1" />
                <span className="text-slate-400 block">Transmission</span>
                <span className="font-bold text-white">{vehicle.transmission}</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <Fuel className="w-4 h-4 text-gold-400 mb-1" />
                <span className="text-slate-400 block">Fuel Type</span>
                <span className="font-bold text-white">{vehicle.fuelType}</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <Users className="w-4 h-4 text-gold-400 mb-1" />
                <span className="text-slate-400 block">Seating</span>
                <span className="font-bold text-white">{vehicle.seatingCapacity} Persons</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <Gauge className="w-4 h-4 text-gold-400 mb-1" />
                <span className="text-slate-400 block">Engine / Mileage</span>
                <span className="font-bold text-white">
                  {vehicle.mileageKmpl ? `${vehicle.mileageKmpl} km/l` : `${vehicle.engineCc} cc`}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Features */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Key Features & Inclusions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Policies & Eligibility */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-gold-400" />
              Rental Conditions & Guidelines
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Eligibility & Documents:</strong> Minimum age {vehicle.minAge} years. Original physical Driving License and Aadhaar Card are mandatory for vehicle release at Kakinada Hub.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Fuel className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Fuel Policy:</strong> Customer Fills. Provided with sufficient fuel to reach the nearest pump. No fuel reimbursement upon return.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Gauge className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Kilometre Allowance:</strong> {vehicle.kmLimitPerDay} km/day included. Excess usage billed at ₹{vehicle.excessKmRate}/km.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Security Deposit:</strong> {formatINR(vehicle.depositAmount)} refundable security deposit refunded via UPI within 24 hours of vehicle return.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Booking Widget (Royal Brothers style) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="glass-panel bg-navy-900/95 border border-navy-700 rounded-3xl p-6 shadow-2xl space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Rental Rates
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <span className="text-3xl font-black text-white">
                    {formatINR(vehicle.dailyRate)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ day</span>
                </div>
                <span className="text-xs text-gold-400 font-semibold">
                  or {formatINR(vehicle.hourlyRate)}/hr
                </span>
              </div>
            </div>

            {/* Schedule Selectors */}
            <div className="space-y-3 pt-2 border-t border-navy-800">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Pickup Hub in Kakinada</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                >
                  {KAKINADA_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-navy-950 text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Pickup Date & Time</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-xs text-white"
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-xs text-white mt-1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Return Date & Time</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-xs text-white"
                  />
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-xs text-white mt-1"
                  />
                </div>
              </div>

              {/* Duration pill */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Calculated Duration:</span>
                <span className="font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                  {durationInfo.formattedDuration}
                </span>
              </div>
            </div>

            {/* Add-ons Section */}
            <div className="space-y-3 pt-3 border-t border-navy-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Optional Add-Ons
              </h4>

              {vehicle.category === 'bike' && (
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-medium block">Helmets Required</span>
                    <span className="text-[11px] text-slate-400">1st helmet complimentary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHelmetCount(1)}
                      className={`px-2.5 py-1 rounded text-xs font-bold ${
                        helmetCount === 1 ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-slate-300'
                      }`}
                    >
                      1 (Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHelmetCount(2)}
                      className={`px-2.5 py-1 rounded text-xs font-bold ${
                        helmetCount === 2 ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-slate-300'
                      }`}
                    >
                      2 (+₹50/day)
                    </button>
                  </div>
                </div>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer text-xs pt-1">
                <input
                  type="checkbox"
                  checked={damageProtection}
                  onChange={(e) => setDamageProtection(e.target.checked)}
                  className="mt-0.5 rounded border-navy-700 text-gold-500 focus:ring-gold-500/30"
                />
                <div>
                  <span className="text-white font-medium block">
                    Zero-Liability Roadside Protection
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {vehicle.category === 'bike' ? '₹150/day' : '₹350/day'} — Caps accidental repair liability
                  </span>
                </div>
              </label>
            </div>

            {/* Price Breakdown */}
            {priceInfo && (
              <div className="space-y-2 pt-3 border-t border-navy-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Base Rental Charge ({durationInfo.formattedDuration})</span>
                  <span className="font-semibold text-white">
                    {formatINR(priceInfo.baseRentalCharge)}
                  </span>
                </div>
                {priceInfo.addonsTotal > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Add-ons (Helmets / Protection)</span>
                    <span className="font-semibold text-white">
                      {formatINR(priceInfo.addonsTotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Refundable Security Deposit</span>
                  <span className="font-semibold text-white">
                    {formatINR(priceInfo.refundableDeposit)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Total Included Kilometres</span>
                  <span>{priceInfo.kmAllowed} km</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-navy-700">
                  <span className="font-bold text-white text-sm">Total Estimated Payable</span>
                  <span className="font-black text-xl text-gold-400">
                    {formatINR(priceInfo.totalPayable)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 italic text-right">
                  Includes {formatINR(priceInfo.refundableDeposit)} refundable deposit
                </p>
              </div>
            )}

            {/* Availability Warning */}
            {!availabilityResult.isAvailable && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{availabilityResult.reason || 'Vehicle is not available for chosen dates.'}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleProceedToBook}
                disabled={!availabilityResult.isAvailable || durationInfo.totalHours <= 0}
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                  !availabilityResult.isAvailable || durationInfo.totalHours <= 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 hover:from-gold-300 hover:to-gold-400 shadow-gold-500/20 active:scale-98'
                }`}
              >
                <span>Proceed to Book</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <VehicleWhatsAppEnquiryButton
                vehicleName={vehicle.name}
                pickupDate={new Date(pickupIso).toLocaleDateString('en-IN')}
                returnDate={new Date(returnIso).toLocaleDateString('en-IN')}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
