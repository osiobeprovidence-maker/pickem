import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Clock, X, Info, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProxyTimerData {
  id: string;
  item_description: string;
  proxy_code: string;
  drop_location: string;
  expires_at: number;
}

export default function FloatingProxyTimer() {
  const [activeProxy, setActiveProxy] = useState<ProxyTimerData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const checkProxy = () => {
      const stored = localStorage.getItem('active_proxy');
      if (stored) {
        const data: ProxyTimerData = JSON.parse(stored);
        const now = Date.now();
        if (data.expires_at > now) {
          setActiveProxy(data);
          setTimeLeft(Math.floor((data.expires_at - now) / 1000));
        } else {
          // Timer expired
          completeProxy(data);
        }
      } else {
        setActiveProxy(null);
      }
    };

    checkProxy();
    const interval = setInterval(checkProxy, 1000);
    return () => clearInterval(interval);
  }, []);

  const completeProxy = (data: ProxyTimerData) => {
    // Add to activity log
    const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    const newActivity = {
      id: crypto.randomUUID(),
      type: 'proxy_completed',
      title: 'Proxy Handover Finished',
      description: `Successfully received: ${data.item_description}`,
      time: new Date().toISOString(),
      details: data
    };
    localStorage.setItem('user_activities', JSON.stringify([newActivity, ...activities]));
    
    // Clear active proxy
    localStorage.removeItem('active_proxy');
    setActiveProxy(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeProxy) return null;

  return (
    <div className="fixed bottom-10 left-10 z-[100]">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="relative group"
      >
        {/* Glowing Background Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        
        <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-apple-gray-50 flex items-center gap-6 min-w-[320px]">
          {/* Timer Circle */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-apple-gray-50"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={175.9}
                strokeDashoffset={175.9 * (1 - timeLeft / 300)} // Assuming 5 min initial timer for demo
                className="text-emerald-500 transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-black text-apple-gray-500">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex-grow space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-apple-gray-300">Active Proxy</span>
            </div>
            <h4 className="font-black text-apple-gray-500 leading-tight truncate max-w-[180px]">
              {activeProxy.item_description}
            </h4>
            <div className="flex items-center gap-2 text-xs font-bold text-apple-gray-200">
              <span className="bg-apple-gray-50 px-2 py-0.5 rounded-lg border border-apple-gray-100">
                Code: {activeProxy.proxy_code}
              </span>
            </div>
          </div>

          <button 
            onClick={() => completeProxy(activeProxy)}
            className="p-2 bg-apple-gray-50 rounded-full text-apple-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}