import {
  AdminLevel,
  User,
  Delivery,
  DeliveryStatus,
  UserRole,
  Business,
  Product,
  CustomerData,
  BusinessOrder,
  BusinessOrderStatus,
  StorageSubscription,
  StorageLocation,
  StorageSize,
  RunnerVerification,
  DeliveryProofMethod,
  UserStatus,
} from "../types";

// Fully mocked API for frontend-only demo
const STORAGE_KEY = 'pickem_deliveries';
const USER_KEY = 'pickem_users';
const BUSINESS_KEY = 'pickem_businesses';
const PRODUCT_KEY = 'pickem_products';
const CUSTOMER_DATA_KEY = 'pickem_business_customers';
const BUSINESS_ORDER_KEY = 'pickem_business_orders';
const STORAGE_SUBSCRIPTION_KEY = 'pickem_storage_subscriptions';
const RUNNER_VERIFICATION_KEY = 'pickem_runner_verifications';
const SUPER_ADMIN_EMAIL = 'riderezzy@gmail.com';
const SUPER_ADMIN_PASSWORD = '1percent99';
const SUPER_ADMIN_ID = 'pickem-super-admin';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getStoredUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USER_KEY) || '[]');
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USER_KEY, JSON.stringify(users));
};

const getDefaultNameFromEmail = (email: string) => {
  const [handle] = email.split('@');
  return handle || 'Pickem User';
};

const ensureSeededUsers = (): User[] => {
  const users = getStoredUsers();
  const now = new Date().toISOString();
  const superAdminIndex = users.findIndex(user => normalizeEmail(user.email) === SUPER_ADMIN_EMAIL);
  const existingSuperAdmin = superAdminIndex >= 0 ? users[superAdminIndex] : null;

  const seededSuperAdmin: User = {
    id: existingSuperAdmin?.id || SUPER_ADMIN_ID,
    name: existingSuperAdmin?.name || 'riderezzy',
    email: SUPER_ADMIN_EMAIL,
    role: 'admin',
    status: 'approved',
    created_at: existingSuperAdmin?.created_at || now,
    hasPassword: true,
    password: existingSuperAdmin?.password || SUPER_ADMIN_PASSWORD,
    lastMagicLogin: existingSuperAdmin?.lastMagicLogin || now,
    email_verified: true,
    phone_verified: true,
    verification_cleared: true,
    admin_level: 'super_admin',
    invited_by: existingSuperAdmin?.invited_by,
    business: existingSuperAdmin?.business,
  };

  if (superAdminIndex >= 0) {
    users[superAdminIndex] = { ...existingSuperAdmin, ...seededSuperAdmin };
  } else {
    users.push(seededSuperAdmin);
  }

  saveUsers(users);
  return users;
};

const getStoredDeliveries = (): Delivery[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

const saveDeliveries = (deliveries: Delivery[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveries));
};

const getStoredBusinesses = (): Business[] => {
  return JSON.parse(localStorage.getItem(BUSINESS_KEY) || '[]');
};

const saveBusinesses = (businesses: Business[]) => {
  localStorage.setItem(BUSINESS_KEY, JSON.stringify(businesses));
};

const getStoredProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem(PRODUCT_KEY) || '[]');
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
};

const getStoredCustomers = (): CustomerData[] => {
  return JSON.parse(localStorage.getItem(CUSTOMER_DATA_KEY) || '[]');
};

const saveCustomers = (customers: CustomerData[]) => {
  localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customers));
};

const getStoredBusinessOrders = (): BusinessOrder[] => {
  return JSON.parse(localStorage.getItem(BUSINESS_ORDER_KEY) || '[]');
};

const saveBusinessOrders = (orders: BusinessOrder[]) => {
  localStorage.setItem(BUSINESS_ORDER_KEY, JSON.stringify(orders));
};

const getStoredSubscriptions = (): StorageSubscription[] => {
  return JSON.parse(localStorage.getItem(STORAGE_SUBSCRIPTION_KEY) || '[]');
};

const saveSubscriptions = (subscriptions: StorageSubscription[]) => {
  localStorage.setItem(STORAGE_SUBSCRIPTION_KEY, JSON.stringify(subscriptions));
};

const getStoredRunnerVerifications = (): RunnerVerification[] => {
  return JSON.parse(localStorage.getItem(RUNNER_VERIFICATION_KEY) || '[]');
};

const saveRunnerVerifications = (verifications: RunnerVerification[]) => {
  localStorage.setItem(RUNNER_VERIFICATION_KEY, JSON.stringify(verifications));
};

const storageRateTable: Record<StorageLocation, Record<StorageSize, number>> = {
  Lagos: { small: 12000, medium: 24000, large: 42000, custom: 65000 },
  Abuja: { small: 11000, medium: 22000, large: 39000, custom: 60000 },
  'Port Harcourt': { small: 10000, medium: 20000, large: 36000, custom: 56000 },
  Warri: { small: 9000, medium: 18000, large: 32000, custom: 50000 },
};

export const api = {
  // User methods
  async ensureSystemUsers(): Promise<User[]> {
    return ensureSeededUsers();
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const users = ensureSeededUsers();
    return users.find(user => normalizeEmail(user.email) === normalizeEmail(email)) || null;
  },

  async getUser(id: string): Promise<User> {
    const users = ensureSeededUsers();
    const user = users.find((u: User) => u.id === id);
    if (!user) throw new Error("User not found");
    return user;
  },

  async createUser(user: Partial<User>): Promise<User> {
    const users = ensureSeededUsers();
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: user.status || 'approved',
      email: normalizeEmail(user.email || ''),
      hasPassword: user.hasPassword || false,
    } as User;
    saveUsers([...users, newUser]);
    return newUser;
  },

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    const users = ensureSeededUsers();
    const updatedUsers = users.map((u: User) => 
      u.id === id ? { ...u, ...data } : u
    );
    saveUsers(updatedUsers);
  },

  async setUserPassword(id: string, password: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === id);
    if (!target) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...target,
      hasPassword: true,
      password,
    };

    saveUsers(users.map(user => (user.id === id ? updatedUser : user)));
    return updatedUser;
  },

  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user || user.status === 'removed') {
      throw new Error('User not found or invalid credentials');
    }

    if (!user.hasPassword || !user.password || user.password !== password) {
      throw new Error('Invalid password');
    }

    const authenticatedUser = {
      ...user,
      lastMagicLogin: new Date().toISOString(),
    };

    await this.updateUser(user.id, { lastMagicLogin: authenticatedUser.lastMagicLogin });
    return authenticatedUser;
  },

  async issueMagicLogin(email: string, role: UserRole): Promise<User> {
    const now = new Date().toISOString();
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      if (existingUser.status === 'removed') {
        throw new Error('This account has been removed. Contact Pick\'em support.');
      }

      const refreshedUser = {
        ...existingUser,
        lastMagicLogin: now,
      };
      await this.updateUser(existingUser.id, { lastMagicLogin: now });
      return refreshedUser;
    }

    return this.createUser({
      id: btoa(normalizeEmail(email)).slice(0, 10),
      name: getDefaultNameFromEmail(email),
      email,
      role,
      status: 'approved',
      hasPassword: false,
      lastMagicLogin: now,
      email_verified: true,
    });
  },

  async getAdminUsers(): Promise<User[]> {
    return ensureSeededUsers()
      .filter(user => user.role === 'admin')
      .sort((a, b) => {
        if (a.admin_level === 'super_admin') return -1;
        if (b.admin_level === 'super_admin') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  },

  async inviteAdmin(email: string, invitedBy: string): Promise<User> {
    const normalizedEmail = normalizeEmail(email);
    const now = new Date().toISOString();
    const users = ensureSeededUsers();
    const existingUserIndex = users.findIndex(user => normalizeEmail(user.email) === normalizedEmail);
    const existingUser = existingUserIndex >= 0 ? users[existingUserIndex] : null;

    const invitedAdmin: User = {
      id: existingUser?.id || crypto.randomUUID(),
      name: existingUser?.name || getDefaultNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      role: 'admin',
      status: existingUser?.admin_level === 'super_admin' ? 'approved' : 'pending',
      created_at: existingUser?.created_at || now,
      hasPassword: existingUser?.hasPassword || false,
      password: existingUser?.password,
      lastMagicLogin: existingUser?.lastMagicLogin,
      email_verified: existingUser?.email_verified || true,
      phone_verified: existingUser?.phone_verified || false,
      verification_cleared: existingUser?.verification_cleared || false,
      admin_level: existingUser?.admin_level || 'admin',
      invited_by: invitedBy,
      business: existingUser?.business,
    };

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = { ...existingUser, ...invitedAdmin };
    } else {
      users.push(invitedAdmin);
    }

    saveUsers(users);
    return invitedAdmin;
  },

  async approveAdmin(userId: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === userId && user.role === 'admin');
    if (!target) {
      throw new Error('Admin not found');
    }

    const approvedAdmin: User = {
      ...target,
      status: 'approved',
      admin_level: target.admin_level || 'admin',
      verification_cleared: true,
      email_verified: true,
    };

    saveUsers(users.map(user => (user.id === userId ? approvedAdmin : user)));
    return approvedAdmin;
  },

  async removeAdmin(userId: string): Promise<void> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === userId && user.role === 'admin');
    if (!target) {
      throw new Error('Admin not found');
    }
    if (target.admin_level === 'super_admin') {
      throw new Error('Super admin access cannot be removed');
    }

    saveUsers(
      users.map(user =>
        user.id === userId
          ? {
              ...user,
              status: 'removed' as UserStatus,
            }
          : user,
      ),
    );
  },

  // Business Methods
  async getBusinesses(): Promise<Business[]> {
    return getStoredBusinesses().sort((a, b) => a.name.localeCompare(b.name));
  },

  async getBusiness(id: string): Promise<Business | null> {
    const businesses = getStoredBusinesses();
    return businesses.find(b => b.id === id) || null;
  },

  async createOrUpdateBusiness(business: Partial<Business>): Promise<Business> {
    const businesses = getStoredBusinesses();
    const existingIndex = businesses.findIndex(b => b.id === business.id);
    
    let updatedBusiness: Business;
    if (existingIndex >= 0) {
      updatedBusiness = { ...businesses[existingIndex], ...business } as Business;
      businesses[existingIndex] = updatedBusiness;
    } else {
      updatedBusiness = {
        ...business,
        id: business.id || crypto.randomUUID(),
        is_pro: false,
        kyc_status: 'none',
        created_at: new Date().toISOString(),
        location_type: business.location_type || 'on_campus',
        is_remote: business.is_remote || false,
      } as Business;
      businesses.push(updatedBusiness);
    }
    
    saveBusinesses(businesses);
    return updatedBusiness;
  },

  async approveBusinessVerification(id: string): Promise<Business> {
    const businesses = getStoredBusinesses();
    const businessIndex = businesses.findIndex(entry => entry.id === id);
    if (businessIndex < 0) {
      throw new Error('Business not found');
    }

    const approvedBusiness: Business = {
      ...businesses[businessIndex],
      kyc_status: 'verified',
    };

    businesses[businessIndex] = approvedBusiness;
    saveBusinesses(businesses);
    return approvedBusiness;
  },

  // Product Methods
  async getProducts(businessId?: string): Promise<Product[]> {
    const products = getStoredProducts();
    if (businessId) {
      return products.filter(p => p.business_id === businessId);
    }
    return products.filter(p => p.is_published); // For public market
  },

  async createOrUpdateProduct(product: Partial<Product>): Promise<Product> {
    const products = getStoredProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    let updatedProduct: Product;
    if (existingIndex >= 0) {
      updatedProduct = { ...products[existingIndex], ...product } as Product;
      products[existingIndex] = updatedProduct;
    } else {
      updatedProduct = {
        ...product,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        is_published: true,
        fulfillment_mode: product.fulfillment_mode || 'manual',
      } as Product;
      products.push(updatedProduct);
    }
    
    saveProducts(products);
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = getStoredProducts();
    saveProducts(products.filter(p => p.id !== id));
  },

  async duplicateProduct(id: string): Promise<Product> {
    const products = getStoredProducts();
    const existing = products.find(p => p.id === id);
    if (!existing) throw new Error("Product not found");

    const duplicated: Product = {
      ...existing,
      id: crypto.randomUUID(),
      name: `${existing.name} Copy`,
      created_at: new Date().toISOString(),
    };

    saveProducts([...products, duplicated]);
    return duplicated;
  },

  // Delivery Methods
  async getDeliveries(role: UserRole, userId: string): Promise<Delivery[]> {
    const deliveries = getStoredDeliveries();
    if (role === 'runner') {
      return deliveries.filter(d => d.status === 'requested' || d.runner_id === userId);
    }
    if (role === 'business') {
      return deliveries.filter(d => d.business_id === userId);
    }
    return deliveries.filter(d => d.customer_id === userId);
  },

  async createDelivery(delivery: Partial<Delivery>): Promise<{ id: string }> {
    const deliveries = getStoredDeliveries();
    const newDelivery: Delivery = {
      id: crypto.randomUUID(),
      status: 'requested',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...delivery,
    } as Delivery;
    
    saveDeliveries([...deliveries, newDelivery]);
    return { id: newDelivery.id };
  },

  async updateDeliveryStatus(id: string, status: DeliveryStatus, runnerId?: string): Promise<void> {
    const deliveries = getStoredDeliveries();
    const updated = deliveries.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status,
          runner_id: runnerId || d.runner_id,
          updated_at: new Date().toISOString()
        };
      }
      return d;
    });
    saveDeliveries(updated);
  },

  async completeRunnerDeliveryWithProof(
    id: string,
    runnerId: string,
    proof: {
      method: DeliveryProofMethod;
      asset?: string;
      code?: string;
    },
  ): Promise<void> {
    const deliveries = getStoredDeliveries();
    const updated = deliveries.map(delivery => {
      if (delivery.id !== id) return delivery;
      return {
        ...delivery,
        status: 'delivered' as const,
        runner_id: runnerId,
        proof_method: proof.method,
        proof_asset: proof.asset,
        proof_code: proof.code,
        proof_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
    saveDeliveries(updated);

    const verifications = getStoredRunnerVerifications();
    const updatedVerifications = verifications.map(record =>
      record.runner_id === runnerId
        ? {
            ...record,
            trust_score: Math.min(100, record.trust_score + 5),
            updated_at: new Date().toISOString(),
          }
        : record,
    );
    saveRunnerVerifications(updatedVerifications);
  },

  // Business order methods
  async getBusinessOrders(businessId: string): Promise<BusinessOrder[]> {
    const orders = getStoredBusinessOrders();
    return orders
      .filter(order => order.business_id === businessId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createBusinessOrder(order: Partial<BusinessOrder>): Promise<BusinessOrder> {
    const orders = getStoredBusinessOrders();
    const newOrder: BusinessOrder = {
      id: crypto.randomUUID(),
      business_id: order.business_id!,
      customer_name: order.customer_name || 'Guest Customer',
      customer_email: order.customer_email || '',
      customer_phone: order.customer_phone || '',
      product_name: order.product_name || 'Product',
      product_type: order.product_type || 'physical',
      quantity: order.quantity || 1,
      unit_price: order.unit_price || 0,
      total_amount: order.total_amount || 0,
      delivery_fee: order.delivery_fee || 0,
      pickup_location: order.pickup_location || 'Business pickup',
      drop_location: order.drop_location || '',
      contact_details: order.contact_details || '',
      fulfillment_mode: order.fulfillment_mode || 'manual',
      status: order.status || 'pending_approval',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...order,
    } as BusinessOrder;

    saveBusinessOrders([...orders, newOrder]);
    return newOrder;
  },

  async updateBusinessOrderStatus(id: string, status: BusinessOrderStatus, deliveryId?: string): Promise<void> {
    const orders = getStoredBusinessOrders();
    const updated = orders.map(order => {
      if (order.id !== id) return order;
      return {
        ...order,
        status,
        delivery_id: deliveryId || order.delivery_id,
        updated_at: new Date().toISOString(),
      };
    });
    saveBusinessOrders(updated);
  },

  async dispatchBusinessOrder(id: string): Promise<{ deliveryId?: string; order: BusinessOrder }> {
    const orders = getStoredBusinessOrders();
    const order = orders.find(entry => entry.id === id);
    if (!order) throw new Error("Order not found");

    const deliveries = getStoredDeliveries();
    let deliveryId = order.delivery_id;

    if (!deliveryId) {
      const delivery: Delivery = {
        id: crypto.randomUUID(),
        type: 'business_delivery',
        status: 'assigned',
        pickup_location: order.pickup_location,
        drop_location: order.drop_location,
        item_description: `${order.quantity}x ${order.product_name}`,
        contact_details: order.contact_details,
        customer_id: order.customer_id,
        business_id: order.business_id,
        item_image: undefined,
        fee: order.delivery_fee,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      deliveries.push(delivery);
      saveDeliveries(deliveries);
      deliveryId = delivery.id;
    }

    await this.updateBusinessOrderStatus(id, 'runner_assigned', deliveryId);
    const refreshed = getStoredBusinessOrders().find(entry => entry.id === id)!;
    return { deliveryId, order: refreshed };
  },

  async approveBusinessOrder(id: string): Promise<{ deliveryId?: string; order: BusinessOrder }> {
    return this.dispatchBusinessOrder(id);
  },

  async syncBusinessOrdersWithDeliveries(businessId: string): Promise<void> {
    const orders = getStoredBusinessOrders();
    const deliveries = getStoredDeliveries();

    const deliveryToOrderStatus: Partial<Record<DeliveryStatus, BusinessOrderStatus>> = {
      requested: 'ready_for_pickup',
      assigned: 'runner_assigned',
      picked_up: 'out_for_delivery',
      delivered: 'delivered',
    };

    const updated = orders.map(order => {
      if (order.business_id !== businessId || !order.delivery_id) return order;
      const delivery = deliveries.find(item => item.id === order.delivery_id);
      if (!delivery) return order;
      const status = deliveryToOrderStatus[delivery.status] || order.status;
      return {
        ...order,
        status,
        updated_at: delivery.updated_at,
      };
    });

    saveBusinessOrders(updated);
  },

  // Storage methods
  async getStorageSubscriptions(businessId: string): Promise<StorageSubscription[]> {
    return getStoredSubscriptions()
      .filter(subscription => subscription.business_id === businessId)
      .sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime());
  },

  async createStorageSubscription(input: {
    business_id: string;
    location: StorageLocation;
    size: StorageSize;
    quantity: number;
    durationMonths: number;
    product_ids: string[];
  }): Promise<StorageSubscription> {
    const subscriptions = getStoredSubscriptions();
    const monthlyCost = storageRateTable[input.location][input.size] * Math.max(1, input.durationMonths);
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + Math.max(1, input.durationMonths));

    const subscription: StorageSubscription = {
      id: crypto.randomUUID(),
      business_id: input.business_id,
      location: input.location,
      size: input.size,
      quantity: input.quantity,
      product_ids: input.product_ids,
      monthly_cost: monthlyCost,
      expires_at: expiresAt.toISOString(),
      active: true,
      created_at: new Date().toISOString(),
    };

    saveSubscriptions([...subscriptions, subscription]);

    const products = getStoredProducts();
    const updatedProducts = products.map(product =>
      input.product_ids.includes(product.id)
        ? { ...product, fulfillment_mode: 'warehouse' as const }
        : product,
    );
    saveProducts(updatedProducts);

    return subscription;
  },

  async removeProductsFromStorage(businessId: string, productIds: string[]): Promise<void> {
    const subscriptions = getStoredSubscriptions().map(subscription => {
      if (subscription.business_id !== businessId) return subscription;
      return {
        ...subscription,
        product_ids: subscription.product_ids.filter(id => !productIds.includes(id)),
      };
    });
    saveSubscriptions(subscriptions);

    const products = getStoredProducts().map(product =>
      product.business_id === businessId && productIds.includes(product.id)
        ? { ...product, fulfillment_mode: 'manual' as const }
        : product,
    );
    saveProducts(products);
  },

  // Customer Data Methods
  async getBusinessCustomers(businessId: string): Promise<CustomerData[]> {
    const customers = getStoredCustomers();
    return customers.filter(c => c.business_id === businessId);
  },

  async collectCustomerData(businessId: string, userData: { name: string, email: string, phone: string, amount: number }): Promise<void> {
    const customers = getStoredCustomers();
    const existingIndex = customers.findIndex(c => c.business_id === businessId && c.email === userData.email);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = {
        ...customers[existingIndex],
        name: userData.name,
        phone: userData.phone,
        total_spent: customers[existingIndex].total_spent + userData.amount,
        order_count: customers[existingIndex].order_count + 1,
        last_purchase_date: new Date().toISOString()
      };
    } else {
      customers.push({
        id: crypto.randomUUID(),
        business_id: businessId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        total_spent: userData.amount,
        order_count: 1,
        last_purchase_date: new Date().toISOString()
      });
    }
    saveCustomers(customers);
  },

  async upsertBusinessCustomer(
    businessId: string,
    customerData: {
      name: string;
      email: string;
      phone: string;
      totalSpent?: number;
      orderCount?: number;
    },
  ): Promise<CustomerData> {
    const customers = getStoredCustomers();
    const existingIndex = customers.findIndex(
      c => c.business_id === businessId && c.email.toLowerCase() === customerData.email.toLowerCase(),
    );

    const nextCustomer: CustomerData = {
      id: existingIndex >= 0 ? customers[existingIndex].id : crypto.randomUUID(),
      business_id: businessId,
      name: customerData.name.trim(),
      email: customerData.email.trim(),
      phone: customerData.phone.trim(),
      total_spent: customerData.totalSpent ?? (existingIndex >= 0 ? customers[existingIndex].total_spent : 0),
      order_count: customerData.orderCount ?? (existingIndex >= 0 ? customers[existingIndex].order_count : 0),
      last_purchase_date: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      customers[existingIndex] = nextCustomer;
    } else {
      customers.push(nextCustomer);
    }

    saveCustomers(customers);
    return nextCustomer;
  },

  async getRunnerVerification(runnerId: string): Promise<RunnerVerification | null> {
    const verifications = getStoredRunnerVerifications();
    return verifications.find(record => record.runner_id === runnerId) || null;
  },

  async getRunnerVerifications(): Promise<RunnerVerification[]> {
    return getStoredRunnerVerifications().sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  },

  async createOrUpdateRunnerVerification(
    verification: Partial<RunnerVerification> & { runner_id: string },
  ): Promise<RunnerVerification> {
    const verifications = getStoredRunnerVerifications();
    const existingIndex = verifications.findIndex(record => record.runner_id === verification.runner_id);
    const now = new Date().toISOString();

    const baseRecord: RunnerVerification = existingIndex >= 0
      ? verifications[existingIndex]
      : {
          runner_id: verification.runner_id,
          full_name: verification.full_name || '',
          phone_number: verification.phone_number || '',
          phone_verified: verification.phone_verified || false,
          email: verification.email || '',
          email_verified: verification.email_verified || false,
          id_type: verification.id_type || 'nin',
          id_front: verification.id_front,
          id_back: verification.id_back,
          selfie_image: verification.selfie_image,
          residential_address: verification.residential_address || '',
          proof_of_address: verification.proof_of_address,
          emergency_contact_name: verification.emergency_contact_name || '',
          emergency_contact_phone: verification.emergency_contact_phone || '',
          emergency_contact_relationship: verification.emergency_contact_relationship || '',
          bank_name: verification.bank_name || '',
          account_number: verification.account_number || '',
          account_name: verification.account_name || '',
          payout_verified: verification.payout_verified || false,
          device_id: verification.device_id || '',
          ip_address: verification.ip_address || 'Local demo session',
          location_data: verification.location_data || 'Location unavailable',
          terms_accepted: verification.terms_accepted || false,
          security_bond_amount: verification.security_bond_amount || 0,
          trust_score: verification.trust_score || 50,
          verification_status: verification.verification_status || 'not_started',
          submitted_at: verification.submitted_at,
          approved_at: verification.approved_at,
          created_at: now,
          updated_at: now,
        };

    const nextRecord: RunnerVerification = {
      ...baseRecord,
      ...verification,
      updated_at: now,
    };

    if (existingIndex >= 0) {
      verifications[existingIndex] = nextRecord;
    } else {
      verifications.push(nextRecord);
    }

    saveRunnerVerifications(verifications);
    return nextRecord;
  },

  async approveRunnerVerification(runnerId: string): Promise<RunnerVerification> {
    const existing = await this.getRunnerVerification(runnerId);
    if (!existing) {
      throw new Error('Runner verification not found');
    }

    const approved = {
      ...existing,
      verification_status: 'approved' as const,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      trust_score: Math.max(existing.trust_score, 80),
    };

    await this.createOrUpdateRunnerVerification(approved);
    return approved;
  },

  // Admin Action Logging
  async logAdminAction(log: any): Promise<void> {
    const logs = JSON.parse(localStorage.getItem('admin_action_logs') || '[]');
    logs.push(log);
    localStorage.setItem('admin_action_logs', JSON.stringify(logs));
  },

  async getAdminActionLogs(): Promise<any[]> {
    return JSON.parse(localStorage.getItem('admin_action_logs') || '[]')
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async getAdminActionLogsByAdmin(adminId: string): Promise<any[]> {
    const logs = await this.getAdminActionLogs();
    return logs.filter((log: any) => log.admin_id === adminId);
  },

  // Security Event Logging
  async logSecurityEvent(event: any): Promise<void> {
    const events = JSON.parse(localStorage.getItem('admin_security_events') || '[]');
    events.push(event);
    localStorage.setItem('admin_security_events', JSON.stringify(events));
  },

  async getSecurityEvents(): Promise<any[]> {
    return JSON.parse(localStorage.getItem('admin_security_events') || '[]')
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async getSecurityEventsByAdmin(adminId: string): Promise<any[]> {
    const events = await this.getSecurityEvents();
    return events.filter((event: any) => event.admin_id === adminId);
  },

  // User Management for Admins
  async getAllUsers(): Promise<User[]> {
    return ensureSeededUsers();
  },

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return ensureSeededUsers().filter(user => user.role === role);
  },

  async suspendUser(userId: string, reason: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === userId);
    if (!target) throw new Error('User not found');

    const suspended = {
      ...target,
      status: 'suspended' as UserStatus,
      suspension_reason: reason,
    };

    saveUsers(users.map(user => (user.id === userId ? suspended : user)));
    return suspended;
  },

  async banUser(userId: string, reason: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === userId);
    if (!target) throw new Error('User not found');

    const banned = {
      ...target,
      status: 'banned' as UserStatus,
      ban_reason: reason,
    };

    saveUsers(users.map(user => (user.id === userId ? banned : user)));
    return banned;
  },

  async unsuspendUser(userId: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === userId);
    if (!target) throw new Error('User not found');

    const restored = {
      ...target,
      status: 'approved' as UserStatus,
      suspension_reason: undefined,
    };

    saveUsers(users.map(user => (user.id === userId ? restored : user)));
    return restored;
  },

  // Admin Management
  async assignAdminRole(userId: string, adminLevel: AdminLevel): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === userId);
    if (!target) throw new Error('User not found');

    const adminUser = {
      ...target,
      role: 'admin' as UserRole,
      admin_level: adminLevel,
      status: 'approved' as UserStatus,
    };

    saveUsers(users.map(user => (user.id === userId ? adminUser : user)));
    return adminUser;
  },

  async removeAdminRole(userId: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === userId && user.role === 'admin');
    if (!target) throw new Error('Admin not found');
    if (target.admin_level === 'super_admin') {
      throw new Error('Cannot remove super admin role');
    }

    const regularUser = {
      ...target,
      role: 'customer' as UserRole,
      admin_level: undefined,
    };

    saveUsers(users.map(user => (user.id === userId ? regularUser : user)));
    return regularUser;
  },

  // Business Management for Admins
  async suspendBusiness(businessId: string, reason?: string): Promise<Business> {
    const businesses = getStoredBusinesses();
    const target = businesses.find(b => b.id === businessId);
    if (!target) throw new Error('Business not found');

    const suspended = {
      ...target,
      kyc_status: 'pending' as const,
    };

    saveBusinesses(businesses.map(b => (b.id === businessId ? suspended : b)));
    return suspended;
  },

  async approveBusiness(businessId: string): Promise<Business> {
    const businesses = getStoredBusinesses();
    const target = businesses.find(b => b.id === businessId);
    if (!target) throw new Error('Business not found');

    const approved = {
      ...target,
      kyc_status: 'verified' as const,
    };

    saveBusinesses(businesses.map(b => (b.id === businessId ? approved : b)));
    return approved;
  },

  // Runner Management for Admins
  async suspendRunner(runnerId: string, reason: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === runnerId && user.role === 'runner');
    if (!target) throw new Error('Runner not found');

    return this.suspendUser(runnerId, reason);
  },

  async banRunner(runnerId: string, reason: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === runnerId && user.role === 'runner');
    if (!target) throw new Error('Runner not found');

    return this.banUser(runnerId, reason);
  },

  async approveRunner(runnerId: string): Promise<User> {
    const users = ensureSeededUsers();
    const target = users.find(user => user.id === runnerId && user.role === 'runner');
    if (!target) throw new Error('Runner not found');

    const approved = {
      ...target,
      status: 'approved' as UserStatus,
    };

    saveUsers(users.map(user => (user.id === runnerId ? approved : user)));
    return approved;
  },

  // Delivery Management for Admins
  async getAllDeliveries(): Promise<Delivery[]> {
    return getStoredDeliveries();
  },

  async reassignDelivery(deliveryId: string, runnerId: string): Promise<void> {
    const deliveries = getStoredDeliveries();
    const updated = deliveries.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          runner_id: runnerId,
          status: 'assigned' as DeliveryStatus,
          updated_at: new Date().toISOString(),
        };
      }
      return d;
    });
    saveDeliveries(updated);
  },

  async resolveDeliveryDispute(deliveryId: string, resolution: string): Promise<void> {
    const deliveries = getStoredDeliveries();
    const updated = deliveries.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          status: 'delivered' as DeliveryStatus,
          updated_at: new Date().toISOString(),
        };
      }
      return d;
    });
    saveDeliveries(updated);
  },

  // Analytics for Admins
  async getPlatformAnalytics() {
    const users = ensureSeededUsers();
    const deliveries = getStoredDeliveries();
    const businesses = getStoredBusinesses();

    return {
      total_users: users.length,
      total_runners: users.filter(u => u.role === 'runner').length,
      total_businesses: businesses.length,
      total_orders: deliveries.length,
      completed_orders: deliveries.filter(d => d.status === 'delivered').length,
      pending_orders: deliveries.filter(d => d.status === 'requested').length,
      active_runners: users.filter(u => u.role === 'runner' && u.status === 'approved').length,
      active_businesses: businesses.filter(b => b.kyc_status === 'verified').length,
      total_admins: users.filter(u => u.role === 'admin').length,
      timestamp: new Date().toISOString(),
    };
  },

  // IP Management
  async whitelistAdminIp(adminId: string, ipAddress: string): Promise<void> {
    const users = ensureSeededUsers();
    const admin = users.find(u => u.id === adminId);
    if (!admin) throw new Error('Admin not found');

    const updated = {
      ...admin,
      ip_whitelist: [...(admin.ip_whitelist || []), ipAddress],
    };

    saveUsers(users.map(u => (u.id === adminId ? updated : u)));
  },

  async banIpAddress(ipAddress: string): Promise<void> {
    const bannedIps = JSON.parse(localStorage.getItem('banned_ips') || '[]');
    if (!bannedIps.includes(ipAddress)) {
      bannedIps.push(ipAddress);
      localStorage.setItem('banned_ips', JSON.stringify(bannedIps));
    }
  },

  async getBannedIps(): Promise<string[]> {
    return JSON.parse(localStorage.getItem('banned_ips') || '[]');
  },

  // Storage Management
  async approveStorageRequest(storageId: string): Promise<void> {
    const subscriptions = getStoredSubscriptions();
    const updated = subscriptions.map(sub => {
      if (sub.id === storageId) {
        return {
          ...sub,
          status: 'active' as const,
          approved_at: new Date().toISOString(),
        };
      }
      return sub;
    });
    saveSubscriptions(updated);
  },

  async rejectStorageRequest(storageId: string): Promise<void> {
    const subscriptions = getStoredSubscriptions();
    const updated = subscriptions.map(sub => {
      if (sub.id === storageId) {
        return {
          ...sub,
          status: 'rejected' as const,
        };
      }
      return sub;
    });
    saveSubscriptions(updated);
  },
};
