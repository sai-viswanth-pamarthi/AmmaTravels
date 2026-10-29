'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Car,
  Bike,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wrench,
  Clock,
} from 'lucide-react';
import { store } from '@/lib/store';
import { Vehicle, VehicleCategory, MaintenanceBlock } from '@/lib/types';
import { formatINR } from '@/lib/pricing';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceBlocks, setMaintenanceBlocks] = useState<MaintenanceBlock[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'car' | 'bike'>('all');

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Maintenance Modal State
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [maintVehicle, setMaintVehicle] = useState<Vehicle | null>(null);
  const [maintStart, setMaintStart] = useState('');
  const [maintEnd, setMaintEnd] = useState('');
  const [maintReason, setMaintReason] = useState('Routine 5000km Engine Oil Service');

  // Form Fields
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('bike');
  const [subCategory, setSubCategory] = useState('Scooter');
  const [year, setYear] = useState(2023);
  const [transmission, setTransmission] = useState<'Manual' | 'Automatic'>('Automatic');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Electric'>('Petrol');
  const [seatingCapacity, setSeatingCapacity] = useState(2);
  const [dailyRate, setDailyRate] = useState(450);
  const [hourlyRate, setHourlyRate] = useState(35);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [kmLimitPerDay, setKmLimitPerDay] = useState(150);
  const [excessKmRate, setExcessKmRate] = useState(4.0);
  const [primaryImageUrl, setPrimaryImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const refreshVehicles = () => {
    setVehicles(store.getVehicles({ includeUnpublished: true }));
    setMaintenanceBlocks(store.getMaintenanceBlocks());
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  const openAddModal = () => {
    setEditingVehicle(null);
    setName('');
    setModel('');
    setBrand('Honda');
    setCategory('bike');
    setSubCategory('Scooter');
    setYear(2023);
    setTransmission('Automatic');
    setFuelType('Petrol');
    setSeatingCapacity(2);
    setDailyRate(450);
    setHourlyRate(35);
    setDepositAmount(1000);
    setKmLimitPerDay(150);
    setExcessKmRate(4.0);
    setPrimaryImageUrl('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80');
    setDescription('Reliable city commuter in Kakinada.');
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setName(v.name);
    setModel(v.model);
    setBrand(v.brand);
    setCategory(v.category);
    setSubCategory(v.subCategory);
    setYear(v.year);
    setTransmission(v.transmission);
    setFuelType(v.fuelType);
    setSeatingCapacity(v.seatingCapacity);
    setDailyRate(v.dailyRate);
    setHourlyRate(v.hourlyRate);
    setDepositAmount(v.depositAmount);
    setKmLimitPerDay(v.kmLimitPerDay);
    setExcessKmRate(v.excessKmRate);
    setPrimaryImageUrl(v.primaryImageUrl);
    setDescription(v.description);
    setIsModalOpen(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleData: Vehicle = {
      id: editingVehicle ? editingVehicle.id : `v-${Date.now()}`,
      name,
      model,
      brand,
      category,
      subCategory,
      year: Number(year),
      transmission,
      fuelType,
      seatingCapacity: Number(seatingCapacity),
      dailyRate: Number(dailyRate),
      hourlyRate: Number(hourlyRate),
      depositAmount: Number(depositAmount),
      kmLimitPerDay: Number(kmLimitPerDay),
      excessKmRate: Number(excessKmRate),
      primaryImageUrl,
      description,
      fuelPolicy: 'customer_fills',
      minAge: category === 'bike' ? 20 : 21,
      features: editingVehicle?.features || ['Complimentary Helmet', 'Tubeless Tyres', 'Electric Start'],
      isPublished: editingVehicle ? editingVehicle.isPublished : true,
      isAvailable: editingVehicle ? editingVehicle.isAvailable : true,
      displayOrder: editingVehicle ? editingVehicle.displayOrder : vehicles.length + 1,
    };

    store.saveVehicle(vehicleData);
    setIsModalOpen(false);
    refreshVehicles();
  };

  const handleTogglePublished = (v: Vehicle) => {
    store.saveVehicle({ ...v, isPublished: !v.isPublished });
    refreshVehicles();
  };

  const handleToggleAvailable = (v: Vehicle) => {
    store.saveVehicle({ ...v, isAvailable: !v.isAvailable });
    refreshVehicles();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle from the fleet?')) {
      store.deleteVehicle(id);
      refreshVehicles();
    }
  };

  const openMaintenanceModal = (v: Vehicle) => {
    setMaintVehicle(v);
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    setMaintStart(`${tom.toISOString().split('T')[0]}T09:00:00`);
    const dayAfter = new Date(tom);
    dayAfter.setDate(dayAfter.getDate() + 2);
    setMaintEnd(`${dayAfter.toISOString().split('T')[0]}T18:00:00`);
    setIsMaintModalOpen(true);
  };

  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintVehicle) return;

    store.addMaintenanceBlock({
      vehicleId: maintVehicle.id,
      startTime: maintStart,
      endTime: maintEnd,
      reason: maintReason,
    });

    setIsMaintModalOpen(false);
    refreshVehicles();
  };

  const filteredVehicles = activeCategory === 'all'
    ? vehicles
    : vehicles.filter((v) => v.category === activeCategory);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Fleet Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Vehicle Fleet Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure vehicle specifications, daily/hourly rates, security deposits, and maintenance periods.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gold-500 text-navy-950 hover:bg-gold-400 transition-all flex items-center gap-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'all'
              ? 'bg-gold-500 text-navy-950'
              : 'bg-navy-900 text-slate-300 hover:bg-navy-800'
          }`}
        >
          All Vehicles ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveCategory('bike')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'bike'
              ? 'bg-gold-500 text-navy-950'
              : 'bg-navy-900 text-slate-300 hover:bg-navy-800'
          }`}
        >
          Bikes & Scooters ({vehicles.filter((v) => v.category === 'bike').length})
        </button>
        <button
          onClick={() => setActiveCategory('car')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'car'
              ? 'bg-gold-500 text-navy-950'
              : 'bg-navy-900 text-slate-300 hover:bg-navy-800'
          }`}
        >
          Cars ({vehicles.filter((v) => v.category === 'car').length})
        </button>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((v) => {
          const vBlocks = maintenanceBlocks.filter((m) => m.vehicleId === v.id);

          return (
            <div
              key={v.id}
              className={`rounded-2xl border p-5 shadow-xl space-y-4 transition-all ${
                v.isPublished
                  ? 'bg-navy-900 border-navy-800'
                  : 'bg-navy-950 border-rose-900/40 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-navy-950 shrink-0">
                  <Image src={v.primaryImageUrl} alt={v.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{v.name}</h3>
                  <p className="text-[11px] text-slate-400 capitalize">
                    {v.brand} • {v.subCategory} ({v.transmission})
                  </p>
                  <p className="text-xs font-extrabold text-gold-400 mt-1">
                    {formatINR(v.dailyRate)}/day • Dep: {formatINR(v.depositAmount)}
                  </p>
                </div>
              </div>

              {/* Maintenance blocks badge if any */}
              {vBlocks.length > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Maintenance Scheduled ({vBlocks.length})</span>
                  </div>
                  {vBlocks.map((b) => (
                    <div key={b.id} className="text-[10px] text-slate-300">
                      {new Date(b.startTime).toLocaleDateString('en-IN')} – {new Date(b.endTime).toLocaleDateString('en-IN')}: {b.reason}
                    </div>
                  ))}
                </div>
              )}

              {/* Status Toggles */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-navy-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublished(v)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                      v.isPublished
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {v.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{v.isPublished ? 'Published' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleAvailable(v)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      v.isAvailable
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {v.isAvailable ? 'Available' : 'Locked'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openMaintenanceModal(v)}
                    title="Schedule Maintenance"
                    className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(v)}
                    title="Edit Specifications"
                    className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-gold-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    title="Delete Vehicle"
                    className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-900/60 text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 my-8">
            <h3 className="text-lg font-bold text-white">
              {editingVehicle ? 'Edit Vehicle Specifications' : 'Add New Vehicle to Fleet'}
            </h3>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Vehicle Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Royal Enfield Hunter 350"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Model Sub-name</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="E.g. Dapper Ash"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Brand / Make</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="E.g. Royal Enfield"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  >
                    <option value="bike">Bike / Scooter</option>
                    <option value="car">Car</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Sub-Category</label>
                  <input
                    type="text"
                    required
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="Scooter / Cruiser / SUV"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Daily Rate (₹)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Km Limit / Day</label>
                  <input
                    type="number"
                    required
                    value={kmLimitPerDay}
                    onChange={(e) => setKmLimitPerDay(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Seating Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Image URL</label>
                <input
                  type="url"
                  required
                  value={primaryImageUrl}
                  onChange={(e) => setPrimaryImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold bg-navy-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold bg-gold-500 text-navy-950 hover:bg-gold-400"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Maintenance Block Modal */}
      {isMaintModalOpen && maintVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-gold-400" />
              Schedule Maintenance Block
            </h3>
            <p className="text-xs text-slate-300">
              Vehicle: <strong className="text-white">{maintVehicle.name}</strong>. Scheduling a maintenance window blocks all customer bookings for this vehicle during this time.
            </p>

            <form onSubmit={handleSaveMaintenance} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Start Timestamp</label>
                <input
                  type="datetime-local"
                  required
                  value={maintStart}
                  onChange={(e) => setMaintStart(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">End Timestamp</label>
                <input
                  type="datetime-local"
                  required
                  value={maintEnd}
                  onChange={(e) => setMaintEnd(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Maintenance Reason / Service Type</label>
                <input
                  type="text"
                  required
                  value={maintReason}
                  onChange={(e) => setMaintReason(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMaintModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold bg-navy-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold bg-amber-500 text-navy-950 hover:bg-amber-400"
                >
                  Apply Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
