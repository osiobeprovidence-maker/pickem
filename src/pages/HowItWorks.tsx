import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Package, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: 'Set Your Locations',
      description: 'Tell us where the item is and where it needs to go. Our smart mapping handles the rest.',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000',
    },
    {
      icon: Package,
      title: 'Runner Picks Up',
      description: 'A verified student runner near the pickup point accepts your request and collects the item.',
      image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=1000',
    },
    {
      icon: Truck,
      title: 'Safe Delivery',
      description: 'Track your runner in real-time as they navigate campus to deliver your item safely.',
      image: 'https://images.unsplash.com/photo-1510511459019-5dee99c48db8?auto=format&fit=crop&q=80&w=1000',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <section className="px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-block rounded-full bg-apple-gray-50 px-4 py-1.5 text-[13px] font-semibold text-apple-gray-300"
          >
            The Process
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-apple-gray-500 sm:mb-8 sm:text-5xl md:text-7xl"
          >
            How Pick&apos;em <br /> works.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-apple-gray-300 sm:text-xl md:text-2xl"
          >
            We&apos;ve simplified campus logistics into three easy steps. No cars, no traffic, just students helping students.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-20 px-5 py-20 sm:space-y-32 sm:px-6 sm:py-24">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 sm:gap-16 md:gap-20`}
          >
            <div className="flex-1 space-y-6 text-center md:space-y-8 md:text-left">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-apple-gray-50 md:mx-0">
                <step.icon className="h-8 w-8 text-apple-gray-500" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{step.title}</h2>
              <p className="text-lg font-medium leading-relaxed text-apple-gray-300 sm:text-xl">{step.description}</p>
            </div>
            <div className="w-full flex-1">
              <img
                src={step.image}
                alt={step.title}
                className="aspect-video w-full rounded-[2rem] object-cover shadow-2xl sm:rounded-[3rem]"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        ))}
      </section>

      <section className="px-5 py-20 sm:px-6 sm:py-32">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-apple-gray-500 p-8 text-center text-white sm:rounded-[3rem] sm:p-12 md:p-24">
          <h2 className="relative z-10 mb-8 text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">Ready to try it out?</h2>
          <Link
            to="/auth"
            className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 sm:w-auto sm:px-10"
          >
            Get Started Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
