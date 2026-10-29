'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Shield } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { store } from '@/lib/store';
import { UserProfile } from '@/lib/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(store.getCurrentUser());
    const handleAuth = () => setCurrentUser(store.getCurrentUser());
    window.addEventListener('amma-auth-changed', handleAuth);
    return () => window.removeEventListener('amma-auth-changed', handleAuth);
  }, []);

  if (!currentUser) {
    return <div className="p-12 text-center text-slate-400">Loading admin portal...</div>;
  }

  // If user is customer, show access gate with 1-click switch for demo/QA testing
  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-navy-900 border border-navy-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You are currently signed in as a customer account (<strong className="text-slate-200">{currentUser.fullName}</strong>). The admin management portal requires operational staff privileges.
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                store.switchUserRole('admin');
              }}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gold-500 text-navy-950 hover:bg-gold-400 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Switch to Demo Admin Account</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-2.5 rounded-xl font-semibold text-xs bg-navy-800 text-slate-300 hover:bg-navy-750 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Site</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-navy-950">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
