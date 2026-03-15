export type UserRole = 'customer' | 'business' | 'runner' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'suspended' | 'banned' | 'removed';
export type AdminLevel = 'super_admin' | 'operations_admin' | 'compliance_admin';
export type AdminPermission = 
  // User Management
  | 'view_users' | 'suspend_users' | 'ban_users'
  // Admin Management
  | 'approve_admins' | 'remove_admins' | 'assign_admin_roles'
  // Runner Management
  | 'approve_runners' | 'suspend_runners' | 'ban_runners'
  // Business Management
  | 'approve_businesses' | 'suspend_businesses' | 'ban_businesses' | 'revoke_storefront'
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
  | 'override_restrictions' | 'ban_ips' | 'lock_accounts' | 'manage_warehouse_locations'
  // Special Privileges
  | 'act_as_runner' | 'act_as_business' | 'act_as_shop_owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  hasPassword?: boolean;
  password?: string;
  lastMagicLogin?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  verification_cleared?: boolean;
  admin_level?: AdminLevel;
  invited_by?: string;
  business?: Business;
  // Admin-specific fields
  two_factor_enabled?: boolean;
  ip_whitelist?: string[];
  last_ip_address?: string;
  suspension_reason?: string;
  ban_reason?: string;
}

export interface AdminActionLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_user_id?: string;
  target_user_email?: string;
  details: Record<string, any>;
  timestamp: string;
  ip_address?: string;
}

export interface AdminSecurityEvent {
  id: string;
  admin_id: string;
  event_type: 'login' | 'permission_denied' | 'suspicious_activity' | '2fa_failed';
  description: string;
  ip_address?: string;
  timestamp: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  is_remote: boolean;
  location_type: 'on_campus' | 'off_campus' | 'remote';
  logo?: string;
  banner?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
  store_policy?: string;
  is_pro: boolean;
  kyc_status: 'none' | 'pending' | 'verified';
  nin?: string;
  proof_of_address?: string;
  created_at: string;
}

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string;
  image?: string;
  video?: string;
  stock: number;
  type: 'physical' | 'digital' | 'service';
  fulfillment_mode?: 'manual' | 'warehouse';
  is_published: boolean;
  created_at: string;
}

export interface CustomerData {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string;
  last_purchase_date: string;
  total_spent: number;
  order_count: number;
}

export type DeliveryStatus = 'requested' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
export type DeliveryType = 'send_item' | 'business_delivery' | 'proxy' | 'buy_deliver';
export type BusinessOrderStatus = 'pending_approval' | 'ready_for_pickup' | 'runner_assigned' | 'out_for_delivery' | 'delivered';
export type StorageSize = 'small' | 'medium' | 'large' | 'custom';
export type StorageLocation = 'Lagos' | 'Abuja' | 'Port Harcourt' | 'Warri';
export type RunnerVerificationStatus = 'not_started' | 'in_review' | 'approved';
export type DeliveryProofMethod = 'photo' | 'signature' | 'otp';

export interface Delivery {
  id: string;
  type: DeliveryType;
  status: DeliveryStatus;
  pickup_location: string;
  drop_location: string;
  item_description: string;
  contact_details: string;
  customer_id?: string;
  business_id?: string;
  runner_id?: string;
  proxy_code?: string;
  preferred_time?: string;
  item_image?: string;
  proof_method?: DeliveryProofMethod;
  proof_asset?: string;
  proof_code?: string;
  proof_confirmed_at?: string;
  fee: number;
  created_at: string;
  updated_at: string;
}

export interface RunnerVerification {
  runner_id: string;
  full_name: string;
  phone_number: string;
  phone_verified: boolean;
  email: string;
  email_verified: boolean;
  id_type: 'nin' | 'drivers_license' | 'passport' | 'voters_card';
  id_front?: string;
  id_back?: string;
  selfie_image?: string;
  residential_address: string;
  proof_of_address?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  payout_verified: boolean;
  device_id: string;
  ip_address: string;
  location_data: string;
  terms_accepted: boolean;
  security_bond_amount: number;
  trust_score: number;
  verification_status: RunnerVerificationStatus;
  submitted_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessOrder {
  id: string;
  business_id: string;
  product_id?: string;
  delivery_id?: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  product_type: Product['type'];
  quantity: number;
  unit_price: number;
  total_amount: number;
  delivery_fee: number;
  pickup_location: string;
  drop_location: string;
  contact_details: string;
  fulfillment_mode: 'manual' | 'warehouse';
  status: BusinessOrderStatus;
  created_at: string;
  updated_at: string;
}

export interface StorageSubscription {
  id: string;
  business_id: string;
  location: StorageLocation;
  size: StorageSize;
  monthly_cost: number;
  quantity: number;
  product_ids: string[];
  expires_at: string;
  active: boolean;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
}
