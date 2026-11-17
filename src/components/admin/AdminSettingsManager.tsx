import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  RotateCcw,
  Building2,
  Navigation,
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useBusinessSettings, DEFAULT_SETTINGS, BusinessSettings } from '@/lib/settings';

export const AdminSettingsManager: React.FC = () => {
  const [settings, updateSettings] = useBusinessSettings();
  const [form, setForm] = useState<BusinessSettings>({ ...settings });
  const [newLocation, setNewLocation] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field: keyof BusinessSettings, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = newLocation.trim();
    if (!loc) return;
    if (form.locations.includes(loc)) {
      alert('This location already exists in the list.');
      return;
    }
    setForm((prev) => ({
      ...prev,
      locations: [...prev.locations, loc],
    }));
    setNewLocation('');
  };

  const handleRemoveLocation = (indexToRemove: number) => {
    if (form.locations.length <= 1) {
      alert('You must have at least one pickup location.');
      return;
    }
    setForm((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleLocationNameChange = (index: number, val: string) => {
    setForm((prev) => {
      const updated = [...prev.locations];
      updated[index] = val;
      return { ...prev, locations: updated };
    });
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all business info and locations to factory defaults?')) {
      setForm({ ...DEFAULT_SETTINGS });
      updateSettings(DEFAULT_SETTINGS);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with Save CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-200 dark:border-red-900">
            <Building2 className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Hub Locations & Contact Settings
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Update your primary office address, WhatsApp support number, phone, email, and pickup spots across the website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-sm font-semibold shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Settings saved successfully! Website headers, footers, location dropdowns, and WhatsApp links have been updated in real-time.</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Contact & Office Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Official Hub Contact Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <Phone className="w-5 h-5 text-red-600" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Contact Numbers & WhatsApp
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Primary Phone Number (For Calls)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 88857 57966"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">Shown in header, contact bar, and call buttons.</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  WhatsApp Support Number
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="918885757966"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">Used for direct 1-click WhatsApp bookings.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Support Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@ammatravelskkd.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Secondary Fleet Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={form.secondaryEmail}
                    onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
                    placeholder="rentals@ammatravels.in"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Main Hub Location & Operating Hours */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <MapPin className="w-5 h-5 text-red-600" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Main Hub Office & Operating Hours
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                Primary Office Address (Displayed in Footer & Contacts)
              </label>
              <textarea
                rows={2}
                value={form.primaryAddress}
                onChange={(e) => handleInputChange('primaryAddress', e.target.value)}
                placeholder="Bhanugudi Junction, Kakinada, Andhra Pradesh 533003"
                className="w-full p-3 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  value={form.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  placeholder="Near Kakinada Town Railway Station & Main Road"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Operating Hours Schedule
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.operatingHours}
                    onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                    placeholder="24/7 Operations & Roadside Assistance"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Pickup & Return Locations List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <Navigation className="w-5 h-5 text-red-600" />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Pickup & Return Locations
                </h3>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                {form.locations.length} Locations
              </span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              These locations populate the pickup and return dropdowns in the Hero booking banner and enquiry forms.
            </p>

            {/* Existing Locations Editable List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {form.locations.map((loc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={loc}
                      onChange={(e) => handleLocationNameChange(idx, e.target.value)}
                      className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-red-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(idx)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors flex-shrink-0"
                    title="Delete location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Location Form */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                + Add New Pickup Hub / Point
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Samalkot Junction Hub"
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-800 hover:bg-black dark:hover:bg-neutral-700 text-white text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 mt-4 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Locations & Contact Info</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
