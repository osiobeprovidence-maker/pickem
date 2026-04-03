import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { DeliveryType } from '../types';
import { motion } from 'motion/react';
import { Package, MapPin, Info, Phone, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

export default function RequestDelivery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState<DeliveryType>('send_item');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    pickup_location: '',
    drop_location: '',
    item_description: '',
    contact_details: '',
    use_proxy: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const proxy_code = formData.use_proxy ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined;
      const fee = 500; // Flat fee for demo

      await api.createDelivery({
        type,
        pickup_location: formData.pickup_location,
        drop_location: formData.drop_location,
        item_description: formData.item_description,
        contact_details: formData.contact_details,
        customer_id: user.id,
        fee,
        proxy_code,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const types: { id: DeliveryType; title: string; icon: any; description: string }[] = [
    { id: 'send_item', title: 'Send Item', icon: Package, description: 'Move a package from A to B.' },
    { id: 'buy_deliver', title: 'Buy & Deliver', icon: ShoppingBag, description: 'Runner shops and delivers to you.' },
    { id: 'proxy', title: 'Pick’em Proxy', icon: ShieldCheck, description: 'Secure pickup on your behalf.' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">New Delivery Request</h1>
        <p className="text-stone-500">Fill in the details to find a runner.</p>
      </div>

      <div className="space-y-10">
        {/* Type Selection */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">Select Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-3",
                  type === t.id
                    ? "border-emerald-600 bg-emerald-50/50"
                    : "border-stone-100 hover:border-stone-200 bg-white"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  type === t.id ? "bg-emerald-600 text-white" : "bg-stone-50 text-stone-400"
                )}>
                  <t.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t.title}</div>
                  <div className="text-[10px] text-stone-500 leading-tight">{t.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Pickup Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Arts"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Drop-off Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hall 4, Room 202"
                  value={formData.drop_location}
                  onChange={(e) => setFormData({ ...formData, drop_location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-stone-400" /> Item Description
              </label>
              <textarea
                required
                placeholder="What are we moving? (e.g. Blue backpack, 2 packs of Indomie)"
                value={formData.item_description}
                onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 outline-none transition-all min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-400" /> Contact Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="08012345678"
                value={formData.contact_details}
                onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
              />
            </div>

            {type === 'proxy' && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="use_proxy"
                  checked={formData.use_proxy}
                  onChange={(e) => setFormData({ ...formData, use_proxy: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-600"
                />
                <label htmlFor="use_proxy" className="text-sm font-medium text-emerald-900">
                  Generate a secure proxy code for this delivery
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-6 bg-stone-900 rounded-3xl text-white">
            <div>
              <div className="text-xs text-stone-400 uppercase font-bold">Estimated Fee</div>
              <div className="text-3xl font-bold">₦500.00</div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Posting..." : "Confirm Request"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
