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
  const [submittedData, setSubmittedData] = useState<InterestSubmission | null>(null);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Bot detected, silently reject or fail
      return;
    }

    if (!name.trim() || !phone.trim() || !pickupDate || !returnDate) {
      setError('Please fill in your Name, Phone Number, Pickup Date, and Return Date.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (new Date(returnDate) < new Date(pickupDate)) {
      setError('Return date cannot be earlier than pickup date.');
      return;
    }

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-2xl overflow-hidden my-auto p-6 sm:p-8">
        {/* Success View */}
        {submittedData ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Inquiry Successfully Registered
              </span>
              <h3 className="font-display text-2xl font-bold text-charcoal-900 dark:text-warm-50 mt-1">
                Your Booking Request is Logged!
              </h3>
              <p className="mt-2 text-sm text-charcoal-600 dark:text-warm-300">
                Our Kakinada fleet manager has received your reservation request for{' '}
                <strong className="text-charcoal-900 dark:text-warm-100">{vehicle.name}</strong>.
              </p>
            </div>

            {/* Reference ID Callout Box */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-center">
              <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold uppercase tracking-wider">
                Booking Reference ID
              </p>
              <p className="font-mono text-2xl font-extrabold text-teal-950 dark:text-saffron-400 mt-1 tracking-wider">
                {submittedData.refId}
              </p>
              <p className="text-[11px] text-charcoal-500 dark:text-warm-400 mt-1">
                Save this Reference ID to track status anytime with your phone number ({submittedData.phone})
              </p>
            </div>

            {/* WhatsApp Deep Link CTA */}
            <div className="space-y-3 pt-2">
              <a
                href={getVehicleWhatsAppUrl(vehicle.name, submittedData.refId)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Confirm Instantly via WhatsApp</span>
              </a>

              <button
                onClick={resetAndClose}
                className="w-full py-2.5 px-4 rounded-xl bg-warm-100 dark:bg-charcoal-800 hover:bg-warm-200 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-warm-200 font-semibold text-xs transition-colors"
              >
                Done / Return to Fleet
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-charcoal-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-800 dark:text-saffron-400">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                    Rental Booking Inquiry
                  </span>
                  <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-warm-50">
                    {vehicle.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={resetAndClose}
                className="p-2 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-100 rounded-full hover:bg-warm-100 dark:hover:bg-charcoal-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tariff highlight */}
            <div className="my-4 p-3 rounded-xl bg-warm-50 dark:bg-charcoal-800/60 border border-warm-200 dark:border-charcoal-700 flex items-center justify-between text-xs">
              <span className="text-charcoal-600 dark:text-warm-300">
                Tariff: <strong className="text-charcoal-900 dark:text-warm-100">₹{vehicle.pricePerDay}/day</strong>
              </span>
              <span className="text-charcoal-600 dark:text-warm-300">
                Deposit: <strong className="text-charcoal-900 dark:text-warm-100">₹{vehicle.deposit}</strong>
              </span>
              <span className="text-charcoal-600 dark:text-warm-300">
                Free Run: <strong className="text-charcoal-900 dark:text-warm-100">{vehicle.kmLimit} km/day</strong>
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Pickup Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
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
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Pickup Date & Time *
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Return Date & Time *
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                  Driving Licence / ID Proof URL or Notes (Optional)
                </label>
                <input
                  type="text"
                  value={idProofUrl}
                  onChange={(e) => setIdProofUrl(e.target.value)}
                  placeholder="Drive link, DigiLocker, or present original at pickup"
                  className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                  Specific Requests or Message (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Need extra helmet, child seat, early morning pickup..."
                  className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-bold text-sm tracking-wide shadow-md shadow-saffron-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{submitting ? 'Registering Booking...' : 'Confirm Interest & Reserve'}</span>
                </button>
                <p className="text-[11px] text-center text-charcoal-500 dark:text-warm-400 mt-2">
                  🔒 No payment required now. Verified on vehicle hand-over in Kakinada.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
