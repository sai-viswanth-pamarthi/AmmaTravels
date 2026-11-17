import React from 'react';
import { motion } from 'framer-motion';
import { Search, CheckSquare, KeyRound, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onSelectOption: (tab: 'vehicles') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onSelectOption }) => {
  const steps = [
    {
      num: '01',
      title: 'Choose & Inspect Vehicle',
      desc: 'Browse verified hatchbacks, sedans, 4x4 SUVs, and bikes. Inspect high-definition photos, custom colors, and full specs before expressing interest.',
      icon: Search,
      tag: 'Total Transparency',
    },
    {
      num: '02',
      title: 'Express Your Interest',
      desc: 'Select preferred dates, pickup location, and submit your interest with zero upfront advance payment. Receive your instant reference ID.',
      icon: CheckSquare,
      tag: 'Instant Reference ID',
    },
    {
      num: '03',
      title: 'Staff Connect & Pickup',
      desc: 'Our Kakinada team coordinates directly, verifies documents, and prepares your sanitized ride for 5-minute handover at Bhanugudi Junction.',
      icon: KeyRound,
      tag: 'Drive with Confidence',
    },
  ];

  return (
    <motion.section
      id="how-it-works"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative py-24 bg-[#F4EEDF]/50 dark:bg-slate-950/50 border-y border-[#E8DFCF] dark:border-slate-800 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-mono text-[11px] font-bold text-orange-600 dark:text-blue-400 bg-orange-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-blue-900">
              KM 25.0 // The Pitstop Blueprint
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-blue-400 bg-orange-50 dark:bg-blue-950/60 px-4 py-1.5 rounded-full border border-orange-200 dark:border-blue-900">
              Hassle-Free Process
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-black text-stone-900 dark:text-white mt-3">
            How Renting With <span className="text-orange-600 dark:text-blue-400 hand-drawn-underline">Amma Travels</span> Works
          </h2>

          <div className="mt-3 text-center font-hand text-xl text-orange-500 font-bold -rotate-1">
            <span>Takes less than 2 minutes • 0 upfront token required ⤵</span>
          </div>

          <p className="mt-2 text-base text-stone-600 dark:text-slate-300">
            No advance payment traps. No hidden fuel clauses. Pure Godavari hospitality and dependable rides.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-[#FFFDF7] dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-[#E8DFCF] dark:border-slate-800 soft-card-shadow card-interactive group"
              >
                {/* Step Connector Arrow for Desktop */}
                {idx < 2 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-20 text-blue-600 dark:text-blue-400 font-hand text-3xl font-black rotate-[-6deg] pointer-events-none">
                    ➔
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-display font-black text-4xl text-slate-200 dark:text-slate-800 group-hover:text-blue-600/30 transition-colors">
                    {step.num}
                  </span>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {step.tag}
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 sm:mt-14 text-center">
          <button
            onClick={() => onSelectOption('vehicles')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 min-h-[48px] rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-600/30 transition-all btn-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Explore Entire Fleet Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};
