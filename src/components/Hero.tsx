import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Car,
  Calendar,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  ChevronDown,
  Clock,
  Compass
} from 'lucide-react';

interface HeroProps {
  onSelectOption: (section: 'vehicles' | 'events') => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectOption }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking for parallax and day-to-night transitions
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Day to night sky gradient: Dawn/Day teal (#0A3641) -> Dusk amber (#1B2735) -> Deep Night (#041014)
  const skyColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      'linear-gradient(180deg, #07262F 0%, #0A3641 45%, #184855 75%, #E58B24 100%)',
      'linear-gradient(180deg, #0B192C 0%, #0D2636 50%, #1E3E50 80%, #C26D18 100%)',
      'linear-gradient(180deg, #020B10 0%, #04141C 50%, #08212C 85%, #102B36 100%)',
    ]
  );

  const mountainY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const roadY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const vehicleProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Card 3D tilt state
  const [tiltVehicle, setTiltVehicle] = useState({ x: 0, y: 0 });
  const [tiltEvent, setTiltEvent] = useState({ x: 0, y: 0 });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    setter: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  ) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setter({ x, y });
  };

  const handleMouseLeave = (
    setter: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  ) => {
    setter({ x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[105vh] flex flex-col justify-between overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Dynamic Animated Sky Background */}
      <motion.div
        className="absolute inset-0 -z-30 pointer-events-none transition-colors duration-700"
        style={{ background: skyColor }}
      />

      {/* Atmospheric Star / Dust Field */}
      <div className="absolute inset-0 -z-25 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* Layered Parallax Scenery: Mountains, Coastline, Road */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        {/* Distant Mountains Ridge */}
        <motion.svg
          style={{ y: mountainY }}
          className="absolute bottom-16 sm:bottom-20 left-0 right-0 w-full h-48 sm:h-72 text-teal-950/60 opacity-80"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          fill="currentColor"
        >
          <path d="M0,192L60,176C120,160,240,128,360,138.7C480,149,600,203,720,208C840,213,960,171,1080,165.3C1200,160,1320,192,1380,208L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </motion.svg>

        {/* Coastal Ocean Water Layer */}
        <svg
          className="absolute bottom-10 left-0 right-0 w-full h-32 text-teal-900/40 opacity-70"
          preserveAspectRatio="none"
          viewBox="0 0 1440 180"
          fill="currentColor"
        >
          <path d="M0,64L80,80C160,96,320,128,480,122.7C640,117,800,75,960,69.3C1120,64,1280,96,1360,112L1440,128L1440,180L0,180Z" />
        </svg>

        {/* Foreground Coastal Winding Road */}
        <motion.svg
          style={{ y: roadY }}
          className="absolute bottom-0 left-0 right-0 w-full h-28 sm:h-36 text-charcoal-950/90"
          preserveAspectRatio="none"
          viewBox="0 0 1440 160"
          fill="currentColor"
        >
          <path d="M0,120 C320,60, 520,140, 840,90 C1140,40, 1340,100, 1440,80 L1440,160 L0,160 Z" />
        </motion.svg>

        {/* Road Center Dotted Line */}
        <svg
          className="absolute bottom-3 sm:bottom-4 left-0 right-0 w-full h-8 opacity-60"
          preserveAspectRatio="none"
          viewBox="0 0 1440 20"
        >
          <path
            d="M0,15 C320,8, 520,17, 840,11 C1140,6, 1340,12, 1440,10"
            fill="none"
            stroke="#E58B24"
            strokeWidth="2.5"
            strokeDasharray="16 14"
          />
        </svg>

        {/* Animated Vehicle Driving Across Road (Car and Bike on Scroll) */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute bottom-5 sm:bottom-7 flex items-center gap-6 z-10 pointer-events-none"
            style={{
              left: `${Math.min(vehicleProgress.get(), 92)}%`,
              transition: 'left 0.1s linear',
            }}
          >
            {/* Animated Car Icon silhouette with headlight glow */}
            <div className="relative flex items-center">
              <div className="p-1.5 bg-teal-900/90 rounded-full border border-saffron-500/60 shadow-lg shadow-saffron-500/20 text-saffron-400">
                <Car className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="w-8 h-3 bg-gradient-to-r from-saffron-400/40 to-transparent blur-[1px] -mr-6" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Hero Headline & Subtitle */}
      <div className="max-w-5xl mx-auto text-center z-10 mt-6 sm:mt-10">
        {/* Hub Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/60 border border-teal-700/60 backdrop-blur-md text-saffron-400 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-sm"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Kakinada, Andhra Pradesh • Premium Fleet & Event Management</span>
        </motion.div>

        {/* Kinetic Animated Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-warm-50 tracking-tight leading-[1.1]"
        >
          Amma<span className="text-saffron-500">Travels</span>
          <span className="block mt-2 text-2xl sm:text-4xl md:text-5xl font-semibold text-warm-200/95 font-sans">
            Every journey, a celebration.
          </span>
        </motion.h1>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-warm-100/80 font-normal leading-relaxed"
        >
          Experience pristine self-drive cars, rugged adventure bikes with 360° virtual inspection,
          and turnkey luxury event logistics curated in Kakinada.
        </motion.p>
      </div>

      {/* Two Large Animated Choice Cards (Vehicle Rental vs Event Management) */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 my-10 z-10">
        {/* Choice Card 1: Car & Bike Rentals */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          onMouseMove={(e) => handleMouseMove(e, setTiltVehicle)}
          onMouseLeave={() => handleMouseLeave(setTiltVehicle)}
          style={{
            transform: shouldReduceMotion
              ? 'none'
              : `perspective(1000px) rotateX(${tiltVehicle.y}deg) rotateY(${tiltVehicle.x}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          onClick={() => onSelectOption('vehicles')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl bg-teal-900/60 dark:bg-charcoal-900/70 border border-teal-700/60 hover:border-saffron-500/70 p-6 sm:p-8 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-saffron-500/10 transition-all duration-300"
        >
          {/* Subtle warm accent glow on hover */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-saffron-500/15 rounded-full blur-2xl group-hover:bg-saffron-500/25 transition-all" />

          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-800/80 border border-teal-700 flex items-center justify-center text-saffron-400 group-hover:bg-saffron-500 group-hover:text-teal-950 transition-colors shadow-sm">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-saffron-400 bg-saffron-500/10 px-2.5 py-1 rounded-md border border-saffron-500/30">
              Self-Drive & Rider
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-warm-50 group-hover:text-saffron-300 transition-colors">
            Rent a Car or Bike
          </h3>
          <p className="mt-2 text-sm text-warm-100/75 leading-relaxed">
            Choose from Swift, Creta, Fortuner 4x4, Royal Enfield Classic, Himalayan & Activa.
            Enjoy 360° interactive views, zero security deposit traps, and transparent daily/weekly pricing.
          </p>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-teal-800/60">
            <div className="flex items-center gap-3 text-xs text-warm-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-saffron-400" /> Sanitized
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-saffron-400" /> Instant Confirm
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-saffron-400 group-hover:translate-x-1 transition-transform">
              Browse Fleet <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </motion.div>

        {/* Choice Card 2: Event Management Packages */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          onMouseMove={(e) => handleMouseMove(e, setTiltEvent)}
          onMouseLeave={() => handleMouseLeave(setTiltEvent)}
          style={{
            transform: shouldReduceMotion
              ? 'none'
              : `perspective(1000px) rotateX(${tiltEvent.y}deg) rotateY(${tiltEvent.x}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          onClick={() => onSelectOption('events')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl bg-teal-900/60 dark:bg-charcoal-900/70 border border-teal-700/60 hover:border-saffron-500/70 p-6 sm:p-8 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-saffron-500/10 transition-all duration-300"
        >
          {/* Subtle warm accent glow on hover */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all" />

          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-800/80 border border-teal-700 flex items-center justify-center text-saffron-400 group-hover:bg-saffron-500 group-hover:text-teal-950 transition-colors shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-saffron-400 bg-saffron-500/10 px-2.5 py-1 rounded-md border border-saffron-500/30">
              End-to-End Logistics
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-warm-50 group-hover:text-saffron-300 transition-colors">
            Plan Your Event
          </h3>
          <p className="mt-2 text-sm text-warm-100/75 leading-relaxed">
            Weddings, corporate summits, destination tours, and birthdays in Godavari & Kakinada.
            Complete with VIP bridal cars, luxury guest shuttles, and on-ground coordinators.
          </p>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-teal-800/60">
            <div className="flex items-center gap-3 text-xs text-warm-200">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-saffron-400" /> Turnkey Decor
              </span>
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-saffron-400" /> Full Godavari
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-saffron-400 group-hover:translate-x-1 transition-transform">
              View Packages <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator & Trust Bar */}
      <div className="z-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto w-full pt-4 text-xs text-warm-200/80 border-t border-teal-800/40">
        <div className="flex items-center gap-6">
          <span className="font-medium text-warm-100">✓ 100% Verified Fleet</span>
          <span className="font-medium text-warm-100">✓ Complimentary Helmets</span>
          <span className="font-medium text-warm-100">✓ 24/7 Roadside Assistance</span>
        </div>

        <button
          onClick={() => onSelectOption('vehicles')}
          className="flex items-center gap-1 text-saffron-400 hover:text-saffron-300 font-medium transition-colors"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
