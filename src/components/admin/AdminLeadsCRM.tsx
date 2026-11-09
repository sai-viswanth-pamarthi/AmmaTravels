import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Download,
  PhoneCall,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Flame
} from 'lucide-react';
import { InterestSubmission, LeadStage, User, ActivityLog, Vehicle } from '@/types';
import { api } from '@/lib/api';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface AdminLeadsCRMProps {
  leads: InterestSubmission[];
  vehicles?: Vehicle[];
  initialVehicleFilter?: string;
  currentUser: User;
  onRefreshLeads: () => void;
  onExportCSV: () => void;
}

const STAGES: LeadStage[] = [
  'New',
  'Contacted',
  'Visit/Meeting Scheduled',
  'Documents Verified',
  'Confirmed',
  'Completed',
  'Rejected',
];

export const AdminLeadsCRM: React.FC<AdminLeadsCRMProps> = ({
  leads,
  vehicles = [],
  initialVehicleFilter = 'all',
  currentUser,
  onRefreshLeads,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>(initialVehicleFilter);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [activeLead, setActiveLead] = useState<InterestSubmission | null>(null);

  // Drawer edit states
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');
  const [editStage, setEditStage] = useState<LeadStage>('New');
  const [isUpdating, setIsUpdating] = useState(false);
  const [leadLogs, setLeadLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (initialVehicleFilter) {
      setSelectedVehicle(initialVehicleFilter);
    }
  }, [initialVehicleFilter]);

  // Extract unique vehicle names for dropdown
  const vehicleOptions = useMemo(() => {
    const names = new Set<string>();
    vehicles.forEach((v) => names.add(v.name));
    leads.forEach((l) => {
      if (l.vehicleName) names.add(l.vehicleName);
    });
    return Array.from(names);
  }, [vehicles, leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (
        selectedVehicle !== 'all' &&
        lead.vehicleId !== selectedVehicle &&
        lead.vehicleName?.toLowerCase() !== selectedVehicle.toLowerCase()
      ) {
        return false;
      }
      if (selectedStage !== 'all' && lead.progressStage !== selectedStage) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchRef = lead.refId.toLowerCase().includes(q);
        const matchName = lead.name.toLowerCase().includes(q);
        const matchPhone = lead.phone.includes(q);
        const matchItem = (lead.vehicleName || '').toLowerCase().includes(q);
        if (!matchRef && !matchName && !matchPhone && !matchItem) return false;
      }
      return true;
    });
  }, [leads, selectedVehicle, selectedStage, searchTerm]);

  const handleOpenLead = async (lead: InterestSubmission) => {
    setActiveLead(lead);
    setEditNotes(lead.internalNotes || '');
    setEditFollowUp(lead.followUpDate || '');
    setEditStage(lead.progressStage || 'New');

    try {
      const logs = await api.getActivityLogs(lead.id);
      setLeadLogs(logs);
    } catch {
      setLeadLogs([]);
    }
  };

  const handleSaveLeadDetails = async () => {
    if (!activeLead) return;
    setIsUpdating(true);
    try {
      const updated = await api.updateInterestStage(
        activeLead.id,
        editStage,
        editNotes,
        editFollowUp,
        currentUser.name
      );
      setActiveLead(updated);
      onRefreshLeads();
      const logs = await api.getActivityLogs(activeLead.id);
      setLeadLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickStageChange = async (leadId: string, stage: LeadStage) => {
    try {
      await api.updateInterestStage(
        leadId,
        stage,
        undefined,
        undefined,
        currentUser.name
      );
      onRefreshLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const getStageBadgeColor = (stage: LeadStage) => {
    switch (stage) {
      case 'New':
        return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'Visit/Meeting Scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
      case 'Documents Verified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'Completed':
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Vehicle Filter & Export Toolbar */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, ref ID, vehicle..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Requirement 2: Filter Leads by Specific Vehicle */}
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="py-2 px-3 text-xs font-bold rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
            aria-label="Filter by vehicle"
          >
            <option value="all">Vehicle: All Fleet Models</option>
            {vehicleOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
            aria-label="Filter by CRM stage"
          >
            <option value="all">Stage: All Stages</option>
            {STAGES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* CSV Export */}
          <button
            onClick={onExportCSV}
            className="py-2 px-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-red-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 dark:bg-black text-neutral-700 dark:text-neutral-300 font-extrabold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Ref ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Interested Vehicle</th>
                <th className="py-3.5 px-4">Requested Schedule & Hub</th>
                <th className="py-3.5 px-4">Pipeline Stage</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No customer inquiries found for this vehicle/criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors cursor-pointer"
                    onClick={() => handleOpenLead(lead)}
                  >
                    {/* Ref ID & Date */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-black text-red-600 block">
                        {lead.refId}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-black dark:text-white block">
                        {lead.name}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {lead.phone}
                      </span>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3 px-4">
                      <span className="font-black text-black dark:text-white block">
                        {lead.vehicleName}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-red-600">
                        {lead.type || 'Vehicle'}
                      </span>
                    </td>

                    {/* Schedule & Hub */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                        {lead.pickupDate} → {lead.returnDate}
                      </span>
                      <span className="text-[10px] text-neutral-400 block truncate max-w-[180px]">
                        {lead.pickupLocation || 'Kakinada Hub'}
                      </span>
                    </td>

                    {/* CRM Stage */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.progressStage}
                        onChange={(e) => handleQuickStageChange(lead.id, e.target.value as LeadStage)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold border ${getStageBadgeColor(
                          lead.progressStage
                        )} focus:outline-none`}
                        aria-label="Change lead stage"
                      >
                        {STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={getWhatsAppUrl(
                            `Hello ${lead.name}, thank you for your interest in ${lead.vehicleName || 'our rental fleet'} with Amma Travels Kakinada (Ref: ${lead.refId}). How may we assist your journey?`,
                            lead.phone
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                          title="Message on WhatsApp"
                          aria-label="WhatsApp"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenLead(lead)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-bold flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out CRM Detail Drawer */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg h-full overflow-y-auto p-6 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-xs font-mono font-black text-red-600 block">
                    {activeLead.refId}
                  </span>
                  <h3 className="font-display text-xl font-black text-black dark:text-white">
                    {activeLead.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveLead(null)}
                  className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Vehicle Interest Banner */}
              <div className="my-4 p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-red-600">
                    Interested Fleet Vehicle
                  </span>
                  <p className="font-display font-black text-base text-black dark:text-white">
                    {activeLead.vehicleName}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white">
                  {activeLead.pickupDate} → {activeLead.returnDate}
                </span>
              </div>

              {/* Customer Contact */}
              <div className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 mb-4">
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Mobile Phone:</span>
                  <span className="font-mono font-bold">{activeLead.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Email Address:</span>
                  <span>{activeLead.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Pickup Hub:</span>
                  <span>{activeLead.pickupLocation || 'Kakinada Hub'}</span>
                </div>
                {activeLead.idProofUrl && (
                  <div className="py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400 block mb-1">ID Proof / DL:</span>
                    <a
                      href={activeLead.idProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 underline font-bold break-all"
                    >
                      {activeLead.idProofUrl}
                    </a>
                  </div>
                )}
                {activeLead.message && (
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 mt-2">
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold mb-0.5">
                      Customer Message:
                    </span>
                    <p className="italic">{activeLead.message}</p>
                  </div>
                )}
              </div>

              {/* Progress Pipeline Editor */}
              <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <label className="block text-xs font-bold text-black dark:text-white">
                  Update Lead Pipeline Stage
                </label>
                <select
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value as LeadStage)}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white text-xs font-bold"
                >
                  {STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1">
                    Internal Staff Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Log customer conversation, DL verification details, pickup timing..."
                    className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={editFollowUp}
                    onChange={(e) => setEditFollowUp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white text-xs"
                  />
                </div>

                <button
                  onClick={handleSaveLeadDetails}
                  disabled={isUpdating}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/30 transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Lead Updates'}
                </button>
              </div>

              {/* Activity History Logs */}
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <h4 className="text-xs font-bold text-black dark:text-white mb-2">
                  Activity & Audit Logs
                </h4>
                <div className="space-y-2 text-[11px] text-neutral-500">
                  {leadLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
                      <div className="flex justify-between font-bold text-black dark:text-white">
                        <span>{log.action}</span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-0.5">{log.notes}</p>
                      <span className="text-[10px] text-red-600 block mt-0.5">by {log.adminName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
              <a
                href={getWhatsAppUrl(
                  `Hello ${activeLead.name}, confirming your interest in ${activeLead.vehicleName} with Amma Travels (Ref: ${activeLead.refId}).`,
                  activeLead.phone
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => setActiveLead(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
