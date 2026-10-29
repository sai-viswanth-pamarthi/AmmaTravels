import { Vehicle, PriceCalculation } from './types';

export const MIN_RENTAL_HOURS = 4;
export const HELMET_DAILY_FEE = 50; // INR per day for extra helmet (1st helmet is free)
export const PROTECTION_DAILY_FEE_BIKE = 150; // INR per day
export const PROTECTION_DAILY_FEE_CAR = 350; // INR per day

/**
 * Calculates rental duration between pickup and return timestamps in hours and days.
 */
export function calculateRentalDuration(pickupIso: string, returnIso: string): {
  totalHours: number;
  days: number;
  hoursRemainder: number;
  formattedDuration: string;
} {
  const pickup = new Date(pickupIso).getTime();
  const dropoff = new Date(returnIso).getTime();

  if (isNaN(pickup) || isNaN(dropoff) || dropoff <= pickup) {
    return {
      totalHours: 0,
      days: 0,
      hoursRemainder: 0,
      formattedDuration: '0 Hours',
    };
  }

  // Calculate duration in exact hours (rounded up to nearest hour)
  const diffMs = dropoff - pickup;
  const exactHours = diffMs / (1000 * 60 * 60);
  const totalHours = Math.max(1, Math.ceil(exactHours));

  const days = Math.floor(totalHours / 24);
  const hoursRemainder = totalHours % 24;

  let formattedDuration = '';
  if (days > 0) {
    formattedDuration += `${days} ${days === 1 ? 'Day' : 'Days'}`;
    if (hoursRemainder > 0) {
      formattedDuration += ` ${hoursRemainder} ${hoursRemainder === 1 ? 'Hour' : 'Hours'}`;
    }
  } else {
    formattedDuration = `${totalHours} ${totalHours === 1 ? 'Hour' : 'Hours'}`;
  }

  return {
    totalHours,
    days,
    hoursRemainder,
    formattedDuration,
  };
}

/**
 * Calculates itemized rental charges based on vehicle rates and user options.
 * Follows Royal Brothers transparent pricing model.
 */
export function calculateRentalPrice(
  vehicle: Pick<Vehicle, 'category' | 'dailyRate' | 'hourlyRate' | 'depositAmount' | 'kmLimitPerDay' | 'excessKmRate'>,
  pickupIso: string,
  returnIso: string,
  options: {
    helmetCount?: number;
    damageProtection?: boolean;
  } = {}
): PriceCalculation {
  const { totalHours, days, hoursRemainder, formattedDuration } = calculateRentalDuration(pickupIso, returnIso);

  if (totalHours < MIN_RENTAL_HOURS) {
    // If less than minimum, we still calculate based on min hours or base
  }

  // Calculate base rental charge
  let baseRentalCharge = 0;
  if (totalHours <= 24) {
    // For single-day or sub-24h rental:
    // If hours <= 12, use hourly rate, but cap at dailyRate
    const hourlySubtotal = totalHours * vehicle.hourlyRate;
    baseRentalCharge = Math.min(hourlySubtotal, vehicle.dailyRate);
  } else {
    // Multi-day rental:
    const fullDaysCharge = days * vehicle.dailyRate;
    let remainderCharge = 0;
    if (hoursRemainder > 0) {
      if (hoursRemainder > 12) {
        remainderCharge = vehicle.dailyRate;
      } else {
        remainderCharge = hoursRemainder * vehicle.hourlyRate;
      }
    }
    baseRentalCharge = fullDaysCharge + remainderCharge;
  }

  // Total billable days (ceiling of days for add-ons like helmets and protection)
  const billableDays = Math.max(1, Math.ceil(totalHours / 24));

  // Add-ons
  const extraHelmets = Math.max(0, (options.helmetCount || 1) - 1);
  const helmetCharge = vehicle.category === 'bike' ? extraHelmets * HELMET_DAILY_FEE * billableDays : 0;

  const protectionDailyRate = vehicle.category === 'bike' ? PROTECTION_DAILY_FEE_BIKE : PROTECTION_DAILY_FEE_CAR;
  const protectionCharge = options.damageProtection ? protectionDailyRate * billableDays : 0;

  const addonsTotal = helmetCharge + protectionCharge;
  const refundableDeposit = vehicle.depositAmount;
  const totalPayable = baseRentalCharge + addonsTotal + refundableDeposit;

  // Kilometre limits
  const kmAllowed = billableDays * vehicle.kmLimitPerDay;

  return {
    totalHours,
    rentalDays: days,
    rentalHoursRemainder: hoursRemainder,
    baseRentalCharge: Math.round(baseRentalCharge),
    helmetCharge: Math.round(helmetCharge),
    protectionCharge: Math.round(protectionCharge),
    addonsTotal: Math.round(addonsTotal),
    refundableDeposit: Math.round(refundableDeposit),
    totalPayable: Math.round(totalPayable),
    kmAllowed,
    excessKmRate: vehicle.excessKmRate,
    currency: 'INR',
    formattedDuration,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
