import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import {
  ArrowRight,
  Clock,
  CreditCard,
  LockKeyhole,
  MapPin,
  Package,
  Plus,
  Search,
  Store,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  activateBusinessSubscription,
  getBusinessPlanSummary,
  startBusinessTrial,
} from '../lib/businessOnboarding';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [planSummary, setPlanSummary] = useState(() => getBusinessPlanSummary(user?.email));

  useEffect(() => {
    if (user) {
      api.getDeliveries('business', user.id).then(setDeliveries).finally(() => setIsLoading(false));
    }
  }, [user]);

  useEffect(() => {
    setPlanSummary(getBusinessPlanSummary(user?.email));
  }, [user?.email]);

  const refreshPlan = () => setPlanSummary(getBusinessPlanSummary(user?.email));

  const handleStartTrial = () => {
    if (!user?.email) return;
    startBusinessTrial(user.email);
    refreshPlan();
  };

  const handleSubscribe = () => {
    if (!user?.email) return;
    activateBusinessSubscription(user.email);
    refreshPlan();
  };

  const isPremiumLocked = planSummary.locked;
  const needsRegistration = planSummary.status === 'none';
  const canStartTrial = planSummary.status === 'registered';

  const stats = [
    { label: 'Total Orders', value: deliveries.length, icon: Package, color: 'text-brand-600' },
    { label: 'Revenue', value: `N${(deliveries.length * 2500).toLocaleString()}`, icon: TrendingUp, color: 'text-brand-700' },
    { label: 'Active', value: deliveries.filter((delivery) => delivery.status !== 'delivered').length, icon: Clock, color: 'text-orange-600' },
  ];

  const businessLinks = [
    {
      title: 'Active Orders',
      description: 'Manage your current customer deliveries.',
      path: '/dashboard',
      icon: Package,
      color: 'bg-brand-50 text-brand-600',
    },
    {
      title: 'Business Profile',
      description: 'Update your shop details and location.',
      path: '/profile',
      icon: Store,
      color: 'bg-apple-gray-50 text-apple-gray-500',
    },
    {
      title: 'Analytics',
      description: 'View your sales and delivery performance.',
      path: '/dashboard',
      icon: TrendingUp,
      color: 'bg-brand-100 text-brand-700',
      premium: true,
    },
  ];

  return (
    <div className="space-y-8 overflow-x-clip md:space-y-12">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-apple-gray-500 shadow-sm">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="break-words text-3xl font-bold text-apple-gray-500">{user?.name}</h1>
                <p className="font-medium text-apple-gray-300">Business Dashboard · {deliveries.length} Deliveries</p>
              </div>
            </div>

            {needsRegistration ? (
              <Link to="/businesses" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Complete Business Registration
                </Button>
              </Link>
            ) : isPremiumLocked ? (
              <Button size="lg" className="w-full sm:w-auto" onClick={handleSubscribe}>
                Subscribe for ₦3,500/month
              </Button>
            ) : canStartTrial ? (
              <Button size="lg" className="w-full sm:w-auto" onClick={handleStartTrial}>
                Start 7-Day Free Trial
              </Button>
            ) : (
              <Link to="/request" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  <Plus className="h-5 w-5" />
                  New Delivery
                </Button>
              </Link>
            )}
          </div>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">Current Plan</p>
              <h2 className="mt-2 text-3xl font-black text-apple-gray-500">{planSummary.currentPlanLabel}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
              <CreditCard className="h-6 w-6 text-brand-600" />
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm font-medium text-apple-gray-400">
            <div className="flex items-center justify-between gap-4">
              <span>Days remaining</span>
              <span className="font-black text-apple-gray-500">{planSummary.daysRemaining}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Next billing</span>
              <span className="text-right font-black text-apple-gray-500">{planSummary.nextBillingLabel}</span>
            </div>
          </div>

          {isPremiumLocked ? (
            <div className="mt-5 rounded-[1.5rem] border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="font-black text-red-700">Premium features are locked</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-red-600">
                    Renew your subscription to create new delivery jobs and unlock analytics again.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-brand-100 bg-brand-50 p-4">
              <p className="text-sm font-medium leading-relaxed text-brand-900">
                {planSummary.status === 'trial'
                  ? 'Your trial is active. Explore the full business workflow before your first billing cycle begins.'
                  : planSummary.status === 'active'
                    ? 'Your subscription is active and your premium business tools are fully unlocked.'
                    : needsRegistration
                      ? 'Complete your business registration to unlock the onboarding and trial flow.'
                      : 'Complete onboarding to activate your free trial and unlock business delivery tools.'}
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {businessLinks.map((link) => (
          <div key={`${link.title}-${link.path}`} className="h-full">
            {link.premium && isPremiumLocked ? (
              <Card className="flex h-full flex-col p-6 opacity-80 sm:p-8">
                <div className={cn('mb-6 flex h-14 w-14 items-center justify-center rounded-2xl sm:mb-8', link.color)}>
                  <link.icon className="h-7 w-7" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-xl font-bold text-apple-gray-500">{link.title}</h3>
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-red-600">
                    Locked
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-apple-gray-300">{link.description}</p>
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-700"
                >
                  Unlock with subscription
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Card>
            ) : (
              <Link
                to={link.path}
                className="group block h-full rounded-[2.25rem] border border-apple-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl sm:p-8"
              >
                <div
                  className={cn(
                    'mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 sm:mb-8',
                    link.color,
                  )}
                >
                  <link.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-apple-gray-500">{link.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-apple-gray-300">{link.description}</p>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[2.25rem] border border-apple-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className={cn('mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-apple-gray-50', stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="mb-1 break-words text-3xl font-bold text-apple-gray-500">{stat.value}</div>
            <div className="text-sm font-bold uppercase tracking-wider text-apple-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-apple-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-apple-gray-100 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-apple-gray-500">Recent Deliveries</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-gray-200" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full rounded-full border-none bg-apple-gray-50 py-2 pl-9 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500 md:w-64"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 text-center font-medium text-apple-gray-200 sm:p-20">Loading your business data...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-10 text-center sm:p-20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-apple-gray-50">
              <Package className="h-10 w-10 text-apple-gray-200" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-apple-gray-500">No deliveries yet</h3>
            <p className="mx-auto mb-8 max-w-xs font-medium text-apple-gray-300">
              Start using Pick&apos;em as your delivery infrastructure today.
            </p>
            {needsRegistration ? (
              <Link to="/businesses" className="inline-flex w-full sm:w-auto">
                <Button className="w-full sm:w-auto">Complete Registration</Button>
              </Link>
            ) : isPremiumLocked ? (
              <Button onClick={handleSubscribe}>Subscribe for ₦3,500/month</Button>
            ) : (
              <Link to="/request" className="inline-flex w-full sm:w-auto">
                <Button className="w-full sm:w-auto">Create First Delivery</Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-apple-gray-50 text-[10px] font-bold uppercase tracking-widest text-apple-gray-300">
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Customer / Item</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Destination</th>
                    <th className="px-8 py-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-gray-100">
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id} className="group transition-colors hover:bg-apple-gray-50">
                      <td className="px-8 py-8">
                        <span className="font-mono text-xs font-bold text-apple-gray-200">#{delivery.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="mb-1 text-lg font-bold text-apple-gray-500">{delivery.item_description}</div>
                        <div className="text-xs font-medium text-apple-gray-300">{delivery.contact_details}</div>
                      </td>
                      <td className="px-8 py-8">
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
                            delivery.status === 'delivered'
                              ? 'bg-apple-gray-100 text-apple-gray-500'
                              : 'bg-brand-100 text-brand-700',
                          )}
                        >
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-2 text-[14px] font-medium text-apple-gray-300">
                          <MapPin className="h-4 w-4 text-apple-gray-200" />
                          {delivery.drop_location}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="text-[15px] font-bold text-apple-gray-500">{format(new Date(delivery.created_at), 'MMM d')}</div>
                        <div className="text-xs font-medium text-apple-gray-200">{format(new Date(delivery.created_at), 'h:mm a')}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-apple-gray-100 md:hidden">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="space-y-4 p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-apple-gray-200">#{delivery.id.slice(0, 8)}</span>
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
                          delivery.status === 'delivered'
                            ? 'bg-apple-gray-100 text-apple-gray-500'
                            : 'bg-brand-100 text-brand-700',
                        )}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-apple-gray-500">{delivery.item_description}</div>
                    <div className="text-sm font-medium text-apple-gray-300">{delivery.contact_details}</div>
                  </div>

                  <div className="space-y-2 text-sm font-medium text-apple-gray-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-200" />
                      <span>{delivery.drop_location}</span>
                    </div>
                    <div className="text-xs text-apple-gray-200">
                      {format(new Date(delivery.created_at), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
