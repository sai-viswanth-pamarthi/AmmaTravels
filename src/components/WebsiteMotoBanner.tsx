import React from 'react';
import { Car, Bike, Calendar, PhoneCall, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface WebsiteMotoBannerProps {
  onExploreFleet?: () => void;
}

export const WebsiteMotoBanner: React.FC<WebsiteMotoBannerProps> = ({ onExploreFleet }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Visual Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple 3-Step Process • Zero Formal Experience Needed</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
          How Amma Travels Works in Kakinada
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          Zero advance payment. Just browse, click <strong className="text-blue-600 dark:text-blue-400">"I'm Interested"</strong>, and our team handles everything from delivery to pickup.
        </p>
      </div>

      {/* 3 Large Visual Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Step 1 */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:border-blue-500/70 transition-all duration-300 flex flex-col justify-between group">
          <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 font-black text-base flex items-center justify-center font-display border border-blue-600/20">
            1
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
              <div className="flex items-center gap-1">
                <Car className="w-6 h-6" />
                <Bike className="w-5 h-5 -ml-1 text-blue-200" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                STEP 1 • CHOOSE VEHICLE
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display mt-0.5">
                Choose Car or Bike
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Browse our verified 2-wheelers (Royal Enfield, Scooters) or 4-wheelers (Swift, Thar, Innova, BMW). View colors, prices, and specifications.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Sanitized & GPS Tracked</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-[#FFFDF7] dark:bg-slate-900 border border-[#E8DFCF] dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:border-blue-500/70 transition-all duration-300 flex flex-col justify-between group">
          <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 font-black text-base flex items-center justify-center font-display border border-blue-600/20">
            2
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                STEP 2 • PICK DATES & TIME
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display mt-0.5">
                Pick Your Travel Dates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Select your start and return dates with our easy laptop-style calendar and up/down time steppers. No typing digits needed!
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Laptop Stepper • No Typing</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group">
          <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 text-white font-black text-base flex items-center justify-center font-display border border-white/30">
            3
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">
                STEP 3 • WE CALL & COORDINATE
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                Click "I'm Interested"
              </h3>
              <p className="text-xs text-blue-100 mt-2 leading-relaxed">
                Enter your mobile number and name. You pay <strong className="text-white underline">₹0 in advance</strong>. Our operations team directly calls you to coordinate ride handover!
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              <span>₹0 Advance Payment</span>
            </div>
            {onExploreFleet && (
              <button
                type="button"
                onClick={onExploreFleet}
                className="px-3 py-1 rounded-full bg-white text-blue-700 hover:bg-blue-50 text-[11px] font-extrabold flex items-center gap-1 transition-colors"
              >
                <span>Browse Fleet</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
