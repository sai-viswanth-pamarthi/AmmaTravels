import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  PhoneCall,
  Calendar,
  Car,
  FileCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Sparkles,
  MessageSquare,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { InterestSubmission, LeadStage, User, ActivityLog } from '@/types';
import { api } from '@/lib/api';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface AdminLeadsCRMProps {
  leads: InterestSubmission[];
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
  currentUser,
  onRefreshLeads,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'vehicle' | 'event'>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [activeLead, setActiveLead] = useState<InterestSubmission | null>(null);

  // Drawer edit states
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');
  const [editStage, setEditStage] = useState<LeadStage>('New');
  const [isUpdating, setIsUpdating] = useState(false);
  const [leadLogs, setLeadLogs] = useState<ActivityLog[]>([]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (selectedType !== 'all' && lead.type !== selectedType) return false;
      if (selectedStage !== 'all' && lead.progressStage !== selectedStage) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchRef = lead.refId.toLowerCase().includes(q);
        const matchName = lead.name.toLowerCase().includes(q);
        const matchPhone = lead.phone.includes(q);
        const matchItem =
          (lead.vehicleName || lead.packageName || '').toLowerCase().includes(q);
        if (!matchRef && !matchName && !matchPhone && !matchItem) return false;
      }
      return true;
    });
  }, [leads, selectedType, selectedStage, searchTerm]);

  const handleOpenLead = async (lead: InterestSubmission) => {
    setActiveLead(lead);
    setEditNotes(lead.internalNotes || '');
    setEditFollowUp(lead.followUpDate || '');
    setEditStage(lead.progressStage || 'New');

    // Fetch activity logs
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
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'Visit/Meeting Scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
      case 'Documents Verified':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'Completed':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Export Toolbar */}
      <div className="bg-white dark:bg-charcoal-900 rounded-2xl p-4 sm:p-5 border border-warm-200 dark:border-charcoal-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, ref ID, vehicle..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="py-2 px-3 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-800 dark:text-warm-100 focus:outline-none"
          >
            <option value="all">Category: All</option>
            <option value="vehicle">Vehicles</option>
            <option value="event">Event Packages</option>
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-800 dark:text-warm-100 focus:outline-none"
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
            className="py-2 px-3.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-warm-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-saffron-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-100/75 dark:bg-charcoal-950 text-charcoal-600 dark:text-warm-300 font-bold uppercase tracking-wider border-b border-warm-200 dark:border-charcoal-800">
              <tr>
                <th className="py-3.5 px-4">Ref ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Service / Fleet</th>
                <th className="py-3.5 px-4">Schedule & Location</th>
                <th className="py-3.5 px-4">CRM Stage</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 dark:divide-charcoal-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-500 dark:text-warm-400">
                    No leads match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-warm-50/80 dark:hover:bg-charcoal-800/50 transition-colors cursor-pointer"
                    onClick={() => handleOpenLead(lead)}
                  >
                    {/* Ref ID & Date */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-teal-900 dark:text-saffron-400 block">
                        {lead.refId}
                      </span>
                      <span className="text-[10px] text-charcoal-400 font-mono">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-charcoal-900 dark:text-warm-100 block">
                        {lead.name}
                      </span>
                      <span className="text-[11px] text-charcoal-500 dark:text-warm-400 font-mono">
                        {lead.phone}
                      </span>
                    </td>

                    {/* Service / Fleet */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-charcoal-800 dark:text-warm-200 block">
                        {lead.vehicleName || lead.packageName}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-charcoal-400">
                        {lead.type}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-3 px-4">
                      <span className="text-charcoal-700 dark:text-warm-300 block">
                        {lead.pickupDate
                          ? `${lead.pickupDate} to ${lead.returnDate}`
                          : lead.eventDate
                          ? `Event: ${lead.eventDate}`
                          : 'Immediate'}
                      </span>
                      <span className="text-[10px] text-charcoal-400 truncate max-w-[140px] block">
                        {lead.pickupLocation || lead.cityVenue || 'Kakinada Hub'}
                      </span>
                    </td>

                    {/* CRM Stage Quick Selector */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.progressStage}
                        onChange={(e) => handleQuickStageChange(lead.id, e.target.value as LeadStage)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold border transition-colors focus:outline-none ${getStageBadgeColor(
                          lead.progressStage
                        )}`}
                      >
                        {STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={getWhatsAppUrl(
                            `Hello ${lead.name}, this is ${currentUser.name} from Amma Travels regarding your booking enquiry ${lead.refId}.`,
                            lead.phone
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200"
                          title="Open WhatsApp chat"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenLead(lead)}
                          className="p-1.5 rounded-lg bg-warm-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-warm-200 hover:bg-warm-200"
                          title="View lead drawer"
                        >
                          <ChevronRight className="w-4 h-4" />
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

      {/* Lead Detail Drawer / Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-charcoal-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl h-full bg-white dark:bg-charcoal-900 border-l border-warm-200 dark:border-charcoal-800 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-charcoal-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                    Lead Inspection Drawer
                  </span>
                  <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-warm-50">
                    {activeLead.name}
                  </h3>
                  <p className="text-xs text-charcoal-500 dark:text-warm-400 font-mono">
                    Ref ID: {activeLead.refId} • Submitted on{' '}
                    {new Date(activeLead.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => setActiveLead(null)}
                  className="p-2 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-100 rounded-full hover:bg-warm-100 dark:hover:bg-charcoal-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Direct Communication Bar */}
              <div className="my-4 flex items-center gap-2">
                <a
                  href={`tel:${activeLead.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-warm-100 dark:bg-charcoal-800 hover:bg-warm-200 text-charcoal-800 dark:text-warm-100 font-semibold text-xs flex items-center justify-center gap-1.5 border border-warm-200 dark:border-charcoal-700"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
                  <span>Call {activeLead.phone}</span>
                </a>

                <a
                  href={getWhatsAppUrl(
                    `Hello ${activeLead.name}, this is ${currentUser.name} from Amma Travels Kakinada regarding your booking ${activeLead.refId}.`,
                    activeLead.phone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Message</span>
                </a>
              </div>

              {/* Customer & Booking Details Card */}
              <div className="space-y-3 p-4 rounded-2xl bg-warm-50 dark:bg-charcoal-800/60 border border-warm-200 dark:border-charcoal-700 text-xs">
                <div className="flex justify-between py-1 border-b border-warm-200 dark:border-charcoal-700">
                  <span className="text-charcoal-500 dark:text-warm-400">Target Item:</span>
                  <span className="font-bold text-charcoal-900 dark:text-warm-100">
                    {activeLead.vehicleName || activeLead.packageName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-warm-200 dark:border-charcoal-700">
                  <span className="text-charcoal-500 dark:text-warm-400">Email Address:</span>
                  <span className="font-semibold text-charcoal-900 dark:text-warm-100">
                    {activeLead.email || 'Not supplied'}
                  </span>
                </div>
                {activeLead.pickupDate && (
                  <div className="flex justify-between py-1 border-b border-warm-200 dark:border-charcoal-700">
                    <span className="text-charcoal-500 dark:text-warm-400">Rental Window:</span>
                    <span className="font-semibold text-charcoal-900 dark:text-warm-100">
                      {activeLead.pickupDate} to {activeLead.returnDate}
                    </span>
                  </div>
                )}
                {activeLead.eventDate && (
                  <div className="flex justify-between py-1 border-b border-warm-200 dark:border-charcoal-700">
                    <span className="text-charcoal-500 dark:text-warm-400">Event Date & Guests:</span>
                    <span className="font-semibold text-charcoal-900 dark:text-warm-100">
                      {activeLead.eventDate} ({activeLead.guestCount || '100'} Guests)
                    </span>
                  </div>
                )}
                {activeLead.budgetRange && (
                  <div className="flex justify-between py-1 border-b border-warm-200 dark:border-charcoal-700">
                    <span className="text-charcoal-500 dark:text-warm-400">Budget Range:</span>
                    <span className="font-semibold text-charcoal-900 dark:text-warm-100">
                      {activeLead.budgetRange}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-warm-200 dark:border-charcoal-700">
                  <span className="text-charcoal-500 dark:text-warm-400">Location / Venue:</span>
                  <span className="font-semibold text-charcoal-900 dark:text-warm-100">
                    {activeLead.pickupLocation || activeLead.cityVenue || 'Kakinada Main Hub'}
                  </span>
                </div>
                {activeLead.message && (
                  <div className="pt-2">
                    <span className="text-charcoal-500 dark:text-warm-400 block mb-1">
                      Customer Message:
                    </span>
                    <p className="p-2.5 rounded-lg bg-white dark:bg-charcoal-900 border border-warm-200 dark:border-charcoal-700 text-charcoal-800 dark:text-warm-200 italic">
                      "{activeLead.message}"
                    </p>
                  </div>
                )}
              </div>

              {/* Stage Progression & Followup Inputs */}
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 dark:text-warm-300 mb-1">
                    Update Pipeline Stage
                  </label>
                  <select
                    value={editStage}
                    onChange={(e) => setEditStage(e.target.value as LeadStage)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none"
                  >
                    {STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 dark:text-warm-300 mb-1">
                    Scheduled Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={editFollowUp}
                    onChange={(e) => setEditFollowUp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 dark:text-warm-300 mb-1">
                    Internal Staff Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Log verification remarks, customer preferences, or price negotiations..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Activity Log History */}
              <div className="mt-6 pt-4 border-t border-warm-200 dark:border-charcoal-800">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 dark:text-warm-400 block mb-2">
                  Audit & Action Log
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {leadLogs.length === 0 ? (
                    <p className="text-[11px] text-charcoal-400">No activity recorded yet.</p>
                  ) : (
                    leadLogs.map((log) => (
                      <div
                        key={log.id}
                        className="text-[11px] p-2 rounded-lg bg-warm-100/60 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700"
                      >
                        <div className="flex items-center justify-between font-semibold text-charcoal-800 dark:text-warm-200">
                          <span>{log.action}</span>
                          <span className="text-[10px] text-charcoal-400">
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-charcoal-600 dark:text-warm-300 mt-0.5">{log.notes}</p>
                        )}
                        <span className="text-[10px] text-teal-700 dark:text-saffron-400 font-medium">
                          By: {log.adminName}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-warm-200 dark:border-charcoal-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveLead(null)}
                className="py-2.5 px-4 rounded-xl bg-warm-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-warm-200 text-xs font-semibold"
              >
                Close Drawer
              </button>

              <button
                onClick={handleSaveLeadDetails}
                disabled={isUpdating}
                className="flex-1 py-2.5 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isUpdating ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Save Stage & Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
