import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Lock, Mail, Package, Shield, Store, Truck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

type AuthMode = 'signin' | 'signup';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = (searchParams.get('role') as UserRole) || 'customer';

  const [mode, setMode] = useState<AuthMode>('signin');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    login,
    signUp,
    loginWithGoogle,
    loginWithApple,
    sendPasswordReset,
  } = useAuth();

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const roles: { id: UserRole; title: string; icon: typeof Package; description: string }[] = [
    { id: 'customer', title: 'Customer', icon: Package, description: 'Send items or request shopping.' },
    { id: 'runner', title: 'Runner', icon: Truck, description: 'Earn money by delivering on campus.' },
    { id: 'business', title: 'Business', icon: Store, description: 'Manage your storefront and deliveries.' },
  ];

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setStatus(null);

    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await signUp(email, password, name.trim(), role);
      }

      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Unable to continue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setError(null);
    setStatus(null);

    try {
      if (provider === 'google') {
        await loginWithGoogle(role);
      } else {
        await loginWithApple(role);
      }

      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Unable to continue with that provider.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Enter your email address first, then try reset password again.');
      setStatus(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus(null);

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
    <div className="min-h-[80vh] bg-white px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-4 py-1.5 text-[12px] font-semibold text-apple-gray-300"
            >
              <Shield className="h-4 w-4 text-blue-500" />
              Firebase Auth Ready
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tight text-apple-gray-500">Pick&apos;em</h1>
            <p className="mt-4 text-lg font-medium text-apple-gray-300">
              {mode === 'signin' ? 'Sign in to your logistics account' : 'Create your logistics account'}
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4">
            {roles.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setRole(entry.id)}
                className={cn(
                  'flex items-center gap-4 rounded-[2rem] border-2 p-5 text-left transition-all',
                  role === entry.id
                    ? 'border-apple-gray-500 bg-apple-gray-50/60'
                    : 'border-apple-gray-50 bg-white hover:border-apple-gray-100',
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl transition-colors',
                    role === entry.id ? 'bg-apple-gray-500 text-white' : 'bg-apple-gray-50 text-apple-gray-300',
                  )}
                >
                  <entry.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-lg font-bold text-apple-gray-500">{entry.title}</div>
                  <div className="text-sm font-medium text-apple-gray-300">{entry.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 rounded-full bg-apple-gray-50 p-1.5">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={cn(
                'rounded-full px-4 py-3 text-sm font-bold transition-colors',
                mode === 'signin' ? 'bg-white text-apple-gray-500 shadow-sm' : 'text-apple-gray-300',
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={cn(
                'rounded-full px-4 py-3 text-sm font-bold transition-colors',
                mode === 'signup' ? 'bg-white text-apple-gray-500 shadow-sm' : 'text-apple-gray-300',
              )}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="ml-6 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Providence Osiobe"
                    className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 outline-none ring-0 placeholder:text-apple-gray-200 shadow-sm focus:ring-2 focus:ring-apple-gray-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="ml-6 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@school.edu"
                  className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 outline-none ring-0 placeholder:text-apple-gray-200 shadow-sm focus:ring-2 focus:ring-apple-gray-500"
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 outline-none ring-0 placeholder:text-apple-gray-200 shadow-sm focus:ring-2 focus:ring-apple-gray-500"
                />
              </div>
            </div>

            {error && <p className="ml-6 text-sm font-bold text-red-500">{error}</p>}
            {status && <p className="ml-6 text-sm font-bold text-emerald-600">{status}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-apple-gray-500 py-5 text-xl font-bold text-white shadow-lg shadow-apple-gray-500/10 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              {!isLoading && <ArrowRight className="h-6 w-6" />}
            </button>
          </form>

          {mode === 'signin' && (
            <button
              type="button"
              onClick={handlePasswordReset}
              className="mt-4 w-full text-sm font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
            >
              Forgot your password?
            </button>
          )}

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-apple-gray-100" />
            <span className="text-xs font-bold uppercase tracking-widest text-apple-gray-200">Or continue with</span>
            <div className="h-px flex-1 bg-apple-gray-100" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialAuth('google')}
              className="w-full rounded-full border border-apple-gray-100 bg-white px-6 py-4 text-sm font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 disabled:opacity-50"
            >
              Continue with Google
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialAuth('apple')}
              className="w-full rounded-full border border-apple-gray-100 bg-white px-6 py-4 text-sm font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 disabled:opacity-50"
            >
              Continue with Apple
            </button>
          </div>

          <p className="mx-auto mt-12 max-w-[320px] text-center text-xs font-bold leading-relaxed text-apple-gray-300">
            Social sign-ins will still be asked to set a password and claim a unique username before entering the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
