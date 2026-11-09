import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Gauge, MapPin } from 'lucide-react';

interface HighwayMilestonesProps {
  onSelectSection: (sectionId: string) => void;
}

export const HighwayMilestones: React.FC<HighwayMilestonesProps> = ({ onSelectSection }) => {
  const [activeSection, setActiveSection] = useState('hero');

  const milestones = [
    { id: 'hero', km: '00.0', label: 'Flagoff' },
    { id: 'offers', km: '05.2', label: 'Offers' },
    { id: 'trip-planner', km: '10.0', label: 'Trips' },
    { id: 'vehicles', km: '15.4', label: 'Fleet' },
    { id: 'how-it-works', km: '25.0', label: 'Guide' },
    { id: 'testimonials', km: '38.2', label: 'Reviews' },
    { id: 'faq', km: '50.0', label: 'FAQ' },
    { id: 'contact', km: '65.0', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (let i = milestones.length - 1; i >= 0; i--) {
        const el = document.getElementById(milestones[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(milestones[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      aria-label="Coastal Highway Navigation Metaphor"
      className="fixed left-4 bottom-6 z-40 hidden xl:flex flex-col gap-2 p-2 rounded-2xl bg-black/85 backdrop-blur-xl border border-zinc-800 shadow-2xl text-white select-none transition-all duration-300"
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 border-b border-zinc-800/80">
        <Gauge className="w-3.5 h-3.5 text-red-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-display">
          MILEPOSTS
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {milestones.map((m) => {
          const isActive = activeSection === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectSection(m.id)}
              className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-xl text-left transition-all duration-200 group ${
                isActive
                  ? 'bg-red-600/20 text-white border border-red-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    isActive ? 'bg-red-500 ring-2 ring-red-500/50 scale-125' : 'bg-zinc-600'
                  }`}
                />
                <span className="text-[11px] font-bold font-display">{m.label}</span>
              </div>
              <span
                className={`text-[10px] font-mono ${
                  isActive ? 'text-amber-400 font-bold' : 'text-zinc-500'
                }`}
              >
                {m.km}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
