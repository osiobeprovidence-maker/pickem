import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Users,
  Box,
  Truck,
  CreditCard,
  ClipboardList,
  Shield,
  BarChart3,
  Settings,
  Lock,
  User,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AdminRBAC } from '../lib/rbac';

const items = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard/admin', icon: Grid },
  { id: 'users', label: 'Users', path: '/dashboard/admin?tab=users', icon: Users },
  { id: 'marketplace', label: 'Marketplace', path: '/dashboard/admin?tab=marketplace', icon: Box },
  { id: 'businesses', label: 'Businesses', path: '/dashboard/admin?tab=businesses', icon: ClipboardList },
  { id: 'runners', label: 'Runners', path: '/dashboard/admin?tab=runners', icon: Truck },
  { id: 'orders', label: 'Orders', path: '/dashboard/admin?tab=orders', icon: CreditCard },
  { id: 'deliveries', label: 'Deliveries', path: '/dashboard/admin?tab=deliveries', icon: Truck },
  { id: 'storage', label: 'Storage', path: '/dashboard/admin?tab=storage', icon: Box },
  { id: 'disputes', label: 'Disputes', path: '/dashboard/admin?tab=disputes', icon: Shield },
  { id: 'payments', label: 'Payments', path: '/dashboard/admin?tab=payments', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', path: '/dashboard/admin?tab=analytics', icon: BarChart3 },
  { id: 'security', label: 'Security', path: '/dashboard/admin?tab=security', icon: Lock },
  { id: 'admins', label: 'Admins', path: '/dashboard/admin?tab=admins', icon: User },
  { id: 'settings', label: 'Settings', path: '/dashboard/admin?tab=settings', icon: Settings },
];

export default function AdminSidebar({ current }: { current?: string }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (!user || !user.admin_level || !AdminRBAC.canAccessAdminPanel(user.admin_level)) return null;

  const MenuContent = (
    <>
      <div className="px-6 py-6 flex items-center gap-3 border-b border-stone-800">
        <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center font-black">P</div>
        <div>
          <div className="font-black text-lg">Pick'em Admin</div>
          <div className="text-xs text-stone-400">Control Center</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
        {items.map((it) => {
          const Icon = it.icon as any;
          return (
            <Link
              key={it.id}
              to={it.path}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 rounded-lg px-4 py-3 mx-2 text-sm font-bold transition-colors hover:bg-white/5 ${current === it.id ? 'bg-white/5' : 'text-stone-300'}`}
            >
              <Icon className="h-4 w-4 text-stone-200 group-hover:text-white" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-stone-700 flex items-center justify-center font-black text-white">{user.name?.[0]?.toUpperCase()}</div>
          <div className="flex-1 truncate">
            <div className="font-bold truncate">{user.name}</div>
            <div className="text-xs text-stone-400 truncate">{AdminRBAC.getAdminLevelLabel(user.admin_level)}</div>
          </div>
        </div>
        <div className="mt-4">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-stone-800 px-4 py-2 text-sm font-bold hover:bg-stone-700">
            <ArrowLeft className="h-4 w-4" />
            Switch to User Mode
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-72 bg-stone-900 text-white h-screen sticky top-0">
        {MenuContent}
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 left-4 z-50 md:hidden inline-flex items-center gap-2 rounded-full bg-stone-900 text-white px-4 py-3 shadow-lg"
        aria-label="Open admin menu"
      >
        <Menu className="h-5 w-5" />
        <span className="text-sm font-bold">Admin</span>
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-sm bg-stone-900 text-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center font-black">P</div>
                <div>
                  <div className="font-black">Pick'em Admin</div>
                  <div className="text-xs text-stone-400">Control Center</div>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="h-5 w-5 text-stone-200" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {MenuContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
