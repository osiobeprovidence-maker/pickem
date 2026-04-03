import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar, LogOut, Settings, Bell, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const sections = [
    { icon: Bell, label: 'Notifications', description: 'Manage your delivery alerts' },
    { icon: CreditCard, label: 'Payments', description: 'Payment methods and history' },
    { icon: Settings, label: 'Account Settings', description: 'Update your personal info' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 p-10 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-xl">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <div className="flex items-center gap-2 text-stone-400 text-sm">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user.role} Account</span>
              </div>
            </div>
          </div>
          {/* Abstract background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <div className="text-lg font-medium">{user.email}</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Member Since
              </label>
              <div className="text-lg font-medium">{format(new Date(user.created_at), 'MMMM yyyy')}</div>
            </div>
          </section>

          <div className="h-px bg-stone-100" />

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">Preferences</h2>
            <div className="grid grid-cols-1 gap-3">
              {sections.map((section, i) => (
                <button
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl border border-stone-100 hover:bg-stone-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-emerald-600 transition-colors">
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">{section.label}</div>
                      <div className="text-xs text-stone-500">{section.description}</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings className="w-4 h-4 text-stone-400" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="pt-6">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-stone-400 text-xs">
          Pick’em Logistics Platform v1.0.0<br />
          Campus Edition
        </p>
      </div>
    </div>
  );
}
