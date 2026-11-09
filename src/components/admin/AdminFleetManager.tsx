import React, { useState, useEffect } from 'react';
import {
  Car,
  Bike,
  Plus,
  Edit2,
  Trash2,
  X,
  RotateCcw,
  Search,
  Fuel,
  Settings,
  Users,
  Flame,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { Vehicle, VehicleStatus, VehicleType, User, InterestSubmission } from '@/types';
import { api } from '@/lib/api';

interface AdminFleetManagerProps {
  vehicles: Vehicle[];
  leads: InterestSubmission[];
  currentUser: User;
  initialStatusFilter?: string;
  onRefreshVehicles: () => void;
  onOpen360: (v: Vehicle) => void;
  onViewVehicleInterests: (vehicleName: string) => void;
}

export const AdminFleetManager: React.FC<AdminFleetManagerProps> = ({
  vehicles,
  leads,
  currentUser,
  initialStatusFilter = 'all',
  onRefreshVehicles,
  onOpen360,
  onViewVehicleInterests,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>(initialStatusFilter);
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialStatusFilter) {
      setFilterStatus(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  const bookedCount = vehicles.filter((v) => v.status === 'Booked').length;
  const availableCount = vehicles.filter((v) => v.status === 'Available').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'Maintenance').length;

  const filtered = vehicles.filter((v) => {
    if (filterType !== 'all' && v.type !== filterType) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
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

  const getVehicleInterestCount = (vehicle: Vehicle) => {
    return leads.filter(
      (l) => l.vehicleId === vehicle.id || (l.vehicleName && l.vehicleName.toLowerCase() === vehicle.name.toLowerCase())
    ).length;
  };

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
      {/* Requirement 1: Status Filter Pills (Highlighting Booked Vehicles) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            filterStatus === 'all'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          All Fleet ({vehicles.length})
        </button>

        <button
          onClick={() => setFilterStatus('Booked')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            filterStatus === 'Booked'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-600 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Booked ({bookedCount})</span>
        </button>

        <button
          onClick={() => setFilterStatus('Available')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            filterStatus === 'Available'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400'
          }`}
        >
          Available ({availableCount})
        </button>

        <button
          onClick={() => setFilterStatus('Maintenance')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            filterStatus === 'Maintenance'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-amber-400'
          }`}
        >
          Maintenance ({maintenanceCount})
        </button>
      </div>

      {/* Search, Filter Type & Add Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fleet by name or brand..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Filter & Add Button */}
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
            aria-label="Filter vehicle type"
          >
            <option value="all">Type: All</option>
            <option value="car">Cars Only</option>
            <option value="bike">Bikes Only</option>
          </select>

          {currentUser.role === 'admin' && (
            <button
              onClick={handleOpenAdd}
              className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          )}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 dark:bg-black text-neutral-700 dark:text-neutral-300 font-extrabold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Type & Specs</th>
                <th className="py-3.5 px-4">Tariff / Day</th>
                <th className="py-3.5 px-4">Live Status</th>
                <th className="py-3.5 px-4">Interests Received</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((v) => {
                const interestCount = getVehicleInterestCount(v);
                return (
                  <tr key={v.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors">
                    {/* Vehicle Name & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center p-0.5">
                          <img src={v.primaryImage} alt={v.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="font-bold text-black dark:text-white block">
                            {v.name}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {v.brand} • {v.year}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Type & Specs */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                        {v.subType} ({v.type.toUpperCase()})
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {v.transmission} • {v.fuel} • {v.seats} Seats
                      </span>
                    </td>

                    {/* Tariff */}
                    <td className="py-3 px-4">
                      <span className="font-black text-black dark:text-white font-display">
                        ₹{v.pricePerDay}
                      </span>
                      <span className="text-[10px] text-neutral-400 block">
                        Deposit: ₹{v.deposit}
                      </span>
                    </td>

                    {/* Status Toggle Dropdown (Requirement 1: live Booked/Available status) */}
                    <td className="py-3 px-4">
                      <select
                        value={v.status}
                        onChange={(e) => handleQuickStatusChange(v, e.target.value as VehicleStatus)}
                        disabled={currentUser.role !== 'admin'}
                        className={`py-1.5 px-3 rounded-xl text-xs font-black border transition-colors focus:outline-none ${
                          v.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : v.status === 'Booked'
                            ? 'bg-red-600 text-white border-red-700 shadow-sm'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        }`}
                        aria-label="Change vehicle status"
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked (On Rent)</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>

                    {/* Requirement 2: Interests Received Column */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onViewVehicleInterests(v.name)}
                        className="px-3 py-1 rounded-full text-xs font-black bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700 shadow-sm group"
                        title="Click to view all interested customers for this vehicle in CRM"
                      >
                        <Flame className="w-3.5 h-3.5 text-red-600 group-hover:text-white" />
                        <span>{interestCount} {interestCount === 1 ? 'Inquiry' : 'Inquiries'}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpen360(v)}
                          className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200"
                          title="360 Studio Preview"
                          aria-label="360 preview"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {currentUser.role === 'admin' && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(v)}
                              className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200"
                              title="Edit Vehicle"
                              aria-label="Edit vehicle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(v.id, v.name)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100"
                              title="Delete Vehicle"
                              aria-label="Delete vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-5">
              <h3 className="font-display font-black text-xl text-black dark:text-white">
                {editingVehicle.id ? 'Edit Vehicle Details' : 'Add New Fleet Vehicle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Vehicle Full Name *
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.name || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Type *
                  </label>
                  <select
                    value={editingVehicle.type || 'car'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value as VehicleType })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Tariff / Day (₹) *
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.pricePerDay || 0}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, pricePerDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.deposit || 0}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, deposit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Daily KM Limit
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.kmLimit || 250}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, kmLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Live Status
                  </label>
                  <select
                    value={editingVehicle.status || 'Available'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, status: e.target.value as VehicleStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  value={editingVehicle.primaryImage || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, primaryImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-md shadow-red-600/30 transition-all disabled:opacity-50"
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
