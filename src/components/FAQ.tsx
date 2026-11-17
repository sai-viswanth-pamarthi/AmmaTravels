import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
      q: 'How does the "I\'m Interested" enquiry process work?',
      a: 'Simply click "I\'m Interested" on any car or bike to submit your requested dates and pickup preferences. Our fleet operations team immediately checks live availability and contacts you within 15 minutes to confirm your vehicle reservation!',
    },
  ];

  return (
    <motion.section
      id="faq"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-20 bg-[#F4EEDF]/50 dark:bg-slate-950/50 border-t border-[#E8DFCF] dark:border-slate-800 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <span className="font-mono text-[11px] font-bold text-orange-600 dark:text-blue-400 bg-orange-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-blue-900">
              KM 50.0 // Roadside Codex
            </span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-blue-400 bg-orange-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-orange-200 dark:border-blue-900">
              Frequently Asked Questions
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mt-3">
            Got Questions? <span className="text-orange-600 dark:text-blue-400 hand-drawn-underline">We Have Answers.</span>
          </h2>

          <div className="mt-2 text-center font-hand text-xl text-orange-500 font-bold -rotate-1">
            <span>Clear terms • Fair level-to-level fuel • Zero surprises ⤵</span>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#FFFDF7] dark:bg-slate-900 rounded-2xl border border-[#E8DFCF] dark:border-slate-800 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
