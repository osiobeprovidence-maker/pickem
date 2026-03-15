import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Business, Product, Delivery, CustomerData, BusinessOrder, StorageSubscription, StorageLocation, StorageSize } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, Package, Settings, ShieldCheck, Plus, Trash2, Edit, CreditCard, 
  Activity, LayoutDashboard, Share2, Zap, Search, CheckCircle2, Clock, 
  ArrowRight, Image as ImageIcon, AlertCircle, Percent, Truck, Video, 
  X, MapPin, Users, BarChart3, TrendingUp, Globe, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

type Tab = 'overview' | 'storefront' | 'inventory' | 'storage' | 'kyc' | 'deliveries' | 'customers' | 'analytics' | 'settings' | 'pro';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTab = (searchParams.get('tab') as Tab) || 'overview';
  const activeTab = requestedTab === 'kyc' ? 'settings' : requestedTab;
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [businessOrders, setBusinessOrders] = useState<BusinessOrder[]>([]);
  const [storageSubscriptions, setStorageSubscriptions] = useState<StorageSubscription[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerAsset, setBannerAsset] = useState('');
  const [logoAsset, setLogoAsset] = useState('');
  const [productImageAsset, setProductImageAsset] = useState('');
  const [productVideoAsset, setProductVideoAsset] = useState('');
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [storageForm, setStorageForm] = useState<{
    location: StorageLocation;
    size: StorageSize;
    quantity: number;
    durationMonths: number;
    productIds: string[];
  }>({
    location: 'Lagos',
    size: 'small',
    quantity: 1,
    durationMonths: 1,
    productIds: [],
  });
  const [notificationSettings, setNotificationSettings] = useState({
    orderAlerts: true,
    deliveryAlerts: true,
    marketingEmails: false,
  });
  const [verificationSettings, setVerificationSettings] = useState({
    nin: '',
    proof_of_address: '',
  });
  const [payoutSettings, setPayoutSettings] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
  });
  const [manualCustomerForm, setManualCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    totalSpent: '',
    orderCount: '',
  });
  const [deliveryForm, setDeliveryForm] = useState({
    productId: '',
    quantity: 1,
    itemDescription: '',
    pickupLocation: '',
    dropLocation: '',
    contactDetails: '',
    fee: '',
  });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const savedNotifications = localStorage.getItem(`pickem_biz_notifications_${user.id}`);
    const savedPayouts = localStorage.getItem(`pickem_biz_payouts_${user.id}`);

    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }

    if (savedPayouts) {
      setPayoutSettings(JSON.parse(savedPayouts));
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await api.syncBusinessOrdersWithDeliveries(user!.id);
      const biz = await api.getBusiness(user!.id);
      if (biz) setBusiness(biz);
      setProducts(await api.getProducts(user!.id));
      setDeliveries(await api.getDeliveries('business', user!.id));
      setBusinessOrders(await api.getBusinessOrders(user!.id));
      setStorageSubscriptions(await api.getStorageSubscriptions(user!.id));
      setCustomers(await api.getBusinessCustomers(user!.id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setBannerAsset(business?.banner || '');
    setLogoAsset(business?.logo || '');
  }, [business?.banner, business?.logo]);

  useEffect(() => {
    setVerificationSettings({
      nin: business?.nin || '',
      proof_of_address: business?.proof_of_address || '',
    });
  }, [business?.nin, business?.proof_of_address]);

  useEffect(() => {
    setProductImageAsset(editingProduct?.image || '');
    setProductVideoAsset(editingProduct?.video || '');
  }, [editingProduct]);

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });

  const handleMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'banner' | 'logo',
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (field === 'banner') {
        setBannerAsset(dataUrl);
      } else {
        setLogoAsset(dataUrl);
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please try again.');
    } finally {
      event.target.value = '';
    }
  };

  const handleProductMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'image' | 'video',
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if ((field === 'image' && !isImage) || (field === 'video' && !isVideo)) {
      alert(field === 'image' ? 'Please upload an image file.' : 'Please upload a video file.');
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (field === 'image') {
        setProductImageAsset(dataUrl);
      } else {
        setProductVideoAsset(dataUrl);
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please try again.');
    } finally {
      event.target.value = '';
    }
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductImageAsset('');
    setProductVideoAsset('');
  };

  const storefrontUrl = user ? `${window.location.origin}/store/${user.id}` : '';

  const handleShareStorefront = async () => {
    if (!storefrontUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: business?.name || 'Pick\'em Storefront',
          text: `Check out ${business?.name || 'this store'} on Pick'em`,
          url: storefrontUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(storefrontUrl);
      alert('Storefront link copied!');
    } catch (error) {
      console.error(error);
      alert('Could not share the storefront right now.');
    }
  };

  const handleUpdateBusiness = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = await api.createOrUpdateBusiness({
      id: user!.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      address: formData.get('address') as string,
      location_type: formData.get('location_type') as any,
      is_remote: formData.get('location_type') === 'remote',
      logo: logoAsset,
      banner: bannerAsset,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      whatsapp: formData.get('whatsapp') as string,
      instagram: formData.get('instagram') as string,
      website: formData.get('website') as string,
      store_policy: formData.get('store_policy') as string,
    });
    setBusiness(updated);
    alert("Store updated!");
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!business?.is_pro && products.length >= 5 && !editingProduct?.id) {
      navigate('/dashboard/business?tab=pro');
      return;
    }
    await api.createOrUpdateProduct({
      ...editingProduct,
      business_id: user!.id,
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      stock: Number(formData.get('stock')),
      type: formData.get('type') as any,
      fulfillment_mode: formData.get('fulfillment_mode') as Product['fulfillment_mode'],
      is_published: true,
      image: productImageAsset || editingProduct?.image || '',
      video: productVideoAsset || editingProduct?.video || '',
    });
    closeProductModal();
    loadData();
  };

  const handleUpgradeToPro = async () => {
    const updated = await api.createOrUpdateBusiness({
      id: user!.id,
      is_pro: true,
    });
    setBusiness(updated);
    navigate('/dashboard/business');
    alert("Your business is now on Pick'em Pro.");
  };

  const handleDuplicateProduct = async (productId: string) => {
    await api.duplicateProduct(productId);
    loadData();
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.',
    );
    if (!confirmed) return;

    await api.deleteProduct(productId);
    loadData();
  };

  const handleApproveOrder = async (orderId: string) => {
    await api.dispatchBusinessOrder(orderId);
    loadData();
  };

  const handleCreateStorageSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!storageForm.productIds.length) {
      alert('Select at least one product for storage.');
      return;
    }

    await api.createStorageSubscription({
      business_id: user!.id,
      location: storageForm.location,
      size: storageForm.size,
      quantity: storageForm.quantity,
      durationMonths: storageForm.durationMonths,
      product_ids: storageForm.productIds,
    });

    setStorageForm({
      location: 'Lagos',
      size: 'small',
      quantity: 1,
      durationMonths: 1,
      productIds: [],
    });
    setIsStorageModalOpen(false);
    loadData();
  };

  const handleCreateDelivery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedProduct = products.find(product => product.id === deliveryForm.productId);
    const itemDescription = selectedProduct
      ? `${deliveryForm.quantity}x ${selectedProduct.name}`
      : deliveryForm.itemDescription.trim();

    const { id } = await api.createDelivery({
      type: 'business_delivery',
      business_id: user!.id,
      pickup_location: deliveryForm.pickupLocation.trim(),
      drop_location: deliveryForm.dropLocation.trim(),
      item_description: itemDescription,
      contact_details: deliveryForm.contactDetails.trim(),
      fee: deliveryForm.fee ? Number(deliveryForm.fee) : 0,
    });

    await api.updateDeliveryStatus(id, 'assigned', 'pickem-runner');

    setDeliveryForm({
      productId: '',
      quantity: 1,
      itemDescription: '',
      pickupLocation: '',
      dropLocation: '',
      contactDetails: '',
      fee: '',
    });
    setIsDeliveryModalOpen(false);
    await loadData();
    alert('Delivery dispatched through Pick\'em.');
  };

  const openDeliveryModal = () => {
    setDeliveryForm({
      productId: '',
      quantity: 1,
      itemDescription: '',
      pickupLocation: business?.address || '',
      dropLocation: '',
      contactDetails: '',
      fee: '',
    });
    setIsDeliveryModalOpen(true);
  };

  const orderStatusLabel: Record<BusinessOrder['status'], string> = {
    pending_approval: 'Pending Approval',
    ready_for_pickup: 'Pending Pickup',
    runner_assigned: 'Runner Assigned',
    out_for_delivery: 'In Transit',
    delivered: 'Delivered',
  };

  const storedProducts = products.filter(product => product.fulfillment_mode === 'warehouse');

  const handleSaveVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verificationSettings.nin.trim() || !verificationSettings.proof_of_address.trim()) {
      alert('Please add your NIN and proof of address before saving verification.');
      return;
    }

    const updated = await api.createOrUpdateBusiness({
      id: user!.id,
      nin: verificationSettings.nin.trim(),
      proof_of_address: verificationSettings.proof_of_address.trim(),
      kyc_status: 'pending',
    });
    setBusiness(updated);
    alert('Verification details saved.');
  };

  const handleSaveNotifications = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem(`pickem_biz_notifications_${user!.id}`, JSON.stringify(notificationSettings));
    alert('Notification settings saved.');
  };

  const handleSavePayouts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem(`pickem_biz_payouts_${user!.id}`, JSON.stringify(payoutSettings));
    alert('Payout settings saved.');
  };

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await api.upsertBusinessCustomer(user!.id, {
      name: manualCustomerForm.name,
      email: manualCustomerForm.email,
      phone: manualCustomerForm.phone,
      totalSpent: manualCustomerForm.totalSpent ? Number(manualCustomerForm.totalSpent) : 0,
      orderCount: manualCustomerForm.orderCount ? Number(manualCustomerForm.orderCount) : 0,
    });

    setManualCustomerForm({
      name: '',
      email: '',
      phone: '',
      totalSpent: '',
      orderCount: '',
    });

    setIsCustomerModalOpen(false);
    await loadData();
    alert('Customer saved.');
  };

  if (isLoading) return <div className="p-20 text-center font-black">Loading Hub...</div>;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-0">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Business Hub</h1>
                    <p className="text-2xl font-bold text-apple-gray-300 italic">Welcome back, {business?.name || user?.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link 
                      to={`/store/${user?.id}`}
                      className="px-8 py-4 bg-apple-gray-50 text-apple-gray-500 rounded-2xl font-black hover:bg-apple-gray-100 transition-all flex items-center gap-2 border border-apple-gray-100"
                    >
                      <Store className="w-5 h-5" /> View My Store
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Total Sales</div>
                    <div className="text-5xl font-black text-apple-gray-500 tracking-tighter">₦{customers.reduce((s, c) => s + c.total_spent, 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Customers</div>
                    <div className="text-5xl font-black text-apple-gray-500 tracking-tighter">{customers.length}</div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Products</div>
                    <div className="text-5xl font-black text-apple-gray-500 tracking-tighter">{products.length}</div>
                  </div>
                </div>

                {!business?.is_pro && (
                  <div className="bg-emerald-500 p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-3xl font-black tracking-tighter leading-none">Unlock Business Insights</h3>
                      <p className="font-bold opacity-80">Get full analytics, top customer data, and unlimited inventory.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/business?tab=pro')}
                      className="bg-white text-emerald-500 px-10 py-5 rounded-[1.5rem] font-black text-lg shadow-xl shrink-0"
                    >
                      Go Pro
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'analytics' && (business?.is_pro || true) && ( // Allowing for demo
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="space-y-4 mb-12">
                  <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Insights</h1>
                  <p className="text-2xl font-bold text-apple-gray-300 italic">Deep dive into your business performance.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> Top Customers</h3>
                    <div className="space-y-4">
                      {customers.sort((a, b) => b.total_spent - a.total_spent).slice(0, 5).map(c => (
                        <div key={c.id} className="flex justify-between items-center p-4 bg-apple-gray-50 rounded-2xl">
                          <div className="font-black text-apple-gray-500">{c.name}</div>
                          <div className="font-black text-emerald-600">₦{c.total_spent.toLocaleString()}</div>
                        </div>
                      ))}
                      {customers.length === 0 && <p className="text-apple-gray-200 italic">No customer data yet.</p>}
                    </div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-2"><Package className="w-5 h-5 text-blue-500" /> Best Sellers</h3>
                    <div className="space-y-4">
                      {products.sort((a, b) => b.stock - a.stock).slice(0, 5).map(p => (
                        <div key={p.id} className="flex justify-between items-center p-4 bg-apple-gray-50 rounded-2xl">
                          <div className="font-black text-apple-gray-500">{p.name}</div>
                          <div className="text-xs font-bold text-apple-gray-300 uppercase">{p.type}</div>
                        </div>
                      ))}
                      {products.length === 0 && <p className="text-apple-gray-200 italic">No inventory yet.</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div key="customers-manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
                  <div className="space-y-4 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-apple-gray-500">Customers</h1>
                    <p className="text-xl md:text-2xl font-bold text-apple-gray-300 italic">Manage your customer relationships and add customers manually.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90"
                  >
                    <Plus className="w-4 h-4" />
                    Add Customer
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 mb-3">Customer Count</div>
                    <div className="text-4xl font-black text-apple-gray-500">{customers.length}</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 mb-3">Lifetime Value</div>
                    <div className="text-4xl font-black text-emerald-600">N{customers.reduce((sum, customer) => sum + customer.total_spent, 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 mb-3">Total Orders</div>
                    <div className="text-4xl font-black text-apple-gray-500">{customers.reduce((sum, customer) => sum + customer.order_count, 0)}</div>
                  </div>
                </div>
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-apple-gray-100 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left min-w-[780px]">
                      <thead className="bg-apple-gray-50 text-[10px] font-black uppercase tracking-widest text-apple-gray-300">
                        <tr>
                          <th className="p-6 md:p-8">Name</th>
                          <th className="p-6 md:p-8">Email & Phone</th>
                          <th className="p-6 md:p-8">Total Spent</th>
                          <th className="p-6 md:p-8">Orders</th>
                          <th className="p-6 md:p-8">Last Activity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-apple-gray-50">
                        {customers
                          .slice()
                          .sort((a, b) => new Date(b.last_purchase_date).getTime() - new Date(a.last_purchase_date).getTime())
                          .map(c => (
                            <tr key={c.id} className="hover:bg-apple-gray-50 transition-colors">
                              <td className="p-6 md:p-8 font-black text-apple-gray-500">{c.name}</td>
                              <td className="p-6 md:p-8 space-y-1">
                                <div className="font-bold text-apple-gray-500 text-sm">{c.email}</div>
                                <div className="text-xs text-apple-gray-200">{c.phone}</div>
                              </td>
                              <td className="p-6 md:p-8 font-black text-emerald-600">N{c.total_spent.toLocaleString()}</td>
                              <td className="p-6 md:p-8 font-black text-apple-gray-500">{c.order_count}</td>
                              <td className="p-6 md:p-8 text-sm font-bold text-apple-gray-300">{format(new Date(c.last_purchase_date), 'MMM d, yyyy')}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {customers.length === 0 && (
                    <div className="p-20 text-center text-apple-gray-200 font-bold italic">No customers collected yet.</div>
                  )}
                </div>
              </motion.div>
            )}

            {false && activeTab === 'customers' && (
              <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="space-y-4 mb-12 text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-apple-gray-500">Customers</h1>
                  <p className="text-xl md:text-2xl font-bold text-apple-gray-300 italic">Manage your customer relationships and add customers manually.</p>
                </div>
                <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-apple-gray-100 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left min-w-[700px]">
                      <thead className="bg-apple-gray-50 text-[10px] font-black uppercase tracking-widest text-apple-gray-300">
                        <tr>
                          <th className="p-6 md:p-8">Name</th>
                          <th className="p-6 md:p-8">Email & Phone</th>
                          <th className="p-6 md:p-8">Total Spent</th>
                          <th className="p-6 md:p-8">Orders</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-apple-gray-50">
                        {customers.map(c => (
                          <tr key={c.id} className="hover:bg-apple-gray-50 transition-colors">
                            <td className="p-6 md:p-8 font-black text-apple-gray-500">{c.name}</td>
                            <td className="p-6 md:p-8 space-y-1">
                              <div className="font-bold text-apple-gray-500 text-sm">{c.email}</div>
                              <div className="text-xs text-apple-gray-200">{c.phone}</div>
                            </td>
                            <td className="p-6 md:p-8 font-black text-emerald-600">₦{c.total_spent.toLocaleString()}</td>
                            <td className="p-6 md:p-8 font-black text-apple-gray-500">{c.order_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {customers.length === 0 && (
                    <div className="p-20 text-center text-apple-gray-200 font-bold italic">No customers collected yet.</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'storefront' && (
              <motion.div key="storefront" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="bg-white p-12 rounded-[3.5rem] border border-apple-gray-100 shadow-sm space-y-12">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-4xl font-black text-apple-gray-500">Store Profile</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/store/${user?.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 bg-apple-gray-50 px-6 py-3 text-sm font-black text-apple-gray-500 transition-colors hover:bg-apple-gray-100"
                      >
                        <Store className="w-4 h-4" />
                        View Storefront
                      </Link>
                      <button
                        type="button"
                        onClick={handleShareStorefront}
                        className="inline-flex items-center gap-2 rounded-full bg-apple-gray-500 px-6 py-3 text-sm font-black text-white transition-opacity hover:opacity-90"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Storefront
                      </button>
                    </div>
                  </div>
                  <form onSubmit={handleUpdateBusiness} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Store Banner</label>
                        <div className="space-y-4 rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5 shadow-sm">
                          <div className="aspect-[16/7] overflow-hidden rounded-[1.5rem] bg-white">
                            {bannerAsset ? (
                              <img src={bannerAsset} alt="Store banner preview" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center gap-3 text-apple-gray-200">
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-sm font-bold">No banner uploaded yet</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-flex cursor-pointer items-center rounded-full bg-apple-gray-500 px-5 py-3 text-sm font-black text-white transition-opacity hover:opacity-90">
                              Upload Banner
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => handleMediaUpload(event, 'banner')}
                              />
                            </label>
                            {bannerAsset && (
                              <button
                                type="button"
                                onClick={() => setBannerAsset('')}
                                className="rounded-full border border-apple-gray-200 px-5 py-3 text-sm font-black text-apple-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
                              >
                                Remove
                              </button>
                            )}
                            <span className="text-xs font-bold text-apple-gray-300">JPG, PNG, or WebP</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Store Logo</label>
                        <div className="space-y-4 rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5 shadow-sm">
                          <div className="flex h-48 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white">
                            {logoAsset ? (
                              <img src={logoAsset} alt="Store logo preview" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex items-center gap-3 text-apple-gray-200">
                                <Store className="w-5 h-5" />
                                <span className="text-sm font-bold">No logo uploaded yet</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-flex cursor-pointer items-center rounded-full bg-apple-gray-500 px-5 py-3 text-sm font-black text-white transition-opacity hover:opacity-90">
                              Upload Logo
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => handleMediaUpload(event, 'logo')}
                              />
                            </label>
                            {logoAsset && (
                              <button
                                type="button"
                                onClick={() => setLogoAsset('')}
                                className="rounded-full border border-apple-gray-200 px-5 py-3 text-sm font-black text-apple-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
                              >
                                Remove
                              </button>
                            )}
                            <span className="text-xs font-bold text-apple-gray-300">Square image recommended</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Location Type</label>
                        <select name="location_type" defaultValue={business?.location_type} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 appearance-none shadow-sm">
                          <option value="on_campus">On Campus Physical Store</option>
                          <option value="off_campus">Off Campus Physical Store</option>
                          <option value="remote">Remote / Online Only</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Store Name</label>
                        <input name="name" defaultValue={business?.name} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-apple-gray-500 border-b border-apple-gray-50 pb-4">
                        Contact & Socials
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Public Email</label>
                          <input name="email" defaultValue={business?.email} placeholder="hello@store.com" className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Public Phone</label>
                          <input name="phone" defaultValue={business?.phone} placeholder="+234..." className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">WhatsApp Number</label>
                          <input name="whatsapp" defaultValue={business?.whatsapp} placeholder="+234..." className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Instagram Handle</label>
                          <input name="instagram" defaultValue={business?.instagram} placeholder="@store_handle" className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm" />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Business Policy</label>
                          <textarea
                            name="store_policy"
                            defaultValue={business?.store_policy}
                            placeholder="Add your refund, exchange, delivery, payment, and order policies here."
                            className="w-full min-h-[180px] rounded-[2.5rem] border-none bg-apple-gray-50 px-8 py-6 font-bold text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Description (About Us)</label>
                      <textarea name="description" defaultValue={business?.description} className="w-full bg-apple-gray-50 border-none rounded-[2.5rem] py-6 px-8 focus:ring-2 focus:ring-apple-gray-500 outline-none font-bold text-apple-gray-500 shadow-sm min-h-[120px]" />
                    </div>
                    <button className="w-full bg-apple-gray-500 text-white py-6 rounded-full font-black text-xl shadow-xl">Save Storefront</button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* inventory tab */}
            {activeTab === 'inventory' && (
              <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Inventory</h1>
                    <p className="text-2xl font-bold text-apple-gray-300 italic">Manage your products and services.</p>
                  </div>
                  <button 
                    onClick={() => { setEditingProduct({}); setIsProductModalOpen(true); }}
                    className="bg-apple-gray-500 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Plus className="w-6 h-6" /> Add Item
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(prod => (
                    <div key={prod.id} className="bg-white p-8 rounded-[3rem] border border-apple-gray-100 shadow-sm group">
                      <div className="aspect-square bg-apple-gray-50 rounded-[2.5rem] mb-6 overflow-hidden relative">
                        {prod.video ? (
                          <video
                            src={prod.video}
                            poster={prod.image}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            autoPlay
                            playsInline
                          />
                        ) : prod.image ? (
                          <img src={prod.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center gap-3 text-apple-gray-200">
                            <Package className="w-6 h-6" />
                            <span className="text-sm font-bold">No media uploaded</span>
                          </div>
                        )}
                        {prod.video && (
                          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 shadow-sm">
                            Video
                          </div>
                        )}
                        <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-apple-gray-500 shadow-sm">
                          {prod.fulfillment_mode === 'warehouse' ? 'Storage Fulfillment' : 'Manual Approval'}
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button onClick={() => { setEditingProduct(prod); setIsProductModalOpen(true); }} className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-apple-gray-500 shadow-sm"><Edit className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-[10px] font-black uppercase text-apple-gray-200">{prod.type}</div>
                        <h3 className="text-xl font-black text-apple-gray-500">{prod.name}</h3>
                        <div className="text-2xl font-black text-apple-gray-500">₦{prod.price.toLocaleString()}</div>
                        <div className="flex flex-wrap items-center gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() => { setEditingProduct(prod); setIsProductModalOpen(true); }}
                            className="rounded-full bg-apple-gray-50 px-4 py-2 text-xs font-black text-apple-gray-500 transition-colors hover:bg-apple-gray-100"
                          >
                            Edit Product
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateProduct(prod.id)}
                            className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100"
                          >
                            Duplicate Product
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600 transition-colors hover:bg-red-100"
                          >
                            Delete Product
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <div className="col-span-full p-20 text-center text-apple-gray-200 font-bold italic">Inventory is empty.</div>}
                </div>
              </motion.div>
            )}

            {/* storage tab */}
            {activeTab === 'storage' && (
              <motion.div key="storage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Storage</h1>
                    <p className="text-2xl font-bold text-apple-gray-300 italic">Manage your Pick'em fulfillment storage and automation.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsStorageModalOpen(true)}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90"
                  >
                    <Plus className="w-4 h-4" />
                    Add Storage
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Stored Products</div>
                    <div className="text-4xl font-black text-apple-gray-500">{storedProducts.length}</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Active Plans</div>
                    <div className="text-4xl font-black text-apple-gray-500">{storageSubscriptions.filter(plan => plan.active).length}</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Monthly Cost</div>
                    <div className="text-4xl font-black text-apple-gray-500">N{storageSubscriptions.reduce((sum, plan) => sum + plan.monthly_cost, 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Auto Fulfillment</div>
                    <div className="text-4xl font-black text-emerald-600">{businessOrders.filter(order => order.fulfillment_mode === 'warehouse').length}</div>
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-8">
                  <h2 className="text-3xl font-black text-apple-gray-500">Storage Dashboard</h2>
                  <div className="space-y-4">
                    {storageSubscriptions.length === 0 && (
                      <div className="rounded-[2rem] border border-dashed border-apple-gray-100 p-12 text-center text-apple-gray-300 font-bold">
                        No storage subscription yet.
                      </div>
                    )}
                    {storageSubscriptions.map(plan => (
                      <div key={plan.id} className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="text-lg font-black text-apple-gray-500">{plan.location} Warehouse</div>
                            <div className="text-xs font-black uppercase tracking-widest text-apple-gray-200">{plan.size} storage</div>
                          </div>
                          <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 border border-emerald-100">
                            {plan.active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-bold text-apple-gray-400">
                          <div><div className="text-[10px] uppercase tracking-widest text-apple-gray-200">Monthly Cost</div><div className="mt-1 text-apple-gray-500">N{plan.monthly_cost.toLocaleString()}</div></div>
                          <div><div className="text-[10px] uppercase tracking-widest text-apple-gray-200">Inventory Qty</div><div className="mt-1 text-apple-gray-500">{plan.quantity}</div></div>
                          <div><div className="text-[10px] uppercase tracking-widest text-apple-gray-200">Products</div><div className="mt-1 text-apple-gray-500">{plan.product_ids.length}</div></div>
                          <div><div className="text-[10px] uppercase tracking-widest text-apple-gray-200">Expires</div><div className="mt-1 text-apple-gray-500">{format(new Date(plan.expires_at), 'MMM d, yyyy')}</div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* deliveries tab */}
            {activeTab === 'deliveries' && (
              <motion.div key="deliveries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter text-apple-gray-500">Deliveries</h1>
                    <p className="text-2xl font-bold text-apple-gray-300 italic">Dispatch sold products with Pick&apos;em and track fulfillment progress.</p>
                  </div>
                  <button
                    type="button"
                    onClick={openDeliveryModal}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90"
                  >
                    <Plus className="w-4 h-4" />
                    Add Delivery
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm"><div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Pending Approval</div><div className="text-4xl font-black text-apple-gray-500">{businessOrders.filter(order => order.status === 'pending_approval').length}</div></div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm"><div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Pending Pickup</div><div className="text-4xl font-black text-apple-gray-500">{businessOrders.filter(order => order.status === 'ready_for_pickup').length}</div></div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm"><div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">In Transit</div><div className="text-4xl font-black text-apple-gray-500">{businessOrders.filter(order => order.status === 'runner_assigned' || order.status === 'out_for_delivery').length}</div></div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm"><div className="text-[10px] font-black uppercase text-apple-gray-200 mb-2">Delivered</div><div className="text-4xl font-black text-emerald-600">{businessOrders.filter(order => order.status === 'delivered').length}</div></div>
                </div>
                <div className="space-y-4">
                  {businessOrders.length === 0 && <div className="p-12 text-center text-apple-gray-200 font-bold italic bg-white rounded-[2.5rem] border border-apple-gray-100 shadow-sm">No business fulfillment orders yet.</div>}
                  {businessOrders.map(order => (
                    <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm space-y-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-apple-gray-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-apple-gray-300">
                              {order.fulfillment_mode === 'warehouse' ? 'Storage Auto Dispatch' : 'Dispatch on Request'}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                              {orderStatusLabel[order.status]}
                            </span>
                          </div>
                          <div className="text-2xl font-black text-apple-gray-500">{order.product_name}</div>
                          <div className="text-sm font-bold text-apple-gray-300">{order.quantity} item(s) • Customer: {order.customer_name} • {format(new Date(order.created_at), 'MMM d, h:mm a')}</div>
                          <div className="text-sm font-bold text-apple-gray-400">Pickup: {order.pickup_location} • Dropoff: {order.drop_location}</div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-3">
                          <div className="text-3xl font-black text-apple-gray-500">N{order.total_amount.toLocaleString()}</div>
                          {order.status === 'pending_approval' && order.fulfillment_mode === 'manual' && (
                            <button type="button" onClick={() => handleApproveOrder(order.id)} className="rounded-full bg-apple-gray-500 px-6 py-3 text-sm font-black text-white shadow-sm hover:opacity-90">
                              Dispatch via Pick&apos;em
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {deliveries.map(del => (
                    <div key={del.id} className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-apple-gray-50 rounded-2xl flex items-center justify-center text-apple-gray-300"><Package className="w-7 h-7" /></div>
                        <div>
                          <div className="font-black text-apple-gray-500">{del.item_description}</div>
                          <div className="text-xs font-bold text-apple-gray-200 uppercase">{del.status} • {format(new Date(del.created_at), 'MMM d, h:mm a')}</div>
                        </div>
                      </div>
                      <button className="px-6 py-3 bg-apple-gray-50 text-apple-gray-500 rounded-xl font-black text-sm">Details</button>
                    </div>
                  ))}
                  {deliveries.length === 0 && <div className="p-20 text-center text-apple-gray-200 font-bold italic">No active deliveries.</div>}
                </div>
              </motion.div>
            )}

            {/* settings tab */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black tracking-tighter text-apple-gray-500">Business Settings</h2>
                  <p className="text-xl font-bold text-apple-gray-300 italic">Manage verification, notifications, and payout information for your store.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-3 text-emerald-600">
                      <ShieldCheck className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-[0.35em]">Verification</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-3xl font-black text-apple-gray-500">Merchant Status</div>
                      <span
                        className={cn(
                          'rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest border',
                          business?.kyc_status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : business?.kyc_status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-apple-gray-50 text-apple-gray-300 border-apple-gray-100'
                        )}
                      >
                        {business?.kyc_status || 'none'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-apple-gray-300">Add identity and address details to move your store toward verified business status.</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-3 text-apple-gray-300">
                      <Activity className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-[0.35em]">Notifications</span>
                    </div>
                    <div className="text-3xl font-black text-apple-gray-500">
                      {Object.values(notificationSettings).filter(Boolean).length}/3 enabled
                    </div>
                    <p className="text-sm font-bold text-apple-gray-300">Control alerts for new orders, fulfillment activity, and growth updates.</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-apple-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-3 text-apple-gray-300">
                      <CreditCard className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-[0.35em]">Payouts</span>
                    </div>
                    <div className="text-3xl font-black text-apple-gray-500">
                      {payoutSettings.bankName && payoutSettings.accountNumber ? 'Ready' : 'Incomplete'}
                    </div>
                    <p className="text-sm font-bold text-apple-gray-300">Set the bank account where your business earnings should be settled.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8">
                  <form onSubmit={handleSaveVerification} className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-2xl font-black text-apple-gray-500">Verification</h3>
                        <span
                          className={cn(
                            'rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest border',
                            business?.kyc_status === 'verified'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : business?.kyc_status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-apple-gray-50 text-apple-gray-300 border-apple-gray-100'
                          )}
                        >
                          {business?.kyc_status || 'none'}
                        </span>
                      </div>
                      <p className="text-apple-gray-300 font-bold">Submit identity and address information to unlock the verified merchant badge.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-4">National ID / NIN</label>
                        <input
                          name="nin"
                          value={verificationSettings.nin}
                          onChange={(e) =>
                            setVerificationSettings(settings => ({
                              ...settings,
                              nin: e.target.value,
                            }))
                          }
                          placeholder="Enter your NIN"
                          className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-4">Proof of Address</label>
                        <input
                          name="proof_of_address"
                          value={verificationSettings.proof_of_address}
                          onChange={(e) =>
                            setVerificationSettings(settings => ({
                              ...settings,
                              proof_of_address: e.target.value,
                            }))
                          }
                          placeholder="Upload link or document reference"
                          className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="rounded-[2rem] bg-apple-gray-50 px-6 py-5 text-sm font-bold text-apple-gray-300">
                      Verification submissions are stored with your business profile and marked as pending review.
                    </div>
                    <button className="rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90">
                      Save Verification
                    </button>
                  </form>

                  <div className="space-y-8">
                    <form onSubmit={handleSaveNotifications} className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-8">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-black text-apple-gray-500">Notifications</h3>
                        <p className="text-apple-gray-300 font-bold">Choose how Pick'em should notify you about store activity.</p>
                      </div>
                      <div className="space-y-4">
                        {[
                          ['orderAlerts', 'New order alerts', 'Get notified whenever a customer places an order.'],
                          ['deliveryAlerts', 'Delivery status updates', 'Stay on top of runner assignment and drop-off progress.'],
                          ['marketingEmails', 'Marketing and growth tips', 'Receive product updates and recommendations for your store.'],
                        ].map(([key, label, description]) => (
                          <label key={key} className="flex items-start justify-between gap-4 rounded-[1.75rem] bg-apple-gray-50 px-6 py-5">
                            <div className="space-y-1">
                              <div className="font-black text-apple-gray-500">{label}</div>
                              <div className="text-sm font-bold text-apple-gray-300">{description}</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings[key as keyof typeof notificationSettings]}
                              onChange={(e) =>
                                setNotificationSettings(settings => ({
                                  ...settings,
                                  [key]: e.target.checked,
                                }))
                              }
                              className="mt-1 h-5 w-5 accent-emerald-600"
                            />
                          </label>
                        ))}
                      </div>
                      <button className="rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90">
                        Save Notifications
                      </button>
                    </form>

                    <form onSubmit={handleSavePayouts} className="bg-white p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-8">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-black text-apple-gray-500">Payouts</h3>
                        <p className="text-apple-gray-300 font-bold">Add the bank details where business earnings should be settled.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          value={payoutSettings.bankName}
                          onChange={(e) => setPayoutSettings(settings => ({ ...settings, bankName: e.target.value }))}
                          placeholder="Bank name"
                          className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                        />
                        <input
                          value={payoutSettings.accountName}
                          onChange={(e) => setPayoutSettings(settings => ({ ...settings, accountName: e.target.value }))}
                          placeholder="Account name"
                          className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                        />
                        <input
                          value={payoutSettings.accountNumber}
                          onChange={(e) =>
                            setPayoutSettings(settings => ({
                              ...settings,
                              accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                            }))
                          }
                          inputMode="numeric"
                          placeholder="Account number"
                          className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                        />
                      </div>
                      <div className="rounded-[2rem] bg-apple-gray-50 px-6 py-5 text-sm font-bold text-apple-gray-300">
                        Payout details are saved only for this business dashboard profile in the current browser.
                      </div>
                      <button className="rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90">
                        Save Payout Details
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pro' && (
              <motion.div key="pro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="rounded-[3.5rem] overflow-hidden border border-emerald-200 shadow-sm">
                  <div className="bg-emerald-500 px-8 py-12 md:px-14 md:py-16 text-white">
                    <div className="max-w-4xl space-y-5">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em]">
                        Pick&apos;em Pro
                      </div>
                      <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Upgrade your business dashboard</h1>
                      <p className="max-w-2xl text-base md:text-lg font-bold text-emerald-50/90">
                        Unlock unlimited inventory, richer business insights, and advanced fulfillment tools built for serious campus merchants.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white px-8 py-10 md:px-14 md:py-14 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 space-y-3">
                        <Package className="w-6 h-6 text-emerald-600" />
                        <div className="text-lg font-black text-apple-gray-500">Unlimited Inventory</div>
                        <p className="text-sm font-bold text-apple-gray-300">Add as many products as you need without the starter item cap.</p>
                      </div>
                      <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 space-y-3">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                        <div className="text-lg font-black text-apple-gray-500">Deeper Insights</div>
                        <p className="text-sm font-bold text-apple-gray-300">Track customer behavior, repeat buyers, and store performance in more detail.</p>
                      </div>
                      <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 space-y-3">
                        <Truck className="w-6 h-6 text-emerald-600" />
                        <div className="text-lg font-black text-apple-gray-500">Priority Fulfillment</div>
                        <p className="text-sm font-bold text-apple-gray-300">Run a more powerful logistics workflow across storage, dispatch, and delivery.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
                      <div className="rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-50 p-8 md:p-10 space-y-6">
                        <div className="space-y-2">
                          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-700">What You Get</div>
                          <h2 className="text-3xl font-black tracking-tighter text-apple-gray-500">Built for growing campus businesses</h2>
                        </div>
                        <div className="space-y-4">
                          {[
                            'Unlimited product listings',
                            'Advanced customer and sales insights',
                            'Stronger fulfillment and storage workflows',
                            'Business tools designed for scale',
                          ].map(feature => (
                            <div key={feature} className="flex items-center gap-3 rounded-[1.5rem] bg-white px-5 py-4">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <span className="font-black text-apple-gray-500">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[2.5rem] border border-emerald-100 bg-emerald-50 p-8 md:p-10 space-y-6">
                        <div className="space-y-2">
                          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-700">Founding Plan</div>
                          <div className="text-5xl font-black tracking-tighter text-apple-gray-500">
                            N5,000<span className="text-lg text-apple-gray-300">/month</span>
                          </div>
                          <p className="text-sm font-bold text-apple-gray-300">
                            This is a local demo upgrade flow for now, so activating Pro updates your business instantly in this workspace.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleUpgradeToPro}
                          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-5 text-sm font-black text-white shadow-sm hover:opacity-90"
                        >
                          <Zap className="w-4 h-4" />
                          {business?.is_pro ? 'Pick&apos;em Pro Active' : 'Activate Pick&apos;em Pro'}
                        </button>
                        <Link
                          to="/dashboard/business"
                          className="inline-flex w-full items-center justify-center rounded-full border border-apple-gray-100 px-8 py-5 text-sm font-black text-apple-gray-500"
                        >
                          Back to Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl rounded-[3rem] bg-white p-8 md:p-12 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-600">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-apple-gray-500">Add Customer</h2>
                  <p className="mt-2 text-sm md:text-base font-bold text-apple-gray-300">Create or update a customer record manually for this business.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="rounded-full bg-apple-gray-50 p-4 text-apple-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="mt-10 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <input
                  required
                  value={manualCustomerForm.name}
                  onChange={(e) => setManualCustomerForm(form => ({ ...form, name: e.target.value }))}
                  placeholder="Customer name"
                  className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                />
                <input
                  required
                  type="email"
                  value={manualCustomerForm.email}
                  onChange={(e) => setManualCustomerForm(form => ({ ...form, email: e.target.value }))}
                  placeholder="Email address"
                  className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                />
                <input
                  required
                  value={manualCustomerForm.phone}
                  onChange={(e) => setManualCustomerForm(form => ({ ...form, phone: e.target.value }))}
                  placeholder="Phone number"
                  className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    min="0"
                    type="number"
                    value={manualCustomerForm.totalSpent}
                    onChange={(e) => setManualCustomerForm(form => ({ ...form, totalSpent: e.target.value }))}
                    placeholder="Total spent"
                    className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                  />
                  <input
                    min="0"
                    type="number"
                    value={manualCustomerForm.orderCount}
                    onChange={(e) => setManualCustomerForm(form => ({ ...form, orderCount: e.target.value }))}
                    placeholder="Order count"
                    className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="rounded-[2rem] bg-apple-gray-50 px-6 py-5 text-sm font-bold text-apple-gray-300">
                If the email already exists for this business, the customer record will be updated instead of duplicated.
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="rounded-full border border-apple-gray-100 px-6 py-4 text-sm font-black text-apple-gray-500"
                >
                  Cancel
                </button>
                <button className="inline-flex items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90">
                  <Plus className="w-4 h-4" />
                  Save Customer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isStorageModalOpen && (
        <div className="fixed inset-0 z-[195] flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-3xl rounded-[3rem] bg-white p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-600">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-apple-gray-500">New Storage Plan</h2>
                  <p className="mt-2 text-sm md:text-base font-bold text-apple-gray-300">Choose a Pick'em warehouse, set your storage size, and link physical products for fulfillment.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStorageModalOpen(false)}
                className="rounded-full bg-apple-gray-50 p-4 text-apple-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStorageSubscription} className="mt-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-4">Warehouse Location</label>
                  <select value={storageForm.location} onChange={(e) => setStorageForm(form => ({ ...form, location: e.target.value as StorageLocation }))} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 appearance-none shadow-sm">
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Warri">Warri</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-4">Storage Size</label>
                  <select value={storageForm.size} onChange={(e) => setStorageForm(form => ({ ...form, size: e.target.value as StorageSize }))} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 appearance-none shadow-sm">
                    <option value="small">Small Storage</option>
                    <option value="medium">Medium Storage</option>
                    <option value="large">Large Storage</option>
                    <option value="custom">Custom Storage</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-4">Inventory Quantity</label>
                  <input type="number" min="1" value={storageForm.quantity} onChange={(e) => setStorageForm(form => ({ ...form, quantity: Number(e.target.value) }))} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-4">Monthly Duration</label>
                  <input type="number" min="1" value={storageForm.durationMonths} onChange={(e) => setStorageForm(form => ({ ...form, durationMonths: Number(e.target.value) }))} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-4">Stored Products</label>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {products.filter(product => product.type === 'physical').map(product => (
                    <label key={product.id} className="flex items-center gap-3 rounded-[1.5rem] bg-apple-gray-50 px-5 py-4 text-sm font-bold text-apple-gray-500">
                      <input
                        type="checkbox"
                        checked={storageForm.productIds.includes(product.id)}
                        onChange={(e) =>
                          setStorageForm(form => ({
                            ...form,
                            productIds: e.target.checked ? [...form.productIds, product.id] : form.productIds.filter(id => id !== product.id),
                          }))
                        }
                      />
                      <span>{product.name}</span>
                    </label>
                  ))}
                  {products.filter(product => product.type === 'physical').length === 0 && (
                    <div className="rounded-[1.5rem] border border-dashed border-apple-gray-100 px-5 py-8 text-center text-sm font-bold text-apple-gray-300">
                      Add physical products to inventory before creating a storage plan.
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-[2rem] bg-apple-gray-50 px-6 py-5 text-sm font-bold text-apple-gray-300">
                Storage plans are billed monthly based on location, size, and the amount of inventory you place in Pick'em fulfillment.
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStorageModalOpen(false)}
                  className="rounded-full border border-apple-gray-100 px-6 py-4 text-sm font-black text-apple-gray-500"
                >
                  Cancel
                </button>
                <button className="inline-flex items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90">
                  <Plus className="w-4 h-4" />
                  Activate Storage
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-[198] flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-3xl rounded-[3rem] bg-white p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-600">
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-apple-gray-500">Add Delivery</h2>
                  <p className="mt-2 text-sm md:text-base font-bold text-apple-gray-300">Create a business delivery and dispatch it through Pick&apos;em&apos;s runner network.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeliveryModalOpen(false)}
                className="rounded-full bg-apple-gray-50 p-4 text-apple-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDelivery} className="mt-10 space-y-6">
              <div className="rounded-[2.25rem] border border-apple-gray-100 bg-apple-gray-50/70 p-6 space-y-5">
                <div className="space-y-1">
                  <div className="text-sm font-black text-apple-gray-500">Pick an inventory item</div>
                  <div className="text-xs font-bold text-apple-gray-300">Choose a product from your store or leave it blank to enter a custom delivery item.</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4">
                  <select
                    value={deliveryForm.productId}
                    onChange={(e) => {
                      const nextProductId = e.target.value;
                      const nextProduct = products.find(product => product.id === nextProductId);
                      setDeliveryForm(form => ({
                        ...form,
                        productId: nextProductId,
                        itemDescription: nextProduct ? nextProduct.name : form.itemDescription,
                      }));
                    }}
                    className="w-full bg-white border border-apple-gray-100 rounded-full py-5 px-8 font-bold text-apple-gray-500 appearance-none shadow-sm"
                  >
                    <option value="">Custom delivery item</option>
                    {products.filter(product => product.type === 'physical').map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - N{product.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <input
                    min="1"
                    type="number"
                    value={deliveryForm.quantity}
                    onChange={(e) =>
                      setDeliveryForm(form => ({
                        ...form,
                        quantity: Number(e.target.value) || 1,
                      }))
                    }
                    placeholder="Quantity"
                    className="w-full bg-white border border-apple-gray-100 rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    required
                    value={deliveryForm.itemDescription}
                    onChange={(e) => setDeliveryForm(form => ({ ...form, itemDescription: e.target.value }))}
                    placeholder="Item description"
                    className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                  />
                </div>
                <input
                  required
                  value={deliveryForm.pickupLocation}
                  onChange={(e) => setDeliveryForm(form => ({ ...form, pickupLocation: e.target.value }))}
                  placeholder="Pickup location"
                  className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                />
                <input
                  required
                  value={deliveryForm.dropLocation}
                  onChange={(e) => setDeliveryForm(form => ({ ...form, dropLocation: e.target.value }))}
                  placeholder="Dropoff location"
                  className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                />
                <input
                  required
                  value={deliveryForm.contactDetails}
                  onChange={(e) => setDeliveryForm(form => ({ ...form, contactDetails: e.target.value }))}
                  placeholder="Receiver contact details"
                  className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                />
                <input
                  min="0"
                  type="number"
                  value={deliveryForm.fee}
                  onChange={(e) => setDeliveryForm(form => ({ ...form, fee: e.target.value }))}
                  placeholder="Delivery fee"
                  className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm"
                />
              </div>
              <div className="rounded-[2rem] bg-apple-gray-50 px-6 py-5 text-sm font-bold text-apple-gray-300">
                Once submitted, Pick&apos;em immediately creates the delivery and assigns a runner so it appears in your live delivery tracking.
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="rounded-full border border-apple-gray-100 px-6 py-4 text-sm font-black text-apple-gray-500"
                >
                  Cancel
                </button>
                <button className="inline-flex items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm hover:opacity-90">
                  <Truck className="w-4 h-4" />
                  Dispatch via Pick&apos;em
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-[4rem] p-12 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={closeProductModal} className="absolute top-10 right-10 p-4 bg-apple-gray-50 rounded-full text-apple-gray-300"><X className="w-6 h-6" /></button>
            <div className="space-y-10">
              <h2 className="text-4xl font-black text-apple-gray-500 tracking-tighter">{editingProduct?.id ? 'Edit Item' : 'New Item'}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Item Name</label>
                    <input name="name" required defaultValue={editingProduct?.name} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Price (₦)</label>
                    <input name="price" type="number" required defaultValue={editingProduct?.price} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Type</label>
                    <select name="type" defaultValue={editingProduct?.type} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 appearance-none shadow-sm">
                      <option value="physical">Physical Product</option>
                      <option value="digital">Digital Product</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Stock</label>
                    <input name="stock" type="number" required defaultValue={editingProduct?.stock} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Category</label>
                    <input name="category" required defaultValue={editingProduct?.category} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Fulfillment</label>
                    <select name="fulfillment_mode" defaultValue={editingProduct?.fulfillment_mode || 'manual'} className="w-full bg-apple-gray-50 border-none rounded-full py-5 px-8 font-bold text-apple-gray-500 appearance-none shadow-sm">
                      <option value="manual">Manual Approval</option>
                      <option value="warehouse">Pick'em Storage Fulfillment</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-6">Description</label>
                  <textarea name="description" required defaultValue={editingProduct?.description} className="w-full bg-apple-gray-50 border-none rounded-[2.5rem] py-6 px-8 font-bold text-apple-gray-500 shadow-sm min-h-[100px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-2">Product Photo</label>
                    <div className="aspect-square overflow-hidden rounded-[2rem] bg-white">
                      {productImageAsset ? (
                        <img src={productImageAsset} alt="Product preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center gap-3 text-apple-gray-200">
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-sm font-bold">No image uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center rounded-full bg-apple-gray-500 px-5 py-3 text-sm font-black text-white transition-opacity hover:opacity-90">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleProductMediaUpload(event, 'image')}
                        />
                      </label>
                      {productImageAsset && (
                        <button
                          type="button"
                          onClick={() => setProductImageAsset('')}
                          className="rounded-full border border-apple-gray-200 px-5 py-3 text-sm font-black text-apple-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200 ml-2">Short Video</label>
                    <div className="aspect-square overflow-hidden rounded-[2rem] bg-white">
                      {productVideoAsset ? (
                        <video
                          src={productVideoAsset}
                          poster={productImageAsset || editingProduct?.image}
                          className="h-full w-full object-cover"
                          controls
                          playsInline
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center gap-3 text-apple-gray-200">
                          <Video className="w-5 h-5" />
                          <span className="text-sm font-bold">No video uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center rounded-full bg-apple-gray-500 px-5 py-3 text-sm font-black text-white transition-opacity hover:opacity-90">
                        Upload Video
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(event) => handleProductMediaUpload(event, 'video')}
                        />
                      </label>
                      {productVideoAsset && (
                        <button
                          type="button"
                          onClick={() => setProductVideoAsset('')}
                          className="rounded-full border border-apple-gray-200 px-5 py-3 text-sm font-black text-apple-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
                        >
                          Remove
                        </button>
                      )}
                      <span className="text-xs font-bold text-apple-gray-300">Short clips work best</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-apple-gray-500 text-white py-6 rounded-full font-black text-xl shadow-xl">Publish Item</button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
