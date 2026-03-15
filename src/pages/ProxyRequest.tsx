import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  MapPin, 
  Smartphone, 
  Package, 
  Clock, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  Navigation, 
  Info, 
  X,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { cn } from '../lib/utils';

type Step = 'pickup' | 'delivery' | 'success';

export default function ProxyRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('pickup');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const [formData, setFormData] = useState({
    pickup_location: '',
    item_description: '',
    contact_details: '', // Person holding the item
    item_image: 'https://images.unsplash.com/photo-1588702547319-f55a6dbd300d?w=800&auto=format&fit=crop&q=60', // Mock image
    drop_location: '',
    preferred_time: '',
  });

  const handleNext = () => {
    if (step === 'pickup') setStep('delivery');
  };

  const handleBack = () => {
    if (step === 'delivery') setStep('pickup');
    else navigate('/proxy-pickup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate(`/auth?redirect=${encodeURIComponent('/proxy-request')}`);

    setIsLoading(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedCode(code);
      
      const deliveryData = {
        type: 'proxy' as const,
        pickup_location: formData.pickup_location,
        drop_location: formData.drop_location,
        item_description: formData.item_description,
        contact_details: formData.contact_details,
        customer_id: user.id,
        fee: 2000, // Premium fee for proxy service
        proxy_code: code,
        preferred_time: formData.preferred_time,
        item_image: formData.item_image,
      };

      await api.createDelivery(deliveryData);

      // Set active proxy timer (expires in 5 minutes for demo)
      localStorage.setItem('active_proxy', JSON.stringify({
        id: crypto.randomUUID(),
        item_description: formData.item_description,
        proxy_code: code,
        drop_location: formData.drop_location,
        expires_at: Date.now() + (5 * 60 * 1000)
      }));

      setStep('success');
    } catch (error) {
      console.error(error);
      alert('Failed to post proxy request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Branding Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-apple-gray-50 rounded-full text-[12px] font-semibold text-apple-gray-300"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Proxy Service
          </motion.div>
          <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Pick’em Proxy</h1>
          <p className="text-2xl font-bold text-apple-gray-300 italic">Let us pick up for you, securely.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'pickup' && (
            <motion.div 
              key="pickup" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10"
            >
              <div className="bg-apple-gray-50 p-10 sm:p-12 rounded-[3.5rem] space-y-10 shadow-sm border border-apple-gray-100">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Pickup Point
                    </label>
                    <input
                      type="text" required
                      placeholder="e.g. Campus Store, Admin Office..."
                      value={formData.pickup_location}
                      onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                      className="w-full bg-white border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Who should the runner call?
                    </label>
                    <input
                      type="tel" required
                      placeholder="Recipient's phone number"
                      value={formData.contact_details}
                      onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                      className="w-full bg-white border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                      <Info className="w-4 h-4" /> What are we picking up?
                    </label>
                    <textarea
                      required
                      placeholder="Describe the item (e.g. My ID card, A large brown box...)"
                      value={formData.item_description}
                      onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                      className="w-full bg-white border-none rounded-[2.5rem] py-6 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Reference Image (Optional)
                    </label>
                    <div className="relative group overflow-hidden rounded-[2.5rem] aspect-video bg-white border-2 border-dashed border-apple-gray-100 flex items-center justify-center">
                      {formData.item_image ? (
                        <img 
                          src={formData.item_image} 
                          alt="Preview" 
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="text-center space-y-2">
                          <ImageIcon className="w-8 h-8 text-apple-gray-200 mx-auto" />
                          <p className="text-xs font-bold text-apple-gray-200 uppercase">Upload Item Photo</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-apple-gray-500 text-white py-6 rounded-[2rem] font-black text-xl hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-2xl"
              >
                Next: Delivery Info <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {step === 'delivery' && (
            <motion.div 
              key="delivery" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-apple-gray-50 p-10 sm:p-12 rounded-[3.5rem] space-y-10 shadow-sm border border-apple-gray-100">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-apple-gray-500" /> Return Point
                    </label>
                    <input
                      type="text" required
                      placeholder="Where should we bring it back to you?"
                      value={formData.drop_location}
                      onChange={(e) => setFormData({ ...formData, drop_location: e.target.value })}
                      className="w-full bg-white border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Preferred Return Time
                    </label>
                    <input
                      type="text" required
                      placeholder="e.g. 2:00 PM today, or After my class at 4:30"
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="w-full bg-white border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                    />
                  </div>

                  <div className="p-8 bg-white rounded-[2.5rem] border-2 border-apple-gray-500/10 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-500 font-black uppercase text-[10px] tracking-widest">
                      <ShieldCheck className="w-4 h-4" /> Security Protocol
                    </div>
                    <p className="text-sm font-bold text-apple-gray-300 leading-relaxed italic">
                      "A security code will be generated. When the runner is delivering the item back to you, you will provide this code to confirm you have received it."
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-white text-apple-gray-500 border-2 border-apple-gray-50 py-6 rounded-[2rem] font-black text-xl hover:border-apple-gray-500 transition-all shadow-sm"
                >
                  Go Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-[2] bg-apple-gray-500 text-white py-6 rounded-[2rem] font-black text-xl hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
                >
                  {isLoading ? "Generating Code..." : "Confirm Proxy Request"}
                  {!isLoading && <ArrowRight className="w-6 h-6" />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12 py-12"
            >
              <div className="w-32 h-32 bg-apple-gray-50 rounded-[3rem] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>
              
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-apple-gray-500 tracking-tighter leading-none">Your Code is Ready</h2>
                <div className="p-10 bg-apple-gray-500 rounded-[3rem] shadow-2xl">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-4">Verification Code</div>
                  <div className="text-7xl font-black text-white tracking-[0.2em]">{generatedCode}</div>
                </div>
                <p className="text-xl font-bold text-apple-gray-300 italic max-w-sm mx-auto leading-relaxed">
                  "Show this code to the runner when they bring your item back to confirm delivery."
                </p>
              </div>

              <div className="pt-8 space-y-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-apple-gray-50 text-apple-gray-500 py-6 rounded-[2rem] font-black text-xl hover:bg-apple-gray-100 transition-all shadow-sm"
                >
                  Go to Hub
                </button>
                <p className="text-xs font-black text-apple-gray-200 uppercase tracking-widest">A runner will be assigned shortly</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}