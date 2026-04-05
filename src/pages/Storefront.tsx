import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Business, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  ShieldCheck,
  Star,
  Phone,
  Plus,
  Globe,
  Package,
  Mail,
  MessageCircle,
  Instagram,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

type StoreTab = 'products' | 'about' | 'policy';

export default function Storefront() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StoreTab>('products');

  useEffect(() => {
    if (id) {
      void loadStore(id);
    }
  }, [id]);

  const loadStore = async (businessId: string) => {
    setIsLoading(true);
    try {
      const [businessResult, productsResult] = await Promise.all([
        api.getBusiness(businessId),
        api.getProducts(businessId),
      ]);
      setBusiness(businessResult);
      setProducts(productsResult);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center text-sm font-black uppercase tracking-[0.2em]">Opening Storefront...</div>;
  }

  if (!business) {
    return <div className="p-10 text-center text-sm font-black uppercase tracking-[0.2em]">Store not found.</div>;
  }

  const contactCards = [
    business.email ? { id: 'email', icon: Mail, value: business.email, accent: 'text-blue-500' } : null,
    business.phone ? { id: 'phone', icon: Phone, value: business.phone, accent: 'text-emerald-500' } : null,
    business.whatsapp
      ? { id: 'whatsapp', icon: MessageCircle, value: business.whatsapp, accent: 'text-green-500' }
      : null,
    business.instagram
      ? { id: 'instagram', icon: Instagram, value: business.instagram, accent: 'text-pink-500' }
      : null,
    business.website ? { id: 'website', icon: Globe, value: business.website, accent: 'text-apple-gray-500' } : null,
  ].filter(Boolean) as Array<{ id: string; icon: React.ComponentType<{ className?: string }>; value: string; accent: string }>;

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <div className="relative">
        <div className="h-[28vh] min-h-[220px] bg-apple-gray-500 sm:h-[35vh] md:h-[42vh]">
          {business.banner ? (
            <img src={business.banner} alt="" className="h-full w-full object-cover opacity-80" />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(135deg,#1d1d1f_0%,#5d5d65_100%)]" />
          )}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="-mt-16 flex flex-col gap-6 border-b border-apple-gray-50 pb-8 sm:-mt-20 md:-mt-24 md:flex-row md:items-end md:gap-8">
            <div className="z-10 flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[2.25rem] border-8 border-white bg-white text-4xl font-black text-apple-gray-500 shadow-2xl sm:h-40 sm:w-40 sm:rounded-[2.75rem] md:h-44 md:w-44">
              {business.logo ? (
                <img src={business.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                business.name[0]
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-4 md:pb-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <h1 className="break-words text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl md:text-6xl">
                  {business.name}
                </h1>
                {business.kyc_status === 'verified' && (
                  <div className="inline-flex max-w-full items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">
                    <ShieldCheck className="h-4 w-4" /> Verified Merchant
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <span className="inline-flex max-w-full items-start gap-2 rounded-full bg-apple-gray-50 px-4 py-2 text-sm font-bold text-apple-gray-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="break-words">
                    {business.location_type.replace('_', ' ')} · {business.address}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 self-start rounded-full bg-apple-gray-50 px-4 py-2 text-sm font-bold text-apple-gray-300">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 4.9 Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 border-b border-apple-gray-50 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-3 gap-2 py-3 sm:flex sm:gap-8 sm:py-0">
            {(['products', 'about', 'policy'] as StoreTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative rounded-full px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.16em] transition-colors sm:rounded-none sm:px-0 sm:py-6 sm:text-sm',
                  activeTab === tab
                    ? 'bg-apple-gray-500 text-white sm:bg-transparent sm:text-apple-gray-500'
                    : 'bg-apple-gray-50 text-apple-gray-300 hover:text-apple-gray-500 sm:bg-transparent',
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="storefront-tab"
                    className="absolute inset-x-3 bottom-1 h-1 rounded-full bg-white sm:inset-x-0 sm:bottom-0 sm:bg-apple-gray-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-8"
            >
              {products.length === 0 ? (
                <div className="col-span-full rounded-[2rem] border border-dashed border-apple-gray-100 bg-apple-gray-50 px-6 py-14 text-center sm:rounded-[2.5rem]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-apple-gray-300 shadow-sm">
                    <Package className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-apple-gray-500">No products yet</h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
                    This store has not published products yet. Check back soon or contact the merchant directly.
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-[2rem] border border-apple-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-xl sm:rounded-[2.75rem] sm:p-7"
                  >
                    <div className="relative mb-6 aspect-square overflow-hidden rounded-[1.75rem] bg-apple-gray-50 sm:rounded-[2.25rem]">
                      {product.video ? (
                        <video
                          src={product.video}
                          poster={product.image}
                          className="h-full w-full object-cover"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : product.image ? (
                        <img src={product.image} alt="" crossOrigin="anonymous" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center gap-3 text-apple-gray-200">
                          <Package className="h-6 w-6" />
                          <span className="text-sm font-bold">No media uploaded</span>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm backdrop-blur-md sm:left-5 sm:top-5">
                        {product.type}
                      </div>
                      {product.video && (
                        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700 shadow-sm backdrop-blur-md sm:bottom-5 sm:left-5">
                          Video
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-black leading-tight text-apple-gray-500 sm:text-3xl">
                        {product.name}
                      </h3>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl">
                          N{product.price.toLocaleString()}
                        </div>
                        <Link
                          to={`/buy-and-deliver?item=${product.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-apple-gray-500 px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:self-start"
                        >
                          <Plus className="h-5 w-5" />
                          Add to Order
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl space-y-10 sm:space-y-14"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-apple-gray-500 sm:text-5xl">About Us</h2>
                <p className="text-lg font-bold italic leading-relaxed text-apple-gray-300 sm:text-2xl">
                  "{business.description}"
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-apple-gray-50 pt-8 sm:grid-cols-2 sm:gap-10 sm:pt-12">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-apple-gray-200">Location</div>
                  <div className="flex items-start gap-2 text-lg font-black text-apple-gray-500 sm:text-xl">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-apple-gray-200" />
                    <span className="break-words">{business.address}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-apple-gray-200">
                    Operating Since
                  </div>
                  <div className="text-lg font-black text-apple-gray-500 sm:text-xl">
                    {format(new Date(business.created_at), 'MMMM yyyy')}
                  </div>
                </div>
              </div>

              {contactCards.length > 0 && (
                <div className="space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-apple-gray-200">
                    Contact and Socials
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {contactCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-start gap-4 rounded-[1.75rem] border border-apple-gray-100 bg-apple-gray-50 p-5"
                      >
                        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm', card.accent)}>
                          <card.icon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 break-words text-sm font-bold leading-relaxed text-apple-gray-500 sm:text-base">
                          {card.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'policy' && (
            <motion.div
              key="policy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl space-y-6 sm:space-y-8"
            >
              <h2 className="text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl">Store Policy</h2>
              <p className="whitespace-pre-line text-base font-bold leading-relaxed text-apple-gray-300 sm:text-lg">
                {business.store_policy?.trim() || `No business policy has been published by ${business.name} yet.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
