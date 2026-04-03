import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Lock, Mail, Package, Store, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { stackConfig } from '../lib/env';
import type { UserRole } from '../types';
import { cn } from '../lib/utils';

type AuthMode = 'signin' | 'signup';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = (searchParams.get('role') as UserRole) || 'customer';

  const [mode, setMode] = useState<AuthMode>('signin');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    sendPasswordReset,
  } = useAuth();
  const stackIssues = stackConfig.issues;

  const roles = useMemo(
    () =>
      [
        {
          id: 'customer' as const,
          title: 'Customer',
          icon: Package,
          description: 'Send items or request shopping across campus.',
        },
        {
          id: 'runner' as const,
          title: 'Runner',
          icon: Truck,
          description: 'Earn money by completing delivery jobs on campus.',
        },
        {
          id: 'business' as const,
          title: 'Business',
          icon: Store,
          description: 'Streamline your shop deliveries to students.',
        },
      ],
    [],
  );

  const resetFeedback = () => {
    setError(null);
    setStatus(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password, role);
      } else {
        await signUp(email, password, role);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Could not continue with authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (provider: 'google' | 'apple') => {
    resetFeedback();
    setIsLoading(true);

    try {
      if (provider === 'google') {
        await signInWithGoogle(role);
      } else {
        await signInWithApple(role);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || `Could not continue with ${provider}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Enter your email first, then try reset password again.');
      setStatus(null);
      return;
    }

    resetFeedback();
    setIsLoading(true);

    try {
      await sendPasswordReset(email);
      setStatus('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Could not send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-4 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-apple-gray-300">
            Pick&apos;em Access
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-apple-gray-500">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-apple-gray-300">
            Connect this page to the logistics platform with Firebase authentication and Convex-backed user profiles.
          </p>

          {stackIssues.length > 0 && (
            <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
              <p className="font-black uppercase tracking-[0.14em] text-amber-700">Stack setup needed</p>
              <div className="mt-2 space-y-1">
                {stackIssues.map((issue) => (
                  <p key={issue}>{issue}</p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={cn(
                'rounded-full px-5 py-3 text-sm font-bold transition-colors',
                mode === 'signin'
                  ? 'bg-apple-gray-500 text-white shadow-sm'
                  : 'bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100',
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={cn(
                'rounded-full px-5 py-3 text-sm font-bold transition-colors',
                mode === 'signup'
                  ? 'bg-apple-gray-500 text-white shadow-sm'
                  : 'bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100',
              )}
            >
              Create Account
            </button>
          </div>

          <div className="mt-8 grid gap-4">
            {roles.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                className={cn(
                  'flex items-center gap-4 rounded-[1.75rem] border p-4 text-left transition-all',
                  role === option.id
                    ? 'border-apple-gray-500 bg-apple-gray-50'
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
                <div>
                  <div className="text-base font-black text-apple-gray-500">{option.title}</div>
                  <div className="text-sm font-medium text-apple-gray-300">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 shadow-sm md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="ml-6 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@campus.edu"
                  className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-6 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                <input
                  type="password"
                  required
                  minLength={mode === 'signup' ? 8 : 1}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                />
              </div>
            </div>

            {error && <p className="ml-6 text-sm font-bold text-red-500">{error}</p>}
            {status && <p className="ml-6 text-sm font-bold text-emerald-600">{status}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-apple-gray-500 py-5 text-lg font-bold text-white shadow-lg shadow-apple-gray-500/10 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : mode === 'signin' ? 'Continue' : 'Create account'}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => handleSocial('google')}
              disabled={isLoading}
              className="rounded-full border border-apple-gray-200 bg-white px-5 py-4 text-sm font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 disabled:opacity-50"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocial('apple')}
              disabled={isLoading}
              className="rounded-full border border-apple-gray-200 bg-white px-5 py-4 text-sm font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 disabled:opacity-50"
            >
              Continue with Apple
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm font-bold text-apple-gray-400 transition-colors hover:text-apple-gray-500"
            >
              Forgot your password?
            </button>
            <p className="text-xs font-bold text-apple-gray-300">
              {mode === 'signin'
                ? "New social users can sign in with Google or Apple and add a password during profile completion."
                : 'Email accounts are created with password sign-in right away.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
