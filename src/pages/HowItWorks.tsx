import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, MapPin, Package, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "Set Your Locations",
      description: "Tell us where the item is and where it needs to go. Our smart mapping handles the rest.",
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000"
    },
    {
      icon: Package,
      title: "Runner Picks Up",
      description: "A verified student runner near the pickup point accepts your request and collects the item.",
      image: "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=1000"
    },
    {
      icon: Truck,
      title: "Safe Delivery",
      description: "Track your runner in real-time as they navigate campus to deliver your item safely.",
      image: "https://images.unsplash.com/photo-1510511459019-5dee99c48db8?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-apple-gray-50 rounded-full text-[13px] font-semibold text-apple-gray-300 mb-6"
          >
            The Process
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-apple-gray-500 mb-8"
          >
            How Pick’em <br /> works.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-apple-gray-300 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            We've simplified campus logistics into three easy steps. No cars, no traffic, just students helping students.
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto space-y-40">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center`}
          >
            <div className="flex-1 space-y-8">
              <div className="w-16 h-16 bg-apple-gray-50 rounded-2xl flex items-center justify-center">
                <step.icon className="w-8 h-8 text-apple-gray-500" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{step.title}</h2>
              <p className="text-xl text-apple-gray-300 leading-relaxed font-medium">{step.description}</p>
            </div>
            <div className="flex-1">
              <img 
                src={step.image} 
                alt={step.title} 
                className="rounded-[3rem] shadow-2xl w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto bg-apple-gray-500 rounded-[3rem] p-12 md:p-24 text-white text-center relative overflow-hidden">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 relative z-10">Ready to try it out?</h2>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-white text-apple-gray-500 px-10 py-4 rounded-full font-bold text-lg hover:bg-apple-gray-50 transition-colors relative z-10"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
