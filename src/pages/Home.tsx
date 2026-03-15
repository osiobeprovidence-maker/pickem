import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Package, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  MapPin, 
  Store, 
  Users, 
  Clock, 
  ShoppingBag, 
  CheckCircle2,
  Smartphone,
  ChevronRight,
  DollarSign
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
      description: "Generate a pickup code and let Pick’em receive items for you.",
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
    <div className="-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-12 px-4 overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-apple-gray-50 rounded-full text-[12px] sm:text-[13px] font-semibold text-apple-gray-300 mb-6 sm:mb-8"
          >
            <span className="text-blue-500">New</span> Active on 12 Campuses
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-apple-gray-500 mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.05]"
          >
            Move anything across <br />
            <span className="text-apple-gray-300">campus, instantly.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl md:text-2xl text-apple-gray-300 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4 sm:px-0"
          >
            Send packages, collect items, and deliver goods across campus using Pick’em’s network of trusted runners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4"
          >
            <Link
              to="/request"
              className="bg-apple-gray-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-sm text-center"
            >
              Send Something
            </Link>
            <Link
              to="/become-runner"
              className="bg-white text-apple-gray-500 border-2 border-apple-gray-500 px-10 py-4 rounded-full font-semibold text-lg hover:bg-apple-gray-50 transition-all shadow-sm text-center"
            >
              Become a Runner
            </Link>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-12 sm:mt-20 w-full max-w-6xl px-4 sm:px-6"
        >
          <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-apple-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000" 
              alt="Campus Life" 
              crossOrigin="anonymous"
              className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[21/9]"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-40 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 sm:p-12 bg-apple-gray-50 rounded-[2rem] sm:rounded-[3rem] border border-apple-gray-100 hover:shadow-xl transition-all group"
            >
              <div className={cn("w-12 h-12 sm:w-14 h-14 rounded-2xl flex items-center justify-center mb-8 sm:mb-10", feature.color)}>
                <feature.icon className="w-6 h-6 sm:w-7 h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-apple-gray-300 text-base sm:text-lg leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Showcase - Buy & Deliver */}
      <section className="py-20 sm:py-40 bg-apple-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 items-center">
            <div className="text-center lg:text-left">
              <div className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">New Service</div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 sm:mb-8">Buy & Deliver. <br /> We've got you.</h2>
              <p className="text-apple-gray-300 text-lg sm:text-xl mb-8 sm:mb-12 leading-relaxed font-medium">
                Can't leave your room? Need something from the campus store? Request a runner to shop for you and deliver it instantly.
              </p>
              <Link
                to="/buy-and-deliver"
                className="inline-flex items-center gap-2 bg-apple-gray-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Explore Buy & Deliver <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative order-first lg:order-last">
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000" 
                alt="Shopping" 
                crossOrigin="anonymous"
                className="rounded-[2rem] sm:rounded-[3rem] shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 sm:py-40 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-16 sm:mb-24">Simple. Fast. Secure.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 sm:gap-20">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="text-apple-gray-100 font-bold text-7xl sm:text-9xl absolute -top-12 sm:-top-20 left-1/2 -translate-x-1/2 -z-10 opacity-50">{i + 1}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-apple-gray-300 text-base sm:text-lg font-medium">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


