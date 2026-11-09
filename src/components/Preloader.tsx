import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(onComplete, 400);
    }, 900); // Fast, under 1s load
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
        >
          {/* Rolling Wheel Icon */}
          <div className="relative w-20 h-20 mb-6">
            <svg
              className="w-full h-full animate-roll-wheel text-red-600"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer tyre */}
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" strokeDasharray="14 6" />
              {/* Inner rim */}
              <circle cx="50" cy="50" r="28" stroke="#FFFFFF" strokeWidth="4" />
              {/* Hub */}
              <circle cx="50" cy="50" r="10" fill="#DC2626" />
              {/* Spokes */}
              <line x1="50" y1="22" x2="50" y2="78" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="22" y1="50" x2="78" y2="50" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="30" y1="30" x2="70" y2="70" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="30" y1="70" x2="70" y2="30" stroke="#FFFFFF" strokeWidth="3" />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="font-display font-black text-2xl tracking-wider text-white">
              AMMA<span className="text-red-600">TRAVELS</span>
            </h2>
            <p className="text-xs text-zinc-400 tracking-widest uppercase mt-1 font-semibold">
              Pure Self-Drive Adrenaline
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
