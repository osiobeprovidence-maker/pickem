import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    name: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    firebase_uid: v.optional(v.string()),
    auth_provider: v.optional(v.string()),
    role: v.string(),
    status: v.string(),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
    hasPassword: v.boolean(),
    password: v.optional(v.string()),
    needs_password_setup: v.optional(v.boolean()),
    lastMagicLogin: v.optional(v.string()),
    email_verified: v.boolean(),
    phone_verified: v.boolean(),
    verification_cleared: v.boolean(),
    admin_level: v.optional(v.string()),
    invited_by: v.optional(v.string()),
    business_id: v.optional(v.string()),
    two_factor_enabled: v.optional(v.boolean()),
    ip_whitelist: v.optional(v.array(v.string())),
    last_ip_address: v.optional(v.string()),
    suspension_reason: v.optional(v.string()),
    ban_reason: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .index("by_firebase_uid", ["firebase_uid"])
    .index("by_role", ["role"])
    .index("by_status", ["status"])
    .index("by_role_and_status", ["role", "status"]),

  // Businesses table
  businesses: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    address: v.string(),
    is_remote: v.boolean(),
    location_type: v.string(),
    logo: v.optional(v.string()),
    banner: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    website: v.optional(v.string()),
    store_policy: v.optional(v.string()),
    is_pro: v.boolean(),
    kyc_status: v.string(),
    nin: v.optional(v.string()),
    proof_of_address: v.optional(v.string()),
    created_at: v.string(),
    owner_id: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_kyc_status", ["kyc_status"])
    .index("by_category", ["category"])
    .index("by_owner", ["owner_id"]),

  // Products table
  products: defineTable({
    business_id: v.string(),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    discount_price: v.optional(v.number()),
    category: v.string(),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    stock: v.number(),
    type: v.string(),
    fulfillment_mode: v.string(),
    is_published: v.boolean(),
    created_at: v.string(),
  })
    .index("by_business", ["business_id"])
    .index("by_category", ["category"])
    .index("by_published", ["is_published"])
    .index("by_business_and_published", ["business_id", "is_published"]),

  // Customers table
  customers: defineTable({
    business_id: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    last_purchase_date: v.string(),
    total_spent: v.number(),
    order_count: v.number(),
  })
    .index("by_business", ["business_id"])
    .index("by_email", ["email"])
    .index("by_business_and_email", ["business_id", "email"]),

  // Deliveries table
  deliveries: defineTable({
    type: v.string(),
    status: v.string(),
    pickup_location: v.string(),
    drop_location: v.string(),
    item_description: v.string(),
    contact_details: v.string(),
    customer_id: v.optional(v.string()),
    business_id: v.optional(v.string()),
    runner_id: v.optional(v.string()),
    proxy_code: v.optional(v.string()),
    preferred_time: v.optional(v.string()),
    item_image: v.optional(v.string()),
    proof_method: v.optional(v.string()),
    proof_asset: v.optional(v.string()),
    proof_code: v.optional(v.string()),
    proof_confirmed_at: v.optional(v.string()),
    fee: v.number(),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_customer", ["customer_id"])
    .index("by_business", ["business_id"])
    .index("by_runner", ["runner_id"])
    .index("by_type_and_status", ["type", "status"]),

  // Runner verifications table
  runner_verifications: defineTable({
    runner_id: v.string(),
    full_name: v.string(),
    phone_number: v.string(),
    phone_verified: v.boolean(),
    email: v.string(),
    email_verified: v.boolean(),
    id_type: v.string(),
    id_front: v.optional(v.string()),
    id_back: v.optional(v.string()),
    selfie_image: v.optional(v.string()),
    residential_address: v.string(),
    proof_of_address: v.optional(v.string()),
    emergency_contact_name: v.string(),
    emergency_contact_phone: v.string(),
    emergency_contact_relationship: v.string(),
    bank_name: v.string(),
    account_number: v.string(),
    account_name: v.string(),
    payout_verified: v.boolean(),
    device_id: v.string(),
    ip_address: v.string(),
    location_data: v.string(),
    terms_accepted: v.boolean(),
    security_bond_amount: v.number(),
    trust_score: v.number(),
    verification_status: v.string(),
    submitted_at: v.optional(v.string()),
    approved_at: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_runner", ["runner_id"])
    .index("by_verification_status", ["verification_status"])
    .index("by_email", ["email"]),

  // Business orders table
  business_orders: defineTable({
    business_id: v.string(),
    product_id: v.optional(v.string()),
    delivery_id: v.optional(v.string()),
    customer_id: v.optional(v.string()),
    customer_name: v.string(),
    customer_email: v.string(),
    customer_phone: v.string(),
    product_name: v.string(),
    product_type: v.string(),
    quantity: v.number(),
    unit_price: v.number(),
    total_amount: v.number(),
    delivery_fee: v.number(),
    pickup_location: v.string(),
    drop_location: v.string(),
    contact_details: v.string(),
    fulfillment_mode: v.string(),
    status: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_business", ["business_id"])
    .index("by_customer", ["customer_id"])
    .index("by_status", ["status"])
    .index("by_delivery", ["delivery_id"])
    .index("by_business_and_status", ["business_id", "status"]),

  // Storage subscriptions table
  storage_subscriptions: defineTable({
    business_id: v.string(),
    location: v.string(),
    size: v.string(),
    monthly_cost: v.number(),
    quantity: v.number(),
    product_ids: v.array(v.string()),
    expires_at: v.string(),
    active: v.boolean(),
    created_at: v.string(),
  })
    .index("by_business", ["business_id"])
    .index("by_location", ["location"])
    .index("by_active", ["active"]),

  // Notifications table
  notifications: defineTable({
    user_id: v.string(),
    message: v.string(),
    read: v.boolean(),
    created_at: v.string(),
  })
    .index("by_user", ["user_id"])
    .index("by_user_and_read", ["user_id", "read"]),

  // Admin action logs table
  admin_action_logs: defineTable({
    admin_id: v.string(),
    admin_name: v.string(),
    action: v.string(),
    target_user_id: v.optional(v.string()),
    target_user_email: v.optional(v.string()),
    details: v.any(),
    timestamp: v.string(),
    ip_address: v.optional(v.string()),
  })
    .index("by_admin", ["admin_id"])
    .index("by_timestamp", ["timestamp"])
    .index("by_action", ["action"]),

  // Admin security events table
  admin_security_events: defineTable({
    admin_id: v.string(),
    event_type: v.string(),
    description: v.string(),
    ip_address: v.optional(v.string()),
    timestamp: v.string(),
  })
    .index("by_admin", ["admin_id"])
    .index("by_event_type", ["event_type"])
    .index("by_timestamp", ["timestamp"]),
});
