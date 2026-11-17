import React, { useState } from 'react';
import { Shield, KeyRound, User, X, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { User as UserType } from '@/types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('admin');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await api.login(username.trim(), password.trim(), role);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please verify your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FFFDF7] dark:bg-black rounded-3xl border border-[#E8DFCF] dark:border-zinc-800 shadow-2xl overflow-y-auto max-h-[90dvh] my-auto p-5 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFCF] dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-black tracking-tight text-black dark:text-white">
                Amma Travels Portal
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Staff & Administration Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-0.5">
            Restricted Operational Area
          </span>
          Please authenticate with your administrative credentials to manage fleet reservations and customer inquiries.
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Role Permission
            </label>
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 min-h-[40px] text-xs font-bold rounded-lg transition-all ${
                  role === 'admin'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`flex-1 py-2 min-h-[40px] text-xs font-bold rounded-lg transition-all ${
                  role === 'staff'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Operations Staff
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g. admin)"
                className="w-full pl-9 pr-3.5 py-2.5 min-h-[44px] text-base sm:text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 min-h-[44px] text-base sm:text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 min-h-[48px] rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <Shield className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Operations'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
