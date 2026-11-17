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
import { resolvePrimaryVehicleImage } from '@/lib/vehicleMedia';

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

  // Strict scroll locking: stops Lenis momentum scroll and locks body & html
  useEffect(() => {
    if (isModalOpen) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
      };
    }
  }, [isModalOpen]);

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
      specs: { engineCc: 1197, mileageKmpl: 22, bootSpaceLiters: 268 },
      colors: ['Pearl Arctic White', 'Magma Grey', 'Splendid Silver', 'Fire Red', 'Midnight Black'],
      has360View: false,
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
                          <img src={resolvePrimaryVehicleImage(v)} alt={v.name} className="w-full h-full object-contain" />
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

                    {/* Requirement 2: Customer Inquiries Counter */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{interestCount} {interestCount === 1 ? 'Inquiry' : 'Inquiries'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden animate-in fade-in duration-200"
        >
          <div
            data-lenis-prevent
            className="bg-white dark:bg-neutral-900 rounded-[2rem] max-w-2xl w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden overscroll-contain"
          >
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 bg-neutral-50/70 dark:bg-neutral-950/70 backdrop-blur-md">
              <h3 className="font-display font-black text-xl text-black dark:text-white">
                {editingVehicle.id ? 'Edit Vehicle Details' : 'Add New Fleet Vehicle'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              id="fleet-edit-form"
              data-lenis-prevent
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4 text-xs"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Category / Type Selection */}
              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Vehicle Category (Two Wheeler vs Four Wheeler) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const isCar = true;
                      setEditingVehicle({
                        ...editingVehicle,
                        type: 'car',
                        subType: isCar ? 'Hatchback' : editingVehicle.subType,
                        seats: editingVehicle.seats && editingVehicle.seats > 2 ? editingVehicle.seats : 5,
                      });
                    }}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      editingVehicle.type === 'car'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-blue-400'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Four Wheeler (Car / SUV)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingVehicle({
                        ...editingVehicle,
                        type: 'bike',
                        subType: 'Cruiser Bike',
                        seats: 2,
                      });
                    }}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      editingVehicle.type === 'bike'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-blue-400'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Two Wheeler (Bike / Scooter)</span>
                  </button>
                </div>
              </div>

              {/* Identity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Vehicle Full Name *
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.name || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    placeholder="e.g. Maruti Suzuki Swift VXi"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.brand || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                    placeholder="e.g. Maruti, Royal Enfield, Hyundai"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Sub-Category / Body Type *
                  </label>
                  <select
                    value={editingVehicle.subType || (editingVehicle.type === 'bike' ? 'Cruiser Bike' : 'Hatchback')}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, subType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none cursor-pointer"
                  >
                    {editingVehicle.type === 'bike' ? (
                      <>
                        <option value="Cruiser Bike">Cruiser Bike (Classic / Bullet)</option>
                        <option value="Adventure Bike">Adventure Tourer (Himalayan / Xpulse)</option>
                        <option value="Street / Roadster">Street Roadster (Duke / Hunter)</option>
                        <option value="Scooter">Scooter / Moped (Activa / Jupiter)</option>
                      </>
                    ) : (
                      <>
                        <option value="Hatchback">Hatchback (Swift / Baleno)</option>
                        <option value="Sedan">Sedan (Verna / Dzire / City)</option>
                        <option value="Compact SUV">Compact SUV (Brezza / Creta / Nexon)</option>
                        <option value="4x4 Adventure SUV">4x4 Adventure SUV (Thar / Jimny)</option>
                        <option value="7-Seater MPV">7-Seater MPV (Innova Crysta / Ertiga)</option>
                        <option value="Luxury Car">Luxury Car (BMW / Audi / Fortuner)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Technical Specifications Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Settings className="w-4 h-4" />
                  <span>Technical Specifications</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Transmission
                    </label>
                    <select
                      value={editingVehicle.transmission || 'Manual'}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, transmission: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Fuel Type
                    </label>
                    <select
                      value={editingVehicle.fuel || 'Petrol'}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Seats Capacity
                    </label>
                    <input
                      type="number"
                      value={editingVehicle.seats || (editingVehicle.type === 'bike' ? 2 : 5)}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, seats: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                      min={1}
                      max={12}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Model Year
                    </label>
                    <input
                      type="number"
                      value={editingVehicle.year || 2024}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Engine Displacement (CC)
                    </label>
                    <input
                      type="number"
                      value={editingVehicle.specs?.engineCc || 0}
                      onChange={(e) => setEditingVehicle({
                        ...editingVehicle,
                        specs: { ...(editingVehicle.specs || {}), engineCc: Number(e.target.value) },
                      })}
                      placeholder="e.g. 1197 or 350"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Mileage (km/l or km/chg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingVehicle.specs?.mileageKmpl || 0}
                      onChange={(e) => setEditingVehicle({
                        ...editingVehicle,
                        specs: { ...(editingVehicle.specs || {}), mileageKmpl: Number(e.target.value) },
                      })}
                      placeholder="e.g. 22 or 38"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Boot Space (Liters)
                    </label>
                    <input
                      type="number"
                      value={editingVehicle.specs?.bootSpaceLiters || (editingVehicle.type === 'car' ? 300 : 20)}
                      onChange={(e) => setEditingVehicle({
                        ...editingVehicle,
                        specs: { ...(editingVehicle.specs || {}), bootSpaceLiters: Number(e.target.value) },
                      })}
                      placeholder="e.g. 268"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Available Color Options */}
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Available Colors (comma-separated names)
                  </label>
                  <input
                    type="text"
                    value={
                      Array.isArray(editingVehicle.colors)
                        ? editingVehicle.colors
                            .map((c) => (typeof c === 'string' ? c : c.name))
                            .join(', ')
                        : 'Pearl White, Crimson Red, Midnight Black, Granite Grey'
                    }
                    onChange={(e) => {
                      const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setEditingVehicle({ ...editingVehicle, colors: list });
                    }}
                    placeholder="e.g. Pearl White, Crimson Red, Midnight Black, Granite Grey, Royal Blue"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Tariffs & Deposit */}
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

              {/* Primary Image URL */}
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

              {/* Features and Inclusions */}
              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Key Features / Inclusions (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(editingVehicle.features) ? editingVehicle.features.join(', ') : ''}
                  onChange={(e) => setEditingVehicle({
                    ...editingVehicle,
                    features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="e.g. Dual Airbags, Chilled AC, Touchscreen, Bluetooth, Free Helmet"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white focus:outline-none"
                />
              </div>

            </form>

            {/* Modal Sticky Footer */}
            <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="fleet-edit-form"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-md shadow-red-600/30 transition-all disabled:opacity-50 active:scale-95"
              >
                {isSaving ? 'Saving...' : 'Save Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
