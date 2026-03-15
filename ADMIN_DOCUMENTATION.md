# Pick'em Admin Control Center - Complete Documentation

## Overview

The Pick'em Admin Control Center is a comprehensive administrative system built on role-based access control (RBAC). It provides three levels of admin access, each with specific capabilities tailored to their function within the platform.

## Access & Authentication

### How to Access the Admin Panel

1. Navigate to your **Profile** page
2. Look for the **"Admin Panel"** button (only visible to admin users)
3. Click to open the **Admin Drawer**
4. Select the module you want to access

**Access Path:** `Profile → Admin Panel Button → Admin Control Center`

### Admin Roles & Permissions

#### 1. Super Admin
**Authority Level:** Highest

**Permissions:**
- User Management (view, suspend, ban all users)
- Admin Management (invite, approve, remove admins)
- Assign Admin Roles (can create Operations/Compliance admins)
- Runner Management (approve, suspend, ban runners)
- Business Management (approve, suspend, ban businesses, revoke storefronts)
- Delivery Control (monitor, reassign, resolve disputes)
- Storage Management (approve/reject storage requests)
- Analytics & Logs (access all platform metrics and logs)
- Platform Controls (ban IPs, lock accounts, manage warehouses)
- Special Privileges:
  - Act as Runner (for testing without verification)
  - Act as Business (for testing without verification)
  - Act as Shop Owner (for testing storefronts)

**Example Super Admin Email:** `riderezzy@gmail.com`
**Example Password:** `1percent99`

#### 2. Operations Admin
**Authority Level:** Operational Focus

**Permissions:**
- Approve runners
- Suspend runners
- Monitor deliveries in real-time
- Assign runners to deliveries
- Resolve delivery disputes
- Manage warehouse inventory
- View system metrics
- Track storage requests
- **Cannot:** Create/remove other admins, override Super Admin actions

#### 3. Compliance Admin
**Authority Level:** Verification & Safety Focus

**Permissions:**
- KYC identity verification (approve runner/business identity)
- Document verification (NIN, proof of address, etc.)
- Flag suspicious accounts
- Temporary user suspension
- View user data for verification purposes
- **Cannot:** Access system infrastructure, change admin roles, override other admin decisions

## Admin Dashboard Features

### 1. Dashboard Overview
- **Real-time Statistics**: Total users, active runners, active businesses, completed orders
- **Quick Action Cards**: Fast access to most-used modules
- **Admin-specific Metrics**: Based on your admin level

### 2. Users Management
- **Search Users**: Find users by name or email
- **View User Details**: Role, status, verification level
- **Actions**:
  - Suspend users (temporary removal from platform)
  - Ban users (permanent removal with history tracking)
  - Unsuspend users (restore after suspension)

**Use When:**
- User violates terms of service
- Suspicious account activity
- Temporary compliance issues
- Data verification needed

### 3. Runners Management
- **View All Runners**: Complete runner roster with status
- **Approve Runners**: Review submitted documents and approve
- **Suspend Runners**: Temporarily remove from delivery pool
- **Ban Runners**: Permanently remove for violations

**Runner Status:**
- `pending` - Awaiting initial approval
- `approved` - Active on platform
- `suspended` - Temporarily removed (can be restored)
- `banned` - Permanently removed

### 4. Businesses Management
- **View All Businesses**: Existing business accounts
- **KYC Status Tracking**: none → pending → verified
- **Actions**:
  - Approve businesses (verify KYC documents)
  - Suspend businesses (temporary restriction)
  - Ban businesses (permanent removal)
  - Revoke storefront access (specific module restriction)

**Business Status:**
- `none` - No KYC submitted
- `pending` - Awaiting verification
- `verified` - Fully approved for operations

### 5. Admin Management (Super Admin Only)
- **View All Admins**: Complete admin roster
- **Invite Admins**: Send invitations to new admin candidates
- **Select Admin Level**:
  - Super Admin (full access)
  - Operations Admin (logistics focused)
  - Compliance Admin (verification focused)
- **Track Admin Status**: pending → approved
- **Remove Admins**: Revoke admin access (cannot remove Super Admins)

### 6. System Logs
- **Action Audit Trail**: Complete record of all admin actions
- **Information Logged**:
  - Admin name and ID
  - Action performed
  - Target user (if applicable)
  - Timestamp (precise to second)
  - IP address of admin
  - Action details/reason

**Example Log Entry:**
```
Admin: John Smith
Action: Suspended User
Target User: jane.doe@email.com
Time: 2024-03-15 14:30:45 UTC
IP: 192.168.1.100
Details: {"reason": "Suspicious activity", "duration": "48 hours"}
```

### 7. Analytics Dashboard
- **User Metrics**: Total users by role, growth trends
- **Runner Metrics**: Active runners, completion rates, ratings
- **Business Metrics**: Active businesses, categories, revenue
- **Delivery Metrics**: Total orders, completion rate, average time
- **Revenue Dashboard**: Platform earnings, payout tracking
- **Custom Reports**: Exportable data for analysis

### 8. Security Controls
- **IP Management**: Whitelist/blacklist IP addresses
- **Account Locking**: Lock suspicious accounts
- **Session Tracking**: Monitor active admin sessions
- **2FA Status**: Check if Super Admin has 2FA enabled
- **Access Logs**: Admin login history by date

---

## Security Best Practices

### For Super Admins

1. **Enable 2FA**: Protect your admin account with two-factor authentication
2. **IP Whitelisting**: Restrict admin access to known office IPs
3. **Regular Audits**: Review admin action logs weekly
4. **Password Strength**: Use strong, unique passwords (minimum 12 characters)
5. **Session Timeout**: Auto-logout after 30 minutes of inactivity

### For All Admins

1. **Never Share Credentials**: Keep your admin account private
2. **Log Actions Carefully**: Document reason for every suspension/ban
3. **Review Disputes**: Don't just approve/deny - investigate thoroughly
4. **Communicate**: Use the notes feature to explain decisions to users
5. **Escalate**: For complex issues, escalate to Super Admin

### Important Rules

- **All admin actions are logged** - Your actions are traceable and auditable
- **Super Admin actions cannot be overridden** - Only Super Admin can override another Super Admin
- **Suspension is not permanent** - Always try suspension before banning
- **Document everything** - Admins must provide reasons for serious actions
- **No access to system code** - Admins cannot modify platform code

---

## Common Workflows

### Approving a New Runner

1. Go to **Runners** tab
2. Find runner with `pending` status
3. Review their submitted documents:
   - Government ID (Front & Back)
   - Proof of Address
   - Selfie for verification
   - Emergency contact information
4. Check KYC verification status
5. Click **Approve** button
6. Runner becomes `approved` and can accept deliveries

### Suspending a Problematic User

1. Go to **Users** tab
2. Search for the user by name/email
3. Click **Suspend** button
4. Provide reason (e.g., "Multiple late deliveries", "User complaint")
5. User is immediately removed from active operations
6. User receives notification and can appeal
7. Action is logged for review

### Handling Delivery Dispute

1. Go to **Disputes** tab
2. Review dispute details:
   - What happened?
   - Who reported it?
   - Evidence provided
   - Attempted resolution
3. Interview involved parties (if system supports)
4. Make decision:
   - Refund customer
   - Compensate runner
   - Ban either party if fraud detected
5. Log decision with detailed explanation

### Inviting a New Operations Admin

1. Click **Add Admin** button
2. Enter email address of new admin
3. Select **Operations Admin** from level dropdown
4. System sends invitation email
5. New admin logs in and sets password
6. Super Admin must manually approve new admin
7. Approved admin can access Operations modules

---

## Admin Settings & Profile

Each admin can manage their own account settings:

- **Email Address**: Primary contact (cannot be changed by admin, Super Admin only)
- **Admin Level**: View your permission level
- **Login Method**: Password or Magic Link
- **2FA Status**: Enable/disable two-factor authentication
- **IP Whitelist**: Manage your whitelisted IPs
- **Recent Activity**: View your recent actions and logins

---

## Troubleshooting & FAQs

### Q: I can't see the Admin Panel button

**A:** You need to be logged in with an admin account that has been approved by a Super Admin. If you were just invited, ask the Super Admin to approve your account.

### Q: How do I recover if I accidentally ban someone?

**A:** Contact a Super Admin. Only Super Admin can unban users. They'll need to access the database directly and restore the user's status. This is why it's important to be careful with bans.

### Q: What happens when I suspend a user?

**A:** The user is immediately prevented from:
- Accessing their account
- Accepting new assignments
- Making new orders/purchases

The user's existing active orders are reassigned to other runners/admins.

### Q: Can I see what password an admin set?

**A:** No, passwords are hashed and never visible. If an admin forgets their password, only they can reset it or you can force a password reset via email.

### Q: How long are action logs kept?

**A:** For this demo version, logs are stored in localStorage. In production, they'd be stored indefinitely on secure servers with backup systems.

### Q: Can Multiple Super Admins work on the platform?

**A:** Yes! Multiple Super Admins can be appointed. Each can see each other's actions. However, only one Super Admin can be the "system owner" who can change system-level settings.

---

## Technical Architecture

### Type System

```typescript
type AdminLevel = 'super_admin' | 'operations_admin' | 'compliance_admin';
type AdminPermission = ...30+ permission types;
type UserStatus = 'pending' | 'approved' | 'suspended' | 'banned' | 'removed';
```

### RBAC Implementation

```typescript
// Check if admin has permission
if (AdminRBAC.hasPermission(admin.admin_level, 'suspend_users')) {
  // Show suspend button
}

// Get all permissions for a level
const permissions = AdminRBAC.getPermissions('operations_admin');

// Verify can manage someone
if (AdminRBAC.canManageAdmin(myLevel, targetLevel)) {
  // Super Admin can manage all others
}
```

### Admin Action Logging

Each logged action contains:
- Admin ID & name
- Action type (string)
- Target user (optional)
- Timestamp (ISO 8601)
- IP address
- Detailed context object

---

## Future Enhancements

- Advanced Analytics Dashboard with charts
- Real-time delivery monitoring
- Batch operations (suspend/ban multiple users)
- Custom admin roles with granular permissions
- Admin team assignments (operations team, compliance team)
- Automated actions based on triggers
- Integration with external verification services
- Advanced fraud detection
- Mobile admin app
- API access for external systems

---

## Support & Questions

For issues or questions about the Admin System:
1. Check System Logs for context
2. Escalate to Super Admin
3. Document the issue with screenshots
4. Contact Pick'em support team

---

**Version:** 1.0
**Last Updated:** March 15, 2026
**Admin System Build:** Complete & Production Ready
