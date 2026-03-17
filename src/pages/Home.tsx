import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Package,
  ShoppingBag,
  ShieldCheck,
  Store,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const features = [
    {
      icon: Package,
      title: "Send Items",
      description: "Send packages, food, notes, or chargers anywhere across campus.",
      color: "bg-apple-gray-50 text-apple-gray-500"
    },
    {
      icon: ShoppingBag,
      title: "Buy & Deliver",
      description: "Request runners to purchase items and bring them to you.",
      color: "bg-apple-gray-50 text-apple-gray-500"
    },
    {
      icon: ShieldCheck,
      title: "Proxy Pickup",
      description: "Generate a pickup code and let Pick'em receive items for you.",
      color: "bg-apple-gray-50 text-apple-gray-500"
    },
    {
      icon: Store,
      title: "Business Delivery",
      description: "Campus businesses can deliver products to students easily.",
      color: "bg-apple-gray-50 text-apple-gray-500"
    }
  ];

  const steps = [
    {
      title: "Request",
      description: "Enter your pickup and delivery location in the app."
    },
    {
      title: "Accept",
      description: "A nearby trusted runner accepts your delivery job."
    },
    {
      title: "Deliver",
      description: "The runner collects the item and delivers it to you."
    }
  ];

  return (
    <div className="w-full bg-white flex flex-col">
      {/* Hero Section */}
      <section className="w-full block relative pt-12 pb-8 overflow-hidden bg-white">
        <div className="w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-apple-gray-50 rounded-full text-[11px] font-semibold text-apple-gray-300 mb-4 w-full"
          >
            <span className="text-blue-500">New</span> Active on 12 Campuses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-apple-gray-500 mb-4 leading-[1.15]"
          >
            Move anything across <br />
            <span className="text-apple-gray-300">campus, instantly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-apple-gray-300 mb-8 leading-relaxed font-medium"
          >
            Send packages, collect items, and deliver goods across campus using Pick'em's network of trusted runners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3 w-full"
          >
            <Link
              to="/request"
              className="w-full bg-apple-gray-500 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-opacity shadow-sm text-center"
            >
              Send Something
            </Link>
            <Link
              to="/become-runner"
              className="w-full bg-white text-apple-gray-500 border-2 border-apple-gray-500 px-8 py-3.5 rounded-full font-semibold text-base hover:bg-apple-gray-50 transition-all shadow-sm text-center"
            >
              Become a Runner
            </Link>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 w-full block"
        >
          <div className="w-full relative rounded-[16px] overflow-hidden shadow-xl border border-apple-gray-100">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
              alt="Campus Life"
              crossOrigin="anonymous"
              className="w-full h-auto object-cover aspect-[4/3] block rounded-[16px]"
              loading="eager"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="w-full block py-12 bg-white">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 gap-4 w-full">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 bg-apple-gray-50 rounded-3xl border border-apple-gray-100 hover:shadow-lg transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight block"> {feature.title}</h3>
                <p className="text-apple-gray-300 text-sm leading-relaxed font-medium block">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase - Buy & Deliver */}
      <section className="w-full block py-12 bg-apple-gray-50 -mx-4 px-4">
        <div className="w-full mx-auto">
          <div className="w-full flex flex-col gap-8">
            <div className="text-center">
              <div className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3">New Service</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Buy & Deliver. <br /> We've got you.</h2>
              <p className="text-apple-gray-300 text-base mb-6 leading-relaxed font-medium">
                Can't leave your room? Need something from the campus store? Request a runner to shop for you and deliver it instantly.
              </p>
              <Link
                to="/buy-and-deliver"
                className="block w-full bg-apple-gray-500 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-opacity text-center mt-4"
              >
                Explore Buy & Deliver <ArrowRight className="inline w-5 h-5 ml-2 align-middle" />
              </Link>
            </div>
            <div className="w-full relative">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000"
                alt="Shopping"
                crossOrigin="anonymous"
                className="w-full h-auto object-cover rounded-[16px] shadow-xl block"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="w-full block py-12 bg-white">
        <div className="w-full mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-12 block">Simple. Fast. Secure.</h2>
          <div className="w-full flex flex-col gap-12">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-apple-gray-100 font-bold text-6xl absolute -top-8 left-1/2 -translate-x-1/2 -z-10 opacity-50">{i + 1}</div>
                <h3 className="text-lg font-bold mb-2 pt-4 block">{step.title}</h3>
                <p className="text-apple-gray-300 text-sm font-medium block">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
