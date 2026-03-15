import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Business, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, MapPin, ShieldCheck, ShoppingBag, ArrowRight, Star, 
  Info, Clock, Phone, Zap, Plus, Globe, Package, LayoutDashboard, X,
  Mail, MessageCircle, Instagram
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Storefront() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'policy'>('products');

  useEffect(() => {
    if (id) loadStore();
  }, [id]);

  const loadStore = async () => {
    setIsLoading(true);
    try {
      const biz = await api.getBusiness(id!);
      setBusiness(biz);
      setProducts(await api.getProducts(id!));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center font-black">Opening Storefront...</div>;
  if (!business) return <div className="p-20 text-center font-black">Store not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner & Profile */}
      <div className="relative">
        <div className="h-[35vh] md:h-[45vh] bg-apple-gray-500 overflow-hidden">
          {business.banner ? (
            <img src={business.banner} alt="" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-apple-gray-500 to-black opacity-40" />
          )}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 -mt-20 md:-mt-24 pb-8 border-b border-apple-gray-50">
            {/* Profile Pic Container */}
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-5xl font-black text-apple-gray-500 shrink-0 border-8 border-white overflow-hidden z-10">
              {business.logo ? <img src={business.logo} alt="" className="w-full h-full object-cover" /> : business.name[0]}
            </div>
            
            {/* Store Info */}
            <div className="flex-grow text-center md:text-left space-y-4 md:pb-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-4xl md:text-6xl font-black text-apple-gray-500 tracking-tighter leading-none">{business.name}</h1>
                {business.kyc_status === 'verified' && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                    <ShieldCheck className="w-4 h-4 fill-emerald-600/10" /> Verified Merchant
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-apple-gray-300 font-bold">
                <span className="flex items-center gap-2 bg-apple-gray-50 px-4 py-2 rounded-full text-sm">
                  <MapPin className="w-4 h-4" /> {business.location_type.replace('_', ' ')} • {business.address}
                </span>
                <span className="flex items-center gap-2 bg-apple-gray-50 px-4 py-2 rounded-full text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9 Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-apple-gray-50 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-12 flex gap-12">
          {['products', 'about', 'policy'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "py-8 font-black text-sm uppercase tracking-widest transition-all relative",
                activeTab === tab ? "text-apple-gray-500" : "text-apple-gray-200 hover:text-apple-gray-300"
              )}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-apple-gray-500 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-12">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {products.map(prod => (
                <div key={prod.id} className="bg-white p-10 rounded-[4rem] border border-apple-gray-100 shadow-sm hover:shadow-2xl transition-all group">
                  <div className="aspect-square bg-apple-gray-50 rounded-[3rem] mb-8 overflow-hidden relative">
                    {prod.video ? (
                      <video
                        src={prod.video}
                        poster={prod.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : prod.image ? (
                      <img src={prod.image} alt="" crossOrigin="anonymous" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="flex h-full items-center justify-center gap-3 text-apple-gray-200">
                        <Package className="w-6 h-6" />
                        <span className="text-sm font-bold">No media uploaded</span>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {prod.type}
                    </div>
                    {prod.video && (
                      <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm text-emerald-700">
                        Video
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-apple-gray-500 leading-tight">{prod.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-black text-apple-gray-500 tracking-tighter">₦{prod.price.toLocaleString()}</div>
                      <Link to={`/buy-and-deliver?item=${prod.id}`} className="p-5 bg-apple-gray-500 text-white rounded-2xl hover:opacity-90 shadow-lg">
                        <Plus className="w-6 h-6" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl space-y-16">
              <div className="space-y-6">
                <h2 className="text-5xl font-black text-apple-gray-500 tracking-tighter">About Us</h2>
                <p className="text-2xl font-bold text-apple-gray-300 italic leading-relaxed">"{business.description}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-apple-gray-50">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200">Location</div>
                  <div className="text-xl font-black text-apple-gray-500 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-apple-gray-200" />
                    {business.address}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200">Operating Since</div>
                  <div className="text-xl font-black text-apple-gray-500">{format(new Date(business.created_at), 'MMMM yyyy')}</div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200">Contact & Socials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {business.email && (
                    <div className="flex items-center gap-4 p-6 bg-apple-gray-50 rounded-3xl border border-apple-gray-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-apple-gray-500 truncate">{business.email}</div>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center gap-4 p-6 bg-apple-gray-50 rounded-3xl border border-apple-gray-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-500">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-apple-gray-500 truncate">{business.phone}</div>
                    </div>
                  )}
                  {business.whatsapp && (
                    <div className="flex items-center gap-4 p-6 bg-apple-gray-50 rounded-3xl border border-apple-gray-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-500">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-apple-gray-500 truncate">{business.whatsapp}</div>
                    </div>
                  )}
                  {business.instagram && (
                    <div className="flex items-center gap-4 p-6 bg-apple-gray-50 rounded-3xl border border-apple-gray-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-pink-500">
                        <Instagram className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-apple-gray-500 truncate">{business.instagram}</div>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center gap-4 p-6 bg-apple-gray-50 rounded-3xl border border-apple-gray-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-apple-gray-500">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-apple-gray-500 truncate">{business.website}</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'policy' && (
            <motion.div key="policy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl space-y-16">
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-apple-gray-500 tracking-tighter">Store Policy</h2>
                <p className="text-lg font-bold text-apple-gray-300 leading-relaxed whitespace-pre-line">
                  {business.store_policy?.trim() || `No business policy has been published by ${business.name} yet.`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
