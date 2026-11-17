import React, { useState } from 'react';
import {
  Car,
  Calendar,
  MapPin,
  FileCheck,
  CheckCircle2,
  X,
  Sparkles,
  PhoneCall,
  Clock,
  ShieldCheck,
  AlertCircle,
  UploadCloud
} from 'lucide-react';
import { Vehicle, InterestSubmission } from '@/types';
import { api } from '@/lib/api';
import { getVehicleWhatsAppUrl } from '@/lib/whatsapp';

interface VehicleInterestModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (submission: InterestSubmission) => void;
  selectedColor?: string;
  initialParams?: {
    pickupLocation?: string;
    pickupDate?: string;
    returnDate?: string;
  } | null;
}

export const VehicleInterestModal: React.FC<VehicleInterestModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
  selectedColor,
  initialParams,
}) => {
  const resetAndClose = React.useCallback(() => {
    setSubmittedData(null);
    setName('');
    setPhone('');
    setEmail('');
    setPickupDate('');
    setReturnDate('');
    setMessage('');
    setError(null);
    setFieldErrors({});
    setTouched({});
    onClose();
  }, [onClose]);

  // Prevent background scrolling and stop Lenis momentum smooth scroll while modal is open
  React.useEffect(() => {
    if (isOpen) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          resetAndClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, resetAndClose]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Kakinada Main Hub (Bhanugudi Junction)');
  const [idProofUrl, setIdProofUrl] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedData, setSubmittedData] = useState<InterestSubmission | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB limit. Please upload a smaller image or PDF.');
      return;
    }
    setUploadError(null);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setIdProofUrl(`Uploaded Document: ${file.name} (${Math.round(file.size / 1024)} KB)`);
    };
    reader.readAsDataURL(file);
  };

  // Pre-fill fields from search bar if available
  React.useEffect(() => {
    if (isOpen && initialParams) {
      if (initialParams.pickupDate) setPickupDate(initialParams.pickupDate);
      if (initialParams.returnDate) setReturnDate(initialParams.returnDate);
      if (initialParams.pickupLocation) setPickupLocation(initialParams.pickupLocation);
    }
  }, [isOpen, initialParams]);

  if (!isOpen || !vehicle) return null;

  const validate = (fieldsToValidate?: { name?: string; phone?: string; pickupDate?: string; returnDate?: string }) => {
    const valName = fieldsToValidate?.name !== undefined ? fieldsToValidate.name : name;
    const valPhone = fieldsToValidate?.phone !== undefined ? fieldsToValidate.phone : phone;
    const valPickup = fieldsToValidate?.pickupDate !== undefined ? fieldsToValidate.pickupDate : pickupDate;
    const valReturn = fieldsToValidate?.returnDate !== undefined ? fieldsToValidate.returnDate : returnDate;

    const errs: Record<string, string> = {};

    if (!valName.trim()) {
      errs.name = 'Full name is required';
    } else if (valName.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    const cleanPhone = valPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Mobile phone number is required';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!valPickup) {
      errs.pickupDate = 'Pickup date is required';
    }

    if (!valReturn) {
      errs.returnDate = 'Return date is required';
    } else if (valPickup && new Date(valReturn) < new Date(valPickup)) {
      errs.returnDate = 'Return date cannot be earlier than pickup date';
    }

    setFieldErrors(errs);
    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Bot detected, silently reject
      return;
    }

    setTouched({ name: true, phone: true, pickupDate: true, returnDate: true });
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setError('Please resolve the highlighted errors before submitting.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    setSubmitting(true);
    setError(null);

    try {
      const submission = await api.submitInterest({
        type: 'vehicle',
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        selectedColor,
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim(),
        pickupDate,
        returnDate,
        pickupLocation,
        idProofUrl: idProofUrl.trim() || undefined,
        message: message.trim() || undefined,
        honeypot,
      });

      setSubmittedData(submission);
      onSuccess(submission);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit booking inquiry. Please try again or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          resetAndClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-xl bg-[#FFFDF7] dark:bg-slate-900 rounded-3xl border border-[#E8DFCF] dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[90dvh] my-auto p-5 sm:p-7"
      >
        {/* Universal Top-Right Close Button (Always visible on Form & Success states) */}
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success View */}
        {submittedData ? (
          <div className="text-center py-2 sm:py-3 space-y-3.5 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Interest Successfully Registered
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Your Interest is Registered!
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Our Kakinada team has received your enquiry details for{' '}
                <strong className="text-slate-900 dark:text-white">{vehicle.name}</strong> and will contact you directly to confirm availability and schedule pickup.
              </p>
            </div>

            {/* Reference ID Callout Box */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                Interest Reference ID
              </p>
              <p className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-wider">
                {submittedData.refId}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Save this Reference ID to track status anytime with your phone number ({submittedData.phone})
              </p>
            </div>

            {/* Requested Rental Dates & Booking Summary Card */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Requested Rental Dates</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-extrabold text-[10px]">
                  No Payment Required Upfront
                </span>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Pickup Date</span>
                  <strong className="text-xs sm:text-sm text-slate-900 dark:text-white font-mono">{submittedData.pickupDate}</strong>
                </div>
                <div className="text-slate-400 font-bold px-2">→</div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Return Date</span>
                  <strong className="text-xs sm:text-sm text-slate-900 dark:text-white font-mono">{submittedData.returnDate}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                <span>Selected Pickup Hub:</span>
                <strong className="text-slate-900 dark:text-white truncate max-w-[240px]">{submittedData.pickupLocation}</strong>
              </div>
            </div>

            {/* WhatsApp Deep Link CTA & Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <a
                href={getVehicleWhatsAppUrl(
                  vehicle.name,
                  submittedData.refId,
                  submittedData.pickupDate,
                  submittedData.returnDate
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all btn-interactive"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Confirm Interest on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Done / Return to Fleet</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 pr-12">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Express Interest
                  </span>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {vehicle.name}
                    </h3>
                    {selectedColor && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        Color: {selectedColor}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tariff highlight */}
            <div className="my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                Tariff: <strong className="text-slate-900 dark:text-white">₹{vehicle.pricePerDay}/day</strong>
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Deposit: <strong className="text-slate-900 dark:text-white">₹{vehicle.deposit}</strong>
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Free Run: <strong className="text-slate-900 dark:text-white">{vehicle.kmLimit} km/day</strong>
              </span>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              {/* Anti-spam honeypot (hidden from screen) */}
              <input
                type="text"
                name="website_source"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name) validate({ name: e.target.value });
                    }}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. Ramesh Varma"
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-slate-100 text-base sm:text-xs transition-colors duration-200 focus:outline-none focus:ring-2 ${
                      touched.name && fieldErrors.name
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    aria-invalid={!!(touched.name && fieldErrors.name)}
                    aria-describedby={touched.name && fieldErrors.name ? 'name-error' : undefined}
                    required
                  />
                  {touched.name && fieldErrors.name && (
                    <p id="name-error" className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (touched.phone) validate({ phone: e.target.value });
                    }}
                    onBlur={() => handleBlur('phone')}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-slate-100 text-base sm:text-xs transition-colors duration-200 focus:outline-none focus:ring-2 ${
                      touched.phone && fieldErrors.phone
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    aria-invalid={!!(touched.phone && fieldErrors.phone)}
                    aria-describedby={touched.phone && fieldErrors.phone ? 'phone-error' : undefined}
                    required
                  />
                  {touched.phone && fieldErrors.phone && (
                    <p id="phone-error" className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base sm:text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                  />
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pickup Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base sm:text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                  >
                    <option value="Kakinada Main Hub (Bhanugudi Junction)">
                      Kakinada Main Hub (Bhanugudi)
                    </option>
                    <option value="Kakinada Town Railway Station">
                      Kakinada Town Railway Station
                    </option>
                    <option value="Kakinada Port Railway Station">
                      Kakinada Port Railway Station
                    </option>
                    <option value="RTC Complex Kakinada">
                      RTC Complex Kakinada
                    </option>
                    <option value="Doorstep Delivery in Kakinada">
                      Doorstep Delivery (+₹200)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pickup Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pickup Date & Time *
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => {
                      setPickupDate(e.target.value);
                      if (touched.pickupDate) validate({ pickupDate: e.target.value });
                    }}
                    onBlur={() => handleBlur('pickupDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-slate-100 text-base sm:text-xs transition-colors duration-200 focus:outline-none focus:ring-2 ${
                      touched.pickupDate && fieldErrors.pickupDate
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    aria-invalid={!!(touched.pickupDate && fieldErrors.pickupDate)}
                    aria-describedby={touched.pickupDate && fieldErrors.pickupDate ? 'pickup-error' : undefined}
                    required
                  />
                  {touched.pickupDate && fieldErrors.pickupDate && (
                    <p id="pickup-error" className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.pickupDate}</span>
                    </p>
                  )}
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Return Date & Time *
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      if (touched.returnDate) validate({ returnDate: e.target.value });
                    }}
                    onBlur={() => handleBlur('returnDate')}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-slate-100 text-base sm:text-xs transition-colors duration-200 focus:outline-none focus:ring-2 ${
                      touched.returnDate && fieldErrors.returnDate
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    aria-invalid={!!(touched.returnDate && fieldErrors.returnDate)}
                    aria-describedby={touched.returnDate && fieldErrors.returnDate ? 'return-error' : undefined}
                    required
                  />
                  {touched.returnDate && fieldErrors.returnDate && (
                    <p id="return-error" className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.returnDate}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Driving Licence / ID Proof (Optional for Faster Handover)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">
                      {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Upload Licence (Image/PDF)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={idProofUrl}
                    onChange={(e) => setIdProofUrl(e.target.value)}
                    placeholder="Or Drive / DigiLocker / Pickup link"
                    className="flex-1 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base sm:text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                  />
                </div>
                {uploadError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{uploadError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Requests or Message (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Need extra helmet, child seat, early morning pickup..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base sm:text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60 btn-interactive"
                >
                  {submitting ? (
                    <Clock className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                  <span>{submitting ? 'Registering Interest...' : "Submit My Interest (I'm Interested)"}</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                  🔒 No payment required upfront. Amma Travels team will coordinate your pickup directly.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
