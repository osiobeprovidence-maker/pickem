import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  Bell,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  User,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

import FloatingProxyTimer from './FloatingProxyTimer';

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isBizMode = location.pathname.startsWith('/dashboard/business');
  const isBusinessUser = user?.role === 'business';
  const currentRoute = `${location.pathname}${location.search}`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const defaultNavItems: NavItem[] = [
    ...(isBusinessUser
      ? [{ label: 'Manage Store', path: '/dashboard/business?tab=overview', icon: Store }]
      : []),
    { label: 'Buy & Deliver', path: '/buy-and-deliver', icon: ShoppingBag },
    { label: 'For Businesses', path: '/businesses', icon: Store },
    { label: 'Become a Runner', path: '/become-runner', icon: Truck },
    { label: 'Proxy Pickup', path: '/proxy-pickup', icon: ShieldCheck },
    { label: 'Contact Support', path: '/contact', icon: Bell },
    ...(user ? [{ label: 'My Profile', path: '/profile', icon: User }] : []),
  ];

  const bizNavItems: NavItem[] = [
    { label: 'Overview', path: '/dashboard/business?tab=overview', icon: LayoutDashboard },
    { label: 'Insights', path: '/dashboard/business?tab=analytics', icon: BarChart3 },
    { label: 'Storefront', path: '/dashboard/business?tab=storefront', icon: Store },
    { label: 'Inventory', path: '/dashboard/business?tab=inventory', icon: Package },
    { label: 'Storage', path: '/dashboard/business?tab=storage', icon: Package },
    { label: 'Customers', path: '/dashboard/business?tab=customers', icon: Users },
    { label: 'Deliveries', path: '/dashboard/business?tab=deliveries', icon: Truck },
    { label: 'Settings', path: '/dashboard/business?tab=settings', icon: Settings },
  ];

  const activeMenuItems = isBizMode ? bizNavItems : defaultNavItems;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <nav className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-20 items-center justify-between gap-4">
            <div className="flex shrink-0 items-center">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-black tracking-tighter text-apple-gray-500 group-hover:text-blue-600 transition-colors">
                  Pick'em
                </span>
              </Link>
            </div>

            {isBizMode ? (
              <div className="hidden lg:flex min-w-0 flex-1 items-center justify-center px-4">
                <div className="flex min-w-0 items-center gap-1">
                  {bizNavItems.map((item) => {
                    const isActive = currentRoute === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-[13px] font-bold transition-all',
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-apple-gray-300 hover:bg-emerald-50 hover:text-emerald-700',
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-10">
                {isBusinessUser && (
                  <Link
                    to="/dashboard/business?tab=overview"
                    className="flex items-center gap-2 text-[13px] font-bold text-emerald-600 transition-colors hover:text-emerald-700"
                  >
                    <Store className="h-4 w-4" /> Manage Store
                  </Link>
                )}
                <Link
                  to="/buy-and-deliver"
                  className="text-[13px] font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  Buy & Deliver
                </Link>
                <Link
                  to="/businesses"
                  className="text-[13px] font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  For Businesses
                </Link>
                <Link
                  to="/become-runner"
                  className="text-[13px] font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  Become a Runner
                </Link>
                <Link
                  to="/proxy-pickup"
                  className="text-[13px] font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  Proxy Pickup
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3">
              {isBizMode && (
                <div className="hidden lg:flex items-center">
                  <Link
                    to="/"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[13px] font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Pick'em
                  </Link>
                </div>
              )}
              {!isBizMode && (
                <div className="hidden md:flex items-center gap-6">
                  <Link
                    to="/contact"
                    className="text-[13px] font-bold text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                  >
                    Contact
                  </Link>
                  {user ? (
                    <div className="flex items-center gap-4">
                      <Link
                        to="/profile"
                        className="rounded-full bg-apple-gray-500 px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="p-2 text-apple-gray-300 transition-colors hover:text-red-500"
                        title="Logout"
                      >
                        <LogOut className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="rounded-full bg-apple-gray-500 px-7 py-2.5 text-[13px] font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              )}

              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className={cn(
                    'flex items-center gap-2 rounded-2xl p-3 transition-all',
                    isBizMode
                      ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700'
                      : 'bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100',
                  )}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  {isBizMode && !isMenuOpen && (
                    <span className="pr-2 text-xs font-black uppercase tracking-widest">
                      Biz Menu
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={cn(
                  'fixed right-0 top-0 bottom-0 z-50 flex h-dvh w-full max-w-[22rem] flex-col border-l p-5 shadow-2xl sm:w-[85%] sm:p-6',
                  isBizMode ? 'border-emerald-100 bg-emerald-50/95' : 'border-stone-100 bg-white',
                )}
              >
                <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter text-apple-gray-500 sm:text-2xl">
                      {isBizMode ? "Pick'em Store" : "Pick'em"}
                    </span>
                    <span
                      className={cn(
                        'mt-1 text-[10px] font-black uppercase tracking-[0.2em]',
                        isBizMode ? 'text-emerald-500' : 'text-apple-gray-200',
                      )}
                    >
                      {isBizMode ? 'Business Settings' : 'Main Navigation'}
                    </span>
                  </div>
                  <button
                    onClick={closeMenu}
                    className={cn(
                      'rounded-xl p-2 text-apple-gray-500',
                      isBizMode ? 'bg-white' : 'bg-apple-gray-50',
                    )}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="relative flex-1 overflow-hidden">
                  <motion.div
                    key={isBizMode ? 'business-menu' : 'default-menu'}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full space-y-2 overflow-y-auto pr-1"
                  >
                    {activeMenuItems.map((item) => {
                      const isActive = currentRoute === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeMenu}
                          className={cn(
                            'group flex items-center gap-3 rounded-2xl px-4 py-4 text-base font-bold transition-all sm:px-5 sm:text-lg',
                            isBizMode
                              ? isActive
                                ? 'bg-emerald-600 text-white shadow-lg'
                                : 'text-apple-gray-500 hover:bg-emerald-50'
                              : isActive
                                ? 'bg-apple-gray-500 text-white shadow-lg'
                                : 'text-apple-gray-500 hover:bg-apple-gray-50',
                          )}
                        >
                          <item.icon
                            className={cn(
                              'h-5 w-5 shrink-0 sm:h-6 sm:w-6',
                              !isActive &&
                                (isBizMode
                                  ? 'text-apple-gray-200 group-hover:text-emerald-500'
                                  : 'text-apple-gray-200 group-hover:text-apple-gray-500'),
                            )}
                          />
                          {item.label}
                        </Link>
                      );
                    })}

                    {isBizMode && (
                      <Link
                        to="/"
                        onClick={closeMenu}
                        className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-base font-bold text-emerald-700 transition-all hover:bg-emerald-100 sm:px-5 sm:text-lg"
                      >
                        <ChevronLeft className="h-6 w-6" />
                        Back to Pick'em
                      </Link>
                    )}
                  </motion.div>
                </div>

                {isBizMode ? (
                  <div className="mt-4 border-t border-emerald-100 pt-5 sm:mt-6 sm:pt-6">
                    {user && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-[1.5rem] border border-emerald-100 bg-white p-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 font-black text-white">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div className="flex-grow overflow-hidden">
                            <div className="truncate font-black text-apple-gray-500">{user.name}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                              Business Account
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-white px-4 py-4 text-base font-bold text-red-600 transition-all hover:bg-red-50 sm:px-5 sm:text-lg"
                        >
                          <LogOut className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 border-t border-apple-gray-100 pt-5 sm:mt-6 sm:pt-6">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-[1.5rem] bg-apple-gray-50 p-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-apple-gray-500 font-black text-white">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div className="flex-grow overflow-hidden">
                            <div className="truncate font-black text-apple-gray-500">{user.name}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-apple-gray-200">
                              {user.role} Account
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-base font-bold text-red-600 transition-all hover:bg-red-100 sm:px-5 sm:text-lg"
                        >
                          <LogOut className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          to="/contact"
                          onClick={closeMenu}
                          className="flex items-center justify-center rounded-2xl border border-apple-gray-100 px-4 py-4 text-base font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 sm:text-lg"
                        >
                          Contact Support
                        </Link>
                        <Link
                          to="/auth"
                          onClick={closeMenu}
                          className="block w-full rounded-2xl bg-apple-gray-500 py-4 text-center text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90 sm:py-5 sm:text-lg"
                        >
                          Get Started
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        <motion.div
          key={location.pathname + location.search}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      <FloatingProxyTimer />

      <footer className="bg-white border-t border-apple-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link to="/" className="text-xl font-bold tracking-tight text-apple-gray-500">
                Pick'em
              </Link>
              <p className="max-w-xs text-[15px] text-apple-gray-300 leading-relaxed font-medium">
                Pick'em is a product of Cratebux and Logistics. The premium campus logistics platform connecting students and businesses.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-apple-gray-500 uppercase tracking-wider mb-6">Services</h4>
              <ul className="space-y-4 text-[14px] text-apple-gray-300 font-medium">
                <li><Link to="/request" className="hover:text-blue-600 transition-colors">Send Item</Link></li>
                <li><Link to="/businesses" className="hover:text-blue-600 transition-colors">Business Delivery</Link></li>
                <li><Link to="/proxy-pickup" className="hover:text-blue-600 transition-colors">Pick'em Proxy</Link></li>
                <li><Link to="/buy-and-deliver" className="hover:text-blue-600 transition-colors">Buy & Deliver</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-apple-gray-500 uppercase tracking-wider mb-6">Support</h4>
              <ul className="space-y-4 text-[14px] text-apple-gray-300 font-medium">
                <li><Link to="/how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-apple-gray-100 mt-20 pt-8 text-[12px] text-apple-gray-200 font-medium">
            &copy; {new Date().getFullYear()} Cratebux and Logistics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
