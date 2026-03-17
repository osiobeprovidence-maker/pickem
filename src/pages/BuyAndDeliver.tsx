import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Package, MapPin, ArrowRight, CheckCircle2, ShieldCheck, LayoutDashboard, Plus, Trash2, CreditCard, Store, Search, ShoppingBag, X, Clock, Navigation, Star, Info, Play, Smartphone, Shirt, Coffee, Cpu } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { cn } from '../lib/utils';
import { Business, Product } from '../types';
import { format } from 'date-fns';

interface MarketItem {
  id: string;
  name: string;
  store: string;
  businessId?: string;
  productType?: Product['type'];
  fulfillmentMode?: Product['fulfillment_mode'];
  price: number;
  category: string;
  image?: string;
  videoUrl?: string;
  description: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  shopInfo: {
    address: string;
    verified: boolean;
    joined: string;
  };
}

interface CartItem {
  id: string;
  productId?: string;
  businessId?: string;
  productType?: Product['type'];
  fulfillmentMode?: Product['fulfillment_mode'];
  name: string;
  quantity: number;
  price: number;
  store: string;
}

export default function BuyAndDeliver() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'landing' | 'shopping' | 'checkout' | 'payment' | 'tracking' | 'success'>('landing');
  const [shoppingMode, setShoppingMode] = useState<'custom' | 'marketplace'>('custom');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStore, setNewStore] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const [locations, setLocations] = useState({ pickup: '', dropoff: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [liveUpdates, setLiveUpdates] = useState<{message: string, time: string}[]>([]);
  const [businessProducts, setBusinessProducts] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const marketplaceItems: MarketItem[] = [
    { 
      id: 'm1', 
      name: 'Indomie (Pack of 40)', 
      store: 'Campus Mart', 
      price: 12000,
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=60',
      description: 'A full carton of high-quality Indomie noodles. Perfect for long study sessions.',
      rating: 4.8,
      reviews: 124,
      deliveryTime: '15-20 mins',
      shopInfo: { address: 'Campus Commercial Hub, Store 4', verified: true, joined: 'Oct 2025' }
    },
    { 
      id: 'm2', 
      name: 'Oversized Hoodie', 
      store: 'Campus Styles', 
      price: 15000,
      category: 'Clothes',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=60',
      description: 'Premium cotton oversized hoodie. Available in multiple campus colors.',
      rating: 4.9,
      reviews: 89,
      deliveryTime: '20-25 mins',
      shopInfo: { address: 'Hall 4 Shopping Complex', verified: true, joined: 'Nov 2025' }
    },
    { 
      id: 'm3', 
      name: 'Wireless Mouse', 
      store: 'Tech Hub', 
      price: 8500,
      category: 'Tech',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60',
      description: 'Ergonomic wireless mouse with 2.4GHz connection. Silent clicks.',
      rating: 4.6,
      reviews: 56,
      deliveryTime: '10-15 mins',
      shopInfo: { address: 'Engineering Block A', verified: true, joined: 'Jan 2026' }
    },
    { 
      id: 'm4', 
      name: 'Netflix Premium (1mo)', 
      store: 'Sub Services', 
      price: 5000,
      category: 'Digital',
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=60',
      description: 'Monthly Netflix Premium subscription for campus movie nights.',
      rating: 4.7,
      reviews: 210,
      deliveryTime: 'Instant',
      shopInfo: { address: 'Online Delivery', verified: true, joined: 'Sep 2025' }
    }
  ];

  // Load business products and businesses for marketplace
  useEffect(() => {
    const fetchData = async () => {
      const prods = await api.getProducts();
      setBusinessProducts(prods);
      const bizIds = [...new Set(prods.map(p => p.business_id))];
      const bizList = await Promise.all(bizIds.map(id => api.getBusiness(id)));
      setBusinesses(bizList.filter((b): b is Business => b !== null));
    };
    fetchData();
  }, []);

  // Merge hardcoded marketplace items with dynamic business products
  const allMarketplaceItems = [
    ...marketplaceItems,
    ...businessProducts.map((p: Product) => {
      const biz = businesses.find((b: Business) => b.id === p.business_id);
      return {
        id: p.id,
        name: p.name,
        businessId: p.business_id,
        productType: p.type,
        fulfillmentMode: p.fulfillment_mode || 'manual',
        price: p.price,
        image: p.image,
        videoUrl: p.video,
        category: p.category,
        store: biz?.name || 'Verified Merchant',
        description: p.description,
        rating: 4.5,
        reviews: 0,
        deliveryTime: biz?.location_type === 'off_campus' ? '45-60 mins' : (p.type === 'digital' ? 'Instant' : '20-30 mins'),
        shopInfo: { 
          address: biz?.address || 'Campus Hub', 
          verified: true, 
          joined: biz ? format(new Date(biz.created_at), 'yyyy') : '2025'
        }
      };
    })
  ];

  // Load live updates for active order
  useEffect(() => {
    if (step === 'tracking') {
      const fetchUpdates = () => {
        // In a real app, this would be an active job ID from the API
        // For demo, we'll look for any active job updates in localStorage
        const allKeys = Object.keys(localStorage);
        const updateKey = allKeys.find(k => k.startsWith('live_updates_'));
        if (updateKey) {
          const updates = JSON.parse(localStorage.getItem(updateKey) || '[]');
          setLiveUpdates(updates);
        }
      };

      fetchUpdates();
      const interval = setInterval(fetchUpdates, 5000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pickem_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Check if we just came back from login and should be in a specific step
    const savedStep = searchParams.get('step') as any;
    if (savedStep && ['checkout', 'payment'].includes(savedStep)) {
      setStep(savedStep);
    }
  }, [searchParams]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pickem_cart', JSON.stringify(cart));
  }, [cart]);

  // Mock tracking status
  const trackingStatuses = [
    { status: 'At the shop', time: '2 mins ago', icon: Store, current: false },
    { status: "Pick'em started", time: 'Just now', icon: ShoppingBag, current: true },
    { status: 'At school gate', time: 'Pending', icon: Navigation, current: false },
    { status: 'Delivered', time: 'Pending', icon: CheckCircle2, current: false },
  ];

  const categories = [
    { id: 'All', name: 'All Items', icon: LayoutDashboard },
    { id: 'Food', name: 'Food & Drinks', icon: Coffee },
    { id: 'Clothes', name: 'Clothes', icon: Shirt },
    { id: 'Tech', name: 'Tech', icon: Cpu },
    { id: 'Digital', name: 'Digital Items', icon: Smartphone },
  ];

  const filteredItems = selectedCategory === 'All'
    ? allMarketplaceItems
    : allMarketplaceItems.filter((item: any) => item.category === selectedCategory);

  const addToCart = () => {
    if (!newItem.trim() || !newPrice.trim() || !newStore.trim()) return;
    setCart([...cart, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: newItem, 
      price: parseFloat(newPrice), 
      quantity: 1, 
      store: newStore 
    }]);
    setNewItem('');
    setNewPrice('');
    setNewStore('');
  };

  const addMarketplaceItem = (item: MarketItem) => {
    setCart([...cart, { 
      id: Math.random().toString(36).substr(2, 9), 
      productId: item.id,
      businessId: item.businessId,
      productType: item.productType,
      fulfillmentMode: item.fulfillmentMode,
      name: item.name, 
      price: item.price, 
      quantity: 1, 
      store: item.store 
    }]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item: CartItem) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  const serviceFee = 1500 + (cart.length * 200);

  const handleCheckout = async () => {
    if (!user) return navigate(`/auth?redirect=${encodeURIComponent('/buy-and-deliver?step=payment')}`);
    setIsSubmitting(true);
    try {
      const itemDescription = cart.map((i: CartItem) => `${i.quantity}x ${i.name} (₦${i.price.toLocaleString()}) from ${i.store}`).join(', ');
      
      // Collect customer data for each business in the cart
      for (const item of cart) {
        // In a real app, we'd have the actual business ID for marketplace items
        // For now, we'll use a placeholder or the item's store name
        const businessId = item.id.startsWith('m') ? 'campus-mart-id' : item.id; 
        await api.collectCustomerData(businessId, {
          name: user.name,
          email: user.email,
          phone: "080 0000 0000", // Would be collected from checkout form
          amount: item.price * item.quantity
        });
      }

      await api.createDelivery({
        type: 'buy_deliver',
        pickup_location: locations.pickup || 'Any nearby store',
        drop_location: locations.dropoff,
        item_description: itemDescription,
        contact_details: user.email,
        fee: serviceFee,
      });
      setStep('tracking');
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutWithFulfillment = async () => {
    if (!user) return navigate(`/auth?redirect=${encodeURIComponent('/buy-and-deliver?step=payment')}`);
    setIsSubmitting(true);
    try {
      const formatCartItem = (item: CartItem) =>
        `${item.quantity}x ${item.name} (N${item.price.toLocaleString()}) from ${item.store}`;
      const businessPhysicalItems = cart.filter(
        item => item.businessId && item.productId && item.productType === 'physical',
      );
      const genericItems = cart.filter(
        item => !(item.businessId && item.productId && item.productType === 'physical'),
      );

      for (const item of cart) {
        const businessId = item.businessId || (item.id.startsWith('m') ? 'campus-mart-id' : item.id);
        await api.collectCustomerData(businessId, {
          name: user.name,
          email: user.email,
          phone: '080 0000 0000',
          amount: item.price * item.quantity,
        });
      }

      for (const item of businessPhysicalItems) {
        const order = await api.createBusinessOrder({
          business_id: item.businessId,
          product_id: item.productId,
          customer_id: user.id,
          customer_name: user.name,
          customer_email: user.email,
          customer_phone: '080 0000 0000',
          product_name: item.name,
          product_type: 'physical',
          quantity: item.quantity,
          unit_price: item.price,
          total_amount: item.price * item.quantity,
          delivery_fee: serviceFee,
          pickup_location: item.fulfillmentMode === 'warehouse' ? "Pick'em Fulfillment Storage" : (locations.pickup || item.store),
          drop_location: locations.dropoff,
          contact_details: user.email,
          fulfillment_mode: item.fulfillmentMode || 'manual',
          status: item.fulfillmentMode === 'warehouse' ? 'ready_for_pickup' : 'pending_approval',
        });

        if (item.fulfillmentMode === 'warehouse') {
          await api.dispatchBusinessOrder(order.id);
        }
      }

      if (genericItems.length > 0) {
        await api.createDelivery({
          type: 'buy_deliver',
          pickup_location: locations.pickup || 'Any nearby store',
          drop_location: locations.dropoff,
          item_description: genericItems.map(formatCartItem).join(', '),
          contact_details: user.email,
          fee: serviceFee,
        });
      } else if (businessPhysicalItems.length > 0) {
        localStorage.setItem(
          `live_updates_${user.id}`,
          JSON.stringify([
            { message: 'Your order has been sent for business fulfillment.', time: 'Just now' },
          ]),
        );
      }

      setStep('tracking');
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'tracking') {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-apple-gray-50 text-apple-gray-300 rounded-full text-sm font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-gray-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-apple-gray-500"></span>
              </span>
              Personal Shopper Active
            </div>
            <h1 className="text-5xl font-black text-apple-gray-500 tracking-tighter">Track Your Pick'em</h1>
            <p className="text-apple-gray-300 font-bold text-lg italic">Your runner is currently shopping for your items.</p>
          </div>

          <div className="bg-apple-gray-50 rounded-[3rem] p-10 sm:p-16 space-y-12 shadow-sm">
            {/* Live Status Updates */}
            {liveUpdates.length > 0 && (
              <div className="mb-12 space-y-4 border-b border-apple-gray-100 pb-12">
                <div className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-2">Live Runner Activity</div>
                <div className="space-y-3">
                  {liveUpdates.map((upd: { message: string; time: string }, idx: number) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx} 
                      className="bg-white p-5 rounded-[1.5rem] border border-apple-gray-100 flex justify-between items-center shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-black text-apple-gray-500 text-lg">{upd.message}</span>
                      </div>
                      <span className="text-[10px] font-black text-apple-gray-200 uppercase tracking-widest">{upd.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {trackingStatuses.map((status, i) => (
              <div key={i} className="flex gap-8 relative">
                {i !== trackingStatuses.length - 1 && (
                  <div className={cn(
                    "absolute left-8 top-16 bottom-0 w-0.5 -translate-x-1/2",
                    status.current ? "bg-apple-gray-200" : "bg-apple-gray-100"
                  )} />
                )}
                <div className={cn(
                  "w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                  status.current ? "bg-apple-gray-500 text-white scale-110 shadow-2xl" : 
                  status.time !== 'Pending' ? "bg-apple-gray-100 text-apple-gray-300" : "bg-white text-apple-gray-100 border-2 border-apple-gray-50"
                )}>
                  <status.icon className="w-8 h-8" />
                </div>
                <div className="pt-3">
                  <h3 className={cn("text-xl font-black", status.current ? "text-apple-gray-500" : "text-apple-gray-300")}>
                    {status.status}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-bold text-apple-gray-200 uppercase tracking-widest mt-1">
                    <Clock className="w-4 h-4" />
                    {status.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-apple-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-apple-gray-200 uppercase text-[10px] font-black tracking-widest">
                <MapPin className="w-4 h-4" /> Delivering To
              </div>
              <p className="font-black text-xl text-apple-gray-500">{locations.dropoff || 'Your Location'}</p>
            </div>
            
            <div className="bg-white border border-apple-gray-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-apple-gray-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  JD
                </div>
                <div>
                  <p className="text-xs font-black text-apple-gray-200 uppercase tracking-wider">Your Runner</p>
                  <h4 className="font-black text-apple-gray-500 text-lg leading-none mt-1">John Doe</h4>
                </div>
              </div>
              <button className="px-6 py-4 bg-apple-gray-50 text-apple-gray-500 rounded-2xl font-black hover:bg-apple-gray-100 transition-colors shadow-sm">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-10"
        >
          <div className="w-32 h-32 bg-apple-gray-50 rounded-[3rem] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-apple-gray-500" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter text-apple-gray-500">Order Placed!</h1>
            <p className="text-xl font-bold text-apple-gray-300">Your runner has been notified and will start shopping shortly.</p>
          </div>
          <div className="pt-8">
            <Link
              to="/dashboard"
              className="bg-apple-gray-500 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:opacity-90 transition-all shadow-xl shadow-apple-gray-500/20 inline-flex items-center gap-3"
            >
              Track in Dashboard <ArrowRight className="w-6 h-6" />
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
            className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4"
          >
            {/* Hero Section */}
            <div className="max-w-7xl w-full space-y-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-apple-gray-50 rounded-full text-[12px] font-semibold text-apple-gray-300"
                >
                  <span className="text-blue-500">Premium</span> Personal Shopping
                </motion.div>
                <h1 className="text-7xl font-black tracking-tighter text-apple-gray-500 leading-none">
                  We shop. <br /> We deliver.
                </h1>
                <p className="text-2xl font-bold text-apple-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Get anything from any store on campus. Just tell us what you need, and we'll handle the rest.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() => setStep('shopping')}
                  className="bg-apple-gray-500 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:opacity-90 transition-all shadow-xl shadow-apple-gray-500/20 flex items-center justify-center gap-3 group"
                >
                  Start Shopping <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                {user && (
                  <Link
                    to="/dashboard"
                    className="bg-white text-apple-gray-500 border-2 border-apple-gray-50 px-12 py-6 rounded-[2rem] font-black text-xl hover:border-apple-gray-500 transition-all flex items-center justify-center gap-3 shadow-sm"
                  >
                    <LayoutDashboard className="w-6 h-6" /> Hub
                  </Link>
                )}
              </div>

              {/* How it Works Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                {[
                  { icon: ShoppingCart, title: "List Items", desc: "Specify what you need." },
                  { icon: MapPin, title: "Set Location", desc: "Where should we deliver?" },
                  { icon: Package, title: "Relax", desc: "We bring it to your door." }
                ].map((item, i) => (
                  <div key={i} className="bg-apple-gray-50 p-8 rounded-[2.5rem] space-y-4 border border-apple-gray-100/50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <item.icon className="w-6 h-6 text-apple-gray-500" />
                    </div>
                    <h3 className="font-black text-apple-gray-500 uppercase text-xs tracking-widest">{item.title}</h3>
                    <p className="text-apple-gray-300 font-bold text-sm leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'shopping' && (
          <motion.div
            key="shopping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 px-4 max-w-7xl mx-auto space-y-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Your List</h1>
                <p className="text-2xl font-bold text-apple-gray-300 italic">Tell us what you're craving or missing.</p>
              </div>
              <button 
                onClick={() => setStep('landing')}
                className="px-8 py-4 bg-apple-gray-50 text-apple-gray-300 rounded-2xl font-black hover:bg-apple-gray-100 transition-all flex items-center gap-2"
              >
                <X className="w-5 h-5" /> Cancel Shopping
              </button>
            </div>

            <div className="flex p-2 bg-apple-gray-50 rounded-[2.5rem] max-w-md">
              <button
                onClick={() => setShoppingMode('custom')}
                className={cn(
                  "flex-1 py-4 rounded-[2rem] font-black transition-all",
                  shoppingMode === 'custom' 
                    ? "bg-white text-apple-gray-500 shadow-xl" 
                    : "text-apple-gray-200 hover:text-apple-gray-300"
                )}
              >
                Custom Items
              </button>
              <button
                onClick={() => setShoppingMode('marketplace')}
                className={cn(
                  "flex-1 py-4 rounded-[2rem] font-black transition-all",
                  shoppingMode === 'marketplace' 
                    ? "bg-white text-apple-gray-500 shadow-xl" 
                    : "text-apple-gray-200 hover:text-apple-gray-300"
                )}
              >
                Pick'em Market
              </button>
            </div>

            <AnimatePresence mode="wait">
              {shoppingMode === 'custom' ? (
                <motion.div
                  key="custom"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-apple-gray-50 p-10 sm:p-12 rounded-[3.5rem] shadow-sm border border-apple-gray-100"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6">What do you need?</label>
                        <div className="relative">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                          <input 
                            type="text" 
                            value={newItem}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
                            placeholder="e.g. 2L Milk, Notebook..."
                            className="w-full bg-white border-none rounded-full py-5 pl-16 pr-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6">Rough Price (₦)</label>
                        <div className="relative">
                          <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                          <input 
                            type="number" 
                            value={newPrice}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-white border-none rounded-full py-5 pl-16 pr-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6">Which Store?</label>
                        <div className="relative">
                          <Store className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-200" />
                          <input 
                            type="text" 
                            value={newStore}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStore(e.target.value)}
                            placeholder="e.g. Campus Mart"
                            className="w-full bg-white border-none rounded-full py-5 pl-16 pr-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  <button 
                    onClick={addToCart}
                    className="w-full bg-apple-gray-500 text-white py-6 rounded-full font-black text-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-apple-gray-500/20"
                  >
                    <Plus className="w-6 h-6" /> Add to Shopping List
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="marketplace"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  {/* Category Filter */}
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "flex items-center gap-3 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border-2",
                          selectedCategory === cat.id 
                            ? "bg-apple-gray-500 text-white border-apple-gray-500 shadow-lg shadow-apple-gray-500/20" 
                            : "bg-white text-apple-gray-300 border-apple-gray-50 hover:border-apple-gray-100"
                        )}
                      >
                        <cat.icon className="w-4 h-4" />
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Market Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                    {filteredItems.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white rounded-[2.5rem] border border-apple-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col sm:flex-row"
                      >
                        {/* Image Preview */}
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-apple-gray-500">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col justify-between flex-grow">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-black text-xl text-apple-gray-500 mb-1 leading-tight">{item.name}</h4>
                                <div className="flex items-center gap-2 text-apple-gray-300 text-sm font-bold">
                                  <Store className="w-3.5 h-3.5" />
                                  {item.store}
                                  {item.shopInfo.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                                </div>
                              </div>
                              <div className="text-2xl font-black text-apple-gray-500">₦{item.price.toLocaleString()}</div>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-bold">
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                {item.rating} <span className="text-apple-gray-200">({item.reviews})</span>
                              </div>
                              <div className="flex items-center gap-1 text-apple-gray-300">
                                <Clock className="w-3.5 h-3.5" />
                                {item.deliveryTime}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-8">
                            <button 
                              onClick={() => setSelectedItem(item)}
                              className="flex-1 py-4 bg-apple-gray-50 text-apple-gray-500 rounded-2xl font-bold hover:bg-apple-gray-100 transition-all flex items-center justify-center gap-2"
                            >
                              <Info className="w-4 h-4" /> Details
                            </button>
                            <button 
                              onClick={() => addMarketplaceItem(item)}
                              className="flex-1 py-4 bg-apple-gray-500 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-apple-gray-500/20"
                            >
                              <Plus className="w-4 h-4" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Item Detail Modal */}
            <AnimatePresence>
              {selectedItem && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedItem(null)}
                    className="fixed inset-0 bg-apple-gray-500/40 backdrop-blur-md z-[70]"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed left-4 right-4 top-10 bottom-10 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-4xl sm:h-auto sm:max-h-[90vh] bg-white z-[80] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                  >
                    {/* Visual Preview Section */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-stone-100">
                      <img 
                        src={selectedItem.image} 
                        alt={selectedItem.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div className="space-y-2">
                          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-black uppercase tracking-widest text-white">
                            {selectedItem.category}
                          </span>
                        </div>
                        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-apple-gray-500 fill-current" />
                        </button>
                      </div>
                      <button 
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-8 right-8 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white hover:text-apple-gray-500 transition-all"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Info Section */}
                    <div className="w-full md:w-1/2 p-8 sm:p-12 overflow-y-auto flex flex-col">
                      <div className="flex-grow space-y-8">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h2 className="text-3xl font-black text-apple-gray-500 leading-tight">{selectedItem.name}</h2>
                            <div className="text-3xl font-black text-apple-gray-500">₦{selectedItem.price.toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-4 text-sm font-bold">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-4 h-4 fill-current" />
                              {selectedItem.rating} <span className="text-apple-gray-200">({selectedItem.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1 text-apple-gray-300">
                              <Clock className="w-4 h-4" />
                              {selectedItem.deliveryTime}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-apple-gray-200">Description</h4>
                          <p className="text-apple-gray-300 font-medium leading-relaxed text-lg">
                            {selectedItem.description}
                          </p>
                        </div>

                        <div className="p-6 bg-apple-gray-50 rounded-3xl space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-apple-gray-200">Shop Information</h4>
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                              <Store className="w-7 h-7 text-apple-gray-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-black text-apple-gray-500">{selectedItem.store}</h5>
                                {selectedItem.shopInfo.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                              </div>
                              <p className="text-sm text-apple-gray-300 font-medium">{selectedItem.shopInfo.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 flex gap-4">
                        <button 
                          onClick={() => {
                            addMarketplaceItem(selectedItem);
                            setSelectedItem(null);
                          }}
                          className="flex-grow py-5 bg-apple-gray-500 text-white rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-xl shadow-apple-gray-500/20 flex items-center justify-center gap-3"
                        >
                          <Plus className="w-6 h-6" /> Add to List
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Shopping List Trigger (Floating Icon) */}
            <button 
              onClick={() => setIsListOpen(true)}
              className="fixed bottom-10 right-10 w-20 h-20 bg-apple-gray-500 text-white rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-all z-40"
            >
              <div className="relative">
                <ShoppingCart className="w-8 h-8" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-apple-gray-500">
                    {cart.length}
                  </span>
                )}
              </div>
            </button>

            {/* Shopping List Drawer */}
            <AnimatePresence>
              {isListOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsListOpen(false)}
                    className="fixed inset-0 bg-apple-gray-500/20 backdrop-blur-sm z-50"
                  />
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[60] shadow-2xl p-8 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <h2 className="text-2xl font-bold text-apple-gray-500 flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6" /> Your List
                      </h2>
                      <button onClick={() => setIsListOpen(false)} className="p-2 bg-apple-gray-50 rounded-xl">
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                      {cart.length === 0 ? (
                        <div className="text-center py-20 bg-apple-gray-50 rounded-[2rem] border-2 border-dashed border-apple-gray-100">
                          <p className="text-apple-gray-200 font-medium">Your list is empty.</p>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <motion.div 
                            layout
                            key={item.id}
                            className="bg-white p-6 rounded-2xl border border-apple-gray-100 flex items-center justify-between shadow-sm"
                          >
                            <div>
                              <h4 className="font-bold text-lg text-apple-gray-500">{item.name}</h4>
                              <p className="text-sm text-apple-gray-300 font-medium">₦{item.price.toLocaleString()} • {item.store}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {cart.length > 0 && (
                      <div className="pt-8 border-t border-apple-gray-100 space-y-6">
                        <div className="flex justify-between items-center text-2xl font-bold text-apple-gray-500">
                          <span>Total Items</span>
                          <span>₦{cartTotal.toLocaleString()}</span>
                        </div>
                        <button 
                           onClick={() => {
                             setIsListOpen(false);
                             if (!user) {
                                navigate(`/auth?redirect=${encodeURIComponent('/buy-and-deliver?step=checkout')}`);
                              } else {
                                setStep('checkout');
                              }
                           }}
                           className="w-full bg-apple-gray-500 text-white py-5 rounded-2xl font-bold text-xl hover:opacity-90 transition-opacity shadow-xl flex items-center justify-center gap-3"
                         >
                           Checkout <ArrowRight className="w-6 h-6" />
                         </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-32 pb-20 px-4 max-w-6xl mx-auto space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Checkout</h1>
              <p className="text-2xl font-bold text-apple-gray-300 italic">One last step before we start shopping.</p>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <div className="bg-white p-10 sm:p-12 rounded-[3.5rem] border border-apple-gray-100 shadow-sm space-y-10">
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Your Delivery Location
                        </label>
                        <input 
                          type="text" 
                          value={locations.dropoff}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocations({ ...locations, dropoff: e.target.value })}
                          placeholder="e.g. Hall 4, Room 202"
                          className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                        />
                      </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-apple-gray-300 ml-6 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> Recipient Phone
                    </label>
                    <input 
                      type="tel" 
                      placeholder="080 0000 0000"
                      className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-apple-gray-500 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-24 h-24" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-3xl font-black tracking-tighter">Pick'em Protection</h3>
                    <p className="text-lg font-bold text-apple-gray-200 leading-relaxed">
                      Your items are insured. If anything is missing or damaged, we'll replace it or refund you instantly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-apple-gray-500 text-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-between h-fit lg:sticky lg:top-32">
                <div className="space-y-10">
                  <h3 className="text-3xl font-black tracking-tighter">Order Summary</h3>
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center group">
                        <div className="flex flex-col">
                          <span className="font-black text-xl leading-tight">{item.name}</span>
                          <span className="text-sm font-bold opacity-60 uppercase tracking-widest">{item.store}</span>
                        </div>
                        <span className="font-black text-xl">₦{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-10 border-t border-white/10 space-y-6">
                    <div className="flex justify-between font-bold text-lg opacity-80">
                      <span>Items Subtotal</span>
                      <span>₦{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg opacity-80">
                      <span>Service Fee</span>
                      <span>₦{serviceFee.toLocaleString()}</span>
                    </div>
                    {locations.dropoff && (
                      <div className="pt-6 border-t border-white/10 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Delivering To</div>
                        <div className="text-xl font-black">{locations.dropoff}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-12 space-y-8">
                  <div className="flex justify-between text-5xl font-black tracking-tighter">
                    <span>Total</span>
                    <span>₦{(cartTotal + serviceFee).toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (!locations.dropoff.trim()) {
                        alert('Please enter a delivery location');
                        return;
                      }
                      if (!user) {
                        navigate(`/auth?redirect=${encodeURIComponent('/buy-and-deliver?step=payment')}`);
                      } else {
                        setStep('payment');
                      }
                    }}
                    className="w-full bg-white text-apple-gray-500 py-6 rounded-[1.5rem] font-black text-2xl hover:bg-apple-gray-50 transition-colors shadow-2xl active:scale-[0.98]"
                  >
                    Confirm & Pay
                  </button>
                  <button 
                    onClick={() => setStep('shopping')}
                    className="w-full text-white/60 font-black hover:text-white transition-colors uppercase text-xs tracking-widest"
                  >
                    Edit List
                  </button>
                </div>
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
            <div className="bg-white p-12 rounded-[3.5rem] border border-apple-gray-100 shadow-2xl space-y-10">
              <div className="w-24 h-24 bg-apple-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                <CreditCard className="w-12 h-12 text-apple-gray-500" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black tracking-tighter text-apple-gray-500">Secure Payment</h2>
                <p className="text-xl font-bold text-apple-gray-300">Processing total of <span className="text-apple-gray-500">₦{(cartTotal + serviceFee).toLocaleString()}</span></p>
              </div>
              
              <div className="space-y-6">
                <div className="h-16 bg-apple-gray-50 rounded-2xl flex items-center px-6 gap-4 border border-apple-gray-100 shadow-inner">
                  <div className="w-10 h-6 bg-apple-gray-200 rounded" />
                  <div className="text-apple-gray-300 font-mono text-lg font-bold tracking-widest">**** **** **** 4242</div>
                </div>
                <button 
                  disabled={isSubmitting}
                  onClick={handleCheckoutWithFulfillment}
                  className="w-full bg-apple-gray-500 text-white py-6 rounded-2xl font-black text-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-apple-gray-500/20"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Payment'}
                </button>
                <button 
                  onClick={() => setStep('checkout')}
                  className="text-apple-gray-200 font-black hover:text-apple-gray-500 transition-colors uppercase text-xs tracking-widest"
                >
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
