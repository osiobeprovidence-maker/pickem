import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { Store, Package, TrendingUp, Clock, Plus, Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getDeliveries('business', user.id).then(setDeliveries).finally(() => setIsLoading(false));
    }
  }, [user]);

  const stats = [
    { label: 'Total Orders', value: deliveries.length, icon: Package, color: 'text-blue-600' },
    { label: 'Revenue', value: `N${(deliveries.length * 2500).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Active', value: deliveries.filter((delivery) => delivery.status !== 'delivered').length, icon: Clock, color: 'text-orange-600' },
  ];

  const businessLinks = [
    {
      title: 'Active Orders',
      description: 'Manage your current customer deliveries.',
      path: '/dashboard',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Business Profile',
      description: 'Update your shop details and location.',
      path: '/profile',
      icon: Store,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Analytics',
      description: 'View your sales and delivery performance.',
      path: '/dashboard',
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="space-y-8 overflow-x-clip md:space-y-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-apple-gray-500 shadow-sm">
            <Store className="h-8 w-8 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="break-words text-3xl font-bold text-apple-gray-500">{user?.name}</h1>
            <p className="font-medium text-apple-gray-300">Business Dashboard · {deliveries.length} Deliveries</p>
          </div>
        </div>
        <Link
          to="/request"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-8 py-3 font-bold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto"
        >
          <Plus className="h-5 w-5" /> New Delivery
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {businessLinks.map((link) => (
          <Link
            key={`${link.title}-${link.path}`}
            to={link.path}
            className="group rounded-[2.25rem] border border-apple-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl sm:p-8"
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
              className="w-full rounded-full border-none bg-apple-gray-50 py-2 pl-9 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600 md:w-64"
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
            <Link
              to="/request"
              className="inline-flex w-full items-center justify-center rounded-full bg-apple-gray-500 px-8 py-3 font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              Create First Delivery
            </Link>
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
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700',
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
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700',
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
