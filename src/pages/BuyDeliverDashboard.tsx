import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { motion } from 'motion/react';
import { ShoppingBag, Clock, CheckCircle2, MapPin, Plus, Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function BuyDeliverDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getDeliveries('customer', user.id).then(all => {
        setDeliveries(all.filter(d => d.type === 'buy_deliver'));
      }).finally(() => setIsLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-gray-500">Buy & Deliver Dashboard</h1>
          <p className="text-apple-gray-300 font-medium">Manage your shopping requests and track runners.</p>
        </div>
        <Link
          to="/buy-and-deliver"
          className="bg-apple-gray-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-apple-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-apple-gray-500">{deliveries.filter(d => d.status !== 'delivered').length}</div>
          <div className="text-sm text-apple-gray-300 font-bold uppercase tracking-wider">Active Orders</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-apple-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-apple-gray-500">{deliveries.filter(d => d.status === 'delivered').length}</div>
          <div className="text-sm text-apple-gray-300 font-bold uppercase tracking-wider">Completed</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-[2.5rem] border border-apple-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-apple-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-apple-gray-500">Your Shopping History</h2>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-apple-gray-200 font-medium">Loading your orders...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-apple-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-apple-gray-200" />
            </div>
            <h3 className="text-2xl font-bold text-apple-gray-500 mb-2">No shopping orders yet</h3>
            <p className="text-apple-gray-300 mb-8 font-medium">Need something from the store? We've got you.</p>
            <Link
              to="/buy-and-deliver"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              Place your first order
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-apple-gray-100">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="p-8 hover:bg-apple-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-apple-gray-50 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-7 h-7 text-apple-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                          delivery.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {delivery.status}
                        </span>
                        <span className="text-xs text-apple-gray-200 font-medium">
                          {format(new Date(delivery.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-apple-gray-500 mb-3">{delivery.item_description}</h3>
                      <div className="flex flex-col gap-2 text-[14px] text-apple-gray-300 font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> From: {delivery.pickup_location}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> To: {delivery.drop_location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                    <div className="text-2xl font-bold text-apple-gray-500">₦{delivery.fee}</div>
                    <button className="text-blue-600 font-bold text-sm hover:underline">View Details</button>
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
