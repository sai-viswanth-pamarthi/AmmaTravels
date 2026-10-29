'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Shield,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Phone,
  Check,
} from 'lucide-react';
import { store } from '@/lib/store';
import { Vehicle, UserProfile, PriceCalculation } from '@/lib/types';
import {
  calculateRentalDuration,
  calculateRentalPrice,
  formatINR,
  MIN_RENTAL_HOURS,
} from '@/lib/pricing';
import { checkVehicleAvailability } from '@/lib/availability';
import { DocumentUploader } from '@/components/DocumentUploader';
import { BookingWhatsAppSupportButton } from '@/components/WhatsAppButton';
import { KAKINADA_LOCATIONS } from '@/components/SearchWidget';

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(1);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => store.getCurrentUser());

  // Dates
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
  const [pickupLocation, setPickupLocation] = useState(
    searchParams.get('location') || KAKINADA_LOCATIONS[0]
  );
  const [returnLocation, setReturnLocation] = useState(
    searchParams.get('location') || KAKINADA_LOCATIONS[0]
  );

  // Add-ons
  const [helmetCount, setHelmetCount] = useState<number>(
    searchParams.get('helmets') ? parseInt(searchParams.get('helmets')!) : 1
  );
  const [damageProtection, setDamageProtection] = useState<boolean>(
    searchParams.get('protection') === 'true'
  );
  const [customerNotes, setCustomerNotes] = useState('');

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');

  // Agreement
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [createdBookingRef, setCreatedBookingRef] = useState<string | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const v = store.getVehicleById(resolvedParams.id);
    if (v) setVehicle(v);
  }, [resolvedParams.id]);

  const pickupIso = `${pickupDate}T${pickupTime}:00`;
  const returnIso = `${returnDate}T${returnTime}:00`;

  // Duration
  const durationInfo = useMemo(() => {
    return calculateRentalDuration(pickupIso, returnIso);
  }, [pickupIso, returnIso]);

  // Availability
  const availabilityResult = useMemo(() => {
    if (!vehicle) return { isAvailable: false };
    const bookings = store.getBookings();
    const maintenance = store.getMaintenanceBlocks();
    return checkVehicleAvailability(vehicle, pickupIso, returnIso, bookings, maintenance);
  }, [vehicle, pickupIso, returnIso]);

  // Price
  const priceInfo: PriceCalculation | null = useMemo(() => {
    if (!vehicle || durationInfo.totalHours <= 0) return null;
    return calculateRentalPrice(vehicle, pickupIso, returnIso, {
      helmetCount,
      damageProtection,
    });
  }, [vehicle, pickupIso, returnIso, helmetCount, damageProtection, durationInfo.totalHours]);

  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading vehicle details...
      </div>
    );
  }

  // Handle Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setSubmissionError('Please accept the rental terms and conditions before submitting.');
      return;
    }

    if (!customerPhone || customerPhone.length < 10) {
      setSubmissionError('Please enter a valid 10-digit phone number for booking coordination.');
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);

    const result = store.createBooking({
      vehicleId: vehicle.id,
      pickupTime: pickupIso,
      returnTime: returnIso,
      pickupLocation,
      returnLocation,
      helmetCount,
      damageProtection,
      customerNotes,
      customer: {
        id: currentUser.id,
        fullName: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    });

    setSubmitting(false);

    if (!result.success || !result.booking) {
      setSubmissionError(result.error || 'Failed to submit booking.');
      return;
    }

    setCreatedBookingRef(result.booking.bookingRef);
    setCreatedBookingId(result.booking.id);
    setStep(5); // Success state
  };

  // SUCCESS CONFIRMATION STATE (Step 5)
  if (step === 5 && createdBookingRef) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-navy-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Request Successfully Received
            </span>
            <h1 className="text-3xl font-extrabold text-white">
              Booking Ref: <span className="text-gold-400 font-mono">{createdBookingRef}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Your rental request has been submitted with an initial <span className="font-semibold text-amber-400">Pending Review</span> status. Our Kakinada hub team is reviewing your vehicle schedule and documents.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-navy-950/80 rounded-2xl p-5 border border-navy-800 text-left text-xs space-y-2.5 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Vehicle:</span>
              <span className="font-bold text-white">{vehicle.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span className="font-semibold text-gold-400">{durationInfo.formattedDuration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pickup Hub:</span>
              <span className="text-slate-200">{pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Total:</span>
              <span className="font-bold text-white">{priceInfo ? formatINR(priceInfo.totalPayable) : ''}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-gold-500 text-navy-950 hover:bg-gold-400 transition-all"
            >
              Track in My Bookings
            </Link>

            <BookingWhatsAppSupportButton
              bookingRef={createdBookingRef}
              vehicleName={vehicle.name}
              className="w-full sm:w-auto text-xs py-3"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Step Header Indicator */}
      <div className="space-y-4">
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {vehicle.name}</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Reserve Your {vehicle.category === 'bike' ? 'Bike' : 'Car'}
            </h1>
            <p className="text-xs text-slate-400">
              {vehicle.name} • {vehicle.brand} ({vehicle.subCategory})
            </p>
          </div>

          {/* 4-Step Badge */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-gold-500 text-navy-950 ring-4 ring-gold-500/20'
                    : step > s
                    ? 'bg-emerald-500 text-navy-950'
                    : 'bg-navy-900 text-slate-400 border border-navy-800'
                }`}
              >
                {step > s ? <Check className="w-4 h-4 stroke-[3]" /> : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {submissionError && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{submissionError}</span>
        </div>
      )}

      {/* Main Form & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Steps (7 Cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* STEP 1: Rental Schedule & Hub */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-navy-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold-400" />
                  Step 1: Confirm Rental Schedule & Location
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust your trip dates and pick-up depot in Kakinada.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Pickup Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    {KAKINADA_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-navy-950 text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Pickup Date & Time</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                    />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white mt-1.5"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Return Date & Time</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                    />
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white mt-1.5"
                    />
                  </div>
                </div>

                {/* Duration indicator */}
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Duration:</span>
                  <span className="font-bold text-gold-400">{durationInfo.formattedDuration}</span>
                </div>

                {!availabilityResult.isAvailable && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{availabilityResult.reason || 'Vehicle is not available for requested window.'}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!availabilityResult.isAvailable || durationInfo.totalHours < MIN_RENTAL_HOURS}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gold-500 text-navy-950 hover:bg-gold-400 transition-all flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500"
                >
                  <span>Continue to Customer Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Customer Details & Addons */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-navy-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  Step 2: Renter Details & Trip Add-Ons
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ensure your contact phone is reachable for handover coordination.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name (as per ID)</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Mobile Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94401 23456"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Bike helmet option */}
                {vehicle.category === 'bike' && (
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">Helmets Provided</span>
                      <span className="text-[11px] text-slate-400">1 complimentary sanitized helmet included</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setHelmetCount(1)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          helmetCount === 1 ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-slate-300'
                        }`}
                      >
                        1 Helmet (Free)
                      </button>
                      <button
                        type="button"
                        onClick={() => setHelmetCount(2)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          helmetCount === 2 ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-slate-300'
                        }`}
                      >
                        2 (+₹50/day)
                      </button>
                    </div>
                  </div>
                )}

                {/* Roadside protection toggle */}
                <label className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 flex items-start gap-3 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={damageProtection}
                    onChange={(e) => setDamageProtection(e.target.checked)}
                    className="mt-0.5 rounded border-navy-700 text-gold-500"
                  />
                  <div>
                    <span className="font-semibold text-white block">Add Roadside Damage Protection</span>
                    <span className="text-[11px] text-slate-400">
                      {vehicle.category === 'bike' ? '₹150/day' : '₹350/day'} — Caps accidental repair liability and includes towing support.
                    </span>
                  </div>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Special Notes / Handover Instructions</label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="E.g. arriving on Godavari Express at 8:30 AM..."
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl font-semibold text-xs bg-navy-800 text-slate-300 hover:bg-navy-750"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!customerName || !customerPhone}
                    className="flex-1 py-3 rounded-xl font-bold text-xs bg-gold-500 text-navy-950 hover:bg-gold-400 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Document Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Document Verification */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-navy-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-gold-400" />
                  Step 3: Upload Driving License & ID
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload now for instant pre-verification, or present originals in person at Kakinada Hub.
                </p>
              </div>

              <DocumentUploader userId={currentUser.id} />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-xl font-semibold text-xs bg-navy-800 text-slate-300 hover:bg-navy-750"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 rounded-xl font-bold text-xs bg-gold-500 text-navy-950 hover:bg-gold-400 flex items-center justify-center gap-2"
                >
                  <span>Review & Submit Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review Terms & Submit */}
          {step === 4 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="border-b border-navy-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gold-400" />
                  Step 4: Terms Agreement & Submission
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Review terms, snapshot rate protection, and submit request for admin approval.
                </p>
              </div>

              <div className="space-y-3 text-xs bg-navy-950 p-4 rounded-2xl border border-navy-800 text-slate-300">
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Key Rental Terms:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li>Original physical Driving License and Aadhaar must be presented at vehicle pickup in Kakinada.</li>
                  <li>Fuel is customer-paid; vehicle provided with sufficient fuel to reach nearest fuel pump.</li>
                  <li>Security deposit of {formatINR(vehicle.depositAmount)} is refundable within 24 hours of safe vehicle return.</li>
                  <li>Free cancellation up to 24 hours prior to scheduled pickup time.</li>
                </ul>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-navy-700 text-gold-500 focus:ring-gold-500/30"
                />
                <span className="text-slate-300 leading-relaxed">
                  I confirm that I meet the age ({vehicle.minAge}+) and license requirements, have read the rental and cancellation policies, and agree to the terms of Amma Travels.
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-3 rounded-xl font-semibold text-xs bg-navy-800 text-slate-300 hover:bg-navy-750"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!acceptedTerms || submitting}
                  className="flex-1 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 hover:from-gold-300 hover:to-gold-400 shadow-xl transition-all flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500"
                >
                  {submitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit Booking Request</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Price Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-navy-800">
            <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-navy-950 shrink-0">
              <Image src={vehicle.primaryImageUrl} alt={vehicle.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm line-clamp-1">{vehicle.name}</h4>
              <p className="text-[11px] text-gold-400">{vehicle.brand} • {vehicle.subCategory}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Duration:</span>
              <span className="font-semibold text-white">{durationInfo.formattedDuration}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Pickup Depot:</span>
              <span className="font-semibold text-white text-right max-w-[200px] truncate">{pickupLocation}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Fuel Policy:</span>
              <span className="font-semibold text-white">Customer Fills</span>
            </div>
          </div>

          {priceInfo && (
            <div className="space-y-2.5 pt-4 border-t border-navy-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Rental Charge:</span>
                <span className="font-semibold text-white">{formatINR(priceInfo.baseRentalCharge)}</span>
              </div>
              {priceInfo.addonsTotal > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Add-ons:</span>
                  <span className="font-semibold text-white">{formatINR(priceInfo.addonsTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Refundable Security Deposit:</span>
                <span className="font-semibold text-white">{formatINR(priceInfo.refundableDeposit)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Included Km Limit:</span>
                <span>{priceInfo.kmAllowed} km (₹{priceInfo.excessKmRate}/extra km)</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-navy-700">
                <span className="font-bold text-white text-sm">Estimated Total</span>
                <span className="font-black text-xl text-gold-400">
                  {formatINR(priceInfo.totalPayable)}
                </span>
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Guaranteed Price Snapshot</p>
            <p>Your rates are locked in. Even if vehicle rates are modified later, your confirmed reservation remains unaffected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
