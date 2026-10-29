'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { store } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }
    } else {
      // Local demo mode sign-in
      if (email.toLowerCase().includes('admin')) {
        store.switchUserRole('admin');
      } else {
        store.switchUserRole('customer');
      }
    }

    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleDemoSignIn = (role: 'customer' | 'admin') => {
    store.switchUserRole(role);
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-navy-900 border border-navy-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 flex items-center justify-center font-black text-xl mx-auto shadow-lg shadow-gold-500/20">
            AT
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to Amma Travels</h1>
          <p className="text-xs text-slate-400">
            Access your rental bookings, trip timelines, and documents.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gold-500 text-navy-950 hover:bg-gold-400 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins for instant evaluation */}
        <div className="pt-4 border-t border-navy-800 space-y-3">
          <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
            Quick One-Click Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn('customer')}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-navy-950 hover:bg-navy-850 text-slate-200 border border-navy-700 hover:border-gold-500/40 transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-navy-950 hover:bg-navy-850 text-gold-400 border border-navy-700 hover:border-gold-500/40 transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don’t have an account?{' '}
          <Link href="/auth/register" className="text-gold-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
