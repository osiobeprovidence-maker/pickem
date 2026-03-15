import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
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
            Support
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-apple-gray-500 mb-8"
          >
            We're here <br /> to help.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-apple-gray-300 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Have questions or feedback? Reach out to our campus support team. We're available 24/7 for active deliveries.
          </motion.p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 bg-apple-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Mail, title: "Email Us", detail: "support@pickem.edu", desc: "We usually respond within 2 hours." },
                { icon: Phone, title: "Call Us", detail: "+234 800 PICKEM", desc: "Available Mon-Fri, 9am-6pm." },
                { icon: MessageSquare, title: "Live Chat", detail: "In-App Chat", desc: "Instant support for active deliveries." },
                { icon: MapPin, title: "Visit Us", detail: "Campus Hub, Room 402", desc: "Drop by for a coffee and chat." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white rounded-[2rem] border border-apple-gray-100 shadow-sm space-y-4"
                >
                  <div className="w-12 h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-apple-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-apple-gray-500">{item.title}</h3>
                    <p className="text-blue-600 font-bold">{item.detail}</p>
                    <p className="text-apple-gray-300 text-sm mt-2 font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-12 rounded-[3rem] border border-apple-gray-100 shadow-xl space-y-10"
          >
            <h2 className="text-3xl font-bold">Send us a message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-apple-gray-300 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-apple-gray-50 border border-apple-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-apple-gray-300 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-6 py-4 bg-apple-gray-50 border border-apple-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-apple-gray-300 ml-2">Subject</label>
                <select className="w-full px-6 py-4 bg-apple-gray-50 border border-apple-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none font-medium">
                  <option>General Inquiry</option>
                  <option>Business Partnership</option>
                  <option>Runner Application</option>
                  <option>Support Request</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-apple-gray-300 ml-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-4 bg-apple-gray-50 border border-apple-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="How can we help you?"
                />
              </div>
              <button className="w-full bg-apple-gray-500 text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Send Message <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
