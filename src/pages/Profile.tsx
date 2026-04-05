import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Calendar, LogOut, Settings, Bell, CreditCard, Mail, KeyRound } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const lastSignInLabel =
    user.auth_provider === 'google'
      ? 'Google'
      : user.auth_provider === 'apple'
        ? 'Apple'
        : user.auth_provider === 'password'
          ? 'Email & Password'
          : 'Unknown';

  const sections = [
    { icon: Bell, label: 'Notifications', description: 'Manage your delivery alerts' },
    { icon: CreditCard, label: 'Payments', description: 'Payment methods and history' },
    { icon: Settings, label: 'Account Settings', description: 'Update your personal info' },
  ];

  return (
    <div className="mx-auto max-w-2xl overflow-x-clip py-6 sm:py-8">
      <div className="overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-stone-900 p-6 text-white sm:p-10">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-600 text-3xl font-bold shadow-xl sm:h-24 sm:w-24 sm:text-4xl">
              {user.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="break-words text-3xl font-bold sm:text-4xl">{user.name}</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-stone-400">
                <Shield className="h-4 w-4 shrink-0" />
                <span className="capitalize">{user.role} Account</span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-emerald-600/20 blur-3xl" />
        </div>

        <div className="space-y-8 p-6 sm:space-y-10 sm:p-10">
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <div className="break-all text-base font-medium sm:text-lg">{user.email}</div>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                <Calendar className="h-3 w-3" /> Member Since
              </label>
              <div className="text-base font-medium sm:text-lg">{format(new Date(user.created_at), 'MMMM yyyy')}</div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                <KeyRound className="h-3 w-3" /> Last Sign-In
              </label>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {lastSignInLabel}
              </div>
            </div>
          </section>

          <div className="h-px bg-stone-100" />

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">Preferences</h2>
            <div className="grid grid-cols-1 gap-3">
              {sections.map((section) => (
                <button
                  key={section.label}
                  className="group flex flex-col gap-4 rounded-2xl border border-stone-100 p-4 text-left transition-colors hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-400 transition-colors group-hover:text-emerald-600">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900">{section.label}</div>
                      <div className="text-xs text-stone-500">{section.description}</div>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-50 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <Settings className="h-4 w-4 text-stone-400" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="pt-2 sm:pt-6">
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 p-4 font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-stone-400">
          Pick&apos;em Logistics Platform v1.0.0
          <br />
          Campus Edition
        </p>
      </div>
    </div>
  );
}
