import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What documents do I need to rent a car or bike?',
      a: 'You will need an original valid Indian Driving Licence (LMV for cars, MCWG for geared motorcycles, or non-geared for scooters) and an original Government Photo ID (Aadhaar or Voter ID). International travelers can present a valid International Driving Permit and Passport.',
    },
    {
      q: 'How does the security deposit work? When is it refunded?',
      a: 'Our refundable security deposits are modest (₹1,000 to ₹1,500 for bikes, ₹3,000 to ₹5,000 for luxury cars). The full deposit is processed immediately upon safe return and inspection of the vehicle.',
    },
    {
      q: 'What is the fuel policy?',
      a: 'We operate on a fair "Level-to-Level" policy. You receive the vehicle with a documented fuel level and return it with the same level. Alternatively, we can assist with top-ups at actual market fuel rates.',
    },
    {
      q: 'Can I take the rental vehicle outstation (e.g. Vizag, Maredumilli, Hyderabad)?',
      a: 'Yes, all our vehicles have valid all-India commercial permits and comprehensive insurance coverage across Andhra Pradesh, Telangana, and neighboring states. Please mention your tentative travel route when booking.',
    },
    {
      q: 'Do you offer doorstep delivery in Kakinada?',
      a: 'Yes! While pickup from our central Bhanugudi Junction hub is free, we also offer doorstep delivery and pickup across Kakinada Town, Port, and nearby localities for a nominal convenience charge.',
    },
    {
      q: 'How far in advance should I book an Event Package?',
      a: 'For weddings and large corporate delegations, we recommend locking in your reservation at least 2 to 4 weeks in advance, especially during the wedding muhurtham season. For birthday caravans and tour groups, 48 hours notice is sufficient.',
    },
  ];

  return (
    <section className="py-20 bg-warm-100/50 dark:bg-charcoal-950/50 border-t border-warm-200 dark:border-charcoal-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-700 dark:text-saffron-400 bg-teal-100/60 dark:bg-teal-950/60 px-3.5 py-1.5 rounded-full border border-teal-200 dark:border-teal-800">
            Frequently Asked Questions
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 dark:text-warm-50 mt-3">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-charcoal-900 rounded-2xl border border-warm-200 dark:border-charcoal-800 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-charcoal-900 dark:text-warm-50 hover:text-teal-900 dark:hover:text-saffron-400"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-charcoal-400 dark:text-warm-300 transition-transform ${
                      isOpen ? 'rotate-180 text-saffron-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-charcoal-600 dark:text-warm-200/80 leading-relaxed border-t border-warm-100 dark:border-charcoal-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
