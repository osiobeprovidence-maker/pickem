import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <section className="px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[13px] font-semibold text-brand-700"
          >
            Support
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-apple-gray-500 sm:mb-8 sm:text-5xl md:text-7xl"
          >
            We&apos;re here <br /> to help.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-apple-gray-300 sm:text-xl md:text-2xl"
          >
            Have questions or feedback? Reach out to our campus support team. We&apos;re available 24/7 for active deliveries.
          </motion.p>
        </div>
      </section>

      <section className="bg-apple-gray-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {[
                { icon: Mail, title: 'Email Us', detail: 'support@pickem.edu', desc: 'We usually respond within 2 hours.' },
                { icon: Phone, title: 'Call Us', detail: '+234 800 PICKEM', desc: 'Available Mon-Fri, 9am-6pm.' },
                { icon: MessageSquare, title: 'Live Chat', detail: 'In-App Chat', desc: 'Instant support for active deliveries.' },
                { icon: MapPin, title: 'Visit Us', detail: 'Campus Hub, Room 402', desc: 'Drop by for a coffee and chat.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4 rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
                    <item.icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-apple-gray-500">{item.title}</h3>
                    <p className="break-words font-bold text-brand-700">{item.detail}</p>
                    <p className="mt-2 text-sm font-medium text-apple-gray-300">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-xl sm:space-y-10 sm:rounded-[3rem] sm:p-10 md:p-12"
          >
            <h2 className="text-3xl font-bold">Send us a message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-2 text-[13px] font-semibold text-apple-gray-300">Full Name</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-6 py-4 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-[13px] font-semibold text-apple-gray-300">Email Address</label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-6 py-4 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="ml-2 text-[13px] font-semibold text-apple-gray-300">Subject</label>
                <select className="w-full appearance-none rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-6 py-4 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>General Inquiry</option>
                  <option>Business Partnership</option>
                  <option>Runner Application</option>
                  <option>Support Request</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="ml-2 text-[13px] font-semibold text-apple-gray-300">Message</label>
                <textarea
                  rows={4}
                  className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-6 py-4 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="How can we help you?"
                />
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-apple-gray-500 py-5 text-lg font-bold text-white shadow-sm shadow-brand-500/10 transition-colors hover:bg-black">
                Send Message <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
