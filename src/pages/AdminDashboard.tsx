import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Crown,
  Mail,
  ShieldCheck,
  Truck,
  UserPlus,
  Users,
  X,
  BarChart3,
  Package,
  AlertCircle,
  FileText,
  Settings,
  Lock,
  Eye,
  Trash2,
  Download,
  Filter,
  Search,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { AdminRBAC } from '../lib/rbac';
import { Business, RunnerVerification, User, Delivery, AdminActionLog } from '../types';
import { cn } from '../lib/utils';


type AdminTab = 
  | 'overview' 
  | 'users' 
  | 'admins' 
  | 'businesses' 
  | 'runners' 
  | 'deliveries' 
  | 'storage' 
  | 'disputes' 
  | 'analytics' 
  | 'logs' 
  | 'admin-management' 
  | 'security' 
  | 'settings';

interface AdminStats {
  total_users: number;
  total_runners: number;
  total_businesses: number;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  active_runners: number;
  active_businesses: number;
  total_admins: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as AdminTab) || 'overview';

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [runners, setRunners] = useState<User[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [actionLogs, setActionLogs] = useState<AdminActionLog[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedAdminLevel, setSelectedAdminLevel] = useState<'super_admin' | 'operations_admin' | 'compliance_admin'>('operations_admin');

  const isSuperAdmin = user?.admin_level === 'super_admin';
  const canManageAdmins = AdminRBAC.hasPermission(user?.admin_level, 'approve_admins');
  const canViewUsers = AdminRBAC.hasPermission(user?.admin_level, 'view_users');
  const canManageRunners = AdminRBAC.hasPermission(user?.admin_level, 'approve_runners');
  const canManageBusinesses = AdminRBAC.hasPermission(user?.admin_level, 'approve_businesses');
  const canViewLogs = AdminRBAC.hasPermission(user?.admin_level, 'access_logs');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        allUsersData,
        adminsData,
        businessesData,
        runnerVerifications,
        deliveriesData,
        stats,
        logs,
      ] = await Promise.all([
        api.getAllUsers(),
        api.getAdminUsers(),
        api.getBusinesses(),
        api.getRunnerVerifications(),
        api.getAllDeliveries(),
        api.getPlatformAnalytics(),
        canViewLogs ? api.getAdminActionLogs() : Promise.resolve([]),
      ]);

      setAllUsers(allUsersData);
      setAdmins(adminsData);
      setBusinesses(businessesData);
      setRunners(allUsersData.filter(u => u.role === 'runner'));
      setDeliveries(deliveriesData);
      setAdminStats(stats);
      setActionLogs(logs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' && user.admin_level) {
      loadData();
    }
  }, [user]);

  if (!user || user.role !== 'admin' || !user.admin_level) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-lg rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-apple-gray-50">
            <ShieldCheck className="h-8 w-8 text-apple-gray-300" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-apple-gray-500">Admin Access Required</h1>
          <p className="mt-3 text-sm font-bold text-apple-gray-300">
            This area is only available to approved admin accounts.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-lg font-black text-apple-gray-500">
        Loading admin center...
      </div>
    );
  }

  const openTab = (tab: AdminTab) => setSearchParams({ tab });

  const handleInviteAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    try {
      await api.inviteAdmin(inviteEmail, user.id);
      await api.assignAdminRole(inviteEmail, selectedAdminLevel);
      setInviteEmail('');
      setIsInviteModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to invite admin:', error);
    }
  };

  const tabList: Array<{ id: AdminTab; label: string; icon: React.ReactNode; requiredPermission?: any }> = [
    { id: 'overview', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" />, requiredPermission: 'view_users' },
    { id: 'runners', label: 'Runners', icon: <Truck className="w-4 h-4" />, requiredPermission: 'approve_runners' },
    { id: 'businesses', label: 'Businesses', icon: <Building2 className="w-4 h-4" />, requiredPermission: 'approve_businesses' },
    { id: 'deliveries', label: 'Deliveries', icon: <Package className="w-4 h-4" />, requiredPermission: 'monitor_deliveries' },
    { id: 'storage', label: 'Storage', icon: <Package className="w-4 h-4" />, requiredPermission: 'manage_storage' },
    { id: 'disputes', label: 'Disputes', icon: <AlertCircle className="w-4 h-4" />, requiredPermission: 'resolve_disputes' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, requiredPermission: 'access_analytics' },
    { id: 'logs', label: 'Logs', icon: <FileText className="w-4 h-4" />, requiredPermission: 'access_logs' },
    { id: 'admin-management', label: 'Admin Mgmt', icon: <Lock className="w-4 h-4" />, requiredPermission: 'approve_admins' },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" />, requiredPermission: 'access_logs' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const visibleTabs = tabList.filter(tab => 
    !tab.requiredPermission || AdminRBAC.hasPermission(user.admin_level, tab.requiredPermission)
  );

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2.75rem] border border-apple-gray-100 bg-white shadow-sm"
        >
          <div className="bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-8 text-white md:px-10 md:py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em]">
                  <Crown className="h-3.5 w-3.5" />
                  {AdminRBAC.getAdminLevelLabel(user.admin_level)}
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter md:text-6xl">Admin Control Center</h1>
                  <p className="mt-3 max-w-2xl text-sm font-bold text-brand-100/90 md:text-base">
                    Manage platform users, runners, businesses, deliveries, and system security from one control room.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-brand-700 shadow-sm hover:bg-brand-50 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Admin
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-t border-apple-gray-100 px-6 py-4 md:px-8 overflow-x-auto">
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => openTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                    : 'bg-apple-gray-50 text-apple-gray-600 hover:bg-apple-gray-100'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Overview Tab */}
        {activeTab === 'overview' && adminStats && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Total Users', value: adminStats.total_users, icon: Users, color: 'blue' },
                { label: 'Active Runners', value: adminStats.active_runners, icon: Truck, color: 'green' },
                { label: 'Active Businesses', value: adminStats.active_businesses, icon: Building2, color: 'purple' },
                { label: 'Completed Orders', value: adminStats.completed_orders, icon: Package, color: 'orange' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm"
                  >
                    <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-lg', 
                      stat.color === 'blue' ? 'bg-brand-100 text-brand-700' :
                      stat.color === 'green' ? 'bg-green-100 text-green-600' :
                      stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-4xl font-black tracking-tight text-apple-gray-500">{stat.value}</div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-widest text-apple-gray-300">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
              {canManageAdmins && (
                <div className="rounded-[2.25rem] border border-apple-gray-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-apple-gray-500">Admin Management</h3>
                      <p className="mt-2 text-sm font-bold text-apple-gray-300">Manage admin accounts and permissions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openTab('admin-management')}
                      className="inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-5 py-3 text-xs font-black uppercase tracking-widest text-apple-gray-500 hover:bg-brand-50 transition-colors"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
              {canViewUsers && (
                <div className="rounded-[2.25rem] border border-apple-gray-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-apple-gray-500">User Management</h3>
                      <p className="mt-2 text-sm font-bold text-apple-gray-300">Manage users, suspend, or ban accounts</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openTab('users')}
                      className="inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-5 py-3 text-xs font-black uppercase tracking-widest text-apple-gray-500 hover:bg-brand-50 transition-colors"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && canViewUsers && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-[2.25rem] border border-apple-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Search className="h-5 w-5 text-apple-gray-300" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-apple-gray-500 placeholder-apple-gray-300 outline-none"
                />
              </div>
            </div>

            {allUsers
              .filter(u => 
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(u => (
                <div key={u.id} className="rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-apple-gray-500">{u.name}</h3>
                      <div className="text-sm font-bold text-apple-gray-400">{u.email}</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-brand-700">
                          {u.role}
                        </span>
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest',
                          u.status === 'approved' ? 'bg-green-50 text-green-700' :
                          u.status === 'suspended' ? 'bg-yellow-50 text-yellow-700' :
                          u.status === 'banned' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-700'
                        )}>
                          {u.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {u.status !== 'suspended' && (
                        <button
                          className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700 hover:bg-yellow-200 transition-colors"
                          onClick={async () => {
                            await api.suspendUser(u.id, 'Admin suspension');
                            await loadData();
                          }}
                        >
                          Suspend
                        </button>
                      )}
                      {u.status !== 'banned' && (
                        <button
                          className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-200 transition-colors"
                          onClick={async () => {
                            await api.banUser(u.id, 'Admin ban');
                            await loadData();
                          }}
                        >
                          Ban
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </motion.section>
        )}

        {/* Runners Tab */}
        {activeTab === 'runners' && canManageRunners && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {runners.length === 0 ? (
              <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-10 text-center shadow-sm">
                <Truck className="mx-auto h-10 w-10 text-apple-gray-200" />
                <div className="mt-4 text-2xl font-black text-apple-gray-500">No runners found</div>
              </div>
            ) : (
              runners.map(runner => (
                <div key={runner.id} className="rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-apple-gray-500">{runner.name}</h3>
                      <div className="text-sm font-bold text-apple-gray-400">{runner.email}</div>
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest w-fit',
                        runner.status === 'approved' ? 'bg-green-50 text-green-700' :
                        runner.status === 'suspended' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                      )}>
                        {runner.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {runner.status !== 'approved' && (
                        <button
                          className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700 hover:bg-green-200"
                          onClick={async () => {
                            await api.approveRunner(runner.id);
                            await loadData();
                          }}
                        >
                          Approve
                        </button>
                      )}
                      {runner.status !== 'suspended' && (
                        <button
                          className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700 hover:bg-yellow-200"
                          onClick={async () => {
                            await api.suspendRunner(runner.id, 'Admin suspension');
                            await loadData();
                          }}
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.section>
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && canManageBusinesses && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {businesses.length === 0 ? (
              <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-10 text-center shadow-sm">
                <Building2 className="mx-auto h-10 w-10 text-apple-gray-200" />
                <div className="mt-4 text-2xl font-black text-apple-gray-500">No businesses found</div>
              </div>
            ) : (
              businesses.map(business => (
                <div key={business.id} className="rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-apple-gray-500">{business.name}</h3>
                      <div className="text-sm font-bold text-apple-gray-400">{business.category}</div>
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest w-fit',
                        business.kyc_status === 'verified' ? 'bg-green-50 text-green-700' :
                        business.kyc_status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                      )}>
                        {business.kyc_status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {business.kyc_status !== 'verified' && (
                        <button
                          className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700 hover:bg-green-200"
                          onClick={async () => {
                            await api.approveBusiness(business.id);
                            await loadData();
                          }}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700 hover:bg-yellow-200"
                        onClick={async () => {
                          await api.suspendBusiness(business.id);
                          await loadData();
                        }}
                      >
                        Suspend
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.section>
        )}

        {/* Admin Management Tab */}
        {activeTab === 'admin-management' && isSuperAdmin && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-[2.25rem] border border-apple-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-apple-gray-500 mb-4">Admin Accounts ({admins.length})</h3>
              <div className="space-y-4">
                {admins.map(admin => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border border-apple-gray-100 rounded-xl">
                    <div>
                      <p className="font-bold text-apple-gray-500">{admin.name}</p>
                      <p className="text-sm text-apple-gray-400">{admin.email}</p>
                      <p className="text-xs text-apple-gray-300 mt-1">
                        Level: {AdminRBAC.getAdminLevelLabel(admin.admin_level)}
                      </p>
                    </div>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold',
                      admin.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {admin.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && canViewLogs && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {actionLogs.length === 0 ? (
              <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-10 text-center shadow-sm">
                <FileText className="mx-auto h-10 w-10 text-apple-gray-200" />
                <div className="mt-4 text-2xl font-black text-apple-gray-500">No action logs found</div>
              </div>
            ) : (
              actionLogs.slice(0, 50).map(log => (
                <div key={log.id} className="rounded-[1.5rem] border border-apple-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-apple-gray-500">{log.admin_name}</p>
                      <p className="text-sm text-apple-gray-400">{log.action}</p>
                      <p className="text-xs text-apple-gray-300 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-apple-gray-400">{log.ip_address}</span>
                  </div>
                </div>
              ))
            )}
          </motion.section>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-[2.25rem] border border-apple-gray-100 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-apple-gray-500 mb-4">Admin Settings</h2>
              <div className="space-y-4">
                <div className="p-4 border border-apple-gray-100 rounded-xl">
                  <h4 className="font-bold text-apple-gray-500">Your Admin Account</h4>
                  <p className="text-sm text-apple-gray-400 mt-2">{user.name} ({user.email})</p>
                  <p className="text-sm font-bold text-apple-gray-500 mt-2">
                    Level: {AdminRBAC.getAdminLevelLabel(user.admin_level)}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="w-full rounded-full bg-red-100 px-6 py-3 text-sm font-black text-red-700 hover:bg-red-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* Invite Admin Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-apple-gray-500">Add Admin</h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 hover:bg-apple-gray-50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-apple-gray-400" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-apple-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="admin@email.com"
                  required
                  className="w-full rounded-lg border border-apple-gray-100 px-4 py-3 text-apple-gray-500 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-apple-gray-500 mb-2">Admin Level</label>
                <select
                  value={selectedAdminLevel}
                  onChange={(e) => setSelectedAdminLevel(e.target.value as any)}
                  className="w-full rounded-lg border border-apple-gray-100 px-4 py-3 text-apple-gray-500 outline-none focus:border-brand-500"
                >
                  {AdminRBAC.getAllAdminLevels().map(level => (
                    <option key={level.level} value={level.level}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-brand-500 px-6 py-3 text-sm font-black text-white hover:bg-brand-600 transition-colors"
              >
                Send Invite
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
