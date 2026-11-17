import React from 'react';
import { MapPin, Phone, Clock, Navigation, CheckCircle2, X } from 'lucide-react';

interface LocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHub?: (hubName: string) => void;
}

export const HUB_LOCATIONS = [
  {
    id: 'kakinada-main',
    name: 'Kakinada Main City Hub',
    address: 'Near Bhanugudi Junction, Main Road, Kakinada, AP - 533003',
    hours: '24/7 All Day Pick-Up & Drop',
    phone: '+91 88857 57966',
    tag: 'Flagship Operations Hub',
    distance: '0.0 km',
  },
  {
    id: 'kakinada-station',
    name: 'Kakinada Town Railway Station Counter',
    address: 'Platform 1 Exit Concourse, Kakinada Town Station',
    hours: '06:00 AM – 11:30 PM Daily',
    phone: '+91 94942 12346',
    tag: 'Instant Train Passenger Delivery',
    distance: '1.8 km',
  },
  {
    id: 'rajahmundry-airport',
    name: 'Rajahmundry Airport (RJA) Express Shuttle Point',
    address: 'Arrivals Terminal Forecourt, Madhurapudi',
    hours: 'Flights Schedule Aligned (24/7)',
    phone: '+91 94942 12347',
    tag: 'Free Shuttle Connect Hub',
    distance: '58 km',
  },
  {
    id: 'uppada-beach',
    name: 'Uppada Coastal Scenic Beach Hub',
    address: 'Beach Road Highway, Uppada Promenade',
    hours: '08:00 AM – 08:00 PM',
    phone: '+91 94942 12348',
    tag: 'Touring & Sunset Drives',
    distance: '14 km',
  },
];

export const LocationsModal: React.FC<LocationsModalProps> = ({
  isOpen,
  onClose,
  onSelectHub,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FFFDF7] dark:bg-neutral-900 border border-[#E8DFCF] dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative max-h-[90dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-neutral-400 hover:text-black dark:hover:text-white bg-[#F6F0DF] dark:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Close locations"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-xs font-black uppercase text-orange-500 mb-2">
          <MapPin className="w-4 h-4 fill-orange-500/20" />
          <span>RENTAL HUBS & PICKUP POINTS</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          Convenient Rental Locations
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-neutral-400 mt-1 mb-6">
          Pickup and drop off your vehicle at any of our verified Godavari district hubs or request doorstep delivery.
        </p>

        <div className="space-y-4">
          {HUB_LOCATIONS.map((hub) => (
            <div
              key={hub.id}
              className="p-5 rounded-2xl border border-[#E8DFCF] dark:border-neutral-800 bg-[#F6F0DF]/50 dark:bg-neutral-950/60 hover:border-orange-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-black dark:text-white">
                    {hub.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900">
                    {hub.tag}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {hub.address}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    {hub.hours}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    {hub.phone}
                  </span>
                </div>
              </div>

              {onSelectHub && (
                <button
                  onClick={() => {
                    onSelectHub(hub.name);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Select Hub</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
