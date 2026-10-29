import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  LogOut,
  ExternalLink,
  Shield,
  Download,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { User, Vehicle, EventPackage, InterestSubmission, DashboardStats } from '@/types';
import { AdminDashboard } from './AdminDashboard';
import { AdminLeadsCRM } from './AdminLeadsCRM';
import { AdminFleetManager } from './AdminFleetManager';
import { AdminEventManager } from './AdminEventManager';
import { api } from '@/lib/api';

interface AdminPortalProps {
  currentUser: User;
  onLogout: () => void;
  onReturnToUserSite: () => void;
  onOpen360: (v: Vehicle) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onLogout,
  onReturnToUserSite,
  onOpen360,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'fleet' | 'events'>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 16,
    availableVehicles: 12,
    bookedVehicles: 3,
    maintenanceVehicles: 1,
    newEnquiriesToday: 5,
    confirmedBookings: 8,
    eventEnquiries: 4,
    estimatedRevenue: 148500,
    enquiriesOverTime: [
      { date: '2026-10-22', count: 4 },
      { date: '2026-10-23', count: 6 },
      { date: '2026-10-24', count: 5 },
      { date: '2026-10-25', count: 9 },
      { date: '2026-10-26', count: 7 },
      { date: '2026-10-27', count: 11 },
      { date: '2026-10-28', count: 5 },
    ],
    mostRequestedVehicles: [
      { name: 'Toyota Innova Crysta', count: 14 },
      { name: 'Royal Enfield Himalayan 450', count: 11 },
      { name: 'Hyundai Creta SX(O)', count: 9 },
      { name: 'Mahindra Thar 4x4 Hardtop', count: 8 },
      { name: 'Honda Activa 6G', count: 8 },
    ],
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [packages, setPackages] = useState<EventPackage[]>([]);
  const [leads, setLeads] = useState<InterestSubmission[]>([]);

  const loadData = async () => {
    try {
      const [vList, pList, lList, sData] = await Promise.all([
        api.getVehicles(),
        api.getPackages(),
        api.getInterests(),
        api.getStats(),
      ]);
      setVehicles(vList);
      setPackages(pList);
      setLeads(lList);
      setStats(sData);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = [
      'Ref ID',
      'Category',
      'Item Name',
      'Customer Name',
      'Phone',
      'Email',
      'Pickup/Event Date',
      'Return Date',
      'Location',
      'CRM Stage',
      'Notes',
      'Created At',
    ];

    const rows = leads.map((l) => [
      `"${l.refId}"`,
      `"${l.type}"`,
      `"${(l.vehicleName || l.packageName || '').replace(/"/g, '""')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.pickupDate || l.eventDate || ''}"`,
      `"${l.returnDate || ''}"`,
      `"${(l.pickupLocation || l.cityVenue || '').replace(/"/g, '""')}"`,
      `"${l.progressStage}"`,
      `"${(l.internalNotes || '').replace(/"/g, '""')}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AmmaTravels_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-warm-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-teal-950 border-b border-teal-900 px-4 sm:px-6 lg:px-8 py-3 text-warm-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand & Mode */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-800 to-saffron-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              AT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-warm-50">
                  Amma<span className="text-saffron-500">Travels</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-saffron-500 text-teal-950 rounded">
                  Admin Ops
                </span>
              </div>
              <p className="text-[11px] text-teal-300">Operations Control Center • Kakinada</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-teal-900/60 p-1 rounded-xl border border-teal-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-saffron-500 text-teal-950 shadow-sm'
                  : 'text-warm-200 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'crm'
                  ? 'bg-saffron-500 text-teal-950 shadow-sm'
                  : 'text-warm-200 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leads CRM ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'fleet'
                  ? 'bg-saffron-500 text-teal-950 shadow-sm'
                  : 'text-warm-200 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Fleet ({vehicles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'events'
                  ? 'bg-saffron-500 text-teal-950 shadow-sm'
                  : 'text-warm-200 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Events ({packages.length})</span>
            </button>
          </nav>

          {/* Right Header Actions: User pill, Return to Site, Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReturnToUserSite}
              className="px-3 py-1.5 rounded-lg bg-teal-900/80 hover:bg-teal-800 text-warm-200 hover:text-white text-xs font-medium border border-teal-800 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-saffron-400" />
              <span className="hidden sm:inline">Public Site</span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-teal-900/80 hover:bg-rose-950 text-warm-200 hover:text-rose-300 border border-teal-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center justify-between gap-1 pt-2 border-t border-teal-900 mt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              activeTab === 'dashboard' ? 'bg-saffron-500 text-teal-950' : 'text-warm-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              activeTab === 'crm' ? 'bg-saffron-500 text-teal-950' : 'text-warm-200'
            }`}
          >
            CRM ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              activeTab === 'fleet' ? 'bg-saffron-500 text-teal-950' : 'text-warm-200'
            }`}
          >
            Fleet
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              activeTab === 'events' ? 'bg-saffron-500 text-teal-950' : 'text-warm-200'
            }`}
          >
            Events
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            onExportCSV={handleExportCSV}
          />
        )}

        {activeTab === 'crm' && (
          <AdminLeadsCRM
            leads={leads}
            currentUser={currentUser}
            onRefreshLeads={loadData}
            onExportCSV={handleExportCSV}
          />
        )}

        {activeTab === 'fleet' && (
          <AdminFleetManager
            vehicles={vehicles}
            currentUser={currentUser}
            onRefreshVehicles={loadData}
            onOpen360={onOpen360}
          />
        )}

        {activeTab === 'events' && (
          <AdminEventManager
            packages={packages}
            currentUser={currentUser}
            onRefreshPackages={loadData}
          />
        )}
      </main>
    </div>
  );
};
