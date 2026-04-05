import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { DeliveryType } from '../types';
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const proxyCode = formData.use_proxy ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined;
      const fee = 500;

      await api.createDelivery({
        type,
        pickup_location: formData.pickup_location,
        drop_location: formData.drop_location,
        item_description: formData.item_description,
        contact_details: formData.contact_details,
        customer_id: user.id,
        fee,
        proxy_code: proxyCode,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const types: { id: DeliveryType; title: string; icon: React.ElementType; description: string }[] = [
    { id: 'send_item', title: 'Send Item', icon: Package, description: 'Move a package from A to B.' },
    { id: 'buy_deliver', title: 'Buy & Deliver', icon: ShoppingBag, description: 'Runner shops and delivers to you.' },
    { id: 'proxy', title: "Pick'em Proxy", icon: ShieldCheck, description: 'Secure pickup on your behalf.' },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl overflow-x-clip">
      <div className="mb-8 space-y-2 sm:mb-10">
        <h1 className="text-3xl font-bold text-stone-900">New Delivery Request</h1>
        <p className="font-medium text-stone-500">Fill in the details to find a runner.</p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-400">Select Service</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {types.map((service) => (
              <button
                key={service.id}
                onClick={() => setType(service.id)}
                className={cn(
                  'flex min-w-0 flex-col gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-all',
                  type === service.id ? 'border-emerald-600 bg-emerald-50/50' : 'border-stone-100 hover:border-stone-200',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    type === service.id ? 'bg-emerald-600 text-white' : 'bg-stone-50 text-stone-400',
                  )}
                >
                  <service.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-stone-900">{service.title}</div>
                  <div className="text-[11px] leading-relaxed text-stone-500">{service.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 rounded-3xl border border-stone-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-emerald-600" /> Pickup Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Arts"
                  value={formData.pickup_location}
                  onChange={(event) => setFormData({ ...formData, pickup_location: event.target.value })}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-brand-600" /> Drop-off Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hall 4, Room 202"
                  value={formData.drop_location}
                  onChange={(event) => setFormData({ ...formData, drop_location: event.target.value })}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4 text-stone-400" /> Item Description
              </label>
              <textarea
                required
                placeholder="What are we moving? (e.g. Blue backpack, 2 packs of Indomie)"
                value={formData.item_description}
                onChange={(event) => setFormData({ ...formData, item_description: event.target.value })}
                className="min-h-[100px] w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4 text-stone-400" /> Contact Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="08012345678"
                value={formData.contact_details}
                onChange={(event) => setFormData({ ...formData, contact_details: event.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {type === 'proxy' && (
              <div className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center">
                <input
                  type="checkbox"
                  id="use_proxy"
                  checked={formData.use_proxy}
                  onChange={(event) => setFormData({ ...formData, use_proxy: event.target.checked })}
                  className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-600"
                />
                <label htmlFor="use_proxy" className="text-sm font-medium leading-relaxed text-emerald-900">
                  Generate a secure proxy code for this delivery
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-stone-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <div className="text-xs font-bold uppercase text-stone-400">Estimated Fee</div>
              <div className="text-3xl font-bold">N500.00</div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 sm:w-auto sm:px-10"
            >
              {isLoading ? 'Posting...' : 'Confirm Request'}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
