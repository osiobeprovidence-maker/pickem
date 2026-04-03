export type UserRole = 'customer' | 'business' | 'runner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'approved';
  created_at: string;
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
