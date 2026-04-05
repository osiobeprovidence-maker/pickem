import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { ShoppingBag, CheckCircle2, MapPin, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function BuyDeliverDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getDeliveries('customer', user.id)
        .then((allDeliveries) => {
          setDeliveries(allDeliveries.filter((delivery) => delivery.type === 'buy_deliver'));
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const activeOrders = deliveries.filter((delivery) => delivery.status !== 'delivered').length;
  const completedOrders = deliveries.filter((delivery) => delivery.status === 'delivered').length;

  const statCards = [
    {
      label: 'Active Orders',
      value: activeOrders,
      description: 'Shopping jobs currently being handled by runners.',
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Completed Orders',
      value: completedOrders,
      description: 'Shopping requests that have already been fulfilled.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6 overflow-x-clip md:space-y-8">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-stretch">
        <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray-300">
            <span className="rounded-full bg-apple-gray-50 px-3 py-1.5">Shopping Workspace</span>
            <span className="rounded-full bg-apple-gray-50 px-3 py-1.5">{deliveries.length} total orders</span>
          </div>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-apple-gray-500 sm:text-4xl">
                Buy & Deliver Dashboard
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
                See what is being shopped right now, review completed orders, and keep your campus shopping flow close to the main action.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-bold">
              <div className="rounded-full border border-apple-gray-100 bg-apple-gray-50 px-4 py-2 text-apple-gray-500">
                {activeOrders} active
              </div>
              <div className="rounded-full border border-apple-gray-100 bg-apple-gray-50 px-4 py-2 text-apple-gray-500">
                {completedOrders} completed
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/buy-and-deliver"
          className="inline-flex items-center justify-center gap-2 rounded-[1.5rem] bg-apple-gray-500 px-6 py-4 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90 xl:min-w-[220px]"
        >
          <Plus className="h-5 w-5" /> New Order
        </Link>
      </section>

      <section className="grid auto-rows-fr gap-4 md:grid-cols-2">
        {statCards.map((stat) => (
          <div key={stat.label} className="flex h-full flex-col justify-between rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm sm:p-7">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="mt-5">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-apple-gray-300">{stat.label}</p>
              <div className="mt-2 text-4xl font-bold tracking-tight text-apple-gray-500">{stat.value}</div>
              <p className="mt-3 text-sm font-medium leading-relaxed text-apple-gray-300">{stat.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[2.25rem] border border-apple-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-apple-gray-100 px-6 py-5 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-apple-gray-500">Shopping History</h2>
            <p className="mt-1 text-sm font-medium text-apple-gray-300">
              Review recent orders, runner progress, and delivered items without all the empty dashboard gaps.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-apple-gray-100 bg-apple-gray-50 px-4 py-2 text-sm font-bold text-apple-gray-500">
              {activeOrders} Active
            </div>
            <div className="rounded-full border border-apple-gray-100 bg-apple-gray-50 px-4 py-2 text-sm font-bold text-apple-gray-500">
              {completedOrders} Completed
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center p-10 text-center text-sm font-medium text-apple-gray-200">
            Loading your orders...
          </div>
        ) : deliveries.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center sm:px-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-apple-gray-50">
              <ShoppingBag className="h-10 w-10 text-apple-gray-200" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-apple-gray-500">No shopping orders yet</h3>
            <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
              Need something from the store? Start your first order and keep every item request tracked in one place.
            </p>
            <Link
              to="/buy-and-deliver"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-apple-gray-500 px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Place Your First Order
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-apple-gray-100">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="px-6 py-5 transition-colors hover:bg-apple-gray-50 sm:px-8 sm:py-6">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center">
                  <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-apple-gray-50">
                      <ShoppingBag className="h-7 w-7 text-apple-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
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
                        <span className="text-xs font-medium text-apple-gray-200">
                          {format(new Date(delivery.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <h3 className="break-words text-lg font-bold text-apple-gray-500 sm:text-xl">
                        {delivery.item_description}
                      </h3>
                      <div className="mt-3 grid gap-2 text-sm font-medium text-apple-gray-300 sm:grid-cols-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                          <span className="break-words">From: {delivery.pickup_location}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                          <span className="break-words">To: {delivery.drop_location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <div className="text-2xl font-bold text-apple-gray-500">N{delivery.fee}</div>
                    <button className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
