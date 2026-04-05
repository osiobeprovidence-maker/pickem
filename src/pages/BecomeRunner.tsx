import React from 'react';
import { motion } from 'motion/react';
import { Zap, DollarSign, Clock, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BecomeRunner() {
  const { user } = useAuth();
  const perks = [
    {
      icon: DollarSign,
      title: 'Earn on Your Terms',
      description: 'Set your own schedule and earn money for every delivery you complete. No minimum hours.',
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Work between classes, in the evenings, or on weekends. You are in total control.',
    },
    {
      icon: Zap,
      title: 'Fast Payouts',
      description: 'Get paid quickly for your hard work. Track your earnings in real-time through the app.',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <section className="px-5 pb-12 pt-24 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-semibold text-brand-700 sm:text-[13px]"
          >
            Join the Fleet
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-apple-gray-500 sm:mb-8 sm:text-5xl md:text-7xl"
          >
            Earn money <br /> while you walk.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-apple-gray-300 sm:mb-12 sm:text-xl md:text-2xl"
          >
            Turn your walks across campus into a source of income. Become a Pick&apos;em runner and help your community.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {user?.role === 'runner' ? (
              <Link
                to="/dashboard"
                className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-8 py-4 text-lg font-semibold text-white shadow-sm shadow-brand-500/10 transition-colors hover:bg-black sm:px-12 sm:py-5 sm:text-xl"
              >
                <LayoutDashboard className="h-6 w-6" /> Runner Dashboard
              </Link>
            ) : (
              <Link
                to="/auth?role=runner"
                className="inline-block w-full rounded-full bg-apple-gray-500 px-8 py-4 text-center text-lg font-semibold text-white shadow-sm shadow-brand-500/10 transition-colors hover:bg-black sm:w-auto sm:px-12 sm:py-5 sm:text-xl"
              >
                Apply to Run
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      <section className="bg-apple-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[2rem] border border-apple-gray-100 bg-white p-8 text-center shadow-sm transition-all hover:shadow-xl sm:rounded-[2.5rem] sm:p-12"
              >
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 sm:mb-8">
                  <perk.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold sm:text-2xl">{perk.title}</h3>
                <p className="text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 sm:py-32">
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 overflow-hidden rounded-[2rem] bg-brand-500 p-8 text-white sm:gap-20 sm:rounded-[3rem] sm:p-12 md:p-24 lg:grid-cols-2">
          <div className="relative z-10 space-y-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">All you need is a phone and a smile.</h2>
            <ul className="inline-block space-y-4 text-left sm:space-y-6 lg:block">
              {[
                'Must be a registered student',
                'Valid campus ID required',
                'Smartphone with internet access',
                'Friendly and reliable attitude',
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-4 text-lg font-light text-apple-gray-200 sm:gap-6 sm:text-xl">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 sm:h-6 sm:w-6">
                    <Zap className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                  </div>
                  {req}
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link
                to="/auth?role=runner"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-brand-700 transition-colors hover:bg-brand-50 sm:w-auto sm:px-10"
              >
                Start Earning <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="relative z-10 w-full">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000"
              alt="App"
              className="w-full rounded-[1.5rem] shadow-2xl sm:rounded-[2rem]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
