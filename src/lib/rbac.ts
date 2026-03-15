import { AdminLevel, AdminPermission } from '../types';

// Define permission sets for each admin level
const adminPermissions: Record<AdminLevel, AdminPermission[]> = {
  super_admin: [
    // User Management
    'view_users', 'suspend_users', 'ban_users',
    // Admin Management
    'approve_admins', 'remove_admins', 'assign_admin_roles',
    // Runner Management
    'approve_runners', 'suspend_runners', 'ban_runners',
    // Business Management
    'approve_businesses', 'suspend_businesses', 'ban_businesses', 'revoke_storefront',
    // Delivery Control
    'monitor_deliveries', 'assign_runners', 'resolve_disputes',
    // Storage Management
    'manage_storage', 'view_inventory', 'approve_storage_requests',
    // KYC Verification
    'verify_kyc', 'approve_identity', 'verify_documents',
    // Trust & Safety
    'flag_accounts', 'temporary_suspend',
    // Analytics & Logs
    'access_analytics', 'access_logs', 'view_system_metrics',
    // Platform Control
    'override_restrictions', 'ban_ips', 'lock_accounts', 'manage_warehouse_locations',
    // Special Privileges
    'act_as_runner', 'act_as_business', 'act_as_shop_owner',
  ],
  operations_admin: [
    // Runner Management
    'approve_runners', 'suspend_runners',
    // Delivery Control
    'monitor_deliveries', 'assign_runners', 'resolve_disputes',
    // Storage Management
    'manage_storage', 'view_inventory', 'approve_storage_requests',
    // Analytics & Logs (limited)
    'view_system_metrics',
  ],
  compliance_admin: [
    // KYC Verification
    'verify_kyc', 'approve_identity', 'verify_documents',
    // Trust & Safety
    'flag_accounts', 'temporary_suspend',
    // User Management (limited)
    'view_users',
  ],
};

export class AdminRBAC {
  /**
   * Check if an admin has a specific permission
   */
  static hasPermission(adminLevel: AdminLevel | undefined, permission: AdminPermission): boolean {
    if (!adminLevel) return false;
    return adminPermissions[adminLevel]?.includes(permission) ?? false;
  }

  /**
   * Check if an admin has any of the given permissions
   */
  static hasAnyPermission(adminLevel: AdminLevel | undefined, permissions: AdminPermission[]): boolean {
    if (!adminLevel) return false;
    const adminPerms = adminPermissions[adminLevel] ?? [];
    return permissions.some(perm => adminPerms.includes(perm));
  }

  /**
   * Check if an admin has all of the given permissions
   */
  static hasAllPermissions(adminLevel: AdminLevel | undefined, permissions: AdminPermission[]): boolean {
    if (!adminLevel) return false;
    const adminPerms = adminPermissions[adminLevel] ?? [];
    return permissions.every(perm => adminPerms.includes(perm));
  }

  /**
   * Get all permissions for an admin level
   */
  static getPermissions(adminLevel: AdminLevel | undefined): AdminPermission[] {
    return adminLevel ? adminPermissions[adminLevel] ?? [] : [];
  }

  /**
   * Check if user can perform an action on another admin
   * Super admins can manage all other admins
   * Other admins cannot manage other admins
   */
  static canManageAdmin(adminLevel: AdminLevel | undefined, targetAdminLevel: AdminLevel | undefined): boolean {
    if (!adminLevel) return false;
    if (adminLevel === 'super_admin') return true;
    return false;
  }

  /**
   * Check if user can access admin panel
   */
  static canAccessAdminPanel(adminLevel: AdminLevel | undefined): boolean {
    return adminLevel !== undefined;
  }

  /**
   * Get admin level display name
   */
  static getAdminLevelLabel(adminLevel: AdminLevel | undefined): string {
    const labels: Record<AdminLevel, string> = {
      super_admin: 'Super Admin',
      operations_admin: 'Operations Admin',
      compliance_admin: 'Compliance Admin',
    };
    return adminLevel ? labels[adminLevel] : 'Not Admin';
  }

  /**
   * Get admin level description
   */
  static getAdminLevelDescription(adminLevel: AdminLevel | undefined): string {
    const descriptions: Record<AdminLevel, string> = {
      super_admin: 'Highest authority with access to all platform controls',
      operations_admin: 'Manages daily logistics operations and deliveries',
      compliance_admin: 'Handles verification and safety compliance',
    };
    return adminLevel ? descriptions[adminLevel] : '';
  }

  /**
   * Get all admin levels for selection
   */
  static getAllAdminLevels(): { level: AdminLevel; label: string; description: string }[] {
    return [
      {
        level: 'super_admin',
        label: this.getAdminLevelLabel('super_admin'),
        description: this.getAdminLevelDescription('super_admin'),
      },
      {
        level: 'operations_admin',
        label: this.getAdminLevelLabel('operations_admin'),
        description: this.getAdminLevelDescription('operations_admin'),
      },
      {
        level: 'compliance_admin',
        label: this.getAdminLevelLabel('compliance_admin'),
        description: this.getAdminLevelDescription('compliance_admin'),
      },
    ];
  }
}
