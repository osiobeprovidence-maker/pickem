import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminRBAC } from '../lib/rbac';
import {
  ChevronDown,
  Crown,
  Gauge,
  Lock,
  BarChart3,
  Users,
  Truck,
  Store,
  Package,
  AlertCircle,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const adminMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Gauge,
    href: '/admin',
    requiredPermissions: ['view_users'],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '/admin?tab=users',
    requiredPermissions: ['view_users'],
  },
  {
    id: 'runners',
    label: 'Runners',
    icon: Truck,
    href: '/admin?tab=runners',
    requiredPermissions: ['approve_runners', 'suspend_runners'],
  },
  {
    id: 'businesses',
    label: 'Businesses',
    icon: Store,
    href: '/admin?tab=businesses',
    requiredPermissions: ['approve_businesses'],
  },
  {
    id: 'deliveries',
    label: 'Deliveries',
    icon: Package,
    href: '/admin?tab=deliveries',
    requiredPermissions: ['monitor_deliveries'],
  },
  {
    id: 'storage',
    label: 'Storage',
    icon: Package,
    href: '/admin?tab=storage',
    requiredPermissions: ['manage_storage'],
  },
  {
    id: 'disputes',
    label: 'Disputes',
    icon: AlertCircle,
    href: '/admin?tab=disputes',
    requiredPermissions: ['resolve_disputes'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/admin?tab=analytics',
    requiredPermissions: ['access_analytics', 'view_system_metrics'],
  },
  {
    id: 'logs',
    label: 'System Logs',
    icon: FileText,
    href: '/admin?tab=logs',
    requiredPermissions: ['access_logs'],
  },
  {
    id: 'admin-mgmt',
    label: 'Admin Management',
    icon: Lock,
    href: '/admin?tab=admin-management',
    requiredPermissions: ['approve_admins', 'assign_admin_roles'],
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    href: '/admin?tab=security',
    requiredPermissions: ['access_logs'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/admin?tab=settings',
    requiredPermissions: ['access_logs'],
  },
];

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDrawer({ isOpen, onClose }: AdminDrawerProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isAdmin = user?.admin_level && AdminRBAC.canAccessAdminPanel(user.admin_level);
  const adminLevel = user?.admin_level ? AdminRBAC.getAdminLevelLabel(user.admin_level) : null;

  if (!isAdmin || !user) {
    return null;
  }

  const visibleMenuItems = adminMenuItems.filter(item =>
    item.requiredPermissions.some(perm =>
      AdminRBAC.hasPermission(user.admin_level, perm as any)
    )
  );

  const handleMenuClick = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-screen w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sticky top-0">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Admin Panel</h3>
                  <p className="text-xs text-blue-100">{adminLevel}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5 transform rotate-90" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4 space-y-2">
              {visibleMenuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.href)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      hoveredItem === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="mx-4 h-px bg-gray-200" />

            {/* Admin Info */}
            <div className="p-4 bg-gray-50 m-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Logged in as:</p>
              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            {/* Logout Button */}
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Admin Control Center</p>
              <p>Pick'em Operating System</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
