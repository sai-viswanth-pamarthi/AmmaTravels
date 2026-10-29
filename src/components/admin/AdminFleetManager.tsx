import React, { useState } from 'react';
import {
  Car,
  Bike,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  RotateCcw,
  Search,
  Fuel,
  Settings,
  Users
} from 'lucide-react';
import { Vehicle, VehicleStatus, VehicleType, User } from '@/types';
import { api } from '@/lib/api';

interface AdminFleetManagerProps {
  vehicles: Vehicle[];
  currentUser: User;
  onRefreshVehicles: () => void;
  onOpen360: (v: Vehicle) => void;
}

export const AdminFleetManager: React.FC<AdminFleetManagerProps> = ({
  vehicles,
  currentUser,
  onRefreshVehicles,
  onOpen360,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filtered = vehicles.filter((v) => {
    if (filterType !== 'all' && v.type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingVehicle({
      type: 'car',
      subType: 'Hatchback',
      brand: 'Maruti Suzuki',
      model: 'Swift VXi',
      name: 'Maruti Suzuki Swift VXi',
      year: 2024,
      transmission: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      pricePerDay: 1800,
      pricePerWeek: 11000,
      deposit: 3000,
      kmLimit: 250,
      excessKmRate: 8,
      status: 'Available',
      primaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      gallery: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
      features: ['Dual Airbags', 'Touchscreen Infotainment', 'Chilled AC', 'Bluetooth Audio'],
      specs: { engineCc: 1197, mileageKmpl: 22 },
      has360View: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle({ ...v });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle || !editingVehicle.name) return;

    setIsSaving(true);
    try {
      await api.saveVehicle(editingVehicle);
      setIsModalOpen(false);
      setEditingVehicle(null);
      onRefreshVehicles();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} from the active fleet?`)) {
      try {
        await api.deleteVehicle(id);
        onRefreshVehicles();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleQuickStatusChange = async (vehicle: Vehicle, status: VehicleStatus) => {
    try {
      await api.saveVehicle({ ...vehicle, status });
      onRefreshVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-charcoal-900 rounded-2xl p-4 sm:p-5 border border-warm-200 dark:border-charcoal-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fleet by name or brand..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none"
          />
        </div>

        {/* Filter & Add Button */}
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-800 dark:text-warm-100 focus:outline-none"
          >
            <option value="all">Type: All</option>
            <option value="car">Cars Only</option>
            <option value="bike">Bikes Only</option>
          </select>

          {currentUser.role === 'admin' && (
            <button
              onClick={handleOpenAdd}
              className="py-2 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          )}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-100/75 dark:bg-charcoal-950 text-charcoal-600 dark:text-warm-300 font-bold uppercase tracking-wider border-b border-warm-200 dark:border-charcoal-800">
              <tr>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Type & Specs</th>
                <th className="py-3.5 px-4">Tariff / Day</th>
                <th className="py-3.5 px-4">Deposit</th>
                <th className="py-3.5 px-4">Live Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 dark:divide-charcoal-800">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-warm-50/70 dark:hover:bg-charcoal-800/40 transition-colors">
                  {/* Vehicle Name & Image */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-warm-100 dark:bg-charcoal-800 flex-shrink-0 flex items-center justify-center">
                        <img src={v.primaryImage} alt={v.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="font-bold text-charcoal-900 dark:text-warm-100 block">
                          {v.name}
                        </span>
                        <span className="text-[10px] text-charcoal-400">
                          {v.brand} • {v.year}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type & Specs */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-charcoal-700 dark:text-warm-200 block">
                      {v.subType} ({v.type.toUpperCase()})
                    </span>
                    <span className="text-[10px] text-charcoal-400">
                      {v.transmission} • {v.fuel} • {v.seats} Seats
                    </span>
                  </td>

                  {/* Tariff */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-charcoal-900 dark:text-warm-50 font-display">
                      ₹{v.pricePerDay}
                    </span>
                    <span className="text-[10px] text-charcoal-400 block">
                      Wk: ₹{v.pricePerWeek}
                    </span>
                  </td>

                  {/* Deposit */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-charcoal-800 dark:text-warm-200">
                      ₹{v.deposit}
                    </span>
                  </td>

                  {/* Status Toggle Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={v.status}
                      onChange={(e) => handleQuickStatusChange(v, e.target.value as VehicleStatus)}
                      disabled={currentUser.role !== 'admin'}
                      className={`py-1 px-2.5 rounded-lg text-xs font-bold border transition-colors focus:outline-none ${
                        v.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                          : v.status === 'Booked'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                      }`}
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpen360(v)}
                        className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-saffron-400 hover:bg-teal-100"
                        title="360 Studio Preview"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {currentUser.role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="p-1.5 rounded-lg bg-warm-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-warm-200 hover:bg-warm-200"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(v.id, v.name)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-2xl p-6 sm:p-8 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-charcoal-800 mb-5">
              <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-warm-50">
                {editingVehicle.id ? `Edit: ${editingVehicle.name}` : 'Add New Vehicle to Fleet'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.name || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={editingVehicle.type || 'car'}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        type: e.target.value as VehicleType,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.brand || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.model || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Body SubType
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.subType || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, subType: e.target.value })}
                    placeholder="SUV, Sedan, Cruiser..."
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.year || 2024}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Price / Day (₹)
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.pricePerDay || 1500}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, pricePerDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Price / Week (₹)
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.pricePerWeek || 9000}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, pricePerWeek: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.deposit || 2000}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, deposit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                    KM Limit / Day
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.kmLimit || 200}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, kmLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
                  Primary Photographic Image URL
                </label>
                <input
                  type="text"
                  value={editingVehicle.primaryImage || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, primaryImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100"
                  required
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
                  {isSaving ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
