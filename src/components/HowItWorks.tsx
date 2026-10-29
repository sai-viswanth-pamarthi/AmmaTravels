import React from 'react';
import { Search, CheckSquare, KeyRound, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onSelectOption: (tab: 'vehicles' | 'events') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onSelectOption }) => {
  const steps = [
    {
      num: '01',
      title: 'Choose & Inspect 360°',
      desc: 'Browse verified hatchbacks, sedans, 4x4 SUVs, and bikes. Inspect the vehicle virtually with 360° studio rotation before booking.',
      icon: Search,
      tag: 'Total Transparency',
    },
    {
      num: '02',
      title: 'Simple Digital Reserve',
      desc: 'Submit dates and contact info with zero upfront advance requirement. Receive your instant reference ID (AT-V / AT-E).',
      icon: CheckSquare,
      tag: 'Instant Confirmation',
    },
    {
      num: '03',
      title: 'Drive from Kakinada Hub',
      desc: 'Collect your sanitized vehicle from Bhanugudi Junction or opt for doorstep delivery across Kakinada. Hit the road with 24/7 support.',
      icon: KeyRound,
      tag: 'Drive with Confidence',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-warm-100/60 dark:bg-charcoal-950/60 border-y border-warm-200 dark:border-charcoal-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-700 dark:text-saffron-400 bg-teal-100/60 dark:bg-teal-950/60 px-3.5 py-1.5 rounded-full border border-teal-200 dark:border-teal-800">
            Hassle-Free Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 dark:text-warm-50 mt-3">
            How Renting With Amma Travels Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-600 dark:text-warm-300">
            No paperwork friction. No hidden fuel clauses. Pure Godavari hospitality and dependable rides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-charcoal-900 rounded-3xl p-8 border border-warm-200 dark:border-charcoal-800 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-900 dark:text-saffron-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-display font-black text-3xl text-warm-300 dark:text-charcoal-800">
                    {step.num}
                  </span>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                  {step.tag}
                </span>
                <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-warm-50 mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-charcoal-600 dark:text-warm-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onSelectOption('vehicles')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-900 hover:bg-teal-800 text-warm-50 font-semibold text-sm transition-all shadow-md"
          >
            <span>Ready to explore? View our Vehicles</span>
            <ArrowRight className="w-4 h-4 text-saffron-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
