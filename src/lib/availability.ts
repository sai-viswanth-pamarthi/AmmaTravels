import { Booking, MaintenanceBlock, Vehicle } from './types';

// Buffer in milliseconds between rentals for cleaning, fuel check, and sanitization (default 30 mins)
export const RENTAL_BUFFER_MS = 30 * 60 * 1000;

export interface AvailabilityCheckResult {
  isAvailable: boolean;
  reason?: string;
}

/**
 * Checks if two date ranges overlap, considering an optional buffer time.
 */
export function doIntervalsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
  bufferMs: number = 0
): boolean {
  const bufferedStartB = new Date(startB.getTime() - bufferMs);
  const bufferedEndB = new Date(endB.getTime() + bufferMs);

  return startA < bufferedEndB && endA > bufferedStartB;
}

/**
 * Evaluates whether a vehicle is free for the requested duration.
 * Protects against double bookings, maintenance conflicts, and unpublished status.
 */
export function checkVehicleAvailability(
  vehicle: Vehicle,
  pickupIso: string,
  returnIso: string,
  existingBookings: Booking[],
  maintenanceBlocks: MaintenanceBlock[] = []
): AvailabilityCheckResult {
  if (!vehicle.isPublished) {
    return { isAvailable: false, reason: 'This vehicle is currently unpublished.' };
  }

  if (!vehicle.isAvailable) {
    return { isAvailable: false, reason: 'This vehicle is marked unavailable by the fleet manager.' };
  }

  const reqPickup = new Date(pickupIso);
  const reqReturn = new Date(returnIso);

  if (isNaN(reqPickup.getTime()) || isNaN(reqReturn.getTime())) {
    return { isAvailable: false, reason: 'Invalid pickup or return date provided.' };
  }

  if (reqReturn <= reqPickup) {
    return { isAvailable: false, reason: 'Return date/time must be strictly after pickup date/time.' };
  }

  // 1. Check Maintenance Blocks
  const vehicleMaintenance = maintenanceBlocks.filter((m) => m.vehicleId === vehicle.id);
  for (const block of vehicleMaintenance) {
    const blockStart = new Date(block.startTime);
    const blockEnd = new Date(block.endTime);

    if (doIntervalsOverlap(reqPickup, reqReturn, blockStart, blockEnd, 0)) {
      return {
        isAvailable: false,
        reason: `Vehicle is scheduled for maintenance (${block.reason}) between ${blockStart.toLocaleDateString('en-IN')} and ${blockEnd.toLocaleDateString('en-IN')}.`,
      };
    }
  }

  // 2. Check Conflicting Active Bookings
  // Conflicting statuses: pending, under_review, confirmed, ready_for_pickup, active
  const activeBookings = existingBookings.filter(
    (b) =>
      b.vehicleId === vehicle.id &&
      b.status !== 'cancelled' &&
      b.status !== 'rejected' &&
      b.status !== 'completed'
  );

  for (const booking of activeBookings) {
    const existingPickup = new Date(booking.pickupTime);
    const existingReturn = new Date(booking.returnTime);

    if (doIntervalsOverlap(reqPickup, reqReturn, existingPickup, existingReturn, RENTAL_BUFFER_MS)) {
      return {
        isAvailable: false,
        reason: `Vehicle already has a reserved booking from ${existingPickup.toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })} to ${existingReturn.toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}.`,
      };
    }
  }

  return { isAvailable: true };
}
