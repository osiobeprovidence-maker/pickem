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

export type BusinessSubscriptionStatus = 'inactive' | 'trial' | 'active' | 'expired';
export type StorefrontStatus = 'draft' | 'published' | 'hidden';
export type StorefrontOpenStatus = 'open' | 'closed';
export type ProductStatus = 'draft' | 'published' | 'hidden' | 'out_of_stock';
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'in_transit' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Business {
  id: string;
  business_name: string;
  category: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  email: string;
  phone: string;
  address: string;
  city_state: string;
  description: string;
  onboarding_complete: boolean;
  subscription_status: BusinessSubscriptionStatus;
  trial_start_date?: string;
  trial_end_date?: string;
  storefront_id?: string;
}

export interface StorefrontSocialLinks {
  instagram?: string;
  whatsapp?: string;
  website?: string;
  x?: string;
}

export interface Storefront {
  storefront_id: string;
  business_id: string;
  storefront_name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  tagline: string;
  description: string;
  category: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  campus_location?: string;
  service_area: string;
  opening_hours: string;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
  social_links?: StorefrontSocialLinks;
  storefront_status: StorefrontStatus;
  is_public: boolean;
  open_status: StorefrontOpenStatus;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  business_id: string;
  storefront_id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discount_price?: number;
  images: string[];
  stock: number;
  status: ProductStatus;
  featured: boolean;
  delivery_available: boolean;
  pickup_available: boolean;
  visible_in_marketplace: boolean;
  estimated_preparation_time?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  business_id: string;
  customer_name: string;
  items: OrderItem[];
  amount: number;
  payment_status: PaymentStatus;
  status: OrderStatus;
  created_at: string;
}
