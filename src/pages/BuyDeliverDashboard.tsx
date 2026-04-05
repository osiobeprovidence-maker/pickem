import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { ShoppingBag, CheckCircle2, MapPin, Plus, ShoppingCart } from 'lucide-react';
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

  return (
    <div className="space-y-8 overflow-x-clip">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-apple-gray-500">Buy & Deliver Dashboard</h1>
          <p className="font-medium text-apple-gray-300">Manage your shopping requests and track runners.</p>
        </div>
        <Link
          to="/buy-and-deliver"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-8 py-3 font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
        >
          <Plus className="h-5 w-5" /> New Order
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-apple-gray-500">
            {deliveries.filter((delivery) => delivery.status !== 'delivered').length}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-apple-gray-300">Active Orders</div>
        </div>
        <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-apple-gray-500">
            {deliveries.filter((delivery) => delivery.status === 'delivered').length}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-apple-gray-300">Completed</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-apple-gray-100 bg-white shadow-sm">
        <div className="border-b border-apple-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-apple-gray-500">Your Shopping History</h2>
        </div>

        {isLoading ? (
          <div className="p-16 text-center font-medium text-apple-gray-200 sm:p-20">Loading your orders...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-10 text-center sm:p-20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-apple-gray-50">
              <ShoppingBag className="h-10 w-10 text-apple-gray-200" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-apple-gray-500">No shopping orders yet</h3>
            <p className="mb-8 font-medium text-apple-gray-300">Need something from the store? We&apos;ve got you.</p>
            <Link to="/buy-and-deliver" className="text-lg font-bold text-blue-600 hover:underline">
              Place your first order
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-apple-gray-100">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="p-6 transition-colors hover:bg-apple-gray-50 sm:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-start gap-4 sm:gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-apple-gray-50">
                      <ShoppingBag className="h-7 w-7 text-apple-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:items-end">
                    <div className="text-2xl font-bold text-apple-gray-500">N{delivery.fee}</div>
                    <button className="self-start text-sm font-bold text-blue-600 hover:underline md:self-auto">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
