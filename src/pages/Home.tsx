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
      <section className="w-full block relative pt-12 sm:pt-20 pb-8 overflow-hidden bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-apple-gray-50 rounded-full text-[12px] font-semibold text-apple-gray-300"
                >
                  <span className="text-blue-500">New</span> Active on 12 Campuses
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-apple-gray-500 mb-6 leading-[1.1]"
              >
                Move anything across <span className="text-apple-gray-300">campus, instantly.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg sm:text-xl text-apple-gray-300 mb-10 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0"
              >
                Send packages, collect items, and deliver goods across campus using Pick'em's network of trusted runners.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/request"
                  className="bg-apple-gray-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg text-center min-w-[200px]"
                >
                  Send Something
                </Link>
                <Link
                  to="/become-runner"
                  className="bg-white text-apple-gray-500 border-2 border-apple-gray-500 px-10 py-4 rounded-full font-semibold text-lg hover:bg-apple-gray-50 transition-all shadow-sm text-center min-w-[200px]"
                >
                  Become a Runner
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 w-full"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-apple-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
                  alt="Campus Life"
                  crossOrigin="anonymous"
                  className="w-full h-auto object-cover aspect-[4/3]"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full block py-12 sm:py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-8 bg-apple-gray-50 rounded-[2rem] border border-apple-gray-100 hover:shadow-xl transition-all group"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight"> {feature.title}</h3>
                <p className="text-apple-gray-300 text-base leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase - Buy & Deliver */}
      <section className="w-full block py-16 sm:py-24 bg-apple-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
              <div className="text-blue-600 text-[12px] font-bold uppercase tracking-[0.2em] mb-4">New Service</div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Buy & Deliver. <br /> We've got you.</h2>
              <p className="text-apple-gray-300 text-lg sm:text-xl mb-10 leading-relaxed font-medium">
                Can't leave your room? Need something from the campus store? Request a runner to shop for you and deliver it instantly.
              </p>
              <Link
                to="/buy-and-deliver"
                className="inline-flex items-center justify-center bg-apple-gray-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity gap-2 shadow-lg"
              >
                Explore Buy & Deliver <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white">
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000"
                  alt="Shopping"
                  crossOrigin="anonymous"
                  className="w-full h-auto object-cover aspect-video"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="w-full block py-20 sm:py-32 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-20">Simple. Fast. Secure.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="text-apple-gray-100/50 font-bold text-8xl md:text-9xl absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 -z-10 transition-transform group-hover:scale-110 duration-500">{i + 1}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 pt-4">{step.title}</h3>
                <p className="text-apple-gray-300 text-base sm:text-lg font-medium max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
