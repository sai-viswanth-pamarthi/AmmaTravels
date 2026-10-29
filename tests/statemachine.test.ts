import { describe, it, expect } from 'vitest';
import { canTransitionStatus, getStatusMetadata } from '../src/lib/statemachine';
import { BookingStatus, UserRole } from '../src/lib/types';

describe('Booking Status State Machine & Role Security', () => {
  it('allows admin to transition from pending to confirmed', () => {
    const res = canTransitionStatus('pending', 'confirmed', 'admin');
    expect(res.allowed).toBe(true);
  });

  it('prohibits customer from directly confirming their own booking', () => {
    const res = canTransitionStatus('pending', 'confirmed', 'customer');
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('not authorized');
  });

  it('allows customer to cancel an unapproved pending booking', () => {
    const res = canTransitionStatus('pending', 'cancelled', 'customer');
    expect(res.allowed).toBe(true);
  });

  it('allows customer to cancel an under_review booking', () => {
    const res = canTransitionStatus('under_review', 'cancelled', 'customer');
    expect(res.allowed).toBe(true);
  });

  it('prevents customer from directly cancelling an active ongoing rental', () => {
    const res = canTransitionStatus('active', 'cancelled', 'customer');
    expect(res.allowed).toBe(false);
  });

  it('allows complete linear administrative lifecycle progression', () => {
    // pending -> confirmed
    expect(canTransitionStatus('pending', 'confirmed', 'admin').allowed).toBe(true);
    // confirmed -> ready_for_pickup
    expect(canTransitionStatus('confirmed', 'ready_for_pickup', 'admin').allowed).toBe(true);
    // ready_for_pickup -> active
    expect(canTransitionStatus('ready_for_pickup', 'active', 'admin').allowed).toBe(true);
    // active -> completed
    expect(canTransitionStatus('active', 'completed', 'admin').allowed).toBe(true);
  });

  it('enforces terminal state for completed bookings', () => {
    // completed bookings cannot transition to active or pending
    expect(canTransitionStatus('completed', 'active', 'admin').allowed).toBe(false);
    expect(canTransitionStatus('completed', 'pending', 'admin').allowed).toBe(false);
  });

  it('enforces terminal state for rejected bookings', () => {
    expect(canTransitionStatus('rejected', 'confirmed', 'admin').allowed).toBe(false);
  });

  it('returns valid metadata and step progression index for status badges', () => {
    expect(getStatusMetadata('pending').stepIndex).toBe(1);
    expect(getStatusMetadata('under_review').stepIndex).toBe(2);
    expect(getStatusMetadata('confirmed').stepIndex).toBe(3);
    expect(getStatusMetadata('ready_for_pickup').stepIndex).toBe(4);
    expect(getStatusMetadata('active').stepIndex).toBe(5);
    expect(getStatusMetadata('completed').stepIndex).toBe(6);
    expect(getStatusMetadata('rejected').stepIndex).toBe(-1);
  });
});
