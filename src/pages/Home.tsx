import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Package, ShieldCheck, ShoppingBag, Store, Truck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const features = [
    {
      icon: Package,
      title: 'Send Items',
      description: 'Move packages, food, notes, chargers, and essentials across campus in minutes.',
      tone: 'bg-white text-apple-gray-500',
    },
    {
      icon: ShoppingBag,
      title: 'Buy & Deliver',
      description: 'Send a runner to pick up items from stores, kiosks, or off-campus spots and bring them to you.',
      tone: 'bg-white text-blue-600',
    },
    {
      icon: ShieldCheck,
      title: 'Proxy Pickup',
      description: 'Generate a secure pickup code and let Pick\'em receive parcels or documents on your behalf.',
      tone: 'bg-white text-emerald-600',
    },
    {
      icon: Store,
      title: 'Business Delivery',
      description: 'Help campus vendors fulfill orders quickly with storefronts, dispatch, and customer delivery.',
      tone: 'bg-white text-amber-600',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Request',
      description: 'Choose a service, enter pickup details, and tell us where it needs to go.',
    },
    {
      number: '02',
      title: 'Match',
      description: 'A nearby trusted runner or business flow gets assigned based on the request type.',
    },
    {
      number: '03',
      title: 'Complete',
      description: 'Track the handoff, confirm delivery, and keep moving without leaving your day behind.',
    },
  ];

  return (
    <div className="flex w-full flex-col bg-white">
      <section className="relative overflow-hidden bg-white py-10 md:py-14">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-50/70 to-transparent" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-apple-gray-300 shadow-sm"
            >
              <span className="text-blue-600">New</span>
              Active on 12 Campuses
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-6 max-w-[10ch] text-[3.75rem] font-black leading-[0.96] tracking-[-0.055em] text-apple-gray-500 sm:text-[4.5rem] lg:text-[4.75rem] xl:text-[5.05rem]"
            >
              <span className="block">Move anything</span>
              <span className="mt-3 block text-[0.64em] leading-[1.02] text-apple-gray-300">
                across campus, instantly.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-apple-gray-300 lg:mx-0 lg:text-xl"
            >
              Pick&apos;em connects students, runners, and businesses so deliveries, purchases, and pickups happen fast without the usual campus stress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                to="/request"
                className="inline-flex min-w-[210px] items-center justify-center rounded-full bg-apple-gray-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-apple-gray-500/15 transition-opacity hover:opacity-92"
              >
                Send Something
              </Link>
              <Link
                to="/become-runner"
                className="inline-flex min-w-[210px] items-center justify-center rounded-full border border-apple-gray-200 bg-white px-8 py-4 text-base font-bold text-apple-gray-500 shadow-sm transition-colors hover:bg-apple-gray-50"
              >
                Become a Runner
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 text-left lg:justify-start"
            >
              <div className="rounded-2xl border border-apple-gray-100 bg-white px-4 py-3 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-apple-gray-200">Coverage</div>
                <div className="mt-1 text-sm font-bold text-apple-gray-500">Hostels, classrooms, storefronts</div>
              </div>
              <div className="rounded-2xl border border-apple-gray-100 bg-white px-4 py-3 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-apple-gray-200">Use Cases</div>
                <div className="mt-1 text-sm font-bold text-apple-gray-500">Deliveries, errands, proxy pickups</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 h-28 w-28 rounded-full bg-blue-100/70 blur-2xl" />
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-emerald-100/60 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-apple-gray-100 bg-white shadow-2xl shadow-stone-200/60">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
                alt="Students using Pick'em across campus"
                crossOrigin="anonymous"
                className="aspect-[5/4] w-full object-cover"
                loading="eager"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5 md:p-6">
                <div className="max-w-sm rounded-[1.5rem] border border-white/20 bg-white/92 p-4 shadow-lg backdrop-blur">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-apple-gray-200">Live Campus Flow</div>
                  <div className="mt-2 text-lg font-black text-apple-gray-500">Send. Buy. Pickup. Deliver.</div>
                  <div className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
                    One platform for students, runners, and businesses to move things quickly without leaving campus rhythm.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-3 text-center md:mb-10">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600">Core Services</div>
          <h2 className="text-3xl font-black tracking-tight text-apple-gray-500 md:text-4xl">Built for how campus actually moves</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm', feature.tone)}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black tracking-tight text-apple-gray-500">{feature.title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-apple-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="-mx-4 bg-apple-gray-50 px-4 py-14 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="overflow-hidden rounded-[2rem] border border-white shadow-2xl shadow-stone-200/60">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000"
              alt="Buy and Deliver service"
              crossOrigin="anonymous"
              className="aspect-[5/4] w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="text-center lg:text-left">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600">Buy & Deliver</div>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-apple-gray-500 md:text-5xl">
              Need something fast?
              <span className="mt-2 block text-apple-gray-300">We&apos;ll shop and bring it to you.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-apple-gray-300 md:text-lg lg:max-w-xl">
              From snacks and toiletries to forgotten essentials, students can send a runner to buy items and deliver them directly without leaving lectures, labs, or study time.
            </p>
            <Link
              to="/buy-and-deliver"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-apple-gray-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-apple-gray-500/15 transition-opacity hover:opacity-92"
            >
              Explore Buy & Deliver
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600">How It Works</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-apple-gray-500 md:text-4xl">Simple. Fast. Secure.</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-black tracking-[0.18em] text-apple-gray-200">{step.number}</div>
              <h3 className="mt-4 text-xl font-black text-apple-gray-500">{step.title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-apple-gray-300">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-apple-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50"
          >
            Learn More About the Flow
          </Link>
        </div>
      </section>
    </div>
  );
}
