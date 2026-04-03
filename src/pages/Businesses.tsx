import React from 'react';
import { motion } from 'motion/react';
import { Store, TrendingUp, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Businesses() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Sales",
      description: "Reach students who can't leave their dorms or classes. Expand your delivery radius instantly."
    },
    {
      icon: Users,
      title: "No Hiring Needed",
      description: "Access our network of hundreds of student runners. No need to manage your own delivery staff."
    },
    {
      icon: ShieldCheck,
      title: "Secure Transactions",
      description: "Every delivery is tracked and verified. We handle the logistics so you can focus on your products."
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
            Partnerships
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-apple-gray-500 mb-6 sm:mb-8 leading-[1.1]"
          >
            Grow your campus <br /> presence.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-apple-gray-300 max-w-2xl mx-auto mb-10 sm:mb-12 font-medium leading-relaxed"
          >
            The delivery infrastructure for campus businesses. Connect with students through our trusted runner network.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/auth?role=business"
              className="bg-apple-gray-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-sm inline-block w-full sm:w-auto"
            >
              Register Your Business
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 bg-apple-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 sm:p-12 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-apple-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center mb-6 sm:mb-8">
                  <benefit.icon className="w-6 h-6 text-apple-gray-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-apple-gray-300 text-base sm:text-lg leading-relaxed font-medium">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto bg-apple-gray-500 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-white flex flex-col md:flex-row items-center gap-12 sm:gap-16 overflow-hidden relative">
          <div className="flex-1 space-y-6 sm:space-y-8 relative z-10 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight">Ready to start delivering?</h2>
            <p className="text-apple-gray-200 text-lg sm:text-xl font-light">Join 100+ campus businesses already using Pick’em to scale their operations.</p>
            <Link
              to="/auth?role=business"
              className="inline-flex items-center gap-2 bg-white text-apple-gray-500 px-10 py-4 rounded-full font-bold text-lg hover:bg-apple-gray-50 transition-colors"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex-1 relative z-10 w-full">
            <img 
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000" 
              alt="Partner" 
              className="rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
