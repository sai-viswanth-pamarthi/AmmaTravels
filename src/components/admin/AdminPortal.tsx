import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { User, Vehicle, InterestSubmission, DashboardStats } from '@/types';
import { AdminDashboard } from './AdminDashboard';
import { AdminLeadsCRM } from './AdminLeadsCRM';
import { AdminFleetManager } from './AdminFleetManager';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'fleet'>('dashboard');
  const [selectedVehicleForCRM, setSelectedVehicleForCRM] = useState<string>('all');
  const [selectedStatusForFleet, setSelectedStatusForFleet] = useState<string>('all');

  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 16,
    availableVehicles: 12,
    bookedVehicles: 3,
    maintenanceVehicles: 1,
    newEnquiriesToday: 5,
    confirmedBookings: 8,
    eventEnquiries: 0,
    estimatedRevenue: 148500,
    enquiriesOverTime: [
      { date: '2026-10-25', count: 9 },
      { date: '2026-10-26', count: 7 },
      { date: '2026-10-27', count: 11 },
      { date: '2026-10-28', count: 5 },
      { date: '2026-10-29', count: 8 },
      { date: '2026-10-30', count: 12 },
      { date: '2026-10-31', count: 6 },
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
  const [leads, setLeads] = useState<InterestSubmission[]>([]);

  const loadData = async () => {
    try {
      const [vList, lList, sData] = await Promise.all([
        api.getVehicles(),
        api.getInterests(),
        api.getStats(),
      ]);
      setVehicles(vList);
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
      alert('No customer inquiries available to export.');
      return;
    }

    const headers = [
      'Ref ID',
      'Vehicle Name',
      'Customer Name',
      'Phone',
      'Email',
      'Pickup Date',
      'Return Date',
      'Pickup Location',
      'CRM Stage',
      'Notes',
      'Created At',
    ];

    const rows = leads.map((l) => [
      `"${l.refId}"`,
      `"${(l.vehicleName || '').replace(/"/g, '""')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.pickupDate || ''}"`,
      `"${l.returnDate || ''}"`,
      `"${(l.pickupLocation || '').replace(/"/g, '""')}"`,
      `"${l.progressStage}"`,
      `"${(l.internalNotes || '').replace(/"/g, '""')}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AmmaTravels_Vehicle_Interests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectVehicleForCRM = (vehicleName: string) => {
    setSelectedVehicleForCRM(vehicleName);
    setActiveTab('crm');
  };

  const handleSelectStatusForFleet = (status: string) => {
    setSelectedStatusForFleet(status);
    setActiveTab('fleet');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col font-sans transition-colors duration-300">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-black border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-3 text-white shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand & Mode */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-600/30">
              AT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg tracking-tight text-white">
                  Amma<span className="text-red-600">Travels</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-black bg-red-600 text-white rounded">
                  Admin Ops
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Operations Control Center • Kakinada</p>
            </div>
          </div>

          {/* Tab Navigation (Events removed) */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900 p-1.5 rounded-full border border-neutral-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setSelectedVehicleForCRM('all');
                setActiveTab('crm');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'crm'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Interests CRM ({leads.length})</span>
            </button>

            <button
              onClick={() => {
                setSelectedStatusForFleet('all');
                setActiveTab('fleet');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'fleet'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Fleet Manager ({vehicles.length})</span>
            </button>
          </nav>

          {/* Right Header Actions: Return to Site & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReturnToUserSite}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">User Site</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-300 hover:text-red-400 border border-neutral-800 transition-colors"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center justify-between gap-1 pt-2 border-t border-neutral-800 mt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg ${
              activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-neutral-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setSelectedVehicleForCRM('all');
              setActiveTab('crm');
            }}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg ${
              activeTab === 'crm' ? 'bg-red-600 text-white' : 'text-neutral-300'
            }`}
          >
            CRM ({leads.length})
          </button>
          <button
            onClick={() => {
              setSelectedStatusForFleet('all');
              setActiveTab('fleet');
            }}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg ${
              activeTab === 'fleet' ? 'bg-red-600 text-white' : 'text-neutral-300'
            }`}
          >
            Fleet ({vehicles.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            vehicles={vehicles}
            leads={leads}
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            onSelectVehicleForCRM={handleSelectVehicleForCRM}
            onSelectStatusForFleet={handleSelectStatusForFleet}
            onExportCSV={handleExportCSV}
          />
        )}

        {activeTab === 'crm' && (
          <AdminLeadsCRM
            leads={leads}
            vehicles={vehicles}
            initialVehicleFilter={selectedVehicleForCRM}
            currentUser={currentUser}
            onRefreshLeads={loadData}
            onExportCSV={handleExportCSV}
          />
        )}

        {activeTab === 'fleet' && (
          <AdminFleetManager
            vehicles={vehicles}
            leads={leads}
            currentUser={currentUser}
            initialStatusFilter={selectedStatusForFleet}
            onRefreshVehicles={loadData}
            onOpen360={onOpen360}
            onViewVehicleInterests={handleSelectVehicleForCRM}
          />
        )}
      </main>
    </div>
  );
};
