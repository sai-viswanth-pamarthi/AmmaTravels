import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { EventPackage, User } from '@/types';
import { api } from '@/lib/api';

interface AdminEventManagerProps {
  packages: EventPackage[];
  currentUser: User;
  onRefreshPackages: () => void;
}

export const AdminEventManager: React.FC<AdminEventManagerProps> = ({
  packages,
  currentUser,
  onRefreshPackages,
}) => {
  const [editingPkg, setEditingPkg] = useState<Partial<EventPackage> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingPkg({
      title: 'Kakinada Beach & Resort Celebration',
      slug: `package-${Date.now()}`,
      eventType: 'Wedding',
      tagline: 'Scenic Coastal Venues & Luxury Transit',
      description: 'End-to-end event logistics for coastal gatherings, beach muhurthams, and evening receptions.',
      priceRange: '₹75,000 - ₹2,000,000',
      guestCapacity: '100 - 600 Guests',
      includedServices: ['Luxury Bridal Car', '2x AC Tempo Travellers', 'Airport Pickup Concierge'],
      gallery: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'],
      highlights: ['Beachfront Transit', 'Dedicated Operations Lead', '24/7 Coordinator'],
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: EventPackage) => {
    setEditingPkg({ ...pkg });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg || !editingPkg.title) return;

    setIsSaving(true);
    try {
      await api.savePackage(editingPkg);
      setIsModalOpen(false);
      setEditingPkg(null);
      onRefreshPackages();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-charcoal-900 rounded-2xl p-4 sm:p-5 border border-warm-200 dark:border-charcoal-800 shadow-sm">
        <div>
          <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-warm-50">
            Event Management Packages
          </h3>
          <p className="text-xs text-charcoal-500 dark:text-warm-400">
            Configure wedding, corporate, and private event packages offered in Kakinada
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="py-2 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event Package</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-saffron-400 border border-teal-200 dark:border-teal-800">
                  {pkg.eventType}
                </span>
                <span className="text-xs font-extrabold text-saffron-600 dark:text-saffron-400">
                  {pkg.priceRange}
                </span>
              </div>

              <h4 className="font-display font-bold text-lg text-charcoal-900 dark:text-warm-50">
                {pkg.title}
              </h4>
              <p className="text-xs text-charcoal-500 dark:text-warm-400 mt-1">
                {pkg.tagline}
              </p>

              <div className="my-4 space-y-1.5 text-xs text-charcoal-700 dark:text-warm-200">
                {pkg.includedServices.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-warm-200 dark:border-charcoal-800 flex items-center justify-between">
              <span className="text-xs text-charcoal-500 dark:text-warm-400">
                Capacity: <strong>{pkg.guestCapacity}</strong>
              </span>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="px-3 py-1.5 rounded-xl bg-warm-100 dark:bg-charcoal-800 hover:bg-warm-200 text-charcoal-800 dark:text-warm-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Package</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Package Modal */}
      {isModalOpen && editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-2xl p-6 sm:p-8 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-charcoal-800 mb-5">
              <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-warm-50">
                {editingPkg.id ? 'Edit Event Package' : 'Create New Event Package'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                  Package Title
                </label>
                <input
                  type="text"
                  value={editingPkg.title || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={editingPkg.eventType || 'Wedding'}
                    onChange={(e) => setEditingPkg({ ...editingPkg, eventType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                    <option value="TourGroup">TourGroup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Estimated Price Range
                  </label>
                  <input
                    type="text"
                    value={editingPkg.priceRange || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, priceRange: e.target.value })}
                    placeholder="₹50,000 - ₹2,00,000"
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={editingPkg.tagline || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingPkg.description || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-warm-200 dark:border-charcoal-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-warm-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-warm-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2.5 px-5 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-bold transition-all shadow-sm"
                >
                  {isSaving ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
