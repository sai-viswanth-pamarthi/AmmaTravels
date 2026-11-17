import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(onComplete, 450);
    }, 1100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070D18] text-white overflow-hidden"
        >
          {/* Animated Road Lines Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
            <div className="w-[120%] h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
          </div>

          {/* Rolling Alloy Wheel with Glowing Tread */}
          <div className="relative w-24 h-24 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
              className="w-full h-full relative"
            >
              <svg
                className="w-full h-full text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Heavy All-Terrain Tyre Outer Ring with Deep Grooves */}
                <circle cx="50" cy="50" r="44" stroke="#1E293B" strokeWidth="10" />
                <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" strokeDasharray="14 6" strokeLinecap="round" />
                
                {/* High-Gloss Alloy Rim */}
                <circle cx="50" cy="50" r="30" stroke="#FFFFFF" strokeWidth="3" />
                <circle cx="50" cy="50" r="28" stroke="#3B82F6" strokeWidth="1.5" />
                
                {/* Center Hub Emblem */}
                <circle cx="50" cy="50" r="11" fill="#2563EB" />
                <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
                
                {/* 5-Spoke Alloy Pattern */}
                <line x1="50" y1="20" x2="50" y2="80" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="28" y1="28" x2="72" y2="72" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="28" y1="72" x2="72" y2="28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </motion.div>

            {/* Glowing Ground Reflection */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-2 bg-blue-500/40 rounded-full blur-sm" />
          </div>

          {/* Typography & Brand Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center space-y-1.5"
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
                Amma<span className="text-blue-500">Travels</span><span className="text-blue-400 lowercase font-extrabold text-xl">kkd</span>
              </span>
            </div>
            <p className="text-[11px] text-blue-200/80 font-bold tracking-widest uppercase">
              Amma Enterprises · Kakinada Self-Drive Fleet
            </p>
            <div className="flex items-center justify-center gap-1 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
