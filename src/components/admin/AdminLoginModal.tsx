import React, { useState, useEffect, useRef } from 'react';
import { Shield, KeyRound, User, X, AlertCircle, Eye, EyeOff, Lock, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { User as UserType } from '@/types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 60;

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Rate limiting / Lockout state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Focus and scroll locking
  useEffect(() => {
    if (isOpen) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }

      // Auto-focus username after short mount delay
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      // Reset sensitive fields when closed
      setUsername('');
      setPassword('');
      setError(null);
    }
  }, [isOpen, onClose]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if in lockout cooldown
    if (lockoutTimer > 0) {
      setError(`Security cooldown active. Please wait ${lockoutTimer} seconds.`);
      return;
    }

    // Bot honeypot trap check
    if (honeypot.trim().length > 0) {
      setError('Access verification rejected.');
      return;
    }

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await api.login(cleanUser, cleanPass, 'admin');
      setFailedAttempts(0);
      setUsername('');
      setPassword('');
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      const newFailed = failedAttempts + 1;
      setFailedAttempts(newFailed);
      setPassword(''); // Clear password on error

      if (newFailed >= MAX_FAILED_ATTEMPTS) {
        setLockoutTimer(COOLDOWN_SECONDS);
        setError(`Too many failed attempts. Security cooldown active for ${COOLDOWN_SECONDS} seconds.`);
      } else {
        const remaining = MAX_FAILED_ATTEMPTS - newFailed;
        setError(
          err?.message && !err.message.includes('Password:')
            ? `${err.message} (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`
            : `Invalid credentials. Please verify your username and password. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-md bg-[#FFFDF7] dark:bg-zinc-950 rounded-3xl border border-[#E8DFCF] dark:border-zinc-800 shadow-2xl overflow-hidden my-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFCF] dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center shadow-md">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 id="admin-auth-title" className="font-display text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                Restricted Administration
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Secure Authentication Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Cooldown Alert */}
        {lockoutTimer > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0 animate-spin" />
            <span>Security cooldown active: <strong>{lockoutTimer}s</strong> remaining before next attempt.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && lockoutTimer <= 0 && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Honeypot field - invisible to humans, catches automated bots */}
          <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
            <label htmlFor="sec_admin_ref">Do not fill</label>
            <input
              type="text"
              id="sec_admin_ref"
              name="sec_admin_ref"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Administrator ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={usernameInputRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or email"
                disabled={loading || lockoutTimer > 0}
                autoComplete="username"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1 focus:outline-none"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading || lockoutTimer > 0}
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 font-mono disabled:opacity-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || lockoutTimer > 0}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-2 mt-5 disabled:opacity-50 active:scale-98"
          >
            <Shield className="w-4 h-4" />
            <span>{loading ? 'Verifying Gateway...' : lockoutTimer > 0 ? `Locked (${lockoutTimer}s)` : 'Authenticate Gateway'}</span>
          </button>
        </form>

        {/* Discreet Gateway note */}
        <div className="mt-6 pt-4 border-t border-[#E8DFCF] dark:border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Internal Operations Gateway • Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px] text-zinc-800 dark:text-zinc-200">Esc</kbd> to return
          </p>
        </div>
      </div>
    </div>
  );
};
