import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Package, Clock, Smartphone, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProxyPickup() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <section className="px-5 pb-12 pt-24 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-apple-gray-500 shadow-xl sm:mb-10 sm:h-20 sm:w-20"
          >
            <ShieldCheck className="h-8 w-8 text-white sm:h-10 sm:w-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-apple-gray-500 sm:mb-8 sm:text-5xl md:text-7xl"
          >
            Pick&apos;em Proxy. <br /> Secure by design.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-apple-gray-300 sm:mb-12 sm:text-xl md:text-2xl"
          >
            Never miss a delivery again. Our secure proxy service receives your packages when you&apos;re in class or away.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            {user ? (
              <Link
                to="/proxy-request"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-8 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
              >
                <LayoutDashboard className="h-5 w-5" /> Create Proxy Request
              </Link>
            ) : (
              <div className="inline-flex w-full flex-col items-center gap-4 rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 px-5 py-4 sm:w-auto sm:flex-row sm:rounded-full sm:px-6 sm:py-2">
                <span className="text-lg font-bold tracking-widest text-apple-gray-500 sm:text-base">PKM-XXXXXX</span>
                <Link
                  to="/auth"
                  className="w-full rounded-full bg-apple-gray-500 px-8 py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:py-2"
                >
                  Generate Code
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="bg-apple-gray-50 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 sm:gap-12 sm:px-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm sm:space-y-10 sm:rounded-[3rem] sm:p-12"
          >
            <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
            <div className="space-y-8 sm:space-y-10">
              {[
                { icon: Smartphone, title: 'Generate Code', desc: "Create a unique verification code in the Pick'em app." },
                { icon: Package, title: 'Authorize Runner', desc: 'Share the code with a runner to authorize them to pick up your item.' },
                { icon: Clock, title: 'Flexible Delivery', desc: "The runner holds your item securely until you're ready to receive it." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 sm:gap-6">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-apple-gray-50 sm:h-12 sm:w-12">
                    <item.icon className="h-5 w-5 text-apple-gray-500 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold sm:text-xl">{item.title}</h3>
                    <p className="text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative min-h-[360px] overflow-hidden rounded-[2rem] shadow-2xl sm:min-h-[500px] sm:rounded-[3rem]"
          >
            <img
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000"
              alt="Secure"
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-apple-gray-500/80 to-transparent p-8 sm:p-12">
              <p className="text-xl font-bold leading-tight text-white sm:text-2xl">Your items, secured by community trust and modern encryption.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 sm:py-32">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-apple-gray-500 p-8 text-center text-white sm:rounded-[3rem] sm:p-12 md:p-24">
          <h2 className="relative z-10 mb-8 text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">Don&apos;t let your schedule <br /> stop your deliveries.</h2>
          <Link
            to="/auth"
            className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 sm:w-auto sm:px-10"
          >
            Try Proxy Pickup <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
