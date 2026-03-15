import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { DeliveryType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Package, MapPin, Info, Phone, ArrowRight, ShieldCheck, ShoppingBag, X, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function RequestDelivery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'form' | 'tracking' | 'success'>('form');
  const [type, setType] = useState<DeliveryType>('send_item');
  const [isLoading, setIsLoading] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState<{message: string, time: string}[]>([]);

  // Load live updates for active order
  useEffect(() => {
    if (step === 'tracking') {
      const fetchUpdates = () => {
        const allKeys = Object.keys(localStorage);
        const updateKey = allKeys.find(k => k.startsWith('live_updates_'));
        if (updateKey) {
          const updates = JSON.parse(localStorage.getItem(updateKey) || '[]');
          setLiveUpdates(updates);
        }
      };

      fetchUpdates();
      const interval = setInterval(fetchUpdates, 5000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const [formData, setFormData] = useState({
    pickup_location: '',
    drop_location: '',
    item_description: '',
    contact_details: '',
    use_proxy: false,
  });

  // Mock tracking status
  const trackingStatuses = [
    { status: 'Request Accepted', time: '5 mins ago', icon: CheckCircle2, current: false },
    { status: 'Runner picking up', time: 'Just now', icon: Package, current: true },
    { status: 'In Transit', time: 'Pending', icon: Navigation, current: false },
    { status: 'Delivered', time: 'Pending', icon: MapPin, current: false },
  ];

  useEffect(() => {
    const savedStep = searchParams.get('step');
    if (savedStep === 'tracking') {
      setStep('tracking');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate(`/auth?redirect=${encodeURIComponent('/request')}`);

    setIsLoading(true);
    try {
      const proxy_code = formData.use_proxy ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined;
      const fee = 1500; // Flat fee for demo

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

      setStep('tracking');
    } catch (error) {
      console.error(error);
      alert('Failed to post request');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'tracking') {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-apple-gray-50 rounded-full text-sm font-bold text-apple-gray-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-gray-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-apple-gray-500"></span>
              </span>
              Courier In Progress
            </div>
            <h1 className="text-5xl font-black text-apple-gray-500 tracking-tighter">Track Your Send</h1>
            <p className="text-apple-gray-300 font-bold text-lg italic">Your runner is moving your item across campus.</p>
          </div>

          <div className="bg-apple-gray-50 rounded-[3rem] p-10 sm:p-16 space-y-12 shadow-sm">
            {/* Live Status Updates */}
            {liveUpdates.length > 0 && (
              <div className="mb-12 space-y-4 border-b border-apple-gray-100 pb-12">
                <div className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-2">Live Runner Activity</div>
                <div className="space-y-3">
                  {liveUpdates.map((upd, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx} 
                      className="bg-white p-5 rounded-[1.5rem] border border-apple-gray-100 flex justify-between items-center shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-black text-apple-gray-500 text-lg">{upd.message}</span>
                      </div>
                      <span className="text-[10px] font-black text-apple-gray-200 uppercase tracking-widest">{upd.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {trackingStatuses.map((status, i) => (
              <div key={i} className="flex gap-8 relative">
                {i !== trackingStatuses.length - 1 && (
                  <div className={cn(
                    "absolute left-8 top-16 bottom-0 w-0.5 -translate-x-1/2",
                    status.current ? "bg-apple-gray-200" : "bg-apple-gray-100"
                  )} />
                )}
                <div className={cn(
                  "w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                  status.current ? "bg-apple-gray-500 text-white scale-110 shadow-2xl" : 
                  status.time !== 'Pending' ? "bg-apple-gray-100 text-apple-gray-300" : "bg-white text-apple-gray-100 border-2 border-apple-gray-50"
                )}>
                  <status.icon className="w-8 h-8" />
                </div>
                <div className="pt-3">
                  <h3 className={cn("text-xl font-black", status.current ? "text-apple-gray-500" : "text-apple-gray-300")}>
                    {status.status}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-bold text-apple-gray-200 uppercase tracking-widest mt-1">
                    <Clock className="w-4 h-4" />
                    {status.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-apple-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-apple-gray-200 uppercase text-[10px] font-black tracking-widest">
                <Navigation className="w-4 h-4" /> Route
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-apple-gray-200" />
                  <p className="font-bold text-apple-gray-300 text-sm">{formData.pickup_location || 'Pickup Point'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-apple-gray-500" />
                  <p className="font-black text-apple-gray-500 text-lg">{formData.drop_location || 'Destination'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-apple-gray-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-apple-gray-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  SA
                </div>
                <div>
                  <p className="text-xs font-black text-apple-gray-200 uppercase tracking-wider">Your Runner</p>
                  <h4 className="font-black text-apple-gray-500 text-lg leading-none mt-1">Samson A.</h4>
                </div>
              </div>
              <button className="px-6 py-4 bg-apple-gray-50 text-apple-gray-500 rounded-2xl font-black hover:bg-apple-gray-100 transition-colors shadow-sm">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Pick’em</h1>
          <p className="text-2xl font-bold text-apple-gray-300">Move anything across campus, instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="bg-apple-gray-50 p-10 sm:p-12 rounded-[3.5rem] space-y-10 shadow-sm border border-apple-gray-100">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Pickup Point
                </label>
                <input
                  type="text" required
                  placeholder="Where should the runner meet you?"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                  className="w-full bg-white border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 placeholder:text-apple-gray-200 shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-apple-gray-500" /> Destination
                </label>
                <input
                  type="text" required
                  placeholder="Where is the item going?"
                  value={formData.drop_location}
                  onChange={(e) => setFormData({ ...formData, drop_location: e.target.value })}
                  className="w-full bg-white border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 placeholder:text-apple-gray-200 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                <Info className="w-4 h-4" /> Item Details
              </label>
              <textarea
                required
                placeholder="What are we moving? (e.g. Blue backpack, 2 packs of Indomie)"
                value={formData.item_description}
                onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                className="w-full bg-white border-none rounded-[2.5rem] py-6 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 placeholder:text-apple-gray-200 shadow-sm min-h-[120px]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Recipient Phone
              </label>
              <input
                type="tel" required
                placeholder="080 0000 0000"
                value={formData.contact_details}
                onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                className="w-full bg-white border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 placeholder:text-apple-gray-200 shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-10 bg-apple-gray-500 rounded-[3rem] text-white gap-8 shadow-2xl">
            <div className="text-center sm:text-left space-y-1">
              <div className="text-[10px] text-apple-gray-200 uppercase font-black tracking-widest opacity-80">Estimated Service Fee</div>
              <div className="text-5xl font-black tracking-tighter">₦1,500</div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-white text-apple-gray-500 px-12 py-6 rounded-2xl font-black text-xl hover:bg-apple-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
            >
              {isLoading ? "Posting..." : "Confirm Request"}
              {!isLoading && <ArrowRight className="w-6 h-6" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
