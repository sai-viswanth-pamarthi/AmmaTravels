'use client';

import {
  Vehicle,
  Booking,
  CustomerDocument,
  UserProfile,
  RentalPolicy,
  MaintenanceBlock,
  BookingStatus,
  UserRole,
  DocumentStatus,
  PriceCalculation,
} from './types';
import {
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_DOCUMENTS,
  DEMO_USERS,
  INITIAL_POLICIES,
} from './mock-data';
import { checkVehicleAvailability } from './availability';
import { canTransitionStatus } from './statemachine';
import { calculateRentalPrice } from './pricing';

const STORAGE_KEYS = {
  VEHICLES: 'amma_travels_vehicles',
  BOOKINGS: 'amma_travels_bookings',
  DOCUMENTS: 'amma_travels_documents',
  MAINTENANCE: 'amma_travels_maintenance',
  CURRENT_USER: 'amma_travels_current_user',
  NEXT_BOOKING_SEQ: 'amma_travels_booking_seq',
};

// In-memory fallbacks for SSR or when localStorage is unavailable
let memoryVehicles: Vehicle[] = [...INITIAL_VEHICLES];
let memoryBookings: Booking[] = [...INITIAL_BOOKINGS];
let memoryDocuments: CustomerDocument[] = [...INITIAL_DOCUMENTS];
let memoryMaintenance: MaintenanceBlock[] = [];
let memoryCurrentUser: UserProfile = DEMO_USERS[0]; // Default to Customer
let memoryBookingSeq = 1003;

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

// Store API
export const store = {
  // --- USERS & AUTH ---
  getCurrentUser(): UserProfile {
    return getFromStorage(STORAGE_KEYS.CURRENT_USER, memoryCurrentUser);
  },

  setCurrentUser(user: UserProfile): void {
    memoryCurrentUser = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('amma-auth-changed'));
    }
  },

  switchUserRole(role: UserRole): UserProfile {
    const target = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    this.setCurrentUser(target);
    return target;
  },

  // --- VEHICLES ---
  getVehicles(filters?: {
    category?: 'car' | 'bike';
    transmission?: string;
    fuelType?: string;
    search?: string;
    pickupTime?: string;
    returnTime?: string;
    includeUnpublished?: boolean;
  }): Vehicle[] {
    let list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, memoryVehicles);

    if (!filters?.includeUnpublished) {
      list = list.filter((v) => v.isPublished);
    }

    if (filters?.category) {
      list = list.filter((v) => v.category === filters.category);
    }

    if (filters?.transmission && filters.transmission !== 'all') {
      list = list.filter((v) => v.transmission === filters.transmission);
    }

    if (filters?.fuelType && filters.fuelType !== 'all') {
      list = list.filter((v) => v.fuelType === filters.fuelType);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.subCategory.toLowerCase().includes(q)
      );
    }

    // Availability filtering if dates are chosen
    if (filters?.pickupTime && filters?.returnTime) {
      const bookings = this.getBookings();
      const maintenance = this.getMaintenanceBlocks();
      list = list.filter((v) => {
        const check = checkVehicleAvailability(
          v,
          filters.pickupTime!,
          filters.returnTime!,
          bookings,
          maintenance
        );
        return check.isAvailable;
      });
    }

    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  getVehicleById(id: string): Vehicle | undefined {
    const list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, memoryVehicles);
    return list.find((v) => v.id === id);
  },

  saveVehicle(vehicle: Vehicle): void {
    const list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, memoryVehicles);
    const index = list.findIndex((v) => v.id === vehicle.id);

    if (index >= 0) {
      list[index] = vehicle;
    } else {
      list.push(vehicle);
    }

    memoryVehicles = list;
    saveToStorage(STORAGE_KEYS.VEHICLES, list);
  },

  deleteVehicle(id: string): void {
    let list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, memoryVehicles);
    list = list.filter((v) => v.id !== id);
    memoryVehicles = list;
    saveToStorage(STORAGE_KEYS.VEHICLES, list);
  },

  // --- MAINTENANCE BLOCKS ---
  getMaintenanceBlocks(vehicleId?: string): MaintenanceBlock[] {
    let list = getFromStorage<MaintenanceBlock[]>(STORAGE_KEYS.MAINTENANCE, memoryMaintenance);
    if (vehicleId) {
      list = list.filter((m) => m.vehicleId === vehicleId);
    }
    return list;
  },

  addMaintenanceBlock(block: Omit<MaintenanceBlock, 'id'>): MaintenanceBlock {
    const list = getFromStorage<MaintenanceBlock[]>(STORAGE_KEYS.MAINTENANCE, memoryMaintenance);
    const newBlock: MaintenanceBlock = {
      ...block,
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newBlock);
    memoryMaintenance = list;
    saveToStorage(STORAGE_KEYS.MAINTENANCE, list);
    return newBlock;
  },

  deleteMaintenanceBlock(id: string): void {
    let list = getFromStorage<MaintenanceBlock[]>(STORAGE_KEYS.MAINTENANCE, memoryMaintenance);
    list = list.filter((m) => m.id !== id);
    memoryMaintenance = list;
    saveToStorage(STORAGE_KEYS.MAINTENANCE, list);
  },

  // --- BOOKINGS ---
  getBookings(filters?: { userId?: string; status?: BookingStatus }): Booking[] {
    let list = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, memoryBookings);
    if (filters?.userId) {
      list = list.filter((b) => b.userId === filters.userId);
    }
    if (filters?.status) {
      list = list.filter((b) => b.status === filters.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getBookingById(id: string): Booking | undefined {
    const list = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, memoryBookings);
    return list.find((b) => b.id === id || b.bookingRef === id);
  },

  createBooking(params: {
    vehicleId: string;
    pickupTime: string;
    returnTime: string;
    pickupLocation: string;
    returnLocation: string;
    helmetCount?: number;
    damageProtection?: boolean;
    customerNotes?: string;
    customer: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
    };
  }): { success: boolean; booking?: Booking; error?: string } {
    const vehicle = this.getVehicleById(params.vehicleId);
    if (!vehicle) {
      return { success: false, error: 'Vehicle not found.' };
    }

    // Availability validation check against conflicts
    const existing = this.getBookings();
    const maintenance = this.getMaintenanceBlocks();
    const availability = checkVehicleAvailability(
      vehicle,
      params.pickupTime,
      params.returnTime,
      existing,
      maintenance
    );

    if (!availability.isAvailable) {
      return { success: false, error: availability.reason || 'Vehicle is not available for requested dates.' };
    }

    // Calculate guaranteed price snapshot
    const pricing: PriceCalculation = calculateRentalPrice(
      vehicle,
      params.pickupTime,
      params.returnTime,
      {
        helmetCount: params.helmetCount,
        damageProtection: params.damageProtection,
      }
    );

    // Sequence reference generator
    let seq = getFromStorage(STORAGE_KEYS.NEXT_BOOKING_SEQ, memoryBookingSeq);
    const bookingRef = `AT-2026-${seq}`;
    seq += 1;
    memoryBookingSeq = seq;
    saveToStorage(STORAGE_KEYS.NEXT_BOOKING_SEQ, seq);

    const now = new Date().toISOString();
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingRef,
      userId: params.customer.id,
      userName: params.customer.fullName,
      userPhone: params.customer.phone,
      userEmail: params.customer.email,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleCategory: vehicle.category,
      vehicleImageUrl: vehicle.primaryImageUrl,
      pickupTime: params.pickupTime,
      returnTime: params.returnTime,
      pickupLocation: params.pickupLocation,
      returnLocation: params.returnLocation,
      status: 'pending',

      // Snapshots
      baseRateSnapshot: vehicle.dailyRate,
      hourlyRateSnapshot: vehicle.hourlyRate,
      depositSnapshot: vehicle.depositAmount,
      kmLimitSnapshot: vehicle.kmLimitPerDay,
      excessKmRateSnapshot: vehicle.excessKmRate,
      fuelPolicySnapshot: vehicle.fuelPolicy,

      // Itemized billing
      rentalCharge: pricing.baseRentalCharge,
      addonsCharge: pricing.addonsTotal,
      depositCharge: pricing.refundableDeposit,
      totalAmount: pricing.totalPayable,
      currency: 'INR',

      helmetCount: params.helmetCount || (vehicle.category === 'bike' ? 1 : 0),
      damageProtection: !!params.damageProtection,
      customerNotes: params.customerNotes,

      createdAt: now,
      updatedAt: now,
    };

    const bookings = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, memoryBookings);
    bookings.unshift(newBooking);
    memoryBookings = bookings;
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, booking: newBooking };
  },

  updateBookingStatus(
    bookingId: string,
    targetStatus: BookingStatus,
    role: UserRole,
    notes?: string
  ): { success: boolean; error?: string } {
    const bookings = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, memoryBookings);
    const index = bookings.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      return { success: false, error: 'Booking not found.' };
    }

    const currentBooking = bookings[index];
    const validation = canTransitionStatus(currentBooking.status, targetStatus, role);

    if (!validation.allowed) {
      return { success: false, error: validation.reason };
    }

    currentBooking.status = targetStatus;
    currentBooking.updatedAt = new Date().toISOString();

    if (notes) {
      if (role === 'admin') {
        currentBooking.adminNotes = notes;
        if (targetStatus === 'rejected') {
          currentBooking.rejectionReason = notes;
        }
      } else {
        if (targetStatus === 'cancelled') {
          currentBooking.cancellationReason = notes;
          currentBooking.cancelledAt = new Date().toISOString();
        }
      }
    }

    bookings[index] = currentBooking;
    memoryBookings = bookings;
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true };
  },

  // --- DOCUMENTS ---
  getCustomerDocuments(userId: string): CustomerDocument[] {
    const list = getFromStorage<CustomerDocument[]>(STORAGE_KEYS.DOCUMENTS, memoryDocuments);
    return list.filter((d) => d.userId === userId);
  },

  getAllDocuments(): CustomerDocument[] {
    return getFromStorage<CustomerDocument[]>(STORAGE_KEYS.DOCUMENTS, memoryDocuments);
  },

  addDocument(doc: Omit<CustomerDocument, 'id' | 'uploadedAt' | 'status'>): CustomerDocument {
    const list = getFromStorage<CustomerDocument[]>(STORAGE_KEYS.DOCUMENTS, memoryDocuments);
    const newDoc: CustomerDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
    };
    list.unshift(newDoc);
    memoryDocuments = list;
    saveToStorage(STORAGE_KEYS.DOCUMENTS, list);
    return newDoc;
  },

  updateDocumentStatus(
    docId: string,
    status: DocumentStatus,
    correctionNotes?: string,
    reviewerId?: string
  ): { success: boolean; error?: string } {
    const list = getFromStorage<CustomerDocument[]>(STORAGE_KEYS.DOCUMENTS, memoryDocuments);
    const index = list.findIndex((d) => d.id === docId);

    if (index === -1) {
      return { success: false, error: 'Document not found.' };
    }

    list[index].status = status;
    list[index].correctionNotes = correctionNotes;
    list[index].reviewedAt = new Date().toISOString();
    list[index].reviewedBy = reviewerId;

    memoryDocuments = list;
    saveToStorage(STORAGE_KEYS.DOCUMENTS, list);
    return { success: true };
  },

  // --- POLICIES ---
  getPolicies(): RentalPolicy[] {
    return INITIAL_POLICIES;
  },
};
