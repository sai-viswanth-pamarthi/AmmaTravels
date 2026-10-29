import { describe, it, expect } from 'vitest';
import {
  calculateRentalDuration,
  calculateRentalPrice,
  formatINR,
  MIN_RENTAL_HOURS,
} from '../src/lib/pricing';
import { Vehicle } from '../src/lib/types';

describe('Pricing Engine & Duration Calculations', () => {
  const sampleBike: Pick<Vehicle, 'category' | 'dailyRate' | 'hourlyRate' | 'depositAmount' | 'kmLimitPerDay' | 'excessKmRate'> = {
    category: 'bike',
    dailyRate: 450,
    hourlyRate: 35,
    depositAmount: 1000,
    kmLimitPerDay: 150,
    excessKmRate: 4.0,
  };

  const sampleCar: Pick<Vehicle, 'category' | 'dailyRate' | 'hourlyRate' | 'depositAmount' | 'kmLimitPerDay' | 'excessKmRate'> = {
    category: 'car',
    dailyRate: 1600,
    hourlyRate: 110,
    depositAmount: 3000,
    kmLimitPerDay: 250,
    excessKmRate: 10.0,
  };

  it('calculates duration correctly for single day', () => {
    const pickup = '2026-10-15T09:00:00';
    const dropoff = '2026-10-15T17:00:00'; // 8 hours
    const res = calculateRentalDuration(pickup, dropoff);

    expect(res.totalHours).toBe(8);
    expect(res.days).toBe(0);
    expect(res.formattedDuration).toBe('8 Hours');
  });

  it('calculates duration for multi-day rentals', () => {
    const pickup = '2026-10-15T09:00:00';
    const dropoff = '2026-10-17T14:00:00'; // 2 days 5 hours = 53 hours
    const res = calculateRentalDuration(pickup, dropoff);

    expect(res.totalHours).toBe(53);
    expect(res.days).toBe(2);
    expect(res.hoursRemainder).toBe(5);
    expect(res.formattedDuration).toBe('2 Days 5 Hours');
  });

  it('handles invalid or reversed dates safely', () => {
    const pickup = '2026-10-17T09:00:00';
    const dropoff = '2026-10-15T09:00:00';
    const res = calculateRentalDuration(pickup, dropoff);

    expect(res.totalHours).toBe(0);
    expect(res.formattedDuration).toBe('0 Hours');
  });

  it('calculates bike pricing with single helmet free', () => {
    const pickup = '2026-10-15T09:00:00';
    const dropoff = '2026-10-16T09:00:00'; // 24 hours = 1 day

    const calc = calculateRentalPrice(sampleBike, pickup, dropoff, { helmetCount: 1 });

    expect(calc.baseRentalCharge).toBe(450);
    expect(calc.helmetCharge).toBe(0); // 1st helmet free
    expect(calc.refundableDeposit).toBe(1000);
    expect(calc.totalPayable).toBe(1450); // 450 + 1000
    expect(calc.kmAllowed).toBe(150);
  });

  it('charges for additional second helmet for bikes', () => {
    const pickup = '2026-10-15T09:00:00';
    const dropoff = '2026-10-17T09:00:00'; // 2 days

    const calc = calculateRentalPrice(sampleBike, pickup, dropoff, { helmetCount: 2 });

    expect(calc.baseRentalCharge).toBe(900); // 2 * 450
    expect(calc.helmetCharge).toBe(100); // 1 extra helmet * 50 * 2 days
    expect(calc.refundableDeposit).toBe(1000);
    expect(calc.totalPayable).toBe(2000); // 900 + 100 + 1000
  });

  it('caps sub-24h hourly rates at daily rate', () => {
    // 15 hours * 35 = 525, which exceeds dailyRate of 450 -> capped at 450
    const pickup = '2026-10-15T06:00:00';
    const dropoff = '2026-10-15T21:00:00'; // 15 hours

    const calc = calculateRentalPrice(sampleBike, pickup, dropoff);

    expect(calc.baseRentalCharge).toBe(450);
  });

  it('calculates car pricing with roadside damage protection', () => {
    const pickup = '2026-10-15T09:00:00';
    const dropoff = '2026-10-16T09:00:00'; // 1 day

    const calc = calculateRentalPrice(sampleCar, pickup, dropoff, { damageProtection: true });

    expect(calc.baseRentalCharge).toBe(1600);
    expect(calc.protectionCharge).toBe(350); // 1 day protection for car
    expect(calc.refundableDeposit).toBe(3000);
    expect(calc.totalPayable).toBe(4950);
    expect(calc.kmAllowed).toBe(250);
  });

  it('formats currency in Indian Rupees format', () => {
    const formatted = formatINR(3500);
    expect(formatted).toContain('3,500');
  });
});
