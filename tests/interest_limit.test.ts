import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { api } from '../src/lib/api';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] !== undefined ? this.store[key] : null;
  }
  setItem(key: string, val: string) {
    this.store[key] = String(val);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

if (typeof (globalThis as any).localStorage === 'undefined') {
  (globalThis as any).localStorage = new LocalStorageMock();
}

describe('Anti-Abuse Single Enquiry Enforcement (1 Enquiry Per User)', () => {
  const modalContent = fs.readFileSync(path.resolve(__dirname, '../src/components/VehicleInterestModal.tsx'), 'utf-8');
  const eventModalContent = fs.readFileSync(path.resolve(__dirname, '../src/components/EventInterestModal.tsx'), 'utf-8');
  const serverContent = fs.readFileSync(path.resolve(__dirname, '../server/index.js'), 'utf-8');
  const apiContent = fs.readFileSync(path.resolve(__dirname, '../src/lib/api.ts'), 'utf-8');

  beforeEach(() => {
    (globalThis as any).localStorage.clear();
  });

  it('1. api.ts provides methods to get and set active user enquiry session', () => {
    expect(api.getActiveUserEnquiry()).toBeNull();

    api.setActiveUserEnquiry({
      refId: 'AT-V-1099',
      phone: '9888877777',
      itemName: 'Mahindra Thar Roxx',
      createdAt: new Date().toISOString(),
      progressStage: 'New',
    });

    const active = api.getActiveUserEnquiry();
    expect(active).not.toBeNull();
    expect(active?.refId).toBe('AT-V-1099');
    expect(active?.phone).toBe('9888877777');

    api.setActiveUserEnquiry(null);
    expect(api.getActiveUserEnquiry()).toBeNull();
  });

  it('2. api.submitInterest blocks submission when an active enquiry is already in session', async () => {
    api.setActiveUserEnquiry({
      refId: 'AT-V-2001',
      phone: '9123456789',
      itemName: 'Toyota Innova Crysta',
      createdAt: new Date().toISOString(),
      progressStage: 'New',
    });

    await expect(
      api.submitInterest({
        type: 'vehicle',
        name: 'Test Customer',
        phone: '9123456789',
        vehicleId: 'v-1',
        vehicleName: 'Toyota Innova Crysta',
      })
    ).rejects.toThrow(/already have an active reservation enquiry/i);
  });

  it('3. api.submitInterest blocks duplicate submission by phone number in local store', async () => {
    // Submit first enquiry
    const sub1 = await api.submitInterest({
      type: 'vehicle',
      name: 'Ravi Kumar',
      phone: '9988776655',
      vehicleId: 'v-2',
      vehicleName: 'Hyundai Creta',
      pickupDate: '2026-12-01',
      returnDate: '2026-12-03',
    });

    expect(sub1.refId).toBeDefined();

    // Try submitting again with the same phone number (even if session cache was cleared)
    api.setActiveUserEnquiry(null);

    await expect(
      api.submitInterest({
        type: 'vehicle',
        name: 'Ravi Kumar',
        phone: '9988776655',
        vehicleId: 'v-3',
        vehicleName: 'Mahindra XUV 700',
        pickupDate: '2026-12-05',
        returnDate: '2026-12-07',
      })
    ).rejects.toThrow(/already have an active enquiry/i);
  });

  it('4. server/index.js contains strict duplicate checks for phone, email, and IP cooldown', () => {
    // Check phone duplicate check
    expect(serverContent).toContain('existingByPhone');
    expect(serverContent).toContain('409');
    expect(serverContent).toContain('1 active enquiry is permitted per user');

    // Check email duplicate check
    expect(serverContent).toContain('existingByEmail');

    // Check recent IP device cooldown
    expect(serverContent).toContain('recentIpSubmissions');
    expect(serverContent).toContain('429');
  });

  it('5. VehicleInterestModal.tsx informs the user of active enquiry and disables duplicate submissions', () => {
    expect(modalContent).toContain('activeExistingEnquiry');
    expect(modalContent).toContain('Active Reservation Enquiry Detected');
    expect(modalContent).toContain('Limit: 1 Active Enquiry');
    expect(modalContent).toContain('Enquiry already in progress');
  });

  it('6. EventInterestModal.tsx enforces the 1 active enquiry limit', () => {
    expect(eventModalContent).toContain('activeExistingEnquiry');
    expect(eventModalContent).toContain('Active Reservation Enquiry Detected');
    expect(eventModalContent).toContain('Limit: 1 Active Enquiry');
    expect(eventModalContent).toContain('Enquiry in progress');
  });
});
