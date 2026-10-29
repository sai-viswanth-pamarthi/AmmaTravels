import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. Srinivas Rao',
      role: 'Family Trip to Papikondalu & Maredumilli',
      text: 'Rented the Innova Crysta for a 4-day Godavari road trip. The vehicle was spotless, tires were in great shape, and the pickup process at Bhanugudi was completed in less than 5 minutes. Best rental service in East Godavari.',
      rating: 5,
      vehicle: 'Toyota Innova Crysta',
      location: 'Kakinada',
    },
    {
      name: 'Ananya & Karthik Varma',
      role: 'Destination Wedding Hosts',
      text: 'Amma Travels managed our complete wedding fleet — from the bridal Fortuner to 3 guest traveller convoys between Rajahmundry Airport and Kakinada. Punctual chauffeurs, well-dressed, and zero stress.',
      rating: 5,
      vehicle: 'Wedding Royal Convoy',
      location: 'Rajahmundry & Kakinada',
    },
    {
      name: 'Aditya Prasad',
      role: 'Solo Rider & Tech Professional',
      text: 'Hired the Royal Enfield Himalayan 450 for a weekend coastal ride through Coringa, Yanam, and Antarvedi. Loved the 360° online preview feature and the helmet was genuinely clean and high quality.',
      rating: 5,
      vehicle: 'RE Himalayan 450',
      location: 'Hyderabad to Kakinada',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/40 px-3.5 py-1.5 rounded-full border border-saffron-200 dark:border-saffron-800">
          Customer Trust
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 dark:text-warm-50 mt-3">
          Loved by Locals & Travelers in Kakinada
        </h2>
        <p className="mt-3 text-sm sm:text-base text-charcoal-600 dark:text-warm-300">
          Real feedback from travelers who explored Andhra roads and celebrated life events with us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="bg-white dark:bg-charcoal-900 rounded-3xl p-8 border border-warm-200 dark:border-charcoal-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1 mb-4 text-amber-500">
                {Array.from({ length: rev.rating }).map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <Quote className="w-8 h-8 text-teal-800/20 dark:text-teal-400/20 mb-2" />
              <p className="text-sm text-charcoal-700 dark:text-warm-200 leading-relaxed italic">
                "{rev.text}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-warm-200 dark:border-charcoal-800 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-sm text-charcoal-900 dark:text-warm-50">
                  {rev.name}
                </h4>
                <p className="text-[11px] text-charcoal-500 dark:text-warm-400">
                  {rev.role}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 dark:text-saffron-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                {rev.vehicle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
