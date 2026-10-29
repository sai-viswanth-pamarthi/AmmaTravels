import React from 'react';
import { BookingStatus, DocumentStatus } from '@/lib/types';
import { getStatusMetadata } from '@/lib/statemachine';

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const meta = getStatusMetadata(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${meta.badgeClass}`}
    >
      {meta.label}
    </span>
  );
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  let badgeClass = '';
  let label = '';

  switch (status) {
    case 'verified':
      badgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      label = 'Verified';
      break;
    case 'pending':
      badgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      label = 'Under Review';
      break;
    case 'correction_required':
      badgeClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      label = 'Needs Correction';
      break;
    case 'rejected':
      badgeClass = 'bg-red-500/10 text-red-500 border border-red-500/20';
      label = 'Rejected';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badgeClass}`}
    >
      {label}
    </span>
  );
}
