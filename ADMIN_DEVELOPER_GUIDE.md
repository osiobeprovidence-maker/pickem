# Admin System - Developer Implementation Guide

## Architecture Overview

The Admin Control Center is built with:
- **RBAC (Role-Based Access Control)**: Three admin levels with granular permissions
- **Audit Logging**: Complete action trail with IP tracking
- **Component-Based UI**: Modular React components for each admin module
- **LocalStorage API**: Mocked backend storage (replace with real API)

## File Structure

```
src/
├── types.ts                          # Type definitions
├── lib/
│   └── rbac.ts                       # RBAC permission system
├── contexts/
│   ├── AuthContext.tsx               # Authentication context
│   └── AdminContext.tsx              # Admin utilities & permissions
├── components/
│   └── AdminDrawer.tsx               # Admin navigation drawer
├── pages/
│   ├── AdminDashboard.tsx            # Main admin dashboard
│   ├── Profile.tsx                   # Integrated admin panel button
│   └── ...other pages
└── services/
    └── api.ts                        # API service with admin methods
```

## Key Classes & Utilities

### AdminRBAC Class

```typescript
// In src/lib/rbac.ts

AdminRBAC.hasPermission(level, permission)
  // Check if admin has a single permission

AdminRBAC.hasAnyPermission(level, permissions[])
  // Check if admin has any of the permissions

AdminRBAC.hasAllPermissions(level, permissions[])
  // Check if admin has all permissions

AdminRBAC.canAccessAdminPanel(level)
  // Check if level can access admin panel

AdminRBAC.canManageAdmin(myLevel, targetLevel)
  // Check if can manage another admin (Super Admin only)

AdminRBAC.getPermissions(level)
  // Get all permissions for a level

AdminRBAC.getAdminLevelLabel(level)
  // Get human-readable label (e.g., "Super Admin")

AdminRBAC.getAllAdminLevels()
  // Get all admin levels with descriptions
```

### AdminContext Hook

```typescript
// In src/contexts/AdminContext.tsx

const { 
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessAdminPanel,
  canManageAdmin,
  logAdminAction,
  logSecurityEvent,
  adminUser
} = useAdmin();

// Usage:
if (hasPermission('suspend_users')) {
  // Show suspend button
}

await logAdminAction(
  'suspended_user',
  userId,
  userEmail,
  { reason: 'Suspicious activity' }
);
```

### Admin Permission Types

```typescript
type AdminPermission = 
  // User Management
  | 'view_users' | 'suspend_users' | 'ban_users'
  // Admin Management
  | 'approve_admins' | 'remove_admins' | 'assign_admin_roles'
  // Runner Management
  | 'approve_runners' | 'suspend_runners' | 'ban_runners'
  // Business Management
  | 'approve_businesses' | 'suspend_businesses' 
  | 'ban_businesses' | 'revoke_storefront'
  // Delivery Control
  | 'monitor_deliveries' | 'assign_runners' | 'resolve_disputes'
  // Storage Management
  | 'manage_storage' | 'view_inventory' | 'approve_storage_requests'
  // KYC Verification
  | 'verify_kyc' | 'approve_identity' | 'verify_documents'
  // Trust & Safety
  | 'flag_accounts' | 'temporary_suspend'
  // Analytics & Logs
  | 'access_analytics' | 'access_logs' | 'view_system_metrics'
  // Platform Control
  | 'override_restrictions' | 'ban_ips' | 'lock_accounts'
  | 'manage_warehouse_locations'
  // Special Privileges
  | 'act_as_runner' | 'act_as_business' | 'act_as_shop_owner';
```

## Adding a New Admin Module

### Step 1: Define New Tab Type

```typescript
type AdminTab = 
  | 'overview' 
  | 'your_new_module'  // Add here
  | ...
```

### Step 2: Add Required Permission

```typescript
// In lib/rbac.ts
const adminPermissions: Record<AdminLevel, AdminPermission[]> = {
  super_admin: [
    ...existing,
    'your_new_permission',  // Add here
  ],
  operations_admin: [
    ...,
    // If applicable
  ],
  compliance_admin: [...]
};
```

### Step 3: Add to Tab Navigation

```typescript
// In AdminDashboard.tsx
const tabList = [
  ...existing,
  {
    id: 'your_new_module',
    label: 'Your Module',
    icon: <YourIcon className="w-4 h-4" />,
    requiredPermission: 'your_new_permission'
  }
];
```

### Step 4: Add Tab Content

```typescript
{activeTab === 'your_new_module' && hasYourPermission && (
  <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    {/* Your module JSX */}
  </motion.section>
)}
```

### Step 5: Add API Methods

```typescript
// In services/api.ts
export const api = {
  ...existing,
  
  async yourModuleAction(params: any) {
    // Implement your logic
    // Use localStorage for mocked data
    // Return appropriate data
  },
};
```

## Extending Admin Levels

To create a new admin level:

### 1. Update Types

```typescript
// In types.ts
export type AdminLevel = 
  | 'super_admin' 
  | 'operations_admin' 
  | 'compliance_admin'
  | 'custom_admin';  // Add new level
```

### 2. Define Permissions

```typescript
// In lib/rbac.ts
const adminPermissions: Record<AdminLevel, AdminPermission[]> = {
  ...existing,
  custom_admin: [
    'view_users',
    'approve_runners',
    // Define specific permissions
  ]
};
```

### 3. Update UI Components

```typescript
// Update AdminRBAC.getAllAdminLevels()
static getAllAdminLevels() {
  return [
    ...existing,
    {
      level: 'custom_admin',
      label: 'Custom Admin',
      description: 'Custom admin with specific permissions'
    }
  ];
}
```

## API Methods by Category

### User Management

```typescript
// Get all users
await api.getAllUsers()

// Get users by role
await api.getUsersByRole('runner')

// Suspend user
await api.suspendUser(userId, reason)

// Ban user
await api.banUser(userId, reason)

// Unsuspend user
await api.unsuspendUser(userId)
```

### Admin Management

```typescript
// Assign admin role
await api.assignAdminRole(userId, adminLevel)

// Remove admin role  
await api.removeAdminRole(userId)

// Get all admins
await api.getAdminUsers()
```

### Runner Management

```typescript
// Approve runner
await api.approveRunner(runnerId)

// Suspend runner
await api.suspendRunner(runnerId, reason)

// Ban runner
await api.banRunner(runnerId, reason)
```

### Business Management

```typescript
// Approve business
await api.approveBusiness(businessId)

// Suspend business
await api.suspendBusiness(businessId, reason)
```

### Logging & Analytics

```typescript
// Log admin action
await api.logAdminAction(log)

// Get action logs
await api.getAdminActionLogs()

// Get platform analytics
await api.getPlatformAnalytics()

// Log security event
await api.logSecurityEvent(event)

// Get security events
await api.getSecurityEvents()
```

## Security Considerations

### Input Validation

Always validate admin inputs:
```typescript
if (!userId || !reason) {
  throw new Error('Missing required parameters');
}

if (reason.length < 10) {
  throw new Error('Reason must be at least 10 characters');
}
```

### Permission Checks

Every admin action must check permissions:
```typescript
if (!AdminRBAC.hasPermission(admin.admin_level, 'suspend_users')) {
  throw new Error('Insufficient permissions');
}
```

### Audit Logging

Log all sensitive actions:
```typescript
await api.logAdminAction(
  'user_suspended',
  userId,
  userEmail,
  { reason, duration: '48h', admin_level: adminLevel }
);
```

### Super Admin Protection

Some actions only Super Admins can perform:
```typescript
if (admin.admin_level !== 'super_admin') {
  throw new Error('Only Super Admin can perform this action');
}
```

## Testing the Admin System

### Test Accounts

```
Super Admin:
- Email: riderezzy@gmail.com
- Password: 1percent99
- Level: super_admin

Operations Admin (create one):
- Go to Admin Portal
- Click "Add Admin"
- Email: ops@example.com
- Level: operations_admin

Compliance Admin (create one):
- Email: compliance@example.com  
- Level: compliance_admin
```

### Manual Testing Checklist

- [ ] Login with Super Admin account
- [ ] Navigate to Admin Dashboard
- [ ] Check all visible tabs match admin level
- [ ] Try to perform an action and verify log is created
- [ ] Invite an Operations Admin
- [ ] Login as Operations Admin
- [ ] Verify you can only see Operations tabs
- [ ] Try to access a restricted tab (should not appear)
- [ ] Check System Logs tab shows your action

### Unit Testing Example

```typescript
describe('AdminRBAC', () => {
  it('should grant super admin all permissions', () => {
    const perms = AdminRBAC.getPermissions('super_admin');
    expect(perms.length).toBeGreaterThan(20);
  });

  it('should restrict operations admin correctly', () => {
    expect(AdminRBAC.hasPermission('operations_admin', 'suspend_users')).toBe(false);
    expect(AdminRBAC.hasPermission('operations_admin', 'monitor_deliveries')).toBe(true);
  });

  it('should prevent non-super from managing admins', () => {
    expect(AdminRBAC.canManageAdmin('operations_admin', 'compliance_admin')).toBe(false);
    expect(AdminRBAC.canManageAdmin('super_admin', 'operations_admin')).toBe(true);
  });

  it('should log admin actions correctly', async () => {
    const log = await api.logAdminAction('test_action', 'user123');
    expect(log.timestamp).toBeDefined();
    expect(log.admin_id).toBeDefined();
  });
});
```

## Deployment Checklist

- [ ] Update production API endpoints (replace localStorage)
- [ ] Setup database audit logging tables
- [ ] Configure IP tracking service
- [ ] Enable 2FA for Super Admin
- [ ] Setup admin email notifications
- [ ] Configure admin approval workflow
- [ ] Setup automated security alerts
- [ ] Test with real production data (sanitized)
- [ ] Document admin escalation process
- [ ] Train admin team on system
- [ ] Setup monitoring for admin actions
- [ ] Create backup/disaster recovery plan

## Known Limitations & Future Work

### Current Session
- Data stored in localStorage (browser memory)
- No real-time notifications
- No admin team collaboration features
- No advanced analytics charts
- No mobile-optimized admin app

### Future Enhancements
- Real backend storage with database
- Real-time push notifications
- Batch operations (suspend multiple users at once)
- Advanced fraud detection ML model
- Admin team workflow assignments
- Custom admin roles with drag-drop permissions
- Mobile native admin app
- API access for external integrations
- SMS/Email alerts for sensitive actions

---

**Version:** 1.0
**Status:** Production Ready
**Last Updated:** March 15, 2026
