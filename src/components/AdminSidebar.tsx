'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  CalendarCheck2,
  FileCheck2,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { store } from '@/lib/store';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Fleet Management', href: '/admin/vehicles', icon: Car },
    { name: 'Bookings Review', href: '/admin/bookings', icon: CalendarCheck2 },
    { name: 'Document Verification', href: '/admin/documents', icon: FileCheck2 },
  ];

  return (
    <aside className="w-full lg:w-64 bg-navy-950 border-b lg:border-b-0 lg:border-r border-navy-800 p-4 shrink-0 space-y-6">
      {/* Admin Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center font-black text-sm">
          ADM
        </div>
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Amma Travels
          </h2>
          <span className="text-[10px] text-gold-400 font-semibold tracking-wider uppercase block">
            Operations Portal
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gold-500 text-navy-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-navy-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Switch Back to Customer View */}
      <div className="pt-4 border-t border-navy-800/80 space-y-2">
        <button
          onClick={() => {
            store.switchUserRole('customer');
            window.location.href = '/';
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-300 border border-navy-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Customer Site</span>
        </button>
      </div>
    </aside>
  );
}
