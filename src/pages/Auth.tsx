import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { Package, Store, Truck, Shield, ArrowRight, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

type AuthMode = 'email' | 'password' | 'set-password' | 'magic-link-sent';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'customer';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('email');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, sendMagicLink, setPassword: setAccountPassword } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError(null);
    try {
      const existingUser = await api.findUserByEmail(email);
      if (existingUser) {
        if (existingUser.status === 'removed') {
          throw new Error('This account has been removed. Contact Pick\'em support.');
        }

        if (existingUser.hasPassword) {
          setMode('password');
        } else {
          await sendMagicLink(email, existingUser.role);
          setMode('magic-link-sent');
        }
        return;
      }

      await sendMagicLink(email, role);
      setMode('magic-link-sent');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await setAccountPassword(password);
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const roles: { id: UserRole; title: string; icon: any; description: string }[] = [
    { id: 'customer', title: 'Customer', icon: Package, description: 'Send items or request shopping.' },
    { id: 'runner', title: 'Runner', icon: Truck, description: 'Earn money by delivering.' },
    { id: 'business', title: 'Business', icon: Store, description: 'Manage shop deliveries.' }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-20 px-4 sm:px-0 bg-white">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-apple-gray-50 rounded-full text-[12px] font-semibold text-apple-gray-300 mb-6"
          >
            <span className="text-blue-500">Secure</span> Trusted by Students
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight text-apple-gray-500">Pick’em</h1>
          <p className="text-apple-gray-300 font-medium text-lg">
            {mode === 'email' && "Sign in or create an account"}
            {mode === 'password' && "Welcome back! Enter your password"}
            {mode === 'set-password' && "Create a secure password"}
            {mode === 'magic-link-sent' && "Check your inbox"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'email' && (
            <motion.div key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={cn(
                        "flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left",
                        role === r.id ? "border-apple-gray-500 bg-apple-gray-50/50" : "border-apple-gray-50 bg-white hover:border-apple-gray-100"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                        role === r.id ? "bg-apple-gray-500 text-white" : "bg-apple-gray-50 text-apple-gray-300"
                      )}>
                        <r.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-apple-gray-500 text-lg">{r.title}</div>
                        <div className="text-sm text-apple-gray-300 font-medium">{r.description}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-apple-gray-300 ml-6">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@university.edu"
                        className="w-full bg-apple-gray-50 border-none rounded-full py-5 pl-16 pr-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-medium text-apple-gray-500 placeholder:text-apple-gray-200 shadow-sm"
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm font-bold ml-6">{error}</p>}
                  <button
                    type="submit" disabled={isLoading}
                    className="w-full bg-apple-gray-500 text-white py-5 rounded-full font-bold text-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-apple-gray-500/10"
                  >
                    {isLoading ? "Sending..." : "Continue"}
                    {!isLoading && <ArrowRight className="w-6 h-6" />}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {mode === 'password' && (
            <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-apple-gray-300 ml-6">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                    <input
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-apple-gray-50 border-none rounded-full py-5 pl-16 pr-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-medium text-apple-gray-500 placeholder:text-apple-gray-200 shadow-sm"
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm font-bold ml-6">{error}</p>}
                <button
                  type="submit" disabled={isLoading}
                  className="w-full bg-apple-gray-500 text-white py-5 rounded-full font-bold text-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg shadow-apple-gray-500/10"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button type="button" onClick={() => setMode('email')} className="w-full text-apple-gray-300 font-bold hover:text-apple-gray-500 transition-colors">
                  Use a different email
                </button>
              </form>
            </motion.div>
          )}

          {mode === 'magic-link-sent' && (
            <motion.div key="magic" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-8">
              <div className="w-24 h-24 bg-apple-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                <Mail className="w-10 h-10 text-apple-gray-500" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-apple-gray-500">Magic link sent!</h2>
                <p className="text-apple-gray-300 font-medium leading-relaxed text-lg">
                  We've sent a login link to <span className="text-apple-gray-500 font-bold">{email}</span>. Click it to continue.
                </p>
              </div>
              <div className="pt-8 space-y-4">
                <button 
                  onClick={() => setMode('set-password')}
                  className="w-full bg-apple-gray-500 text-white py-5 rounded-full font-bold text-xl hover:opacity-90 transition-opacity shadow-lg shadow-apple-gray-500/10"
                >
                  Simulate Link Click (Demo)
                </button>
                <button onClick={() => setMode('email')} className="w-full text-apple-gray-300 font-bold hover:text-apple-gray-500 transition-colors">
                  Change email address
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'set-password' && (
            <motion.div key="set-password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <form onSubmit={handleSetPasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-apple-gray-300 ml-6">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                      <input
                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-apple-gray-50 border-none rounded-full py-5 pl-16 pr-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-medium text-apple-gray-500 placeholder:text-apple-gray-200 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-apple-gray-300 ml-6">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                      <input
                        type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-apple-gray-50 border-none rounded-full py-5 pl-16 pr-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-medium text-apple-gray-500 placeholder:text-apple-gray-200 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm font-bold ml-6">{error}</p>}
                <button
                  type="submit" disabled={isLoading}
                  className="w-full bg-apple-gray-500 text-white py-5 rounded-full font-bold text-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg shadow-apple-gray-500/10"
                >
                  {isLoading ? "Saving..." : "Create Account"}
                  <CheckCircle2 className="w-6 h-6" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-apple-gray-300 font-bold mt-12 max-w-[280px] mx-auto leading-relaxed">
          By continuing, you agree to Pick’em's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
