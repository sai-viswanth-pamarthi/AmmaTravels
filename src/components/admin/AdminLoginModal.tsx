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
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
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
      setError(err?.message || 'Invalid credentials. Use admin / admin123 or staff / staff123.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoRole: 'admin' | 'staff') => {
    setRole(demoRole);
    setUsername(demoRole);
    setPassword(`${demoRole}123`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-2xl overflow-hidden my-auto p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-charcoal-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-900 text-saffron-400 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-charcoal-900 dark:text-warm-50">
                Amma Travels Portal
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-warm-400">
                Operations & CRM Authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-100 rounded-full hover:bg-warm-100 dark:hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="my-4 p-3 rounded-2xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-xs">
          <span className="text-charcoal-500 dark:text-warm-400 block mb-2 font-medium">
            Demo Quick Login:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-teal-900 text-saffron-400 font-bold text-[11px] hover:bg-teal-800 transition-colors"
            >
              Admin (Full Control)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('staff')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-warm-200 dark:bg-charcoal-700 text-charcoal-800 dark:text-warm-200 font-bold text-[11px] hover:bg-warm-300 transition-colors"
            >
              Staff (Leads Only)
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
              Role Permission
            </label>
            <div className="flex bg-warm-100 dark:bg-charcoal-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  role === 'admin'
                    ? 'bg-white dark:bg-charcoal-900 text-teal-950 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-600 dark:text-warm-300'
                }`}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  role === 'staff'
                    ? 'bg-white dark:bg-charcoal-900 text-teal-950 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-600 dark:text-warm-300'
                }`}
              >
                Operations Staff
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-teal-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 dark:text-warm-300 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 text-charcoal-900 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-teal-700"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            <Shield className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Operations'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
