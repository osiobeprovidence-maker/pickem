import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, LayoutDashboard, Menu, X, ShoppingBag, Store, Truck, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isProtectedAppRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/request' ||
    location.pathname === '/profile';
  const isLoggedInSurface = Boolean(user) || location.pathname === '/complete-profile';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Buy & Deliver', path: '/buy-and-deliver', icon: ShoppingBag },
    { label: 'For Businesses', path: '/businesses', icon: Store },
    { label: 'Become a Runner', path: '/become-runner', icon: Truck },
    { label: 'Proxy Pickup', path: '/proxy-pickup', icon: ShieldCheck },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-stone-50 text-stone-900 font-sans">
      {/* Navigation */}
      <nav
        className={cn(
          'sticky top-0 z-50 border-b border-stone-100 bg-white shadow-[0_1px_0_rgba(29,29,31,0.04)]',
          isLoggedInSurface ? 'backdrop-blur-none' : 'lg:bg-white/90 lg:backdrop-blur-md',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-black tracking-tighter text-apple-gray-500 group-hover:text-blue-600 transition-colors">
                  Pick’em
                </span>
              </Link>
            </div>

            {/* Desktop Nav - Centered */}
            <div className="hidden lg:flex items-center gap-10">
              <Link to="/buy-and-deliver" className="text-[13px] font-bold text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Buy & Deliver</Link>
              <Link to="/businesses" className="text-[13px] font-bold text-apple-gray-300 hover:text-apple-gray-500 transition-colors">For Businesses</Link>
              <Link to="/become-runner" className="text-[13px] font-bold text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Become a Runner</Link>
              <Link to="/proxy-pickup" className="text-[13px] font-bold text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Proxy Pickup</Link>
            </div>

            {/* Right Side - Actions */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/contact" className="text-[13px] font-bold text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Contact</Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/dashboard"
                    className="bg-apple-gray-500 text-white px-6 py-2.5 rounded-full text-[13px] font-bold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold transition-colors',
                      location.pathname === '/profile'
                        ? 'bg-apple-gray-100 text-apple-gray-500'
                        : 'text-apple-gray-300 hover:bg-apple-gray-50 hover:text-apple-gray-500',
                    )}
                    title="Profile"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-apple-gray-300 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-apple-gray-500 text-white px-7 py-2.5 rounded-full text-[13px] font-bold hover:opacity-90 transition-opacity shadow-sm"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 z-50 flex w-[85%] max-w-sm flex-col overflow-y-auto border-l border-stone-100 bg-white p-6 shadow-2xl lg:hidden sm:p-8"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-2xl font-black tracking-tighter text-apple-gray-500">Pick’em</span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-xl bg-apple-gray-50 text-apple-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-grow space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-6 py-5 rounded-2xl text-lg font-bold transition-all",
                        location.pathname === item.path 
                          ? "bg-apple-gray-500 text-white shadow-lg shadow-apple-gray-500/20" 
                          : "text-apple-gray-500 hover:bg-apple-gray-50"
                      )}
                    >
                      <item.icon className="w-6 h-6" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-8 border-t border-apple-gray-100 space-y-4">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-6 h-6" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center bg-apple-gray-500 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow overflow-x-clip">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isProtectedAppRoute ? (
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              {children}
            </div>
          ) : (
            children
          )}
        </motion.div>
      </main>

      <footer className="bg-white border-t border-apple-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link to="/" className="text-xl font-bold tracking-tight text-apple-gray-500">
                Pick’em
              </Link>
              <p className="max-w-xs text-[15px] text-apple-gray-300 leading-relaxed font-medium">
                Pick’em is a product of Cratebux and Logistics. The premium campus logistics platform connecting students and businesses.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-apple-gray-500 uppercase tracking-wider mb-6">Services</h4>
              <ul className="space-y-4 text-[14px] text-apple-gray-300 font-medium">
                <li><Link to="/request" className="hover:text-blue-600 transition-colors">Send Item</Link></li>
                <li><Link to="/businesses" className="hover:text-blue-600 transition-colors">Business Delivery</Link></li>
                <li><Link to="/proxy-pickup" className="hover:text-blue-600 transition-colors">Pick’em Proxy</Link></li>
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
            © {new Date().getFullYear()} Cratebux and Logistics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
