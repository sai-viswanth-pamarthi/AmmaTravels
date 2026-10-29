import React from 'react';
import {
  CheckCircle2,
  Clock,
  Car,
  KeyRound,
  FileCheck,
  CheckCheck,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { BookingStatus } from '@/lib/types';
import { getStatusMetadata } from '@/lib/statemachine';

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Request Submitted', icon: Clock, desc: 'Booking received' },
  { key: 'under_review', label: 'Under Review', icon: FileCheck, desc: 'Document verification' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Booking approved' },
  { key: 'ready_for_pickup', label: 'Ready for Pickup', icon: KeyRound, desc: 'Vehicle prepped at Hub' },
  { key: 'active', label: 'Active Rental', icon: Car, desc: 'Journey in progress' },
  { key: 'completed', label: 'Trip Completed', icon: CheckCheck, desc: 'Returned & deposit refunded' },
];

export function BookingTimeline({
  status,
  rejectionReason,
  cancellationReason,
}: {
  status: BookingStatus;
  rejectionReason?: string;
  cancellationReason?: string;
}) {
  const meta = getStatusMetadata(status);
  const currentStep = meta.stepIndex;

  const isTerminalNegative = status === 'rejected' || status === 'cancelled';

  return (
    <div className="w-full bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy-800">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Booking Progress Timeline
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Current status: <span className="text-gold-400 font-semibold">{meta.label}</span>
          </p>
        </div>
      </div>

      {/* Terminal Negative Alert */}
      {isTerminalNegative && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-rose-300 uppercase tracking-wide">
              {status === 'rejected' ? 'Booking Request Rejected' : 'Booking Cancelled'}
            </p>
            <p className="text-rose-200">
              {status === 'rejected'
                ? rejectionReason || 'Your booking request could not be accepted due to vehicle scheduling or document constraints.'
                : cancellationReason || 'This booking was cancelled.'}
            </p>
          </div>
        </div>
      )}

      {/* Step Indicators */}
      <div className="relative">
        {/* Connecting Progress Bar */}
        <div className="hidden lg:block absolute top-5 left-6 right-6 h-0.5 bg-navy-800 -z-0">
          <div
            className={`h-full transition-all duration-500 ${
              isTerminalNegative
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-gold-500 to-emerald-400'
            }`}
            style={{
              width: isTerminalNegative
                ? '30%'
                : `${Math.max(0, Math.min(100, ((currentStep - 1) / (TIMELINE_STEPS.length - 1)) * 100))}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
          {TIMELINE_STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isPassed = !isTerminalNegative && currentStep > stepNum;
            const isCurrent = !isTerminalNegative && currentStep === stepNum;
            const Icon = step.icon;

            let circleClass = 'bg-navy-950 text-slate-400 border border-navy-800';
            if (isPassed) {
              circleClass = 'bg-emerald-500 text-navy-950 border-2 border-emerald-400 shadow-md shadow-emerald-500/20';
            } else if (isCurrent) {
              circleClass = 'bg-gold-500 text-navy-950 border-2 border-gold-300 ring-4 ring-gold-500/20 animate-pulse';
            } else if (isTerminalNegative && stepNum === 1) {
              circleClass = 'bg-navy-800 text-slate-300 border border-navy-700';
            }

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${circleClass}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-gold-400'
                      : isPassed
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 hidden sm:block">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
