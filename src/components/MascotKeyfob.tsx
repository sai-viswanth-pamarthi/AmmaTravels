import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Key, Zap } from 'lucide-react';

interface MascotKeyfobProps {
  className?: string;
  onIgnite?: () => void;
}

export const MascotKeyfob: React.FC<MascotKeyfobProps> = ({ className = '', onIgnite }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -70, rotate: -15, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, rotate: isHovered ? 4 : -2, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 18,
        delay: 0.25,
      }}
      className={`relative inline-block select-none cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onClick={() => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 300);
        onIgnite?.();
      }}
    >
      {/* Hand-Drawn Annotation Arrow */}
      <div className="absolute -top-10 -right-16 hidden sm:flex items-center gap-1 text-amber-500 font-hand text-xl font-bold rotate-6 pointer-events-none">
        <span>Click to rev! ⤵</span>
      </div>

      {/* Main Mascot Keyfob Body */}
      <div className="relative w-36 sm:w-44 bg-gradient-to-b from-zinc-900 to-black p-3.5 rounded-[2.25rem] border-2 border-zinc-700 shadow-2xl shadow-red-600/20 transform transition-transform duration-300 hover:scale-105">
        {/* Leather Lanyard Loop */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-amber-500/80 bg-zinc-950 flex items-center justify-center shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>

        {/* Carbon Fiber Inset */}
        <div className="w-full bg-zinc-950 rounded-[1.75rem] p-3 border border-zinc-800 flex flex-col items-center justify-center">
          {/* Top Brand Wordmark */}
          <div className="flex items-center gap-1 mb-2">
            <span className="font-display text-[10px] font-black tracking-widest text-white uppercase">
              AMMA<span className="text-red-500">KEY</span>
            </span>
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          </div>

          {/* Glowing Engine Start / Stop Button */}
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 border-2 ${
              isPressed || isHovered
                ? 'bg-red-600 border-red-400 shadow-[0_0_25px_rgba(220,38,38,0.7)] scale-95'
                : 'bg-gradient-to-br from-red-600 to-red-800 border-red-500/70 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
            }`}
          >
            {/* Outer Tachometer Ring Dots */}
            <div className="absolute inset-1 rounded-full border border-dashed border-white/40 pointer-events-none" />

            <span className="text-[8px] font-black tracking-widest uppercase text-white/90">START</span>
            <div className="w-5 h-5 my-0.5 rounded-full bg-white/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-[7px] font-bold tracking-widest uppercase text-white/80">ENGINE</span>
          </div>

          {/* RPM Mini Gauge */}
          <div className="w-full mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono font-bold text-zinc-400 px-1">
            <span className="text-amber-400">0.0 KM</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-white">READY</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
