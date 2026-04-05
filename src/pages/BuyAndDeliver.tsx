import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart,
  Package,
  MapPin,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Plus,
  Trash2,
  CreditCard,
  Store,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { cn } from '../lib/utils';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  store?: string;
}

type Step = 'landing' | 'shopping' | 'checkout' | 'payment' | 'success';
type ShoppingMode = 'custom' | 'marketplace';

const marketplaceItems = [
  { id: 'm1', name: 'Indomie (Pack of 40)', store: 'Campus Mart', price: 12000 },
  { id: 'm2', name: 'Notebook (A4)', store: 'Bookstore', price: 1500 },
  { id: 'm3', name: 'Bottled Water (Case)', store: 'Campus Mart', price: 3500 },
  { id: 'm4', name: 'Laundry Detergent (2kg)', store: 'Super Store', price: 4200 },
  { id: 'm5', name: 'Bread (Family Size)', store: 'Campus Bakery', price: 1000 },
  { id: 'm6', name: 'Milk (1L)', store: 'Campus Mart', price: 1800 },
];

function createCartItem(name: string, store?: string): CartItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    quantity: 1,
    store,
  };
}

export default function BuyAndDeliver() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('landing');
  const [shoppingMode, setShoppingMode] = useState<ShoppingMode>('custom');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newStore, setNewStore] = useState('');
  const [locations, setLocations] = useState({ pickup: '', dropoff: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = 1500 + cart.length * 200;

  const addToCart = () => {
    const itemName = newItem.trim();
    if (!itemName) return;

    setCart((current) => [...current, createCartItem(itemName, newStore.trim() || undefined)]);
    setNewItem('');
    setNewStore('');
  };

  const addMarketplaceItem = (item: (typeof marketplaceItems)[number]) => {
    setCart((current) => [...current, createCartItem(item.name, item.store)]);
  };

  const removeFromCart = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      const itemDescription = cart
        .map((item) => `${item.quantity}x ${item.name}${item.store ? ` (from ${item.store})` : ''}`)
        .join(', ');

      await api.createDelivery({
        type: 'buy_deliver',
        pickup_location: locations.pickup || 'Any nearby store',
        drop_location: locations.dropoff,
        item_description: itemDescription,
        contact_details: user.email,
        fee: serviceFee,
      });
      setStep('success');
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6 rounded-[2.25rem] border border-apple-gray-100 bg-white p-8 text-center shadow-[0_18px_60px_rgba(29,29,31,0.08)] sm:p-10"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-apple-gray-500 sm:text-4xl">Order Placed!</h1>
            <p className="text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">
              Your runner has been notified and will start shopping shortly.
            </p>
          </div>
          <Link
            to="/dashboard/buy-deliver"
            className="inline-flex w-full items-center justify-center rounded-full bg-apple-gray-500 px-6 py-4 text-base font-bold text-white transition-opacity hover:opacity-90"
          >
            Track in Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <section className="px-4 pb-12 pt-24 sm:px-6 sm:pb-20 sm:pt-32">
              <div className="mx-auto max-w-5xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex max-w-full items-center justify-center rounded-full bg-apple-gray-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-apple-gray-300 sm:text-[12px]"
                >
                  New Service
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-apple-gray-500 sm:text-5xl md:text-7xl"
                >
                  We shop.
                  <br />
                  We deliver.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-apple-gray-300 sm:text-xl md:text-2xl"
                >
                  Get anything from any store on campus or nearby. Just tell us what you need, and a runner
                  will handle the rest.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                  className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center"
                >
                  <button
                    onClick={() => setStep('shopping')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-6 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
                  >
                    Start Shopping <ArrowRight className="h-5 w-5" />
                  </button>
                  {user && (
                    <Link
                      to="/dashboard/buy-deliver"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-apple-gray-500 bg-white px-6 py-4 text-base font-semibold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 sm:w-auto sm:px-10"
                    >
                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </Link>
                  )}
                </motion.div>
              </div>
            </section>

            <section className="bg-apple-gray-50 px-4 py-14 sm:px-6 sm:py-24">
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                {[
                  {
                    icon: ShoppingCart,
                    title: 'List your items',
                    description: 'Tell us what you need from which store. Be as specific as you like.',
                  },
                  {
                    icon: MapPin,
                    title: 'Set your location',
                    description: 'Choose where you want your items delivered on campus.',
                  },
                  {
                    icon: Package,
                    title: 'Relax and receive',
                    description: 'A runner picks up your items and brings them straight to you.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-[2rem] border border-apple-gray-100 bg-white p-7 shadow-sm sm:rounded-[2.5rem] sm:p-10"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-apple-gray-50">
                      <item.icon className="h-6 w-6 text-apple-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-apple-gray-500 sm:text-2xl">{item.title}</h3>
                    <p className="mt-3 text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {step === 'shopping' && (
          <motion.div
            key="shopping"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32"
          >
            <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight text-apple-gray-500 sm:text-4xl">
                  What do you need?
                </h1>
                <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
                  Add your own list or choose from popular campus essentials.
                </p>
              </div>
              <button
                onClick={() => setStep('landing')}
                className="self-start text-sm font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
              >
                Cancel
              </button>
            </div>

            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setShoppingMode('custom')}
                className={cn(
                  'rounded-[1.5rem] px-5 py-4 text-sm font-bold transition-all sm:text-base',
                  shoppingMode === 'custom'
                    ? 'bg-apple-gray-500 text-white shadow-lg'
                    : 'bg-apple-gray-50 text-apple-gray-300 hover:bg-apple-gray-100',
                )}
              >
                Enter Your Own
              </button>
              <button
                onClick={() => setShoppingMode('marketplace')}
                className={cn(
                  'rounded-[1.5rem] px-5 py-4 text-sm font-bold transition-all sm:text-base',
                  shoppingMode === 'marketplace'
                    ? 'bg-apple-gray-500 text-white shadow-lg'
                    : 'bg-apple-gray-50 text-apple-gray-300 hover:bg-apple-gray-100',
                )}
              >
                Job Something Marketplace
              </button>
            </div>

            <AnimatePresence mode="wait">
              {shoppingMode === 'custom' ? (
                <motion.div
                  key="custom"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="mb-10 rounded-[2rem] bg-apple-gray-50 p-5 sm:mb-12 sm:p-8"
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                    <div className="space-y-2">
                      <label className="ml-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray-300">
                        Item Name
                      </label>
                      <div className="relative">
                        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                        <input
                          type="text"
                          value={newItem}
                          onChange={(event) => setNewItem(event.target.value)}
                          placeholder="e.g. 2L Milk, Notebook..."
                          className="w-full rounded-2xl border-none bg-white py-4 pl-14 pr-5 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="ml-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray-300">
                        Store (Optional)
                      </label>
                      <div className="relative">
                        <Store className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                        <input
                          type="text"
                          value={newStore}
                          onChange={(event) => setNewStore(event.target.value)}
                          placeholder="e.g. Campus Mart"
                          className="w-full rounded-2xl border-none bg-white py-4 pl-14 pr-5 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={addToCart}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-apple-gray-500 py-4 text-base font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <Plus className="h-5 w-5" /> Add to List
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="marketplace"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 sm:mb-12"
                >
                  {marketplaceItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[2rem] border border-apple-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:p-6"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-apple-gray-50">
                          <ShoppingBag className="h-6 w-6 text-apple-gray-500" />
                        </div>
                        <div className="text-right text-lg font-bold text-apple-gray-500">
                          N{item.price.toLocaleString()}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold leading-snug text-apple-gray-500">{item.name}</h4>
                      <p className="mt-1 text-sm font-medium text-apple-gray-300">{item.store}</p>
                      <button
                        onClick={() => addMarketplaceItem(item)}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-apple-gray-50 py-3 text-sm font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-500 hover:text-white"
                      >
                        <Plus className="h-4 w-4" /> Add to List
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-apple-gray-500">
                <ShoppingCart className="h-6 w-6" /> Shopping List ({cart.length})
              </h2>

              {cart.length === 0 ? (
                <div className="rounded-[2rem] border-2 border-dashed border-apple-gray-100 bg-white px-5 py-14 text-center sm:rounded-[2.5rem] sm:py-20">
                  <p className="text-sm font-medium text-apple-gray-200 sm:text-base">
                    Your list is empty. Add items above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-apple-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div className="min-w-0">
                        <h4 className="text-lg font-bold leading-snug text-apple-gray-500">{item.name}</h4>
                        {item.store && (
                          <p className="mt-1 text-sm font-medium text-apple-gray-300">From: {item.store}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex self-start rounded-xl p-2 text-red-400 transition-colors hover:bg-red-50 sm:self-center"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}

                  <button
                    onClick={() => setStep('checkout')}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-[1.75rem] bg-apple-gray-500 px-6 py-4 text-base font-bold text-white shadow-xl transition-opacity hover:opacity-90 sm:rounded-[2rem] sm:py-5 sm:text-lg"
                  >
                    Continue to Checkout <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="mx-auto max-w-2xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32"
          >
            <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-apple-gray-500 sm:text-4xl">
                  Delivery Details
                </h1>
                <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
                  Tell us where to shop and where to drop everything off.
                </p>
              </div>
              <button
                onClick={() => setStep('shopping')}
                className="self-start text-sm font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
              >
                Back to List
              </button>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-5 rounded-[2rem] border border-apple-gray-100 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
                <div className="space-y-2">
                  <label className="ml-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray-300">
                    Pickup Store Address
                  </label>
                  <div className="relative">
                    <Store className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                    <input
                      type="text"
                      value={locations.pickup}
                      onChange={(event) =>
                        setLocations((current) => ({ ...current, pickup: event.target.value }))
                      }
                      placeholder="e.g. Main Campus Bookstore"
                      className="w-full rounded-2xl border-none bg-apple-gray-50 py-4 pl-14 pr-5 font-medium text-apple-gray-500 outline-none focus:ring-2 focus:ring-apple-gray-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray-300">
                    Your Delivery Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                    <input
                      type="text"
                      value={locations.dropoff}
                      onChange={(event) =>
                        setLocations((current) => ({ ...current, dropoff: event.target.value }))
                      }
                      placeholder="e.g. Hall 4, Room 202"
                      className="w-full rounded-2xl border-none bg-apple-gray-50 py-4 pl-14 pr-5 font-medium text-apple-gray-500 outline-none focus:ring-2 focus:ring-apple-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5 rounded-[2rem] bg-apple-gray-500 p-5 text-white sm:rounded-[2.5rem] sm:p-8">
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <CreditCard className="h-6 w-6" /> Order Summary
                </h3>
                <div className="space-y-3 text-sm font-medium sm:text-base">
                  <div className="flex items-center justify-between gap-4 opacity-80">
                    <span>Items ({cart.length})</span>
                    <span className="text-right">To be paid by runner</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 opacity-80">
                    <span>Delivery Fee</span>
                    <span>N1,500</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 opacity-80">
                    <span>Service Fee</span>
                    <span>N{cart.length * 200}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-white/20 pt-4 text-xl font-bold sm:text-2xl">
                    <span>Total Service</span>
                    <span>N{serviceFee}</span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-apple-gray-200">
                  You will reimburse the runner for the actual cost of items upon delivery.
                </p>
                <button
                  onClick={() => setStep('payment')}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-white py-4 text-base font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 sm:py-5 sm:text-lg"
                >
                  Confirm and Pay
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-32"
          >
            <div className="space-y-6 rounded-[2.25rem] border border-apple-gray-100 bg-white p-7 shadow-[0_18px_60px_rgba(29,29,31,0.08)] sm:rounded-[3rem] sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <CreditCard className="h-10 w-10 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-apple-gray-500">Secure Payment</h2>
                <p className="text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
                  Processing your service fee of N{serviceFee}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex h-12 items-center gap-3 rounded-xl bg-apple-gray-50 px-4">
                  <div className="h-5 w-8 rounded bg-apple-gray-200" />
                  <div className="font-mono text-sm text-apple-gray-300">**** **** **** 4242</div>
                </div>
                <button
                  disabled={isSubmitting}
                  onClick={handleCheckout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-apple-gray-500 py-4 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                  onClick={() => setStep('checkout')}
                  className="text-sm font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
