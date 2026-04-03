import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Package, MapPin, ArrowRight, CheckCircle2, ShieldCheck, LayoutDashboard, Plus, Trash2, CreditCard, Store, Search, ShoppingBag } from 'lucide-react';
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

export default function BuyAndDeliver() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'landing' | 'shopping' | 'checkout' | 'payment' | 'success'>('landing');
  const [shoppingMode, setShoppingMode] = useState<'custom' | 'marketplace'>('custom');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newStore, setNewStore] = useState('');
  const [locations, setLocations] = useState({ pickup: '', dropoff: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const marketplaceItems = [
    { id: 'm1', name: 'Indomie (Pack of 40)', store: 'Campus Mart', price: 12000 },
    { id: 'm2', name: 'Notebook (A4)', store: 'Bookstore', price: 1500 },
    { id: 'm3', name: 'Bottled Water (Case)', store: 'Campus Mart', price: 3500 },
    { id: 'm4', name: 'Laundry Detergent (2kg)', store: 'Super Store', price: 4200 },
    { id: 'm5', name: 'Bread (Family Size)', store: 'Campus Bakery', price: 1000 },
    { id: 'm6', name: 'Milk (1L)', store: 'Campus Mart', price: 1800 },
  ];

  const addToCart = () => {
    if (!newItem.trim()) return;
    setCart([...cart, { id: Math.random().toString(36).substr(2, 9), name: newItem, quantity: 1, store: newStore }]);
    setNewItem('');
  };

  const addMarketplaceItem = (item: typeof marketplaceItems[0]) => {
    setCart([...cart, { id: Math.random().toString(36).substr(2, 9), name: item.name, quantity: 1, store: item.store }]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (!user) return navigate('/auth');
    setIsSubmitting(true);
    try {
      const itemDescription = cart.map(i => `${i.quantity}x ${i.name} ${i.store ? `(from ${i.store})` : ''}`).join(', ');
      await api.createDelivery({
        type: 'buy_deliver',
        pickup_location: locations.pickup || 'Any nearby store',
        drop_location: locations.dropoff,
        item_description: itemDescription,
        contact_details: user.email,
        fee: 1500 + (cart.length * 200), // Base fee + per item
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-apple-gray-500">Order Placed!</h1>
          <p className="text-apple-gray-300 text-lg">Your runner has been notified and will start shopping shortly.</p>
          <div className="pt-8">
            <Link
              to="/dashboard/buy-deliver"
              className="bg-apple-gray-500 text-white px-10 py-4 rounded-full font-bold hover:opacity-90 transition-opacity inline-block"
            >
              Track in Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section */}
            <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
              <div className="max-w-5xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1.5 bg-apple-gray-50 rounded-full text-[12px] sm:text-[13px] font-semibold text-apple-gray-300 mb-6"
                >
                  New Service
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-apple-gray-500 mb-6 sm:mb-8 leading-[1.1]"
                >
                  We shop. <br /> We deliver.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl md:text-2xl text-apple-gray-300 max-w-2xl mx-auto mb-10 sm:mb-12 font-medium leading-relaxed"
                >
                  Get anything from any store on campus or nearby. Just tell us what you need, and a runner will handle the rest.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <button
                    onClick={() => setStep('shopping')}
                    className="bg-apple-gray-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Start Shopping <ArrowRight className="w-5 h-5" />
                  </button>
                  {user && (
                    <Link
                      to="/dashboard/buy-deliver"
                      className="bg-white text-apple-gray-500 border-2 border-apple-gray-500 px-10 py-4 rounded-full font-semibold text-lg hover:bg-apple-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                  )}
                </motion.div>
              </div>
            </section>

            {/* How it Works */}
            <section className="py-16 sm:py-24 bg-apple-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                  {[
                    {
                      icon: ShoppingCart,
                      title: "List your items",
                      description: "Tell us what you need from which store. Be as specific as you like."
                    },
                    {
                      icon: MapPin,
                      title: "Set your location",
                      description: "Choose where you want your items delivered on campus."
                    },
                    {
                      icon: Package,
                      title: "Relax & Receive",
                      description: "A runner picks up your items and brings them straight to you."
                    }
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-apple-gray-100"
                    >
                      <div className="w-12 h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center mb-6 sm:mb-8">
                        <step.icon className="w-6 h-6 text-apple-gray-500" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-4">{step.title}</h3>
                      <p className="text-apple-gray-300 text-base sm:text-lg leading-relaxed font-medium">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {step === 'shopping' && (
          <motion.div
            key="shopping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 px-4 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-4xl font-bold text-apple-gray-500">What do you need?</h1>
              <button 
                onClick={() => setStep('landing')}
                className="text-apple-gray-300 font-bold hover:text-apple-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setShoppingMode('custom')}
                className={cn(
                  "flex-1 py-3 rounded-2xl font-bold transition-all",
                  shoppingMode === 'custom' 
                    ? "bg-apple-gray-500 text-white shadow-lg" 
                    : "bg-apple-gray-50 text-apple-gray-300 hover:bg-apple-gray-100"
                )}
              >
                Enter Your Own
              </button>
              <button
                onClick={() => setShoppingMode('marketplace')}
                className={cn(
                  "flex-1 py-3 rounded-2xl font-bold transition-all",
                  shoppingMode === 'marketplace' 
                    ? "bg-apple-gray-500 text-white shadow-lg" 
                    : "bg-apple-gray-50 text-apple-gray-300 hover:bg-apple-gray-100"
                )}
              >
                Job Something Marketplace
              </button>
            </div>

            <AnimatePresence mode="wait">
              {shoppingMode === 'custom' ? (
                <motion.div
                  key="custom"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-apple-gray-50 p-8 rounded-[2.5rem] mb-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-apple-gray-300 ml-4">Item Name</label>
                      <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                        <input 
                          type="text" 
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          placeholder="e.g. 2L Milk, Notebook..."
                          className="w-full bg-white border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-apple-gray-500 outline-none font-medium shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-apple-gray-300 ml-4">Store (Optional)</label>
                      <div className="relative">
                        <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                        <input 
                          type="text" 
                          value={newStore}
                          onChange={(e) => setNewStore(e.target.value)}
                          placeholder="e.g. Campus Mart"
                          className="w-full bg-white border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-apple-gray-500 outline-none font-medium shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={addToCart}
                    className="w-full bg-apple-gray-500 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add to List
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="marketplace"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
                >
                  {marketplaceItems.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white p-6 rounded-[2rem] border border-apple-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ShoppingBag className="w-6 h-6 text-apple-gray-500" />
                        </div>
                        <div className="text-lg font-bold text-apple-gray-500">₦{item.price.toLocaleString()}</div>
                      </div>
                      <h4 className="font-bold text-lg text-apple-gray-500 mb-1">{item.name}</h4>
                      <p className="text-sm text-apple-gray-300 font-medium mb-6">{item.store}</p>
                      <button 
                        onClick={() => addMarketplaceItem(item)}
                        className="w-full py-3 bg-apple-gray-50 text-apple-gray-500 rounded-xl font-bold hover:bg-apple-gray-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add to List
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-apple-gray-500 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6" /> Shopping List ({cart.length})
              </h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-apple-gray-100">
                  <p className="text-apple-gray-200 font-medium">Your list is empty. Add items above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      key={item.id}
                      className="bg-white p-6 rounded-2xl border border-apple-gray-100 flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <h4 className="font-bold text-lg text-apple-gray-500">{item.name}</h4>
                        {item.store && <p className="text-sm text-apple-gray-300 font-medium">From: {item.store}</p>}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                  
                  <div className="pt-8">
                    <button 
                      onClick={() => setStep('checkout')}
                      className="w-full bg-apple-gray-500 text-white py-5 rounded-[2rem] font-bold text-xl hover:opacity-90 transition-opacity shadow-xl flex items-center justify-center gap-3"
                    >
                      Continue to Checkout <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-32 pb-20 px-4 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-4xl font-bold text-apple-gray-500">Delivery Details</h1>
              <button 
                onClick={() => setStep('shopping')}
                className="text-apple-gray-300 font-bold hover:text-apple-gray-500 transition-colors"
              >
                Back to List
              </button>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-apple-gray-300 ml-4">Pickup Store Address</label>
                  <div className="relative">
                    <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                    <input 
                      type="text" 
                      value={locations.pickup}
                      onChange={(e) => setLocations({ ...locations, pickup: e.target.value })}
                      placeholder="e.g. Main Campus Bookstore"
                      className="w-full bg-apple-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-apple-gray-500 outline-none font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-apple-gray-300 ml-4">Your Delivery Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                    <input 
                      type="text" 
                      value={locations.dropoff}
                      onChange={(e) => setLocations({ ...locations, dropoff: e.target.value })}
                      placeholder="e.g. Hall 4, Room 202"
                      className="w-full bg-apple-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-apple-gray-500 outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-apple-gray-500 p-8 rounded-[2.5rem] text-white space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="w-6 h-6" /> Order Summary
                </h3>
                <div className="space-y-3 font-medium">
                  <div className="flex justify-between opacity-80">
                    <span>Items ({cart.length})</span>
                    <span>To be paid by runner</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>Delivery Fee</span>
                    <span>₦1,500</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>Service Fee</span>
                    <span>₦{cart.length * 200}</span>
                  </div>
                  <div className="pt-4 border-t border-white/20 flex justify-between text-2xl font-bold">
                    <span>Total Service</span>
                    <span>₦{1500 + (cart.length * 200)}</span>
                  </div>
                </div>
                <p className="text-xs text-apple-gray-200 leading-relaxed italic">
                  * Note: You will reimburse the runner for the actual cost of items upon delivery.
                </p>
                <button 
                  onClick={() => setStep('payment')}
                  className="w-full bg-white text-apple-gray-500 py-5 rounded-2xl font-bold text-xl hover:bg-apple-gray-50 transition-colors shadow-xl"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-32 pb-20 px-4 max-w-md mx-auto text-center"
          >
            <div className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-2xl space-y-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-apple-gray-500">Secure Payment</h2>
              <p className="text-apple-gray-300 font-medium">Processing your service fee of ₦{1500 + (cart.length * 200)}</p>
              
              <div className="space-y-4">
                <div className="h-12 bg-apple-gray-50 rounded-xl flex items-center px-4 gap-3">
                  <div className="w-8 h-5 bg-apple-gray-200 rounded" />
                  <div className="text-apple-gray-300 font-mono">**** **** **** 4242</div>
                </div>
                <button 
                  disabled={isSubmitting}
                  onClick={handleCheckout}
                  className="w-full bg-apple-gray-500 text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : 'Pay Now'}
                </button>
                <button 
                  onClick={() => setStep('checkout')}
                  className="text-apple-gray-200 font-bold hover:text-apple-gray-500 transition-colors"
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
