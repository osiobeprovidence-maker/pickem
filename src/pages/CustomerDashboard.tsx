import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { Package, Clock, CheckCircle2, MapPin, Plus, Search, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getDeliveries('customer', user.id).then(setDeliveries).finally(() => setIsLoading(false));
    }
  }, [user]);

  const stats = [
    {
      label: 'Active',
      value: deliveries.filter((delivery) => delivery.status !== 'delivered' && delivery.status !== 'cancelled').length,
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: deliveries.filter((delivery) => delivery.status === 'delivered').length,
      icon: CheckCircle2,
      color: 'text-emerald-600',
    },
  ];

  const dashboardLinks = [
    {
      title: 'Standard Delivery',
      description: 'Send or receive a package across campus.',
      path: '/request',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Buy & Deliver',
      description: 'Start shopping and get items delivered.',
      path: '/buy-and-deliver',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Proxy Pickup',
      description: 'Set up a secure proxy for your items.',
      path: '/proxy-pickup',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="space-y-8 overflow-x-clip md:space-y-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-apple-gray-500">Hello, {user?.name}!</h1>
          <p className="text-apple-gray-300 font-medium">Welcome to your campus logistics hub.</p>
        </div>
        <Link
          to="/request"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-8 py-3 font-bold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto"
        >
          <Plus className="h-5 w-5" /> New Request
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {dashboardLinks.map((link) => (
          <Link
            key={link.path}
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

      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-apple-gray-500">Recent Activity</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 rounded-full border border-apple-gray-100 bg-white px-4 py-2 text-sm font-bold"
              >
                <stat.icon className={cn('h-4 w-4', stat.color)} />
                <span className="text-apple-gray-500">
                  {stat.value} {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-apple-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-apple-gray-100 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-apple-gray-500">All Deliveries</h2>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-gray-200" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border-none bg-apple-gray-50 py-2 pl-9 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600 md:w-56"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center font-medium text-apple-gray-200 sm:p-20">Loading activity...</div>
          ) : deliveries.length === 0 ? (
            <div className="p-10 text-center sm:p-20">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-apple-gray-50">
                <Package className="h-10 w-10 text-apple-gray-200" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-apple-gray-500">No activity yet</h3>
              <p className="mb-8 font-medium text-apple-gray-300">Start by creating your first delivery request.</p>
              <Link to="/request" className="text-lg font-bold text-blue-600 hover:underline">
                Create Request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-apple-gray-100">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-6 transition-colors hover:bg-apple-gray-50 sm:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-start gap-4 sm:gap-6">
                      <div
                        className={cn(
                          'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
                          delivery.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600',
                        )}
                      >
                        <Package className="h-7 w-7" />
                      </div>
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-apple-gray-200">
                            {delivery.type.replace('_', ' ')}
                          </span>
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
                        <h3 className="mb-3 break-words text-xl font-bold text-apple-gray-500">
                          {delivery.item_description}
                        </h3>
                        <div className="flex flex-col gap-2 text-[14px] font-medium text-apple-gray-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0" /> From: {delivery.pickup_location}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0" /> To: {delivery.drop_location}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:min-w-[140px] md:flex-col md:items-end md:justify-center">
                      <div className="text-2xl font-bold text-apple-gray-500">N{delivery.fee}</div>
                      <div className="text-xs font-medium text-apple-gray-200">
                        {format(new Date(delivery.created_at), 'MMM d, h:mm a')}
                      </div>
                      {delivery.proxy_code && (
                        <div className="rounded-xl bg-apple-gray-500 px-4 py-1.5 text-xs font-mono font-bold text-white">
                          Proxy: {delivery.proxy_code}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
