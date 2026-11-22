import { Vehicle, EventPackage, InterestSubmission, DashboardStats, User, ActivityLog, LeadStage } from '@/types';
import { SEED_VEHICLES, SEED_PACKAGES, SEED_INTERESTS } from '../../server/seed-data.js';

// Local storage keys for resilient offline / zero-setup client execution
const STORAGE_KEYS = {
  VEHICLES: 'at_vehicles_v7',
  PACKAGES: 'at_packages_v3',
  INTERESTS: 'at_interests_v4',
  LOGS: 'at_activity_logs_v4',
  AUTH: 'at_auth_user',
  ACTIVE_ENQUIRY: 'at_active_user_enquiry',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // fallback
  }
}

function getAuthHeaders(): Record<string, string> {
  try {
    const user = getStorage<User | null>(STORAGE_KEYS.AUTH, null);
    if (user?.token) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      };
    }
  } catch {}
  return { 'Content-Type': 'application/json' };
}

export const api = {
  // --- VEHICLES ---
  async getVehicles(filters?: {
    type?: string;
    subType?: string;
    transmission?: string;
    fuel?: string;
    seats?: string;
    status?: string;
    search?: string;
  }): Promise<Vehicle[]> {
    try {
      const query = new URLSearchParams(filters as any).toString();
      const res = await fetch(`/api/vehicles?${query}`);
      if (res.ok) {
        const data = await res.json();
        return data.vehicles;
      }
    } catch {
      // Fallback to local storage
    }

    let list = getStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, SEED_VEHICLES as any);
    if (filters?.type && filters.type !== 'all') {
      list = list.filter((v) => v.type === filters.type);
    }
    if (filters?.transmission && filters.transmission !== 'all') {
      list = list.filter((v) => v.transmission === filters.transmission);
    }
    if (filters?.fuel && filters.fuel !== 'all') {
      list = list.filter((v) => v.fuel === filters.fuel);
    }
    if (filters?.seats && filters.seats !== 'all') {
      list = list.filter((v) => String(v.seats) === String(filters.seats));
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((v) => v.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const res = await fetch(`/api/vehicles/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.vehicle;
      }
    } catch {}

    const list = getStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, SEED_VEHICLES as any);
    const vehicle = list.find((v) => v.id === id);
    if (!vehicle) return null;

    const frames360 = Array.from({ length: 36 }, (_, i) => `${vehicle.primaryImage}&angle=${i * 10}`);
    return { ...vehicle, frames360 };
  },

  async saveVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const method = vehicle.id ? 'PUT' : 'POST';
      const url = vehicle.id ? `/api/vehicles/${vehicle.id}` : '/api/vehicles';
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicle),
      });
      if (res.ok) {
        const data = await res.json();
        return data.vehicle;
      }
    } catch {}

    const list = getStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, SEED_VEHICLES as any);
    if (vehicle.id) {
      const idx = list.findIndex((v) => v.id === vehicle.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...vehicle } as Vehicle;
      }
      setStorage(STORAGE_KEYS.VEHICLES, list);
      return list[idx];
    } else {
      const newV: Vehicle = {
        ...vehicle,
        id: `v-${Date.now()}`,
        status: vehicle.status || 'Available',
        pricePerDay: vehicle.pricePerDay || 1000,
        pricePerWeek: vehicle.pricePerWeek || 6000,
        deposit: vehicle.deposit || 1500,
        kmLimit: vehicle.kmLimit || 150,
        excessKmRate: vehicle.excessKmRate || 5,
        specs: vehicle.specs || {},
        features: vehicle.features || ['Complimentary Helmet', 'Clean Sanitized Vehicle'],
        gallery: vehicle.gallery || [vehicle.primaryImage || ''],
        has360View: true,
      } as Vehicle;
      list.unshift(newV);
      setStorage(STORAGE_KEYS.VEHICLES, list);
      return newV;
    }
  },

  async deleteVehicle(id: string): Promise<void> {
    try {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch {}
    let list = getStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, SEED_VEHICLES as any);
    list = list.filter((v) => v.id !== id);
    setStorage(STORAGE_KEYS.VEHICLES, list);
  },

  // --- EVENT PACKAGES ---
  async getPackages(eventType?: string): Promise<EventPackage[]> {
    try {
      const query = eventType ? `?eventType=${eventType}` : '';
      const res = await fetch(`/api/packages${query}`);
      if (res.ok) {
        const data = await res.json();
        return data.packages;
      }
    } catch {}

    let list = getStorage<EventPackage[]>(STORAGE_KEYS.PACKAGES, SEED_PACKAGES as any);
    if (eventType && eventType !== 'all') {
      list = list.filter((p) => p.eventType.toLowerCase() === eventType.toLowerCase());
    }
    return list;
  },

  async savePackage(pkg: Partial<EventPackage>): Promise<EventPackage> {
    try {
      const method = pkg.id ? 'PUT' : 'POST';
      const url = pkg.id ? `/api/packages/${pkg.id}` : '/api/packages';
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(pkg),
      });
      if (res.ok) {
        const data = await res.json();
        return data.package;
      }
    } catch {}

    const list = getStorage<EventPackage[]>(STORAGE_KEYS.PACKAGES, SEED_PACKAGES as any);
    if (pkg.id) {
      const idx = list.findIndex((p) => p.id === pkg.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...pkg } as EventPackage;
      setStorage(STORAGE_KEYS.PACKAGES, list);
      return list[idx];
    } else {
      const newP: EventPackage = {
        ...pkg,
        id: `pkg-${Date.now()}`,
        slug: (pkg.title || 'package').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        gallery: pkg.gallery || [],
        includedServices: pkg.includedServices || [],
        highlights: pkg.highlights || [],
        isFeatured: true,
      } as EventPackage;
      list.unshift(newP);
      setStorage(STORAGE_KEYS.PACKAGES, list);
      return newP;
    }
  },

  // --- ACTIVE ENQUIRY TRACKING (ANTI-SPAM / SINGLE ENQUIRY ENFORCEMENT) ---
  getActiveUserEnquiry(): { refId: string; phone?: string; itemName?: string; createdAt?: string; progressStage?: string } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ENQUIRY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setActiveUserEnquiry(enquiry: { refId: string; phone?: string; itemName?: string; createdAt?: string; progressStage?: string } | null): void {
    try {
      if (enquiry) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ENQUIRY, JSON.stringify(enquiry));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENQUIRY);
      }
    } catch {}
  },

  // --- INTEREST SUBMISSIONS & CRM ---
  async submitInterest(data: Partial<InterestSubmission> & { honeypot?: string }): Promise<InterestSubmission> {
    const cleanPhone = (data.phone || '').replace(/[^0-9]/g, '').slice(-10);

    // Check if user already has an active reservation in local session
    const existingSessionEnquiry = this.getActiveUserEnquiry();
    if (existingSessionEnquiry) {
      throw new Error(`You already have an active reservation enquiry (Ref ID: ${existingSessionEnquiry.refId}). To prevent duplicate bookings and spam attacks, each user is limited to 1 active enquiry at a time.`);
    }

    try {
      const res = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.interest) {
          this.setActiveUserEnquiry({
            refId: result.interest.refId,
            phone: cleanPhone,
            itemName: result.interest.vehicleName || result.interest.packageName,
            createdAt: result.interest.createdAt,
            progressStage: result.interest.progressStage,
          });
          return result.interest;
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (errJson?.error) {
          if (errJson.refId) {
            this.setActiveUserEnquiry({
              refId: errJson.refId,
              phone: cleanPhone,
              itemName: errJson.existing?.itemName,
              createdAt: errJson.existing?.createdAt,
              progressStage: errJson.existing?.progressStage,
            });
          }
          throw new Error(errJson.error);
        }
      }
    } catch (fetchErr: any) {
      const isNetworkOrUrlErr =
        !fetchErr?.message ||
        fetchErr.message.includes('Failed to fetch') ||
        fetchErr.message.includes('Failed to parse URL') ||
        fetchErr.message.includes('Invalid URL') ||
        fetchErr.code === 'ERR_INVALID_URL';

      if (!isNetworkOrUrlErr) {
        throw fetchErr;
      }
      // Offline / Node test fallback handling
    }

    // Fallback store handling (resilient offline/client mode)
    const list = getStorage<InterestSubmission[]>(STORAGE_KEYS.INTERESTS, SEED_INTERESTS as any);

    const isTerminal = (stage?: string, status?: string) =>
      ['Completed', 'Rejected', 'Cancelled'].includes(stage || '') || status === 'Cancelled' || status === 'Completed';

    // Duplicate check by phone in offline store
    const existing = list.find((i) => {
      const iPhone = (i.phone || '').replace(/[^0-9]/g, '').slice(-10);
      return iPhone === cleanPhone && !isTerminal(i.progressStage, i.status);
    });

    if (existing) {
      this.setActiveUserEnquiry({
        refId: existing.refId,
        phone: existing.phone,
        itemName: existing.vehicleName || existing.packageName,
        createdAt: existing.createdAt,
        progressStage: existing.progressStage,
      });
      throw new Error(`You already have an active enquiry (Ref ID: ${existing.refId}). To prevent duplicate bookings and spam attacks, each user is limited to 1 active enquiry.`);
    }

    const seq = 1000 + list.length + 1;
    const refId = data.type === 'vehicle' ? `AT-V-${seq}` : `AT-E-${seq + 1000}`;

    const newSub: InterestSubmission = {
      id: `int-${Date.now()}`,
      refId,
      type: data.type || 'vehicle',
      vehicleId: data.vehicleId,
      vehicleName: data.vehicleName,
      packageId: data.packageId,
      packageName: data.packageName,
      name: data.name || 'Valued Customer',
      phone: data.phone || '',
      email: data.email || '',
      pickupDate: data.pickupDate,
      returnDate: data.returnDate,
      pickupLocation: data.pickupLocation || 'Kakinada Hub (Main Road)',
      idProofUrl: data.idProofUrl,
      eventType: data.eventType,
      eventDate: data.eventDate,
      guestCount: data.guestCount,
      budgetRange: data.budgetRange,
      cityVenue: data.cityVenue || 'Kakinada, AP',
      message: data.message,
      status: 'Submitted',
      progressStage: 'New',
      internalNotes: 'Form submitted from public portal. Awaiting staff contact.',
      followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newSub);
    setStorage(STORAGE_KEYS.INTERESTS, list);

    this.setActiveUserEnquiry({
      refId: newSub.refId,
      phone: cleanPhone,
      itemName: newSub.vehicleName || newSub.packageName,
      createdAt: newSub.createdAt,
      progressStage: newSub.progressStage,
    });

    return newSub;
  },

  async getInterests(filters?: { type?: string; stage?: string; status?: string; search?: string }): Promise<InterestSubmission[]> {
    try {
      const query = new URLSearchParams(filters as any).toString();
      const res = await fetch(`/api/interests?${query}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.interests;
      }
    } catch {}

    let list = getStorage<InterestSubmission[]>(STORAGE_KEYS.INTERESTS, SEED_INTERESTS as any);
    if (filters?.type && filters.type !== 'all') {
      list = list.filter((i) => i.type === filters.type);
    }
    if (filters?.stage && filters.stage !== 'all') {
      list = list.filter((i) => i.progressStage === filters.stage);
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((i) => i.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.refId.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.phone.includes(q) ||
          (i.vehicleName && i.vehicleName.toLowerCase().includes(q)) ||
          (i.packageName && i.packageName.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async updateInterestStage(
    id: string,
    stage: LeadStage,
    internalNotes?: string,
    followUpDate?: string,
    adminName = 'Staff'
  ): Promise<InterestSubmission> {
    try {
      const res = await fetch(`/api/interests/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ progressStage: stage, internalNotes, followUpDate, adminName }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.interest;
      }
    } catch {}

    const list = getStorage<InterestSubmission[]>(STORAGE_KEYS.INTERESTS, SEED_INTERESTS as any);
    const idx = list.findIndex((i) => i.id === id || i.refId === id);
    if (idx === -1) throw new Error('Lead not found');

    const updated = {
      ...list[idx],
      progressStage: stage,
      status: (stage === 'Confirmed' ? 'Confirmed' : stage === 'Completed' ? 'Completed' : stage === 'Rejected' ? 'Cancelled' : 'Contacted') as any,
      internalNotes: internalNotes !== undefined ? internalNotes : list[idx].internalNotes,
      followUpDate: followUpDate !== undefined ? followUpDate : list[idx].followUpDate,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    setStorage(STORAGE_KEYS.INTERESTS, list);

    // Save activity log
    const logs = getStorage<ActivityLog[]>(STORAGE_KEYS.LOGS, []);
    logs.unshift({
      id: `log-${Date.now()}`,
      interestId: id,
      adminName,
      action: `Stage updated to "${stage}"`,
      notes: internalNotes,
      createdAt: new Date().toISOString(),
    });
    setStorage(STORAGE_KEYS.LOGS, logs);

    return updated;
  },

  async getActivityLogs(interestId: string): Promise<ActivityLog[]> {
    try {
      const res = await fetch(`/api/interests/${interestId}/logs`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.logs;
      }
    } catch {}

    const logs = getStorage<ActivityLog[]>(STORAGE_KEYS.LOGS, []);
    return logs.filter((l) => l.interestId === interestId);
  },

  // --- ENQUIRY TRACKER ---
  async trackEnquiry(refId: string, phone: string): Promise<InterestSubmission | null> {
    const handleResult = (tracking: InterestSubmission | null) => {
      if (tracking) {
        if (
          ['Completed', 'Rejected', 'Cancelled'].includes(tracking.progressStage || '') ||
          tracking.status === 'Cancelled' ||
          tracking.status === 'Completed'
        ) {
          this.setActiveUserEnquiry(null);
        } else {
          this.setActiveUserEnquiry({
            refId: tracking.refId,
            phone: tracking.phone,
            itemName: tracking.vehicleName || tracking.packageName,
            createdAt: tracking.createdAt,
            progressStage: tracking.progressStage,
          });
        }
      }
      return tracking;
    };

    try {
      const res = await fetch(`/api/track?refId=${encodeURIComponent(refId)}&phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        return handleResult(data.tracking);
      }
    } catch {}

    const list = getStorage<InterestSubmission[]>(STORAGE_KEYS.INTERESTS, SEED_INTERESTS as any);
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const found = list.find(
      (i) =>
        i.refId.toUpperCase() === refId.toUpperCase() &&
        i.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone
    );

    return handleResult(found || null);
  },

  // --- DASHBOARD STATS ---
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch('/api/stats', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.stats;
      }
    } catch {}

    const vList = getStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, SEED_VEHICLES as any);
    const iList = getStorage<InterestSubmission[]>(STORAGE_KEYS.INTERESTS, SEED_INTERESTS as any);

    return {
      totalVehicles: vList.length,
      availableVehicles: vList.filter((v) => v.status === 'Available').length,
      bookedVehicles: vList.filter((v) => v.status === 'Booked').length,
      maintenanceVehicles: vList.filter((v) => v.status === 'Maintenance').length,
      newEnquiriesToday: iList.length,
      confirmedBookings: iList.filter((i) => i.progressStage === 'Confirmed').length,
      eventEnquiries: iList.filter((i) => i.type === 'event').length,
      estimatedRevenue: iList.length * 4500,
      enquiriesOverTime: [
        { date: '2026-11-17', count: 4 },
        { date: '2026-11-18', count: 6 },
        { date: '2026-11-19', count: 8 },
        { date: '2026-11-20', count: 12 },
        { date: '2026-11-21', count: 9 },
      ],
      mostRequestedVehicles: [
        { name: 'Mahindra Thar Roxx Star Edition (5-Door)', count: 16 },
        { name: 'Toyota Innova Crysta 2.4 VX', count: 14 },
        { name: 'Royal Enfield Continental GT 650', count: 12 },
        { name: 'Mahindra XUV 7XO AX7 L Automatic', count: 10 },
        { name: 'Honda Activa 6G', count: 9 },
      ],
    };
  },

  async getStats(): Promise<DashboardStats> {
    return this.getDashboardStats();
  },

  // --- AUTH ---
  getCurrentUser(): User | null {
    return getStorage<User | null>(STORAGE_KEYS.AUTH, null);
  },

  setCurrentUser(user: User | null): void {
    setStorage(STORAGE_KEYS.AUTH, user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('at_auth_changed'));
    }
  },

  async login(username: string, password: string, role: 'admin' | 'staff' = 'admin'): Promise<User> {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const isAdminUser =
      cleanUser === 'admin' ||
      cleanUser === 'admin@ammatravelskkd.com' ||
      cleanUser === 'admin@ammatravels.in';

    const isAdminPass =
      cleanPass === 'AmmaTravels@2026' ||
      cleanPass === '"AmmaTravels@2026"' ||
      cleanPass === 'AmmaAdmin#Kkd2026' ||
      cleanPass === '"AmmaAdmin#Kkd2026"';

    const isStaffUser =
      cleanUser === 'staff' ||
      cleanUser === 'staff@ammatravelskkd.com';

    const isStaffPass =
      cleanPass === 'Staff@2026' ||
      cleanPass === '"Staff@2026"';

    // Try backend authentication first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });
      if (res.ok) {
        const data = await res.json();
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          token: data.token,
        };
        this.setCurrentUser(user);
        return user;
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData?.error) {
          throw new Error(errData.error);
        }
      }
    } catch (fetchErr: any) {
      if (fetchErr?.message && !fetchErr.message.includes('Failed to fetch')) {
        throw fetchErr;
      }
      // Backend offline or unreachable, proceed to resilient client verification
    }

    // Client-side resilient verification (supports offline, dev mode, and direct client execution)
    if (isAdminUser && isAdminPass) {
      const adminUser: User = {
        id: 'u-admin-01',
        name: 'Amma Travels Admin',
        email: 'admin@ammatravelskkd.com',
        role: 'admin',
        token: `client-token-admin-${Date.now()}`,
      };
      this.setCurrentUser(adminUser);
      return adminUser;
    }

    if (isStaffUser && isStaffPass) {
      const staffUser: User = {
        id: 'u-staff-01',
        name: 'Amma Travels Staff',
        email: 'staff@ammatravelskkd.com',
        role: 'staff',
        token: `client-token-staff-${Date.now()}`,
      };
      this.setCurrentUser(staffUser);
      return staffUser;
    }

    throw new Error('Invalid administrator credentials. Please check your username and password.');
  },

  logout(): void {
    this.setCurrentUser(null);
  },
};
