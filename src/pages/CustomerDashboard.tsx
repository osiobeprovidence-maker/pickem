import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle2, MapPin, Plus, ArrowRight, Search, ShoppingBag, ShieldCheck } from 'lucide-react';
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
    { label: 'Active', value: deliveries.filter(d => d.status !== 'delivered' && d.status !== 'cancelled').length, icon: Clock, color: 'text-blue-600' },
    { label: 'Completed', value: deliveries.filter(d => d.status === 'delivered').length, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  const dashboardLinks = [
    {
      title: "Standard Delivery",
      description: "Send or receive a package across campus.",
      path: "/request",
      icon: Package,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Buy & Deliver",
      description: "Start shopping and get items delivered.",
      path: "/buy-and-deliver",
      icon: ShoppingBag,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Proxy Pickup",
      description: "Set up a secure proxy for your items.",
      path: "/proxy-pickup",
      icon: ShieldCheck,
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-gray-500">Hello, {user?.name}!</h1>
          <p className="text-apple-gray-300 font-medium">Welcome to your campus logistics hub.</p>
        </div>
        <Link
          to="/request"
          className="bg-apple-gray-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> New Request
        </Link>
      </div>

      {/* Dashboard Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="group bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform", link.color)}>
              <link.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-apple-gray-500 mb-2">{link.title}</h3>
            <p className="text-apple-gray-300 text-sm font-medium leading-relaxed">{link.description}</p>
          </Link>
        ))}
      </div>

      {/* Stats & List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-apple-gray-500">Recent Activity</h2>
          <div className="flex gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-apple-gray-100 text-sm font-bold">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <span className="text-apple-gray-500">{stat.value} {stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-apple-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-apple-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-apple-gray-500">All Deliveries</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-200" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-apple-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 text-center text-apple-gray-200 font-medium">Loading activity...</div>
          ) : deliveries.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-apple-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-apple-gray-200" />
              </div>
              <h3 className="text-2xl font-bold text-apple-gray-500 mb-2">No activity yet</h3>
              <p className="text-apple-gray-300 mb-8 font-medium">Start by creating your first delivery request.</p>
              <Link
                to="/request"
                className="text-blue-600 font-bold hover:underline text-lg"
              >
                Create Request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-apple-gray-100">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-8 hover:bg-apple-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                        delivery.status === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      )}>
                        <Package className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold uppercase text-[10px] tracking-widest text-apple-gray-200">
                            {delivery.type.replace('_', ' ')}
                          </span>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                            delivery.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {delivery.status}
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
                      <div className="text-xs text-apple-gray-200 font-medium">
                        {format(new Date(delivery.created_at), 'MMM d, h:mm a')}
                      </div>
                      {delivery.proxy_code && (
                        <div className="bg-apple-gray-500 text-white px-4 py-1.5 rounded-xl text-xs font-mono font-bold">
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
