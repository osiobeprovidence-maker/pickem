import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { UserRole } from '../types';
import { Package, Store, Truck, Shield, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'customer';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await login(email, role);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const roles: { id: UserRole; title: string; icon: any; description: string }[] = [
    {
      id: 'customer',
      title: 'Customer',
      icon: Package,
      description: 'Send items or request shopping across campus.'
    },
    {
      id: 'runner',
      title: 'Runner',
      icon: Truck,
      description: 'Earn money by completing delivery jobs on campus.'
    },
    {
      id: 'business',
      title: 'Business',
      icon: Store,
      description: 'Streamline your shop deliveries to students.'
    }
  ];

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-0">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Welcome to Pick’em</h1>
        <p className="text-stone-600 font-medium">Choose your role and sign in to continue.</p>
      </div>

      <div className="space-y-8">
        {/* Role Selection */}
        <div className="grid grid-cols-1 gap-4">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                role === r.id
                  ? "border-emerald-600 bg-emerald-50/50"
                  : "border-stone-100 hover:border-stone-200 bg-white"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                role === r.id ? "bg-emerald-600 text-white" : "bg-stone-50 text-stone-400"
              )}>
                <r.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold">{r.title}</div>
                <div className="text-sm text-stone-500">{r.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Continue"}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400">
          By continuing, you agree to Pick’em's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
