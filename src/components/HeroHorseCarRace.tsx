import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCcw, Zap, Sparkles, Flag, Play, Pause } from 'lucide-react';

interface HeroHorseCarRaceProps {
  onRaceComplete?: () => void;
}

export const HeroHorseCarRace: React.FC<HeroHorseCarRaceProps> = ({ onRaceComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [raceKey, setRaceKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const duration = 4.8; // Duration in seconds for the race crossing

  useEffect(() => {
    setProgress(0);
    setIsFinished(false);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentPct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentPct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFinished(true);
        if (onRaceComplete) onRaceComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [raceKey]);

  const handleRestart = () => {
    setRaceKey((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-4 px-4 select-none">
      {/* Race Header / Status Bar */}
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Kakinada Coastal Sprint</span>
          </span>
          <span className="text-ink-600 dark:text-cream-300 font-medium hidden sm:inline">
            🐎 1 Horsepower vs 🚗 200 Horsepower
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-ink-800 dark:text-cream-200">
            {isFinished ? '🏁 100% Ready' : `🏎️ Sprinting: ${progress}%`}
          </span>
          <button
            onClick={handleRestart}
            className="p-1 text-ink-600 dark:text-cream-300 hover:text-amber-500 hover:rotate-180 transition-all"
            title="Replay Sprint"
            aria-label="Replay Sprint"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The Animated Highway Track Container */}
      <div className="relative h-24 sm:h-28 rounded-2xl bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 dark:from-ink-900 dark:via-ink-850 dark:to-ink-900 border border-cream-300 dark:border-ink-800 overflow-hidden soft-card-shadow">
        {/* Distant background road perspective lines */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_24px,#231E1A_25px)] [background-size:50px_100%] pointer-events-none" />

        {/* Highway Road Surface */}
        <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-ink-950/90 dark:bg-black/90">
          {/* Road White / Saffron Dotted Divider */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-amber-400/80" />
        </div>

        {/* Checkered Finish Line on the Right */}
        <div className="absolute top-0 bottom-0 right-6 sm:right-10 w-4 flex flex-col justify-between opacity-80 pointer-events-none z-10">
          <div className="h-full w-full bg-[repeating-conic-gradient(#231E1A_0%_25%,#FFFFFF_0%_50%)] [background-size:8px_8px]" />
          <div className="absolute -top-1 -right-3 text-sm">🏁</div>
        </div>

        {/* --- ANIMATED GALLOPING HORSE & RIDER --- */}
        <motion.div
          key={`horse-${raceKey}`}
          className="absolute bottom-5 sm:bottom-6 z-20"
          initial={{ left: '-12%' }}
          animate={{ left: shouldReduceMotion ? '65%' : '105%' }}
          transition={{
            duration: duration,
            ease: [0.25, 0.1, 0.25, 1], // Natural gallop acceleration
          }}
        >
          {/* Galloping up-and-down oscillation */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -9, 3, -11, 0],
                    rotate: [0, 4, -3, 2, 0],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: 0.55,
              ease: 'easeInOut',
            }}
            className="relative flex flex-col items-center"
          >
            {/* SVG Galloping Stallion with Rider */}
            <svg
              className="w-16 h-14 sm:w-20 sm:h-16 text-amber-800 dark:text-amber-500 filter drop-shadow-md"
              viewBox="0 0 120 90"
              fill="currentColor"
            >
              {/* Jockey / Rider */}
              <circle cx="58" cy="22" r="5" fill="#231E1A" />
              <path
                d="M56,27 L50,42 L58,45 L66,35 Z"
                fill="#F59E0B"
              />
              {/* Horse Body */}
              <path
                d="M32,45 C38,40 54,42 70,40 C82,38 90,44 94,52 C88,60 76,62 58,62 C44,62 34,58 32,45 Z"
                fill="currentColor"
              />
              {/* Horse Neck & Head */}
              <path
                d="M68,40 L84,24 C88,20 94,22 96,28 L94,36 L86,44 Z"
                fill="currentColor"
              />
              {/* Mane */}
              <path
                d="M74,28 Q78,20 84,24 Q78,32 74,38 Z"
                fill="#78350F"
              />
              {/* Front Legs Galloping */}
              <path
                d="M86,52 L102,68 L108,66 M80,54 L94,74 L90,78"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hind Legs Galloping */}
              <path
                d="M40,54 L22,70 L14,64 M48,56 L32,76 L26,72"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Tail flowing in wind */}
              <path
                d="M32,46 Q16,40 8,50 Q18,52 30,52 Z"
                fill="#78350F"
              />
            </svg>

            {/* Dust cloud kickback behind hooves */}
            <motion.div
              animate={{ opacity: [0.2, 0.7, 0], scale: [0.8, 1.4, 0.9] }}
              transition={{ repeat: Infinity, duration: 0.35 }}
              className="absolute -left-3 bottom-0 w-4 h-2 bg-amber-600/30 rounded-full blur-[1px]"
            />
          </motion.div>
        </motion.div>

        {/* --- ANIMATED SLEEK RED CAR --- */}
        <motion.div
          key={`car-${raceKey}`}
          className="absolute bottom-2 sm:bottom-3 z-30"
          initial={{ left: '-18%' }}
          animate={{ left: shouldReduceMotion ? '55%' : '108%' }}
          transition={{
            duration: duration,
            delay: 0.2, // Car launches shortly after the horse leaps
            ease: [0.35, 0, 0.15, 1], // Turbo acceleration catching up!
          }}
        >
          {/* Car body with engine vibration */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: 0.15 }}
            className="relative flex flex-col items-center"
          >
            {/* SVG Red Sports / Convertible Car */}
            <svg
              className="w-24 h-12 sm:w-32 sm:h-16 filter drop-shadow-xl"
              viewBox="0 0 160 80"
              fill="none"
            >
              {/* Headlight beam shining forward */}
              <polygon
                points="150,50 190,42 190,62 150,56"
                fill="url(#headlightBeam)"
                opacity="0.65"
              />

              <defs>
                <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="redCarPaint" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="45%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>
              </defs>

              {/* Aerodynamic Wind Trails */}
              <line
                x1="10"
                y1="34"
                x2="35"
                y2="34"
                stroke="#FCA5A5"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              <line
                x1="2"
                y1="40"
                x2="28"
                y2="40"
                stroke="#FCA5A5"
                strokeWidth="1.5"
                strokeDasharray="6 3"
                opacity="0.8"
              />

              {/* Lower Chassis / Ground shadow */}
              <ellipse cx="80" cy="68" rx="65" ry="4" fill="rgba(0,0,0,0.4)" />

              {/* Main Red Car Body */}
              <path
                d="M15,55 L25,55 L35,42 L70,30 L115,30 L140,46 L152,52 L152,60 L144,62 L18,62 Z"
                fill="url(#redCarPaint)"
              />

              {/* Sleek Cabin / Tinted Glass Windshield */}
              <path
                d="M68,32 L88,32 L112,44 L60,44 Z"
                fill="#1E293B"
                opacity="0.9"
              />
              {/* Windshield Reflection */}
              <path
                d="M72,34 L82,34 L76,42 L66,42 Z"
                fill="#94A3B8"
                opacity="0.5"
              />

              {/* Car Side Door Accent Line */}
              <path
                d="M62,45 L108,45 L104,58 L58,58 Z"
                stroke="#B91C1C"
                strokeWidth="1.2"
                fill="none"
              />

              {/* Front Headlight */}
              <circle cx="149" cy="53" r="3.5" fill="#FEF08A" />
              {/* Rear Tail-Light */}
              <rect x="14" y="52" width="4" height="6" rx="1.5" fill="#F87171" />

              {/* Rear Wheel with Rotating Spokes */}
              <g transform="translate(42, 60)">
                <circle cx="0" cy="0" r="10" fill="#0F172A" />
                <circle cx="0" cy="0" r="6" fill="#94A3B8" />
                <circle cx="0" cy="0" r="2" fill="#F8FAFC" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#0F172A" strokeWidth="1.5" />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#0F172A" strokeWidth="1.5" />
              </g>

              {/* Front Wheel with Rotating Spokes */}
              <g transform="translate(122, 60)">
                <circle cx="0" cy="0" r="10" fill="#0F172A" />
                <circle cx="0" cy="0" r="6" fill="#94A3B8" />
                <circle cx="0" cy="0" r="2" fill="#F8FAFC" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#0F172A" strokeWidth="1.5" />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#0F172A" strokeWidth="1.5" />
              </g>
            </svg>

            {/* Exhaust puff animation */}
            <motion.div
              animate={{ opacity: [0.1, 0.6, 0], scale: [0.7, 1.3, 0.8], x: [-2, -10, -18] }}
              transition={{ repeat: Infinity, duration: 0.25 }}
              className="absolute left-1 bottom-4 w-3 h-2 bg-gray-400/40 rounded-full blur-[1px]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Sprint Finished Notification Callout */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mt-2 pt-1 text-xs text-ink-700 dark:text-cream-300 border-t border-cream-200 dark:border-ink-800"
        >
          <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
            <Flag className="w-3.5 h-3.5" />
            <span>Red Car crossed the finish line! Full fleet ready below.</span>
          </div>

          <button
            onClick={handleRestart}
            className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Race again</span>
            <RotateCcw className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
