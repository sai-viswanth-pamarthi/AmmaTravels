import React, { useState } from 'react';
import {
  Calendar,
  Users,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  PhoneCall,
  Clock,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { EventPackage, InterestSubmission } from '@/types';
import { api } from '@/lib/api';
import { getEventWhatsAppUrl } from '@/lib/whatsapp';

interface EventInterestModalProps {
  eventPackage: EventPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (submission: InterestSubmission) => void;
}

export const EventInterestModal: React.FC<EventInterestModalProps> = ({
  eventPackage,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState(eventPackage?.eventType || 'Wedding');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [budgetRange, setBudgetRange] = useState('₹1,00,000 - ₹2,50,000');
  const [cityVenue, setCityVenue] = useState('Kakinada (Godavari Region)');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<InterestSubmission | null>(null);
  const [activeExistingEnquiry, setActiveExistingEnquiry] = useState<{
    refId: string;
    phone?: string;
    itemName?: string;
    createdAt?: string;
    progressStage?: string;
  } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const active = api.getActiveUserEnquiry();
      setActiveExistingEnquiry(active);
    }
  }, [isOpen]);

  if (!isOpen || !eventPackage) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (activeExistingEnquiry) {
      setError(`You already have an active enquiry (Ref ID: ${activeExistingEnquiry.refId}). Each customer is limited to 1 active enquiry to prevent duplicate submissions.`);
      return;
    }

    if (!name.trim() || !phone.trim() || !eventDate) {
      setError('Please provide your Name, Phone Number, and tentative Event Date.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const submission = await api.submitInterest({
        type: 'event',
        packageId: eventPackage.id,
        packageName: eventPackage.title,
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim(),
        eventType,
        eventDate,
        guestCount: Number(guestCount),
        budgetRange,
        cityVenue: cityVenue.trim(),
        message: message.trim() || undefined,
        honeypot,
      });

      setActiveExistingEnquiry({
        refId: submission.refId,
        phone: cleanPhone,
        itemName: submission.packageName,
        createdAt: submission.createdAt,
        progressStage: submission.progressStage,
      });
      setSubmittedData(submission);
      onSuccess(submission);
    } catch (err: any) {
      const active = api.getActiveUserEnquiry();
      if (active) {
        setActiveExistingEnquiry(active);
      }
      setError(err?.message || 'Failed to submit event inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedData(null);
    setName('');
    setPhone('');
    setEmail('');
    setEventDate('');
    setMessage('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-2xl overflow-hidden my-auto p-6 sm:p-8">
        {submittedData ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Event Inquiry Received
              </span>
              <h3 className="font-display text-2xl font-bold text-charcoal-900 dark:text-warm-50 mt-1">
                Your Event Consultation is Scheduled!
              </h3>
              <p className="mt-2 text-sm text-charcoal-600 dark:text-warm-300">
                Our Senior Event Coordinator will contact you within 2 hours to curate your{' '}
                <strong className="text-charcoal-900 dark:text-warm-100">{eventPackage.title}</strong> itinerary.
              </p>
            </div>

            {/* Reference ID Callout */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-center">
              <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold uppercase tracking-wider">
                Event Reference ID
              </p>
              <p className="font-mono text-2xl font-extrabold text-teal-950 dark:text-saffron-400 mt-1 tracking-wider">
                {submittedData.refId}
              </p>
              <p className="text-[11px] text-charcoal-500 dark:text-warm-400 mt-1">
                Track status anytime online with this ID & your phone number ({submittedData.phone})
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={getEventWhatsAppUrl(eventPackage.title, submittedData.refId)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Discuss Event directly on WhatsApp</span>
              </a>

              <button
                onClick={resetAndClose}
                className="w-full py-2.5 px-4 rounded-xl bg-warm-100 dark:bg-charcoal-800 hover:bg-warm-200 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-warm-200 font-semibold text-xs transition-colors"
              >
                Done / Return to Packages
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-charcoal-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-saffron-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                    Event Package Consultation
                  </span>
                  <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-warm-50">
                    {eventPackage.title}
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

            <div className="my-4 p-3 rounded-xl bg-warm-50 dark:bg-charcoal-800/60 border border-warm-200 dark:border-charcoal-700 flex items-center justify-between text-xs">
              <span className="text-charcoal-600 dark:text-warm-300">
                Range: <strong className="text-charcoal-900 dark:text-warm-100">{eventPackage.priceRange}</strong>
              </span>
              <span className="text-charcoal-600 dark:text-warm-300">
                Capacity: <strong className="text-charcoal-900 dark:text-warm-100">{eventPackage.guestCapacity}</strong>
              </span>
            </div>

            {/* Active Reservation Anti-Abuse Notification */}
            {activeExistingEnquiry && (
              <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <span className="font-bold text-xs text-amber-800 dark:text-amber-300">
                        Active Reservation Enquiry Detected
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        Limit: 1 Active Enquiry
                      </span>
                    </div>
                    <p className="text-xs text-amber-800/90 dark:text-amber-200/90 mt-1 leading-relaxed">
                      You already have an active enquiry (Ref ID: <strong className="font-mono font-bold text-amber-950 dark:text-white">{activeExistingEnquiry.refId}</strong>{activeExistingEnquiry.itemName ? ` for ${activeExistingEnquiry.itemName}` : ''}). To prevent duplicate bookings and spam flood attacks, each customer is limited to 1 active request.
                    </p>
                    <div className="mt-3">
                      <a
                        href={getEventWhatsAppUrl(eventPackage.title, activeExistingEnquiry.refId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Modify via WhatsApp (Ref: {activeExistingEnquiry.refId})</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="user_anti_spam"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Venkat Rao"
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
                    Tentative Event Date *
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Estimated Guests
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    min={10}
                    max={2000}
                    className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Target Budget Range
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  >
                    <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                    <option value="₹2,50,000 - ₹5,00,000+">₹2,50,000 - ₹5,00,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Destination / Venue Location
                  </label>
                  <input
                    type="text"
                    value={cityVenue}
                    onChange={(e) => setCityVenue(e.target.value)}
                    placeholder="e.g. Kakinada, Rajahmundry, Yanam"
                    className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                  Specific Requirements or Vehicle Fleet Preferences
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Need 2 Fortuners for bride & groom + 3 Tempo Travellers for relatives..."
                  className="w-full px-3.5 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                {activeExistingEnquiry ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1.5">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      Enquiry in progress (Ref: {activeExistingEnquiry.refId})
                    </p>
                    <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
                      Submissions are restricted to 1 active reservation per user to protect system resources. Please contact us directly on WhatsApp to make changes.
                    </p>
                  </div>
                ) : (
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
                    <span>{submitting ? 'Submitting Details...' : 'Request Tailored Event Quote'}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
