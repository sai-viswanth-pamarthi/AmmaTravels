import { describe, it, expect } from 'vitest';
import {
  checkVehicleAvailability,
  doIntervalsOverlap,
  RENTAL_BUFFER_MS,
} from '../src/lib/availability';
import { Vehicle, Booking, MaintenanceBlock } from '../src/lib/types';
import { INITIAL_VEHICLES } from '../src/lib/mock-data';

describe('Availability Engine & Overlap Conflict Prevention', () => {
  const testVehicle: Vehicle = {
    ...INITIAL_VEHICLES[0],
    id: 'test-vehicle-01',
    isPublished: true,
    isAvailable: true,
  };

  const existingBooking: Booking = {
    id: 'b-101',
    bookingRef: 'AT-2026-9999',
    userId: 'u-1',
    userName: 'Test User',
    userPhone: '9876543210',
    userEmail: 'test@example.com',
    vehicleId: 'test-vehicle-01',
    vehicleName: 'Test Vehicle',
    vehicleCategory: 'bike',
    vehicleImageUrl: '',
    pickupTime: '2026-10-20T10:00:00.000Z',
    returnTime: '2026-10-22T10:00:00.000Z',
    pickupLocation: 'Kakinada Hub',
    returnLocation: 'Kakinada Hub',
    status: 'confirmed',
    baseRateSnapshot: 450,
    hourlyRateSnapshot: 35,
    depositSnapshot: 1000,
    kmLimitSnapshot: 150,
    excessKmRateSnapshot: 4,
    fuelPolicySnapshot: 'customer_fills',
    rentalCharge: 900,
    addonsCharge: 0,
    depositCharge: 1000,
    totalAmount: 1900,
    currency: 'INR',
    helmetCount: 1,
    damageProtection: false,
    createdAt: '2026-10-10T00:00:00.000Z',
    updatedAt: '2026-10-10T00:00:00.000Z',
  };

  it('detects direct overlap during an active booking window', () => {
    // Request overlaps completely inside: 2026-10-21T09:00:00 to 2026-10-21T18:00:00
    const reqPickup = '2026-10-21T09:00:00.000Z';
    const reqReturn = '2026-10-21T18:00:00.000Z';

    const check = checkVehicleAvailability(testVehicle, reqPickup, reqReturn, [existingBooking], []);
    expect(check.isAvailable).toBe(false);
    expect(check.reason).toContain('reserved booking');
  });

  it('detects partial overlap spanning the return time', () => {
    // Request starts before existing booking returns and ends after
    const reqPickup = '2026-10-22T08:00:00.000Z';
    const reqReturn = '2026-10-23T10:00:00.000Z';

    const check = checkVehicleAvailability(testVehicle, reqPickup, reqReturn, [existingBooking], []);
    expect(check.isAvailable).toBe(false);
  });

  it('allows reservation when requested period is completely before existing booking', () => {
    const reqPickup = '2026-10-18T09:00:00.000Z';
    const reqReturn = '2026-10-19T09:00:00.000Z';

    const check = checkVehicleAvailability(testVehicle, reqPickup, reqReturn, [existingBooking], []);
    expect(check.isAvailable).toBe(true);
  });

  it('allows reservation when requested period is after existing booking and buffer window', () => {
    // Existing ends on 22nd at 10:00:00. Request starts 22nd at 14:00:00 (after 30 min buffer)
    const reqPickup = '2026-10-22T14:00:00.000Z';
    const reqReturn = '2026-10-23T14:00:00.000Z';

    const check = checkVehicleAvailability(testVehicle, reqPickup, reqReturn, [existingBooking], []);
    expect(check.isAvailable).toBe(true);
  });

  it('ignores cancelled or rejected bookings during collision evaluation', () => {
    const cancelledBooking: Booking = { ...existingBooking, status: 'cancelled' };
    const reqPickup = '2026-10-21T09:00:00.000Z';
    const reqReturn = '2026-10-21T18:00:00.000Z';

    const check = checkVehicleAvailability(testVehicle, reqPickup, reqReturn, [cancelledBooking], []);
    expect(check.isAvailable).toBe(true);
  });

  it('blocks reservation during scheduled maintenance periods', () => {
    const maintBlock: MaintenanceBlock = {
      id: 'm-1',
      vehicleId: 'test-vehicle-01',
      startTime: '2026-10-25T08:00:00.000Z',
      endTime: '2026-10-26T18:00:00.000Z',
      reason: 'Brake pad replacement and wheel alignment',
    };

    const reqPickup = '2026-10-25T12:00:00.000Z';
    const reqReturn = '2026-10-25T16:00:00.000Z';

    const check = checkVehicleAvailability(testVehicle, reqPickup, reqReturn, [], [maintBlock]);
    expect(check.isAvailable).toBe(false);
    expect(check.reason).toContain('maintenance');
  });

  it('rejects booking if vehicle is marked unpublished or unavailable', () => {
    const unpublishedVehicle: Vehicle = { ...testVehicle, isPublished: false };
    const check = checkVehicleAvailability(
      unpublishedVehicle,
      '2026-10-28T09:00:00.000Z',
      '2026-10-29T09:00:00.000Z',
      [],
      []
    );
    expect(check.isAvailable).toBe(false);
    expect(check.reason).toContain('unpublished');
  });
});
