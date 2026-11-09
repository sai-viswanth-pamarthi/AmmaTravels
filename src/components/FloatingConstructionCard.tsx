import React, { useState } from 'react';
import {
  Construction,
  Code2,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export const FloatingConstructionCard: React.FC = () => {
  // Starts expanded by default so it's immediately visible across the website while scrolling
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside
      aria-label="Website Status & Developer Info"
      className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-40 max-w-xl lg:max-w-2xl w-[calc(100%-1.5rem)] sm:w-auto transition-all duration-300 select-none print:hidden pointer-events-auto"
    >
      {/* Minimized Pill View */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/95 hover:bg-slate-900 border border-amber-500/60 shadow-2xl text-white backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] active:scale-98 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Click to view Construction status and Pivot Tech contact details"
          aria-expanded="false"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <Construction className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-amber-300 tracking-wide">
            Under Construction
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Built by Pivot Tech</span>
          </span>
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-1" />
        </button>
      ) : (
        /* Expanded Floating Stack matching the user reference screenshot */
        <div className="relative space-y-2.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* Minimize toggle button floating in top-right */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute -top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-semibold flex items-center gap-1 border border-slate-700/80 shadow-md backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Minimize card to badge"
            aria-label="Minimize card"
          >
            <span>Minimize</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* 1. Amber Under Construction Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#140f06]/95 border border-amber-500/60 shadow-2xl shadow-amber-500/10 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="flex items-start sm:items-center gap-3">
              {/* Construction Fence/Barrier Badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/40 shadow-inner">
                <Construction className="w-5 h-5 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400">
                    WEBSITE STILL UNDER ACTIVE CONSTRUCTION
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </div>
                <p className="text-[11px] sm:text-xs text-amber-100/85 mt-0.5 leading-relaxed max-w-lg">
                  The Amma Travels self-drive web portal is currently undergoing active construction and development. Online reservation flows, fleet telemetry, and tariffs are operating in interactive preview mode.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 self-end sm:self-center">
              <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/50 whitespace-nowrap">
                BETA DEVELOPMENT PREVIEW
              </span>
            </div>
          </div>

          {/* 2. Blue/Dark Built by Pivot Tech Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#090f1d]/95 border border-blue-500/40 shadow-2xl shadow-blue-500/10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              {/* Code2 / </> Badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                <Code2 className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-black text-sm sm:text-base text-white tracking-tight">
                    Built by Pivot Tech
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-blue-500/25 text-blue-300 border border-blue-500/40">
                    Official Dev
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug">
                  Custom Web Engineering, 3D Interactive Studios & Enterprise Cloud Solutions
                </p>
              </div>
            </div>

            {/* Clickable Contact Buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto pt-1 md:pt-0">
              {/* Phone 1 */}
              <a
                href="tel:8885757966"
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center gap-1.5 group/btn text-[11px] sm:text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
                title="Call +91 88857 57966"
              >
                <Phone className="w-3 h-3 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                <span>+91 88857 57966</span>
              </a>

              {/* Phone 2 */}
              <a
                href="tel:9346105182"
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center gap-1.5 group/btn text-[11px] sm:text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95"
                title="Call +91 93461 05182"
              >
                <Phone className="w-3 h-3 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                <span>+91 93461 05182</span>
              </a>

              {/* Email */}
              <a
                href="mailto:saiviswanth55@gmail.com"
                className="px-3 py-1.5 rounded-xl bg-blue-600/25 hover:bg-blue-600/35 text-blue-200 hover:text-white border border-blue-500/50 transition-all flex items-center gap-1.5 group/btn text-[11px] sm:text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
                title="Email saiviswanth55@gmail.com"
              >
                <Mail className="w-3 h-3 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                <span>saiviswanth55@gmail.com</span>
              </a>
            </div>
          </div>

        </div>
      )}
    </aside>
  );
};
