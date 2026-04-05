import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Package, ShieldCheck, ShoppingBag, Store } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const features = [
    {
      icon: Package,
      title: 'Send Items',
      description: 'Send packages, food, notes, or chargers anywhere across campus.',
      color: 'bg-apple-gray-50 text-apple-gray-500',
    },
    {
      icon: ShoppingBag,
      title: 'Buy & Deliver',
      description: 'Request runners to purchase items and bring them to you.',
      color: 'bg-apple-gray-50 text-apple-gray-500',
    },
    {
      icon: ShieldCheck,
      title: 'Proxy Pickup',
      description: "Generate a pickup code and let Pick'em receive items for you.",
      color: 'bg-apple-gray-50 text-apple-gray-500',
    },
    {
      icon: Store,
      title: 'Business Delivery',
      description: 'Campus businesses can deliver products to students easily.',
      color: 'bg-apple-gray-50 text-apple-gray-500',
    },
  ];

  const steps = [
    {
      title: 'Request',
      description: 'Enter your pickup and delivery location in the app.',
    },
    {
      title: 'Accept',
      description: 'A nearby trusted runner accepts your delivery job.',
    },
    {
      title: 'Deliver',
      description: 'The runner collects the item and delivers it to you.',
    },
  ];

  return (
    <div className="overflow-x-clip bg-white">
      <section className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden bg-white px-5 pb-12 pt-16 sm:min-h-[85vh] sm:px-6 sm:pt-24">
        <div className="z-10 mx-auto w-full max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-apple-gray-50 px-4 py-1.5 text-[12px] font-semibold text-apple-gray-300 sm:mb-8 sm:text-[13px]"
          >
            <span className="text-brand-600">New</span> Active on 12 Campuses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-apple-gray-500 sm:mb-8 sm:text-6xl md:text-8xl"
          >
            Move anything across <br className="hidden sm:block" />
            <span className="text-apple-gray-300">campus, instantly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-10 max-w-2xl px-1 text-base font-medium leading-relaxed text-apple-gray-300 sm:mb-12 sm:px-0 sm:text-xl md:text-2xl"
          >
            Send packages, collect items, and deliver goods across campus using Pick&apos;em&apos;s network of trusted runners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto flex w-full max-w-md flex-col justify-center gap-4 sm:max-w-none sm:flex-row sm:gap-6"
          >
            <Link
              to="/request"
              className="w-full rounded-full bg-brand-500 px-8 py-4 text-center text-base font-semibold text-white shadow-sm shadow-brand-500/20 transition-colors hover:bg-brand-600 sm:w-auto sm:px-10 sm:text-lg"
            >
              Send Something
            </Link>
            <Link
              to="/become-runner"
              className="w-full rounded-full border-2 border-brand-500 bg-white px-8 py-4 text-center text-base font-semibold text-brand-700 shadow-sm transition-all hover:bg-brand-50 sm:w-auto sm:px-10 sm:text-lg"
            >
              Become a Runner
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-12 w-full max-w-6xl px-0 sm:mt-20 sm:px-6"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-apple-gray-100 shadow-2xl sm:rounded-[3rem]">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000"
              alt="Campus Life"
              className="aspect-[4/3] h-auto w-full object-cover sm:aspect-[21/9]"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-40">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 transition-all hover:shadow-xl sm:rounded-[3rem] sm:p-12"
            >
              <div className={cn('mb-8 flex h-12 w-12 items-center justify-center rounded-2xl sm:mb-10 sm:h-14 sm:w-14', feature.color)}>
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">{feature.title}</h3>
              <p className="text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-apple-gray-50 py-20 sm:py-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 sm:gap-24 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-600 sm:mb-6 sm:text-sm">New Service</div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight sm:mb-8 sm:text-5xl md:text-6xl">
                Buy & Deliver. <br /> We&apos;ve got you.
              </h2>
              <p className="mb-8 text-lg font-medium leading-relaxed text-apple-gray-300 sm:mb-12 sm:text-xl">
                Can&apos;t leave your room? Need something from the campus store? Request a runner to shop for you and deliver it instantly.
              </p>
              <Link
                to="/buy-and-deliver"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-8 py-4 text-lg font-semibold text-white shadow-sm shadow-brand-500/20 transition-colors hover:bg-brand-600 sm:w-auto"
              >
                Explore Buy & Deliver <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="order-first lg:order-last">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000"
                alt="Shopping"
                className="w-full rounded-[2rem] shadow-2xl sm:rounded-[3rem]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-6 sm:py-40">
        <h2 className="mb-16 text-3xl font-bold tracking-tight sm:mb-24 sm:text-4xl md:text-5xl">Simple. Fast. Secure.</h2>
        <div className="grid grid-cols-1 gap-16 sm:gap-20 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="relative mx-auto w-full max-w-sm px-2">
              <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 text-6xl font-bold text-apple-gray-100 opacity-50 sm:-top-20 sm:text-9xl">
                {i + 1}
              </div>
              <h3 className="mb-4 text-xl font-bold sm:text-2xl">{step.title}</h3>
              <p className="mx-auto max-w-xs text-base font-medium text-apple-gray-300 sm:text-lg">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
