import React, { useState, useRef } from 'react';
import { Compass, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface TripType {
  id: string;
  title: string;
  subtitle: string;
  suggestedVehicles: string;
  image: string;
  filterCategory: 'suv' | 'family' | 'compact' | 'roadtrip' | 'business';
}

interface TripPlannerSectionProps {
  onSelectTripType: (trip: TripType) => void;
}

export const TRIP_TYPES: TripType[] = [
  {
    id: 'weekend-escape',
    title: 'Weekend Escape',
    subtitle: 'SUVs & Premium vehicles',
    suggestedVehicles: 'SUVs & Premium vehicles',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    filterCategory: 'suv',
  },
  {
    id: 'family-trip',
    title: 'Family Trip',
    subtitle: 'SUVs & Minivans',
    suggestedVehicles: 'SUVs & Minivans',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    filterCategory: 'family',
  },
  {
    id: 'city-break',
    title: 'City Break',
    subtitle: 'Economy & Compact cars',
    suggestedVehicles: 'Economy & Compact cars',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    filterCategory: 'compact',
  },
  {
    id: 'road-trip',
    title: 'Road Trip',
    subtitle: 'SUVs & Full-size cars',
    suggestedVehicles: 'SUVs & Full-size cars',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    filterCategory: 'roadtrip',
  },
  {
    id: 'business-trip',
    title: 'Business Trip',
    subtitle: 'Premium sedans',
    suggestedVehicles: 'Premium sedans',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    filterCategory: 'business',
  },
];

export const TripPlannerSection: React.FC<TripPlannerSectionProps> = ({
  onSelectTripType,
}) => {
  const [selectedId, setSelectedId] = useState<string>('weekend-escape');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedTrip = TRIP_TYPES.find((t) => t.id === selectedId) || TRIP_TYPES[0];

  const handlePrev = () => {
    const currentIndex = TRIP_TYPES.findIndex((t) => t.id === selectedId);
    const prevIndex = (currentIndex - 1 + TRIP_TYPES.length) % TRIP_TYPES.length;
    setSelectedId(TRIP_TYPES[prevIndex].id);
    scrollToTrip(prevIndex);
  };

  const handleNext = () => {
    const currentIndex = TRIP_TYPES.findIndex((t) => t.id === selectedId);
    const nextIndex = (currentIndex + 1) % TRIP_TYPES.length;
    setSelectedId(TRIP_TYPES[nextIndex].id);
    scrollToTrip(nextIndex);
  };

  const scrollToTrip = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleCardClick = (trip: TripType) => {
    setSelectedId(trip.id);
  };

  return (
    <section id="trip-planner" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header with Navigation Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-orange-500 mb-2">
            <Compass className="w-4 h-4 fill-orange-500/20" />
            <span>START WITH THE JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight leading-tight">
            What kind of trip are you planning?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Pick a trip and we'll point you to the vehicles that fit it best.
          </p>
        </div>

        {/* Carousel Nav Arrows (< and >) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full border border-[#E8DFCF] dark:border-neutral-700 bg-[#FFFDF7] dark:bg-neutral-900 text-stone-800 dark:text-neutral-200 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center transition-all shadow-sm active:scale-95"
            aria-label="Previous trip type"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full border border-[#E8DFCF] dark:border-neutral-700 bg-[#FFFDF7] dark:bg-neutral-900 text-stone-800 dark:text-neutral-200 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center transition-all shadow-sm active:scale-95"
            aria-label="Next trip type"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Trip Cards Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x scroll-smooth"
      >
        {TRIP_TYPES.map((trip) => {
          const isSelected = trip.id === selectedId;
          return (
            <div
              key={trip.id}
              onClick={() => handleCardClick(trip)}
              className={`flex-shrink-0 w-64 sm:w-72 h-80 rounded-3xl overflow-hidden relative cursor-pointer snap-start transition-all duration-300 ${
                isSelected
                  ? 'ring-4 ring-orange-500 shadow-2xl scale-[1.02]'
                  : 'border border-[#E8DFCF] dark:border-neutral-800 opacity-90 hover:opacity-100 hover:scale-[1.01]'
              }`}
            >
              {/* Background Image */}
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
              />

              {/* Bottom Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Card Title & Subtitle */}
              <div className="absolute bottom-5 left-5 right-5 z-10 text-left">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {trip.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 font-medium">
                  {trip.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Recommendation Banner (Directly Matching Screenshot 3) */}
      <div className="mt-8 rounded-3xl bg-[#F4EEDF] dark:bg-neutral-900/90 border border-[#E8DFCF] dark:border-neutral-800 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm sm:text-base text-stone-800 dark:text-neutral-200 font-medium">
          For a <span className="font-bold text-stone-900 dark:text-white">{selectedTrip.title}</span> we'd
          suggest{' '}
          <span className="font-extrabold text-orange-600 dark:text-orange-500">
            {selectedTrip.suggestedVehicles}
          </span>
          .
        </div>

        <button
          onClick={() => onSelectTripType(selectedTrip)}
          className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 group flex-shrink-0"
        >
          <span>Search these vehicles</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
