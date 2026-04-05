import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign, CheckCircle2, Lock, Package, Store, Truck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import type { UserRole } from '../types';

const baseRoles = [
  {
    id: 'customer' as const,
    title: 'Customer',
    icon: Package,
    description: "I'm here to use Pick'em for deliveries, shopping, and campus errands.",
  },
  {
    id: 'runner' as const,
    title: 'Runner',
    icon: Truck,
    description: 'I want to earn by completing delivery jobs around campus.',
  },
  {
    id: 'business' as const,
    title: 'Business',
    icon: Store,
    description: 'I want to sell, receive orders, and manage deliveries for my business.',
  },
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, loading, needsProfileCompletion, completeProfile, setPassword } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const availableRoles = useMemo(() => baseRoles, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      if (user.role === 'business' || user.role === 'runner' || user.role === 'customer') {
        setRole(user.role);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (!loading && user && !needsProfileCompletion) {
      navigate('/dashboard');
    }
  }, [loading, user, needsProfileCompletion, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (user?.needs_password_setup) {
        if (!password || password.length < 8) {
          throw new Error('Set a password with at least 8 characters.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await setPassword(password);
      }

      await completeProfile({ name, username, role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Could not complete your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[80vh] overflow-x-clip bg-[radial-gradient(circle_at_top,_rgba(29,29,31,0.06),_transparent_45%),linear-gradient(180deg,#f7f6f2_0%,#ffffff_55%)] px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 shadow-[0_24px_70px_rgba(29,29,31,0.08)] md:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-apple-gray-50">
            <CheckCircle2 className="h-8 w-8 text-apple-gray-500" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl">Complete your profile</h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm font-bold leading-relaxed text-apple-gray-300 sm:text-base">
            Finish your setup by choosing your base role, claiming a unique username, and confirming the account details you want to use across Pick&apos;em.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-3">
            <label className="ml-2 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Base Role</label>
            <div className="grid gap-4">
              {availableRoles.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  className={cn(
                    'flex items-center gap-4 rounded-[1.75rem] border p-5 text-left transition-all',
                    role === option.id
                      ? 'border-apple-gray-500 bg-apple-gray-50 shadow-sm'
                      : 'border-apple-gray-100 bg-white hover:border-apple-gray-200',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl',
                      role === option.id ? 'bg-apple-gray-500 text-white' : 'bg-apple-gray-50 text-apple-gray-300',
                    )}
                  >
                    <option.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-black text-apple-gray-500">{option.title}</div>
                    <div className="text-sm font-medium leading-relaxed text-apple-gray-300">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-2 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-2 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Username</label>
              <div className="relative">
                <AtSign className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="pickem_handle"
                  required
                  className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium lowercase text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                />
              </div>
              <p className="ml-2 text-xs font-bold text-apple-gray-300">Use 3-20 letters, numbers, or underscores.</p>
            </div>
          </div>

          {user.needs_password_setup && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-2 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPasswordValue(event.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-2 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                  />
                </div>
              </div>
            </div>
          )}

          {error && <p className="ml-2 text-sm font-bold text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-full bg-apple-gray-500 py-5 text-lg font-bold text-white shadow-lg shadow-apple-gray-500/10 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? 'Saving profile...' : 'Finish Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
