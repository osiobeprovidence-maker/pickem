import React from 'react';
import { motion } from 'motion/react';
import { Zap, DollarSign, Clock, Smartphone, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BecomeRunner() {
  const { user } = useAuth();
  const perks = [
    {
      icon: DollarSign,
      title: "Earn on Your Terms",
      description: "Set your own schedule and earn money for every delivery you complete. No minimum hours."
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work between classes, in the evenings, or on weekends. You are in total control."
    },
    {
      icon: Zap,
      title: "Fast Payouts",
      description: "Get paid quickly for your hard work. Track your earnings in real-time through the app."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-apple-gray-50 rounded-full text-[12px] sm:text-[13px] font-semibold text-apple-gray-300 mb-6"
          >
            Join the Fleet
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-apple-gray-500 mb-6 sm:mb-8 leading-[1.1]"
          >
            Earn money <br /> while you walk.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-apple-gray-300 max-w-2xl mx-auto mb-10 sm:mb-12 font-medium leading-relaxed"
          >
            Turn your walks across campus into a source of income. Become a Pick’em runner and help your community.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {user?.role === 'runner' ? (
              <Link
                to="/dashboard"
                className="bg-apple-gray-500 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-full font-semibold text-lg sm:text-xl hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 max-w-sm mx-auto"
              >
                <LayoutDashboard className="w-6 h-6" /> Runner Dashboard
              </Link>
            ) : (
              <Link
                to="/auth?role=runner"
                className="bg-apple-gray-500 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-full font-semibold text-lg sm:text-xl hover:opacity-90 transition-opacity shadow-sm inline-block w-full sm:w-auto"
              >
                Apply to Run
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="py-16 sm:py-24 bg-apple-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {perks.map((perk, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 sm:p-12 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-apple-gray-100 shadow-sm hover:shadow-xl transition-all text-center"
              >
                <div className="w-12 h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <perk.icon className="w-6 h-6 text-apple-gray-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">{perk.title}</h3>
                <p className="text-apple-gray-300 text-base sm:text-lg leading-relaxed font-medium">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto bg-apple-gray-500 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center overflow-hidden relative">
          <div className="space-y-8 sm:space-y-10 relative z-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight">All you need is a phone and a smile.</h2>
            <ul className="space-y-4 sm:space-y-6 text-left inline-block lg:block">
              {[
                "Must be a registered student",
                "Valid campus ID required",
                "Smartphone with internet access",
                "Friendly and reliable attitude"
              ].map((req, i) => (
                <li key={i} className="flex items-center gap-4 sm:gap-6 text-lg sm:text-xl font-light text-apple-gray-200">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  {req}
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link
                to="/auth?role=runner"
                className="inline-flex items-center gap-2 bg-white text-apple-gray-500 px-10 py-4 rounded-full font-bold text-lg hover:bg-apple-gray-50 transition-colors"
              >
                Start Earning <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="relative z-10 w-full">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000" 
              alt="App" 
              className="rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
