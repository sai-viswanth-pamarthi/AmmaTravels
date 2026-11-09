import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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
    <motion.section
      id="testimonials"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            KM 38.2 // Driver Logs & Radio Chatter
          </span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900">
            Customer Trust
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
          Loved by Locals & Travelers in <span className="text-blue-600 dark:text-blue-400 hand-drawn-underline">Kakinada</span>
        </h2>

        <div className="mt-2 text-center font-hand text-xl text-blue-500 font-bold -rotate-1">
          <span>⭐️ 4.9/5 Rating • 2,500+ Godavari coastal road journeys completed</span>
        </div>

        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Real feedback from travelers who explored Andhra roads with our self-drive fleet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-[#FFFDF7] dark:bg-slate-900 rounded-3xl p-8 border border-[#E8DFCF] dark:border-slate-800 soft-card-shadow card-interactive flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {Array.from({ length: rev.rating }).map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <Quote className="w-8 h-8 text-orange-600/20 dark:text-blue-400/20 mb-2" />
              <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed italic">
                "{rev.text}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8DFCF] dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  {rev.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {rev.role}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                {rev.vehicle}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
