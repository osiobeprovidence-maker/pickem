import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Business } from '../types';
import { motion } from 'motion/react';
import AdminDrawer from '../components/AdminDrawer';
import { AdminRBAC } from '../lib/rbac';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  Clock,
  CreditCard,
  Package,
  Settings,
  Shield,
  ShieldCheck,
  Store,
  User,
  Crown,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

type ActivityItem = {
  id: string;
  type?: string;
  title: string;
  description: string;
  time: string;
};

type ProfileTab = 'overview' | 'settings' | 'details';
type SettingsSection = 'notifications' | 'payments' | 'account' | 'business';

const roleLabel: Record<string, string> = {
  customer: 'Customer Account',
  business: 'Business Account',
  runner: 'Runner Account',
  admin: 'Admin Account',
};

const roleSummary: Record<string, string> = {
  customer: 'Track deliveries, payments, and account activity from one standard profile.',
  business: 'Manage your business identity, store activity, and account health from one place.',
  runner: 'Monitor your account status, delivery activity, and payout readiness in one standard layout.',
  admin: 'Review your admin identity and account activity from a shared system profile.',
};

export default function Profile() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [businessProfile, setBusinessProfile] = useState<Business | null>(null);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);

  const isAdmin = user?.admin_level && AdminRBAC.canAccessAdminPanel(user.admin_level);

  useEffect(() => {
    const stored = localStorage.getItem('user_activities');
    if (!stored) return;

    const parsed = JSON.parse(stored) as ActivityItem[];
    setActivities(parsed);
  }, []);

  useEffect(() => {
    const loadBusinessProfile = async () => {
      if (!user || user.role !== 'business') return;
      const business = await api.getBusiness(user.id);
      setBusinessProfile(business);
    };

    loadBusinessProfile();
  }, [user]);

  if (!user) return null;

  const activeTab = (searchParams.get('tab') as ProfileTab) || 'overview';
  const activeSection = (searchParams.get('section') as SettingsSection | null) || null;
  const securityLabel = user.hasPassword ? 'Password Enabled' : 'Magic Link Login';
  const dashboardPath = user.role === 'business' ? '/dashboard/business' : '/dashboard';
  const accountHighlights = [
    { label: 'Account Type', value: roleLabel[user.role] || 'Pick\'em User' },
    { label: 'Account Status', value: user.status === 'approved' ? 'Approved' : 'Pending Review' },
    { label: 'Security', value: securityLabel },
    { label: 'Member Since', value: format(new Date(user.created_at), 'MMMM yyyy') },
  ];

  const settingsCards: Array<{
    icon: typeof Bell;
    label: string;
    description: string;
    section: SettingsSection;
  }> = [
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage updates about deliveries, orders, and account activity.',
      section: 'notifications',
    },
    {
      icon: CreditCard,
      label: 'Payments',
      description: 'Review payment methods, billing history, and payout readiness.',
      section: 'payments',
    },
    {
      icon: Settings,
      label: 'Account Settings',
      description: 'Keep your personal details and account preferences organized.',
      section: 'account',
    },
    {
      icon: user.role === 'business' ? Store : User,
      label: user.role === 'business' ? 'Business Access' : 'Dashboard Access',
      description: user.role === 'business'
        ? 'Open your business dashboard and manage store operations.'
        : 'Jump back into your main dashboard from one place.',
      section: 'business',
    },
  ];

  const openSettings = () => setSearchParams({ tab: 'settings', section: 'notifications' });
  const openOverview = () => setSearchParams({});
  const openDetails = () => setSearchParams({ tab: 'details' });
  const openSettingsSection = (section: SettingsSection) => setSearchParams({ tab: 'settings', section });

  const settingsSectionContent: Record<SettingsSection, { title: string; description: string; items: string[] }> = {
    notifications: {
      title: 'Notifications',
      description: 'Control how Pick\'em keeps you updated about orders, deliveries, and account activity.',
      items: [
        'Delivery and order alerts will appear here.',
        'Account activity updates will live in this section.',
        'Marketing and product notifications can be managed here.',
      ],
    },
    payments: {
      title: 'Payments',
      description: 'Manage payment methods, billing history, payout readiness, and transaction visibility.',
      items: [
        'Saved cards and payment methods will appear here.',
        'Billing history and receipts can be reviewed here.',
        'Business payout details can be linked from this settings area.',
      ],
    },
    account: {
      title: 'Account Settings',
      description: 'Update your identity, profile details, login preferences, and account security setup.',
      items: [
        `Current account email: ${user.email}`,
        `Current login method: ${securityLabel}`,
        `Member since ${format(new Date(user.created_at), 'MMMM yyyy')}`,
      ],
    },
    business: {
      title: user.role === 'business' ? 'Business Access' : 'Dashboard Access',
      description: user.role === 'business'
        ? 'Jump into your business tools, storefront controls, and store operations.'
        : 'Go back to your main dashboard and account tools from here.',
      items: user.role === 'business'
        ? [
            `Plan: ${businessProfile?.is_pro ? 'Pick\'em Pro' : 'Starter Plan'}`,
            `Verification: ${businessProfile?.kyc_status || 'none'}`,
            'Open the business dashboard to manage store settings and operations.',
          ]
        : [
            'Open your dashboard from here.',
            'Use this area as the main account access point.',
            'More role-specific tools can be added here later.',
          ],
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[3rem] border border-apple-gray-100 bg-white shadow-sm"
      >
        <div className="relative overflow-hidden bg-apple-gray-500 px-6 py-10 md:px-10 md:py-12 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-4xl font-black text-apple-gray-500 shadow-xl">
                {user.name[0]?.toUpperCase()}
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em]">
                  <Shield className="h-3.5 w-3.5" />
                  {roleLabel[user.role] || 'Pick\'em User'}
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{user.name}</h1>
                  <p className="mt-2 text-sm md:text-base font-bold text-apple-gray-100/90">{user.email}</p>
                </div>
                <p className="max-w-2xl text-sm md:text-base font-bold text-apple-gray-100/85">
                  {roleSummary[user.role] || 'Manage your Pick\'em account from one organized profile.'}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col sm:w-auto sm:flex-row gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAdminDrawerOpen(true)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 text-sm font-black text-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <Crown className="h-4 w-4" />
                  Admin Panel
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={openDetails}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-white/10 px-6 py-4 text-sm font-black text-white ring-1 ring-white/20"
              >
                Profile Details
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openSettings}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-apple-gray-500 shadow-sm"
              >
                Account Center
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-6 md:p-8">
          {accountHighlights.map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-200">{item.label}</div>
              <div className="mt-3 text-xl font-black tracking-tight text-apple-gray-500">{item.value}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-apple-gray-50">
                <Activity className="h-6 w-6 text-apple-gray-300" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-apple-gray-500">Recent Activity</h2>
                <p className="text-sm font-bold text-apple-gray-300">A shared view of the latest account activity on this device.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[3rem] border border-apple-gray-100 bg-white shadow-sm">
              {activities.length === 0 ? (
                <div className="p-12 md:p-16 text-center space-y-4">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-apple-gray-50">
                    <Package className="h-10 w-10 text-apple-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xl font-black text-apple-gray-500">No recent activity yet</div>
                    <p className="text-sm font-bold text-apple-gray-300">Completed deliveries, proxy handovers, and account actions will appear here.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-apple-gray-50">
                  {activities.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex flex-col gap-4 p-6 md:p-8 md:flex-row md:items-center md:justify-between hover:bg-apple-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-apple-gray-50 text-apple-gray-300">
                          {activity.type === 'proxy_completed' ? <ShieldCheck className="h-7 w-7" /> : <Package className="h-7 w-7" />}
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-black text-apple-gray-500">{activity.title}</div>
                          <div className="text-sm font-bold text-apple-gray-300">{activity.description}</div>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-apple-gray-200">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(activity.time), 'h:mm a, MMM d')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
          </motion.aside>
        </div>
      )}

      {activeTab === 'details' && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-apple-gray-300">
                <BadgeCheck className="h-3.5 w-3.5" />
                Profile Details
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-apple-gray-500">Account Identity</h2>
              <p className="text-sm md:text-base font-bold text-apple-gray-300">
                Review your core account details, login method, and business profile status in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={openOverview}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-apple-gray-100 bg-white px-6 py-4 text-sm font-black text-apple-gray-500 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </button>
          </div>

          <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-200">Display Name</div>
                <div className="mt-3 text-lg font-black text-apple-gray-500">{user.name}</div>
              </div>
              <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-200">Email</div>
                <div className="mt-3 text-lg font-black text-apple-gray-500 break-all">{user.email}</div>
              </div>
              <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-200">Login Method</div>
                <div className="mt-3 text-lg font-black text-apple-gray-500">{securityLabel}</div>
              </div>
              <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-200">Last Magic Login</div>
                <div className="mt-3 text-lg font-black text-apple-gray-500">
                  {user.lastMagicLogin ? format(new Date(user.lastMagicLogin), 'MMM d, yyyy h:mm a') : 'Not available'}
                </div>
              </div>
            </div>

            {user.role === 'business' && businessProfile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-200">Store Status</div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span
                      className={cn(
                        'rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest border',
                        businessProfile.is_pro
                          ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                          : 'border-apple-gray-100 bg-apple-gray-50 text-apple-gray-300'
                      )}
                    >
                      {businessProfile.is_pro ? 'Pick\'em Pro' : 'Starter Plan'}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest border',
                        businessProfile.kyc_status === 'verified'
                          ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                          : businessProfile.kyc_status === 'pending'
                            ? 'border-amber-100 bg-amber-50 text-amber-700'
                            : 'border-apple-gray-100 bg-apple-gray-50 text-apple-gray-300'
                      )}
                    >
                      {businessProfile.kyc_status} verification
                    </span>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-200">Business Name</div>
                  <div className="mt-3 text-lg font-black text-apple-gray-500">{businessProfile.name || 'No business name yet'}</div>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {activeTab === 'settings' && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-apple-gray-300">
                <Settings className="h-3.5 w-3.5" />
                Account Center
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-apple-gray-500">Profile Settings</h2>
              <p className="text-sm md:text-base font-bold text-apple-gray-300">
                Keep all account-related actions in one dedicated settings page.
              </p>
            </div>
            <button
              type="button"
              onClick={openOverview}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-apple-gray-100 bg-white px-6 py-4 text-sm font-black text-apple-gray-500 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsCards.map((card) => (
              <div key={card.label} className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-apple-gray-50 text-apple-gray-300">
                  <card.icon className="h-7 w-7" />
                </div>
                <div className="mt-6 space-y-2">
                  <div className="text-2xl font-black tracking-tight text-apple-gray-500">{card.label}</div>
                  <p className="text-sm font-bold text-apple-gray-300">{card.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openSettingsSection(card.section)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-5 py-3 text-xs font-black uppercase tracking-widest text-apple-gray-500"
                >
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {activeSection && (
            <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10 shadow-sm space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-apple-gray-200">Selected Setting</div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-apple-gray-500">
                  {settingsSectionContent[activeSection].title}
                </h3>
                <p className="text-sm font-bold text-apple-gray-300">
                  {settingsSectionContent[activeSection].description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {settingsSectionContent[activeSection].items.map((item) => (
                  <div key={item} className="rounded-[1.75rem] border border-apple-gray-100 bg-apple-gray-50 p-5 text-sm font-bold text-apple-gray-500">
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {activeSection === 'business' ? (
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-6 py-4 text-sm font-black text-white shadow-sm"
                  >
                    Open Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 rounded-full bg-apple-gray-50 px-6 py-4 text-sm font-black text-apple-gray-500">
                    {settingsSectionContent[activeSection].title} tools coming here
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.section>
      )}

      <AdminDrawer isOpen={isAdminDrawerOpen} onClose={() => setIsAdminDrawerOpen(false)} />
    </div>
  );
}
