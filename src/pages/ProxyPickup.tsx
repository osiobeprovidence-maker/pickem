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
            {user ? (
              <Link
                to="/dashboard/proxy"
                className="bg-apple-gray-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <LayoutDashboard className="w-5 h-5" /> Go to Proxy Dashboard
              </Link>
            ) : (
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 bg-apple-gray-50 rounded-[2rem] sm:rounded-full px-6 py-4 sm:py-2 border border-apple-gray-100 w-full sm:w-auto">
                <span className="text-apple-gray-500 font-mono font-bold tracking-widest text-lg sm:text-base">PKM-XXXXXX</span>
                <Link to="/auth" className="bg-apple-gray-500 text-white px-8 py-3 sm:py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity w-full sm:w-auto text-center">Generate Code</Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-16 sm:py-24 bg-apple-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 bg-white rounded-[2rem] sm:rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-8 sm:space-y-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold">How it works</h2>
            <div className="space-y-8 sm:space-y-10">
              {[
                { icon: Smartphone, title: "Generate Code", desc: "Create a unique verification code in the Pick’em app." },
                { icon: Package, title: "Authorize Runner", desc: "Share the code with a runner to authorize them to pick up your item." },
                { icon: Clock, title: "Flexible Delivery", desc: "The runner holds your item securely until you're ready to receive it." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-apple-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-apple-gray-300 text-base sm:text-lg font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl min-h-[400px] sm:min-h-[500px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000" 
              alt="Secure" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-apple-gray-500/80 to-transparent flex items-end p-8 sm:p-12">
              <p className="text-white text-xl sm:text-2xl font-bold leading-tight">Your items, secured by community trust and modern encryption.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-5xl mx-auto bg-apple-gray-500 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-white text-center relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-8 relative z-10">Don't let your schedule <br /> stop your deliveries.</h2>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-white text-apple-gray-500 px-10 py-4 rounded-full font-bold text-lg hover:bg-apple-gray-50 transition-colors relative z-10"
          >
            Try Proxy Pickup <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
