import React from 'react';
import {
  Car,
  Bike,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Settings,
  Flame,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { DashboardStats, User, Vehicle, InterestSubmission } from '@/types';

interface AdminDashboardProps {
  stats: DashboardStats;
  vehicles: Vehicle[];
  leads: InterestSubmission[];
  currentUser: User;
  onNavigateTab: (tab: 'fleet' | 'settings') => void;
  onSelectVehicleForCRM?: (vehicleIdOrName: string) => void;
  onSelectStatusForFleet: (status: string) => void;
  onExportCSV?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  vehicles,
  leads,
  currentUser,
  onNavigateTab,
  onSelectStatusForFleet,
}) => {
  const bookedCount = vehicles.filter((v) => v.status === 'Booked').length;
  const availableCount = vehicles.filter((v) => v.status === 'Available').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'Maintenance').length;
  const totalVehicles = vehicles.length;
  const carCount = vehicles.filter((v) => v.type === 'car').length;
  const bikeCount = vehicles.filter((v) => v.type === 'bike').length;

  const kpis = [
    {
      title: 'Vehicles Currently Booked',
      value: `${bookedCount} / ${totalVehicles}`,
      sub: `${availableCount} Available • ${maintenanceCount} in Service`,
      icon: KeyRound,
      isPrimary: true,
      badge: `${bookedCount} Active Rentals`,
      badgeColor: 'bg-red-600 text-white',
      onClick: () => {
        onSelectStatusForFleet('Booked');
        onNavigateTab('fleet');
      },
    },
    {
      title: 'Available for Immediate Hire',
      value: `${availableCount} Vehicles`,
      sub: `${carCount} Cars & ${bikeCount} Bikes ready in Kakinada`,
      icon: CheckCircle2,
      badge: 'Ready to Dispatch',
      badgeColor: 'bg-emerald-600 text-white',
      onClick: () => {
        onSelectStatusForFleet('Available');
        onNavigateTab('fleet');
      },
    },
    {
      title: 'Total Fleet Capacity',
      value: `${totalVehicles} Units`,
      sub: `${carCount} Cars, SUVs & ${bikeCount} Bikes, Scooters`,
      icon: Car,
      badge: 'Full Inventory',
      badgeColor: 'bg-blue-600 text-white',
      onClick: () => {
        onSelectStatusForFleet('all');
        onNavigateTab('fleet');
      },
    },
    {
      title: 'Maintenance & Service',
      value: `${maintenanceCount} Units`,
      sub: maintenanceCount > 0 ? 'Under routine technical inspection' : 'All vehicles in prime operating condition',
      icon: AlertTriangle,
      badge: maintenanceCount > 0 ? 'In Garage' : '100% Operational',
      badgeColor: maintenanceCount > 0 ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-emerald-400',
      onClick: () => {
        onSelectStatusForFleet('Maintenance');
        onNavigateTab('fleet');
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-black text-white border border-neutral-800 shadow-xl">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-red-500 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            Operations Console • Kakinada
          </span>
          <h2 className="font-display text-2xl font-black mt-2 text-white">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Role: <strong className="uppercase text-red-500">{currentUser.role}</strong> • Fleet management, tariffs & location operations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('settings')}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-red-500" />
            <span>Hub & Settings</span>
          </button>

          <button
            onClick={() => onNavigateTab('fleet')}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-md shadow-red-600/30 flex items-center gap-1.5"
          >
            <Car className="w-3.5 h-3.5" />
            <span>Manage Fleet</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.onClick}
              className={`rounded-2xl p-5 border cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between ${
                kpi.isPrimary
                  ? 'bg-neutral-950 text-white border-red-600/60 dark:border-red-600'
                  : 'bg-white dark:bg-neutral-900 text-black dark:text-white border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl ${kpi.isPrimary ? 'bg-red-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-red-600'}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <p className="font-display text-3xl font-black">
                  {kpi.value}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px]">
                  <span className="text-neutral-500 dark:text-neutral-400 truncate">{kpi.sub}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${kpi.badgeColor}`}>
                    {kpi.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requirement 1: Booked Vehicles Overview Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display font-black text-lg text-black dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-red-600" />
              <span>Fleet Booking Status: {bookedCount} of {totalVehicles} Vehicles Booked</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Live status breakdown of self-drive cars and bikes across Kakinada
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectStatusForFleet('Booked');
                onNavigateTab('fleet');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-black bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors"
            >
              View {bookedCount} Booked
            </button>
            <button
              onClick={() => {
                onSelectStatusForFleet('Available');
                onNavigateTab('fleet');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 transition-colors"
            >
              View {availableCount} Available
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
          <div
            className="bg-red-600 transition-all duration-500"
            style={{ width: `${(bookedCount / (totalVehicles || 1)) * 100}%` }}
            title={`${bookedCount} Booked`}
          />
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${(availableCount / (totalVehicles || 1)) * 100}%` }}
            title={`${availableCount} Available`}
          />
          <div
            className="bg-amber-500 transition-all duration-500"
            style={{ width: `${(maintenanceCount / (totalVehicles || 1)) * 100}%` }}
            title={`${maintenanceCount} Maintenance`}
          />
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="font-bold text-black dark:text-white">{bookedCount} Booked ({(bookedCount / (totalVehicles || 1) * 100).toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-black dark:text-white">{availableCount} Available ({(availableCount / (totalVehicles || 1) * 100).toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-bold text-black dark:text-white">{maintenanceCount} In Service</span>
          </div>
        </div>
      </div>

      {/* Fleet Inventory Quick Status Grid */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-red-600 text-white">
                <Car className="w-4 h-4" />
              </span>
              <h3 className="font-display font-black text-xl text-black dark:text-white">
                Fleet Inventory & Operational Status
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Current deployment status of cars, SUVs, and bikes across Kakinada
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {totalVehicles} Registered Vehicles
            </span>
            <button
              onClick={() => onNavigateTab('fleet')}
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Manage Fleet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vehicle Demand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 hover:border-red-600/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-12 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img src={v.primaryImage} alt={v.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-black dark:text-white truncate max-w-[150px]">
                    {v.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-neutral-500 font-medium">
                      ₹{v.pricePerDay}/day
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        v.status === 'Booked'
                          ? 'bg-red-600 text-white'
                          : v.status === 'Available'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-black'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge & Action */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                  {v.type === 'car' ? '🚗 Car / SUV' : '🏍️ Bike'}
                </span>
                <button
                  onClick={() => {
                    onSelectStatusForFleet(v.status);
                    onNavigateTab('fleet');
                  }}
                  className="text-[10px] font-extrabold text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Edit in Fleet</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
