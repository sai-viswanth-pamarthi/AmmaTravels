import React, { useState } from 'react';
import { Bus, Clock, MapPin, CheckCircle2, Navigation, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface ShuttleTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShuttleTrackerModal: React.FC<ShuttleTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const shuttles = [
    {
      id: 'SH-01',
      route: 'Rajahmundry Airport (RJA) ⇄ Kakinada Central Hub',
      driver: 'Ramesh V. (Verified Chauffeur)',
      status: 'In Transit',
      statusColor: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
      nextStop: 'Samalkot Flyover',
      eta: '18 mins away',
      seatsAvailable: 4,
      busNumber: 'AP 05 TJ 9901 (Force Traveller A/C)',
    },
    {
      id: 'SH-02',
      route: 'Kakinada Town Railway Station ⇄ Bhanugudi Hub',
      driver: 'Suresh Babu',
      status: 'On Schedule at Platform',
      statusColor: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800',
      nextStop: 'Departing for Bhanugudi Hub',
      eta: '4 mins away',
      seatsAvailable: 8,
      busNumber: 'AP 05 TC 2210 (Innova Crysta VIP Shuttle)',
    },
    {
      id: 'SH-03',
      route: 'Kakinada Central Hub ⇄ Uppada Beach Resort Hub',
      driver: 'Kalyan K.',
      status: 'Scheduled',
      statusColor: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
      nextStop: 'Scheduled Departure at 05:00 PM',
      eta: 'Departs in 35 mins',
      seatsAvailable: 6,
      busNumber: 'AP 05 TT 4180 (A/C Ertiga Shuttle)',
    },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FFFDF7] dark:bg-neutral-900 border border-[#E8DFCF] dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-black dark:hover:text-white bg-[#F6F0DF] dark:bg-neutral-800 transition-colors"
          aria-label="Close shuttle tracker"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-2 pr-10">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 dark:text-blue-400">
            <Bus className="w-4 h-4 fill-blue-500/20" />
            <span>LIVE SHUTTLE TELEMETRY</span>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-blue-600 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          Complimentary Shuttle Tracker
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-neutral-400 mt-1 mb-6">
          Track our free airport, railway station, and intra-hub express customer shuttles in real-time.
        </p>

        <div className="space-y-4">
          {shuttles.map((shuttle) => (
            <div
              key={shuttle.id}
              className="p-5 rounded-2xl border border-[#E8DFCF] dark:border-neutral-800 bg-[#F6F0DF]/50 dark:bg-neutral-950/60 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-white bg-blue-600 px-2 py-0.5 rounded-md">
                    {shuttle.id}
                  </span>
                  <span className="font-extrabold text-sm sm:text-base text-black dark:text-white">
                    {shuttle.route}
                  </span>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${shuttle.statusColor}`}>
                  {shuttle.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span>Next: <strong className="text-black dark:text-white">{shuttle.nextStop}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span>ETA: <strong className="text-orange-600 dark:text-orange-400">{shuttle.eta}</strong></span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {shuttle.driver} • {shuttle.busNumber}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {shuttle.seatsAvailable} Free Seats Available
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2.5">
          <Bus className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span>
            Need an instant private transfer? Show your Amma Travels rental reservation number at any hub desk for VIP priority pickup.
          </span>
        </div>
      </div>
    </div>
  );
};
