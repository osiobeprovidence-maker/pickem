export type UserRole = 'customer' | 'business' | 'runner' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'suspended' | 'banned' | 'removed';
export type AuthProvider = 'password' | 'google' | 'apple';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at?: string;
  username?: string;
  firebase_uid?: string;
  auth_provider?: AuthProvider;
  hasPassword?: boolean;
  password?: string;
  needs_password_setup?: boolean;
  lastMagicLogin?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  verification_cleared?: boolean;
  admin_level?: string;
  invited_by?: string;
  two_factor_enabled?: boolean;
  ip_whitelist?: string[];
  last_ip_address?: string;
  suspension_reason?: string;
  ban_reason?: string;
}

export type DeliveryStatus = 'requested' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
export type DeliveryType = 'send_item' | 'business_delivery' | 'proxy' | 'buy_deliver';

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
  fee: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
}
