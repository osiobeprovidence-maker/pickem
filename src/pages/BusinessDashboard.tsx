import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { motion } from 'motion/react';
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
    { label: 'Revenue', value: `₦${(deliveries.length * 2500).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Active', value: deliveries.filter(d => d.status !== 'delivered').length, icon: Clock, color: 'text-orange-600' },
  ];

  const businessLinks = [
    {
      title: "Active Orders",
      description: "Manage your current customer deliveries.",
      path: "/dashboard",
      icon: Package,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Business Profile",
      description: "Update your shop details and location.",
      path: "/profile",
      icon: Store,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Analytics",
      description: "View your sales and delivery performance.",
      path: "/dashboard",
      icon: TrendingUp,
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-apple-gray-500 rounded-2xl flex items-center justify-center shadow-sm">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-apple-gray-500">{user?.name}</h1>
            <p className="text-apple-gray-300 font-medium">Business Dashboard • {deliveries.length} Deliveries</p>
          </div>
        </div>
        <Link
          to="/request"
          className="bg-apple-gray-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> New Delivery
        </Link>
      </div>

      {/* Business Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {businessLinks.map((link, i) => (
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm">
            <div className={cn("w-12 h-12 rounded-2xl bg-apple-gray-50 flex items-center justify-center mb-6", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-apple-gray-500 mb-1">{stat.value}</div>
            <div className="text-sm text-apple-gray-300 font-bold uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-[2.5rem] border border-apple-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-apple-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-apple-gray-500">Recent Deliveries</h2>
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-200" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2 bg-apple-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-apple-gray-200 font-medium">Loading your business data...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-apple-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-apple-gray-200" />
            </div>
            <h3 className="text-2xl font-bold text-apple-gray-500 mb-2">No deliveries yet</h3>
            <p className="text-apple-gray-300 mb-8 max-w-xs mx-auto font-medium">Start using Pick’em as your delivery infrastructure today.</p>
            <Link
              to="/request"
              className="bg-apple-gray-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              Create First Delivery
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-apple-gray-50 text-apple-gray-300 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer / Item</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Destination</th>
                  <th className="px-8 py-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-gray-100">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-apple-gray-50 transition-colors group">
                    <td className="px-8 py-8">
                      <span className="font-mono text-xs text-apple-gray-200 font-bold">#{delivery.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="font-bold text-apple-gray-500 text-lg mb-1">{delivery.item_description}</div>
                      <div className="text-xs text-apple-gray-300 font-medium">{delivery.contact_details}</div>
                    </td>
                    <td className="px-8 py-8">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                        delivery.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2 text-[14px] text-apple-gray-300 font-medium">
                        <MapPin className="w-4 h-4 text-apple-gray-200" />
                        {delivery.drop_location}
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="text-[15px] font-bold text-apple-gray-500">{format(new Date(delivery.created_at), 'MMM d')}</div>
                      <div className="text-xs text-apple-gray-200 font-medium">{format(new Date(delivery.created_at), 'h:mm a')}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
