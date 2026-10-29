import { BookingStatus, UserRole } from './types';

// Map of permitted status transitions
export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['under_review', 'confirmed', 'rejected', 'cancelled'],
  under_review: ['confirmed', 'awaiting_payment', 'rejected', 'cancelled'],
  awaiting_payment: ['confirmed', 'cancelled', 'rejected'],
  confirmed: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['active', 'cancelled'],
  active: ['completed'],
  completed: [], // Terminal
  rejected: [], // Terminal
  cancelled: [], // Terminal
};

// Which roles are permitted to trigger specific target statuses
export const ROLE_TRANSITION_PERMISSIONS: Record<BookingStatus, UserRole[]> = {
  pending: ['customer'], // Initial creation
  under_review: ['admin'],
  awaiting_payment: ['admin'],
  confirmed: ['admin'],
  ready_for_pickup: ['admin'],
  active: ['admin'],
  completed: ['admin'],
  rejected: ['admin'],
  cancelled: ['customer', 'admin'],
};

/**
 * Validates if a transition from currentStatus to targetStatus is allowed for the user's role.
 */
export function canTransitionStatus(
  currentStatus: BookingStatus,
  targetStatus: BookingStatus,
  role: UserRole
): { allowed: boolean; reason?: string } {
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];

  if (!allowedNext.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `Cannot transition booking from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  const allowedRoles = ROLE_TRANSITION_PERMISSIONS[targetStatus] || [];
  if (!allowedRoles.includes(role)) {
    return {
      allowed: false,
      reason: `Role '${role}' is not authorized to transition booking to '${targetStatus}'.`,
    };
  }

  // Customer cancellation rule: customers can only cancel if booking is still pending or under_review
  if (role === 'customer' && targetStatus === 'cancelled') {
    if (currentStatus !== 'pending' && currentStatus !== 'under_review') {
      return {
        allowed: false,
        reason: 'Confirmed or active bookings cannot be cancelled directly by customers. Please contact Amma Travels support.',
      };
    }
  }

  return { allowed: true };
}

/**
 * Friendly status badge metadata
 */
export function getStatusMetadata(status: BookingStatus): {
  label: string;
  badgeClass: string;
  stepIndex: number;
} {
  switch (status) {
    case 'pending':
      return {
        label: 'Request Submitted',
        badgeClass: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
        stepIndex: 1,
      };
    case 'under_review':
      return {
        label: 'Under Review',
        badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        stepIndex: 2,
      };
    case 'awaiting_payment':
      return {
        label: 'Awaiting Payment',
        badgeClass: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        stepIndex: 2,
      };
    case 'confirmed':
      return {
        label: 'Booking Confirmed',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        stepIndex: 3,
      };
    case 'ready_for_pickup':
      return {
        label: 'Ready for Pickup',
        badgeClass: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
        stepIndex: 4,
      };
    case 'active':
      return {
        label: 'Active Rental',
        badgeClass: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
        stepIndex: 5,
      };
    case 'completed':
      return {
        label: 'Trip Completed',
        badgeClass: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
        stepIndex: 6,
      };
    case 'rejected':
      return {
        label: 'Request Rejected',
        badgeClass: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
        stepIndex: -1,
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        badgeClass: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
        stepIndex: -1,
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-500/10 text-slate-300',
        stepIndex: 0,
      };
  }
}
