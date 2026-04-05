import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Businesses() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Sales',
      description: "Reach students who can't leave their dorms or classes. Expand your delivery radius instantly.",
    },
    {
      icon: Users,
      title: 'No Hiring Needed',
      description: 'Access our network of hundreds of student runners. No need to manage your own delivery staff.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Transactions',
      description: 'Every delivery is tracked and verified. We handle the logistics so you can focus on your products.',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <section className="px-5 pb-12 pt-24 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-block rounded-full bg-apple-gray-50 px-4 py-1.5 text-[12px] font-semibold text-apple-gray-300 sm:text-[13px]"
          >
            Partnerships
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-apple-gray-500 sm:mb-8 sm:text-5xl md:text-7xl"
          >
            Grow your campus <br /> presence.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-apple-gray-300 sm:mb-12 sm:text-xl md:text-2xl"
          >
            The delivery infrastructure for campus businesses. Connect with students through our trusted runner network.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link
              to="/auth?role=business"
              className="inline-block w-full rounded-full bg-apple-gray-500 px-8 py-4 text-center text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
            >
              Register Your Business
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-apple-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[2rem] border border-apple-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl sm:rounded-[2.5rem] sm:p-12"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-apple-gray-50 sm:mb-8">
                  <benefit.icon className="h-6 w-6 text-apple-gray-500" />
                </div>
                <h3 className="mb-4 text-xl font-bold sm:text-2xl">{benefit.title}</h3>
                <p className="text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 sm:py-32">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 overflow-hidden rounded-[2rem] bg-apple-gray-500 p-8 text-white sm:gap-16 sm:rounded-[3rem] sm:p-12 md:flex-row md:p-24">
          <div className="relative z-10 flex-1 space-y-6 text-center md:text-left sm:space-y-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">Ready to start delivering?</h2>
            <p className="text-lg font-light text-apple-gray-200 sm:text-xl">Join 100+ campus businesses already using Pick&apos;em to scale their operations.</p>
            <Link
              to="/auth?role=business"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 sm:w-auto sm:px-10"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="relative z-10 w-full flex-1">
            <img
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000"
              alt="Partner"
              className="w-full rounded-[1.5rem] shadow-2xl sm:rounded-[2rem]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
