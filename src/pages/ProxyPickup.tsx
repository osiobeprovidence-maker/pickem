import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Package, Clock, Smartphone, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProxyPickup() {
  const { user } = useAuth();
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-apple-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-8 sm:mb-10 shadow-xl"
          >
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-apple-gray-500 mb-6 sm:mb-8 leading-[1.1]"
          >
            Pick’em Proxy. <br /> Secure by design.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-apple-gray-300 max-w-2xl mx-auto mb-10 sm:mb-12 font-medium leading-relaxed"
          >
            Never miss a delivery again. Our secure proxy service receives your packages when you're in class or away.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <Link
              to="/proxy-request"
              className="bg-apple-gray-500 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-2xl"
            >
              Start Proxy Pickup <ArrowRight className="w-6 h-6" />
            </Link>
            
            {!user && (
              <p className="text-sm font-bold text-apple-gray-200">
                Already have a code? <Link to="/auth" className="text-apple-gray-500 hover:underline">Sign in to track</Link>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-10 sm:p-16 bg-apple-gray-50 rounded-[3.5rem] border border-apple-gray-100 shadow-sm space-y-12"
        >
          <h2 className="text-4xl font-black text-apple-gray-500 tracking-tighter">How it works</h2>
          <div className="space-y-10">
            {[
              { icon: Smartphone, title: "1. Provide Details", desc: "Tell us what to pick up, where, and who to contact." },
              { icon: ShieldCheck, title: "2. Secure Code", desc: "We generate a unique code for you to use during the final handover." },
              { icon: Clock, title: "3. Flexible Return", desc: "Set a time and place for the runner to bring your item back safely." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <item.icon className="w-6 h-6 text-apple-gray-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-apple-gray-500 mb-2">{item.title}</h3>
                  <p className="text-apple-gray-300 text-lg font-bold leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3.5rem] overflow-hidden shadow-2xl min-h-[500px]"
        >
          <img 
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000" 
            alt="Secure" 
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-apple-gray-500/90 to-transparent flex flex-col justify-end p-12 space-y-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-3xl font-black leading-tight tracking-tighter">Your items, secured by community trust and modern encryption.</p>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto bg-apple-gray-500 rounded-[4rem] p-16 md:p-24 text-white text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-110 transition-transform">
            <Package className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Don't let your schedule <br /> stop your deliveries.</h2>
            <Link
              to="/proxy-request"
              className="inline-flex items-center gap-3 bg-white text-apple-gray-500 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-apple-gray-50 transition-all shadow-2xl"
            >
              Try Proxy Pickup <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
