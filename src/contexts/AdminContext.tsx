import React, { createContext, useContext } from 'react';
import { User, AdminPermission, AdminActionLog, AdminSecurityEvent } from '../types';
import { AdminRBAC } from '../lib/rbac';
import { api } from '../services/api';

interface AdminContextType {
  // Permission checking
  hasPermission: (permission: AdminPermission) => boolean;
  hasAnyPermission: (permissions: AdminPermission[]) => boolean;
  hasAllPermissions: (permissions: AdminPermission[]) => boolean;
  canAccessAdminPanel: () => boolean;
  canManageAdmin: (targetAdmin: User) => boolean;
  
  // Admin actions
  logAdminAction: (
    action: string,
    targetUserId?: string,
    targetUserEmail?: string,
    details?: Record<string, any>
  ) => Promise<AdminActionLog>;
  
  logSecurityEvent: (
    eventType: 'login' | 'permission_denied' | 'suspicious_activity' | '2fa_failed',
    description: string
  ) => Promise<AdminSecurityEvent>;
  
  // Get current admin user
  adminUser: User | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children, adminUser }: { children: React.ReactNode; adminUser: User | null }) {
  const hasPermission = (permission: AdminPermission): boolean => {
    return AdminRBAC.hasPermission(adminUser?.admin_level, permission);
  };

  const hasAnyPermission = (permissions: AdminPermission[]): boolean => {
    return AdminRBAC.hasAnyPermission(adminUser?.admin_level, permissions);
  };

  const hasAllPermissions = (permissions: AdminPermission[]): boolean => {
    return AdminRBAC.hasAllPermissions(adminUser?.admin_level, permissions);
  };

  const canAccessAdminPanel = (): boolean => {
    return AdminRBAC.canAccessAdminPanel(adminUser?.admin_level);
  };

  const canManageAdmin = (targetAdmin: User): boolean => {
    if (!adminUser) return false;
    return AdminRBAC.canManageAdmin(adminUser.admin_level, targetAdmin.admin_level);
  };

  const logAdminAction = async (
    action: string,
    targetUserId?: string,
    targetUserEmail?: string,
    details?: Record<string, any>
  ): Promise<AdminActionLog> => {
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    const log: AdminActionLog = {
      id: crypto.randomUUID(),
      admin_id: adminUser.id,
      admin_name: adminUser.name,
      action,
      target_user_id: targetUserId,
      target_user_email: targetUserEmail,
      details: details || {},
      timestamp: new Date().toISOString(),
      ip_address: await getClientIpAddress(),
    };

    await api.logAdminAction(log);
    return log;
  };

  const logSecurityEvent = async (
    eventType: 'login' | 'permission_denied' | 'suspicious_activity' | '2fa_failed',
    description: string
  ): Promise<AdminSecurityEvent> => {
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    const event: AdminSecurityEvent = {
      id: crypto.randomUUID(),
      admin_id: adminUser.id,
      event_type: eventType,
      description,
      timestamp: new Date().toISOString(),
      ip_address: await getClientIpAddress(),
    };

    await api.logSecurityEvent(event);
    return event;
  };

  const value: AdminContextType = {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessAdminPanel,
    canManageAdmin,
    logAdminAction,
    logSecurityEvent,
    adminUser,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

/**
 * Hook to check if user has a specific permission
 * Must have AdminProvider in parent tree
 */
export function useAdminPermission(permission: AdminPermission) {
  const { hasPermission } = useAdmin();
  return hasPermission(permission);
}

/**
 * Hook to check multiple permissions
 */
export function useAdminPermissions(permissions: AdminPermission[], requireAll: boolean = false) {
  const admin = useAdmin();
  return requireAll ? admin.hasAllPermissions(permissions) : admin.hasAnyPermission(permissions);
}

/**
 * Get client IP address (mocked for browser environment)
 */
async function getClientIpAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
}
