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

  const activeDeliveries = deliveries.filter(d => d.status !== 'delivered' && d.status !== 'cancelled');

  return (
    <div className="min-h-[80vh] bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-0">
      <div className="max-w-6xl w-full mx-auto space-y-16 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500 leading-none">Pick’em</h1>
          <p className="text-2xl font-bold text-apple-gray-300">
            What's the plan for today, {user?.name?.split(' ')[0]}?
          </p>
        </motion.div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/request"
              className="group flex flex-col items-center gap-6 p-10 rounded-[3rem] bg-apple-gray-50 border-2 border-apple-gray-50 hover:border-apple-gray-500 transition-all shadow-sm hover:shadow-xl h-full"
            >
              <div className="w-20 h-20 bg-apple-gray-500 text-white rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Package className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-apple-gray-500">Send Items</h3>
                <p className="text-sm font-bold text-apple-gray-200 uppercase tracking-widest">Courier Service</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/buy-and-deliver"
              className="group flex flex-col items-center gap-6 p-10 rounded-[3rem] bg-apple-gray-50 border-2 border-apple-gray-50 hover:border-apple-gray-500 transition-all shadow-sm hover:shadow-xl h-full"
            >
              <div className="w-20 h-20 bg-apple-gray-500 text-white rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-apple-gray-500">Request Shopping</h3>
                <p className="text-sm font-bold text-apple-gray-200 uppercase tracking-widest">Personal Shopper</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/proxy-request"
              className="group flex flex-col items-center gap-6 p-10 rounded-[3rem] bg-apple-gray-50 border-2 border-apple-gray-50 hover:border-apple-gray-500 transition-all shadow-sm hover:shadow-xl h-full"
            >
              <div className="w-20 h-20 bg-apple-gray-500 text-white rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-apple-gray-500">Proxy Pickup</h3>
                <p className="text-sm font-bold text-apple-gray-200 uppercase tracking-widest">Secure Handover</p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Tracking Menu / Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-12"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-apple-gray-50 rounded-full shadow-sm">
            <Clock className="w-5 h-5 text-apple-gray-300" />
            <h2 className="text-lg font-black text-apple-gray-500">Track your items</h2>
            {activeDeliveries.length > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {activeDeliveries.length} ACTIVE
              </span>
            )}
          </div>

          <div className="mt-8 max-w-3xl mx-auto space-y-4">
            {isLoading ? (
              <div className="py-10 text-apple-gray-200 font-bold">Checking status...</div>
            ) : activeDeliveries.length === 0 ? (
              <p className="text-apple-gray-200 font-bold italic">No active deliveries at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activeDeliveries.slice(0, 3).map((delivery) => (
                  <Link
                    key={delivery.id}
                    to={delivery.type === 'buy_deliver' ? '/buy-and-deliver?step=tracking' : '/request?step=tracking'}
                    className="flex items-center justify-between p-6 bg-white rounded-3xl border border-apple-gray-50 hover:border-apple-gray-100 transition-all text-left shadow-sm group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center text-apple-gray-300 group-hover:bg-apple-gray-500 group-hover:text-white transition-colors">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-apple-gray-500 truncate max-w-[200px] sm:max-w-md">{delivery.item_description}</h4>
                        <p className="text-xs font-bold text-apple-gray-200 uppercase tracking-widest">{delivery.status}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-apple-gray-100 group-hover:text-apple-gray-500 transition-colors" />
                  </Link>
                ))}
                {activeDeliveries.length > 3 && (
                  <button className="text-apple-gray-300 font-black text-sm hover:text-apple-gray-500 transition-colors">
                    View all active requests
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
