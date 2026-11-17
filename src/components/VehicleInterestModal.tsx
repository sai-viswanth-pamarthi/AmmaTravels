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
  AlertCircle
} from 'lucide-react';
import { Vehicle, InterestSubmission } from '@/types';
import { api } from '@/lib/api';
import { getVehicleWhatsAppUrl } from '@/lib/whatsapp';

interface VehicleInterestModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (submission: InterestSubmission) => void;
}

export const VehicleInterestModal: React.FC<VehicleInterestModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}) => {
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

  const resetAndClose = () => {
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFFDF7] dark:bg-slate-900 rounded-3xl border border-[#E8DFCF] dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[90dvh] my-auto p-5 sm:p-8">
        {/* Success View */}
        {submittedData ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Inquiry Successfully Registered
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Your Booking Request is Logged!
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Our Kakinada fleet manager has received your reservation request for{' '}
                <strong className="text-slate-900 dark:text-white">{vehicle.name}</strong>.
              </p>
            </div>

            {/* Reference ID Callout Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                Interest Reference ID
              </p>
              <p className="font-mono text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-wider">
                {submittedData.refId}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Save this Reference ID to track status anytime with your phone number ({submittedData.phone})
              </p>
            </div>

            {/* WhatsApp Deep Link CTA */}
            <div className="space-y-3 pt-2">
              <a
                href={getVehicleWhatsAppUrl(vehicle.name, submittedData.refId)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all btn-interactive"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Coordinate Directly via WhatsApp</span>
              </a>

              <button
                onClick={resetAndClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
              >
                Done / Return to Fleet
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Express Interest
                  </span>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {vehicle.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={resetAndClose}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
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
                  Driving Licence / ID Proof URL or Notes (Optional)
                </label>
                <input
                  type="text"
                  value={idProofUrl}
                  onChange={(e) => setIdProofUrl(e.target.value)}
                  placeholder="Drive link, DigiLocker, or present original at pickup"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base sm:text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                />
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
