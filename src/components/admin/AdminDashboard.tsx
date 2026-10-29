import React from 'react';
import {
  Car,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  BarChart3,
  Download
} from 'lucide-react';
import { DashboardStats, User } from '@/types';

interface AdminDashboardProps {
  stats: DashboardStats;
  currentUser: User;
  onNavigateTab: (tab: 'crm' | 'fleet' | 'events') => void;
  onExportCSV: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  currentUser,
  onNavigateTab,
  onExportCSV,
}) => {
  const kpis = [
    {
      title: 'Total Active Fleet',
      value: stats.totalVehicles,
      sub: `${stats.availableVehicles} Available • ${stats.bookedVehicles} On Rent`,
      icon: Car,
      color: 'teal',
      badge: `${Math.round((stats.availableVehicles / (stats.totalVehicles || 1)) * 100)}% Ready`,
    },
    {
      title: 'New Enquiries Today',
      value: stats.newEnquiriesToday,
      sub: `${stats.eventEnquiries} Events • ${stats.totalVehicles} Rides`,
      icon: Clock,
      color: 'amber',
      badge: 'Action Required',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      sub: 'Active reservations & verified docs',
      icon: CheckCircle2,
      color: 'emerald',
      badge: '+18% this month',
    },
    {
      title: 'Estimated Revenue Run-Rate',
      value: `₹${(stats.estimatedRevenue || 148500).toLocaleString('en-IN')}`,
      sub: 'Based on locked rental durations',
      icon: TrendingUp,
      color: 'saffron',
      badge: 'Target on track',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-teal-950 text-warm-50 border border-teal-900 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 bg-teal-900/80 px-2.5 py-1 rounded">
            Operations Console • Kakinada
          </span>
          <h2 className="font-display text-2xl font-bold mt-2">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-teal-200/80 mt-0.5">
            Role: <strong className="uppercase text-saffron-400">{currentUser.role}</strong> • Real-time fleet and CRM telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl bg-teal-900 hover:bg-teal-800 text-warm-100 text-xs font-semibold flex items-center gap-1.5 border border-teal-700/60 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-saffron-400" />
            <span>Export Leads CSV</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigateTab('fleet')}
              className="px-3.5 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Manage Fleet</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-charcoal-900 rounded-2xl p-5 border border-warm-200 dark:border-charcoal-800 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-charcoal-500 dark:text-warm-400">
                  {kpi.title}
                </span>
                <div className="p-2 rounded-xl bg-warm-100 dark:bg-charcoal-800 text-teal-800 dark:text-saffron-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <p className="font-display text-3xl font-extrabold text-charcoal-900 dark:text-warm-50">
                  {kpi.value}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-warm-100 dark:border-charcoal-800 text-[11px]">
                  <span className="text-charcoal-500 dark:text-warm-400 truncate">{kpi.sub}</span>
                  <span className="font-semibold text-teal-800 dark:text-saffron-400 flex-shrink-0">
                    {kpi.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries Over Time Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal-900 rounded-3xl p-6 border border-warm-200 dark:border-charcoal-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-warm-50">
                Enquiry Flow (Last 7 Days)
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-warm-400">
                Daily incoming vehicle rental & event package requests
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 dark:text-saffron-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md">
              +24% vs Last Week
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-warm-200 dark:border-charcoal-800">
            {stats.enquiriesOverTime?.map((item, i) => {
              const maxCount = Math.max(...stats.enquiriesOverTime.map((d) => d.count), 1);
              const heightPct = Math.round((item.count / maxCount) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-charcoal-700 dark:text-warm-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[36px] bg-warm-100 dark:bg-charcoal-800 rounded-t-lg overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-teal-800 to-saffron-500 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-charcoal-500 dark:text-warm-400 font-mono">
                    {item.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Requested Vehicles & Fleet Status (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-charcoal-900 rounded-3xl p-6 border border-warm-200 dark:border-charcoal-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-warm-50">
              Most Requested Fleet Models
            </h3>
            <p className="text-xs text-charcoal-500 dark:text-warm-400">
              Ranked by customer bookings in Godavari district
            </p>

            <div className="mt-5 space-y-3">
              {stats.mostRequestedVehicles?.map((v, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-warm-100 dark:bg-charcoal-800 flex items-center justify-center font-bold text-[10px] text-charcoal-700 dark:text-warm-300">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-charcoal-800 dark:text-warm-100">{v.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-warm-200 dark:bg-charcoal-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-saffron-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, v.count * 12)}%` }}
                      />
                    </div>
                    <span className="font-bold text-charcoal-700 dark:text-warm-300 min-w-[20px] text-right">
                      {v.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-warm-200 dark:border-charcoal-800 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('crm')}
              className="text-xs font-semibold text-teal-800 dark:text-saffron-400 hover:underline flex items-center gap-1"
            >
              <span>View all active leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-charcoal-400">Auto-synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
