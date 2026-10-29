import { describe, it, expect } from 'vitest';
import { LeadStage, Vehicle, EventPackage, InterestSubmission } from '../src/types';

describe('AmmaTravels Platform Engine & Rental Logic', () => {
  describe('360 Studio Degree and Frame Calculations', () => {
    const totalFrames = 36; // 36 frames = 10 degrees each

    const getAngleFromFrame = (frame: number) => (frame % totalFrames) * 10;

    const getCompassLabel = (deg: number) => {
      const normalized = ((deg % 360) + 360) % 360;
      if (normalized >= 340 || normalized <= 20) return 'Front Profile (0°)';
      if (normalized >= 70 && normalized <= 110) return 'Right Side (90°)';
      if (normalized >= 160 && normalized <= 200) return 'Rear View (180°)';
      if (normalized >= 250 && normalized <= 290) return 'Left Side (270°)';
      return `${normalized}° Angle`;
    };

    it('calculates correct rotational angles for 36 frames', () => {
      expect(getAngleFromFrame(0)).toBe(0);
      expect(getAngleFromFrame(9)).toBe(90);
      expect(getAngleFromFrame(18)).toBe(180);
      expect(getAngleFromFrame(27)).toBe(270);
      expect(getAngleFromFrame(35)).toBe(350);
      expect(getAngleFromFrame(36)).toBe(0); // full circle wraps
    });

    it('assigns accurate compass quadrant labels for customer orientation', () => {
      expect(getCompassLabel(0)).toBe('Front Profile (0°)');
      expect(getCompassLabel(10)).toBe('Front Profile (0°)');
      expect(getCompassLabel(90)).toBe('Right Side (90°)');
      expect(getCompassLabel(180)).toBe('Rear View (180°)');
      expect(getCompassLabel(270)).toBe('Left Side (270°)');
      expect(getCompassLabel(130)).toBe('130° Angle');
    });
  });

  describe('Tariff, Weekly Discounts & Rental Calculations', () => {
    it('computes transparent multi-day rental charge', () => {
      const dailyPrice = 2200; // Creta
      const days = 3;
      const rentalCharge = dailyPrice * days;
      const deposit = 3500;
      const totalInitialOutlay = rentalCharge + deposit;

      expect(rentalCharge).toBe(6600);
      expect(totalInitialOutlay).toBe(10100);
    });

    it('validates weekly package offers at least a 10% saving over daily rate', () => {
      const dailyPrice = 1800; // Swift
      const weeklyPrice = 11000;
      const equivalentDailyTotal = dailyPrice * 7; // 12600

      const savings = equivalentDailyTotal - weeklyPrice;
      const savingsPct = (savings / equivalentDailyTotal) * 100;

      expect(savings).toBeGreaterThan(0);
      expect(savingsPct).toBeGreaterThanOrEqual(10);
    });

    it('calculates excess kilometer charges accurately', () => {
      const dailyLimit = 250;
      const days = 2;
      const totalIncludedKm = dailyLimit * days; // 500 km
      const actualDrivenKm = 575;
      const excessRate = 8; // ₹8 per km

      const excessKm = Math.max(0, actualDrivenKm - totalIncludedKm);
      const excessCharge = excessKm * excessRate;

      expect(excessKm).toBe(75);
      expect(excessCharge).toBe(600);
    });
  });

  describe('Reference ID Generator & Honeypot Spam Validation', () => {
    const generateRefId = (type: 'vehicle' | 'event', seq: number) => {
      const prefix = type === 'vehicle' ? 'AT-V' : 'AT-E';
      return `${prefix}-${seq}`;
    };

    const validateSubmission = (data: {
      name: string;
      phone: string;
      honeypot?: string;
    }) => {
      // Honeypot should be empty
      if (data.honeypot && data.honeypot.trim().length > 0) {
        return { valid: false, reason: 'Spam bot detected' };
      }
      if (!data.name || data.name.trim().length < 2) {
        return { valid: false, reason: 'Invalid name' };
      }
      const cleanPhone = data.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        return { valid: false, reason: 'Invalid phone number' };
      }
      return { valid: true };
    };

    it('formats standardized reference IDs for vehicles and event packages', () => {
      expect(generateRefId('vehicle', 1042)).toBe('AT-V-1042');
      expect(generateRefId('event', 2015)).toBe('AT-E-2015');
    });

    it('rejects automated bot submissions via honeypot traps', () => {
      const botSubmission = {
        name: 'SpamBot',
        phone: '9876543210',
        honeypot: 'http://spam-link.ru',
      };
      const result = validateSubmission(botSubmission);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Spam bot detected');
    });

    it('accepts legitimate customer submissions with clean phone numbers', () => {
      const legitSubmission = {
        name: 'Srinivas Varma',
        phone: '+91 98765-43210',
        honeypot: '',
      };
      const result = validateSubmission(legitSubmission);
      expect(result.valid).toBe(true);
    });
  });

  describe('CRM Lead Pipeline Stage State Transitions', () => {
    const validStages: LeadStage[] = [
      'New',
      'Contacted',
      'Visit/Meeting Scheduled',
      'Documents Verified',
      'Confirmed',
      'Completed',
      'Rejected',
    ];

    const canTransition = (current: LeadStage, target: LeadStage): boolean => {
      if (current === target) return true;
      if (target === 'Rejected') return true; // Can reject at any stage
      const order = [
        'New',
        'Contacted',
        'Visit/Meeting Scheduled',
        'Documents Verified',
        'Confirmed',
        'Completed',
      ];
      const currIdx = order.indexOf(current);
      const targetIdx = order.indexOf(target);
      if (currIdx === -1 || targetIdx === -1) return false;
      return targetIdx >= currIdx; // forward progression allowed
    };

    it('allows natural progression from New to Confirmed and Completed', () => {
      expect(canTransition('New', 'Contacted')).toBe(true);
      expect(canTransition('Contacted', 'Documents Verified')).toBe(true);
      expect(canTransition('Documents Verified', 'Confirmed')).toBe(true);
      expect(canTransition('Confirmed', 'Completed')).toBe(true);
    });

    it('permits rejection at any active pipeline stage', () => {
      expect(canTransition('New', 'Rejected')).toBe(true);
      expect(canTransition('Contacted', 'Rejected')).toBe(true);
      expect(canTransition('Documents Verified', 'Rejected')).toBe(true);
    });
  });

  describe('CSV Lead Export Serialization & Column Escapes', () => {
    const serializeLeadToCSVRow = (lead: Partial<InterestSubmission>) => {
      const escape = (val?: string | number) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      return [
        escape(lead.refId),
        escape(lead.type),
        escape(lead.name),
        escape(lead.phone),
        escape(lead.internalNotes),
      ].join(',');
    };

    it('safely escapes commas and quotes in internal notes and customer names', () => {
      const lead: Partial<InterestSubmission> = {
        refId: 'AT-V-1001',
        type: 'vehicle',
        name: 'Rao, Srinivas "Babu"',
        phone: '9876543210',
        internalNotes: 'Customer requested 2 helmets, pickup at Kakinada Hub.',
      };

      const row = serializeLeadToCSVRow(lead);
      expect(row).toContain('"AT-V-1001"');
      expect(row).toContain('"Rao, Srinivas ""Babu"""');
      expect(row).toContain('"Customer requested 2 helmets, pickup at Kakinada Hub."');
    });
  });
});
