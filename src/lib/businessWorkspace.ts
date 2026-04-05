import type {
  Business,
  BusinessSubscriptionStatus,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Product,
  ProductStatus,
  Storefront,
  StorefrontOpenStatus,
  StorefrontStatus,
  User,
} from '../types';
import {
  BUSINESS_MONTHLY_PRICE,
  getBusinessPlanSummary,
  getBusinessRecordByEmail,
  registerBusiness,
} from './businessOnboarding';

export type BusinessWorkspace = {
  business: Business;
  storefront: Storefront | null;
  products: Product[];
  orders: Order[];
  updated_at: string;
};

export type BusinessStats = {
  totalProducts: number;
  activeListings: number;
  totalOrders: number;
  completedOrders: number;
  revenue: number;
  storefrontStatus: string;
};

export type OnboardingChecklistItem = {
  id: string;
  label: string;
  description: string;
  complete: boolean;
};

export type MarketplaceEligibility = {
  storefrontPublished: boolean;
  subscriptionActive: boolean;
  eligibleForMarketplace: boolean;
  registrationComplete: boolean;
};

export type BusinessRegistrationSetupInput = {
  businessName: string;
  category: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
  cityState: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  storefrontName: string;
  slug: string;
  logo?: string;
  banner?: string;
  tagline: string;
  serviceArea: string;
  openingHours: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  openStatus: StorefrontOpenStatus;
};

export type StorefrontInput = Omit<Storefront, 'id' | 'business_id'>;
export type ProductInput = Omit<Product, 'id' | 'business_id' | 'storefront_id' | 'created_at' | 'updated_at'>;

const STORAGE_KEY = 'pickem_business_workspaces';

const toIso = () => new Date().toISOString();

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `pickem-store-${Date.now().toString().slice(-4)}`;

const readWorkspaces = (): BusinessWorkspace[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BusinessWorkspace[];
  } catch (error) {
    console.error('Failed to read business workspaces:', error);
    return [];
  }
};

const writeWorkspaces = (workspaces: BusinessWorkspace[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
};

const withPlanState = (workspace: BusinessWorkspace): BusinessWorkspace => {
  const plan = getBusinessPlanSummary(workspace.business.email);

  return {
    ...workspace,
    business: {
      ...workspace.business,
      subscription_status: (plan.status === 'none' ? 'inactive' : plan.status) as BusinessSubscriptionStatus,
      trial_start_date: plan.record?.trialStartDate,
      trial_end_date: plan.record?.trialEndDate,
    },
  };
};

const getSeedOrders = (businessId: string, products: Product[]): Order[] => {
  const publishable = products.filter((product) => product.status === 'published' && product.visible_in_marketplace);
  if (!publishable.length) return [];

  const sampleItems = publishable.slice(0, 2);
  return [
    {
      id: `ord_${crypto.randomUUID().slice(0, 8)}`,
      business_id: businessId,
      customer_name: 'Ada Nnaji',
      items: sampleItems.map<OrderItem>((product, index) => ({
        product_id: product.id,
        name: product.name,
        quantity: index === 0 ? 2 : 1,
        price: product.discount_price ?? product.price,
      })),
      amount: sampleItems.reduce(
        (total, product, index) => total + (product.discount_price ?? product.price) * (index === 0 ? 2 : 1),
        0,
      ),
      payment_status: 'paid',
      status: 'pending',
      created_at: toIso(),
    },
    {
      id: `ord_${crypto.randomUUID().slice(0, 8)}`,
      business_id: businessId,
      customer_name: 'Ifeoma Yusuf',
      items: [
        {
          product_id: sampleItems[0].id,
          name: sampleItems[0].name,
          quantity: 1,
          price: sampleItems[0].discount_price ?? sampleItems[0].price,
        },
      ],
      amount: sampleItems[0].discount_price ?? sampleItems[0].price,
      payment_status: 'paid',
      status: 'accepted',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];
};

const ensureSampleOrders = (workspace: BusinessWorkspace): BusinessWorkspace => {
  if (workspace.orders.length > 0) return workspace;
  const seedOrders = getSeedOrders(workspace.business.id, workspace.products);
  return seedOrders.length ? { ...workspace, orders: seedOrders } : workspace;
};

const seedBusinessFromUser = (user?: User | null) => {
  const email = user?.email ?? '';
  const registration = email ? getBusinessRecordByEmail(email) : null;
  const plan = getBusinessPlanSummary(email);

  return {
    business: {
      id: registration?.id ?? crypto.randomUUID(),
      business_name: registration?.businessName ?? user?.name ?? "Pick'em Business",
      category: registration?.businessCategory ?? 'Campus Retail',
      owner_name: registration?.ownerFullName ?? user?.name ?? '',
      owner_email: email,
      owner_phone: registration?.phoneNumber ?? '',
      email,
      phone: registration?.phoneNumber ?? '',
      address: registration?.businessAddress ?? '',
      city_state: registration?.cityState ?? '',
      description: registration?.description ?? "Campus business powered by Pick'em.",
      onboarding_complete: false,
      subscription_status: (plan.status === 'none' ? 'inactive' : plan.status) as BusinessSubscriptionStatus,
      trial_start_date: plan.record?.trialStartDate,
      trial_end_date: plan.record?.trialEndDate,
    } satisfies Business,
    storefront: null,
    products: [],
    orders: [],
    updated_at: toIso(),
  } satisfies BusinessWorkspace;
};

const saveWorkspace = (workspace: BusinessWorkspace) => {
  const next = withPlanState(ensureSampleOrders(workspace));
  const current = readWorkspaces();
  const existingIndex = current.findIndex(
    (entry) => entry.business.email.toLowerCase() === next.business.email.toLowerCase(),
  );
  const updated = {
    ...next,
    updated_at: toIso(),
  };

  if (existingIndex === -1) {
    writeWorkspaces([updated, ...current]);
  } else {
    current[existingIndex] = updated;
    writeWorkspaces(current);
  }

  return updated;
};

export const getBusinessWorkspace = (user?: User | null) => {
  if (!user?.email) return null;
  const existing = readWorkspaces().find((entry) => entry.business.email.toLowerCase() === user.email.toLowerCase());

  if (existing) {
    return saveWorkspace(existing);
  }

  return saveWorkspace(seedBusinessFromUser(user));
};

export const completeBusinessRegistration = (user: User, input: BusinessRegistrationSetupInput) => {
  registerBusiness({
    businessName: input.businessName,
    businessCategory: input.category,
    ownerFullName: input.ownerName,
    email: input.businessEmail,
    phoneNumber: input.businessPhone,
    businessAddress: input.address,
    cityState: input.cityState,
    description: input.description,
  });

  const current = getBusinessWorkspace(user) ?? seedBusinessFromUser(user);

  return saveWorkspace({
    ...current,
    business: {
      ...current.business,
      business_name: input.businessName,
      category: input.category,
      owner_name: input.ownerName,
      owner_email: input.ownerEmail,
      owner_phone: input.ownerPhone,
      email: input.businessEmail,
      phone: input.businessPhone,
      address: input.address,
      city_state: input.cityState,
      description: input.description,
      onboarding_complete: true,
    },
    storefront: {
      id: current.storefront?.id ?? crypto.randomUUID(),
      business_id: current.business.id,
      storefront_name: input.storefrontName,
      slug: slugify(input.slug || input.storefrontName),
      logo: input.logo,
      banner: input.banner,
      tagline: input.tagline,
      service_area: input.serviceArea,
      opening_hours: input.openingHours,
      delivery_enabled: input.deliveryEnabled,
      pickup_enabled: input.pickupEnabled,
      storefront_status: current.storefront?.storefront_status ?? 'draft',
      open_status: input.openStatus,
    },
  });
};

export const updateStorefront = (user: User, input: Partial<StorefrontInput>) => {
  const current = getBusinessWorkspace(user);
  if (!current) return null;

  return saveWorkspace({
    ...current,
    storefront: {
      id: current.storefront?.id ?? crypto.randomUUID(),
      business_id: current.business.id,
      storefront_name: input.storefront_name ?? current.storefront?.storefront_name ?? current.business.business_name,
      slug: slugify(input.slug ?? current.storefront?.slug ?? current.business.business_name),
      logo: input.logo ?? current.storefront?.logo,
      banner: input.banner ?? current.storefront?.banner,
      tagline: input.tagline ?? current.storefront?.tagline ?? '',
      service_area: input.service_area ?? current.storefront?.service_area ?? '',
      opening_hours: input.opening_hours ?? current.storefront?.opening_hours ?? '',
      delivery_enabled: input.delivery_enabled ?? current.storefront?.delivery_enabled ?? true,
      pickup_enabled: input.pickup_enabled ?? current.storefront?.pickup_enabled ?? true,
      storefront_status: input.storefront_status ?? current.storefront?.storefront_status ?? 'draft',
      open_status: input.open_status ?? current.storefront?.open_status ?? 'open',
    },
  });
};

export const setStorefrontStatus = (user: User, status: StorefrontStatus) =>
  updateStorefront(user, { storefront_status: status });

export const getMarketplaceEligibility = (workspace: BusinessWorkspace | null): MarketplaceEligibility => {
  if (!workspace) {
    return {
      storefrontPublished: false,
      subscriptionActive: false,
      eligibleForMarketplace: false,
      registrationComplete: false,
    };
  }

  const storefrontPublished = workspace.storefront?.storefront_status === 'published';
  const subscriptionActive =
    workspace.business.subscription_status === 'trial' || workspace.business.subscription_status === 'active';
  const registrationComplete = workspace.business.onboarding_complete;

  return {
    storefrontPublished,
    subscriptionActive,
    registrationComplete,
    eligibleForMarketplace: storefrontPublished && subscriptionActive && registrationComplete,
  };
};

const canPublishProducts = (workspace: BusinessWorkspace | null) =>
  getMarketplaceEligibility(workspace).eligibleForMarketplace;

const normalizeProductStatus = (status: ProductStatus, stock: number): ProductStatus => {
  if (stock <= 0) return 'out_of_stock';
  return status;
};

export const upsertProduct = (user: User, input: ProductInput, productId?: string) => {
  const current = getBusinessWorkspace(user);
  if (!current || !current.storefront) return null;

  const canPublish = canPublishProducts(current);
  const desiredStatus = normalizeProductStatus(input.status, input.stock);
  const status = desiredStatus === 'published' && !canPublish ? 'draft' : desiredStatus;

  const existingProduct = productId ? current.products.find((product) => product.id === productId) : undefined;

  const nextProduct: Product = {
    id: productId ?? crypto.randomUUID(),
    business_id: current.business.id,
    storefront_id: current.storefront.id,
    name: input.name,
    category: input.category,
    description: input.description,
    price: input.price,
    discount_price: input.discount_price,
    images: input.images,
    stock: input.stock,
    status,
    featured: input.featured,
    delivery_available: input.delivery_available,
    pickup_available: input.pickup_available,
    visible_in_marketplace: canPublish && input.visible_in_marketplace && status === 'published',
    estimated_preparation_time: input.estimated_preparation_time,
    tags: input.tags,
    created_at: existingProduct?.created_at ?? toIso(),
    updated_at: toIso(),
  };

  const products = current.products.some((product) => product.id === nextProduct.id)
    ? current.products.map((product) => (product.id === nextProduct.id ? nextProduct : product))
    : [nextProduct, ...current.products];

  return saveWorkspace({
    ...current,
    products,
  });
};

export const deleteProduct = (user: User, productId: string) => {
  const current = getBusinessWorkspace(user);
  if (!current) return null;

  return saveWorkspace({
    ...current,
    products: current.products.filter((product) => product.id !== productId),
  });
};

export const updateProductStatus = (user: User, productId: string, status: ProductStatus) => {
  const current = getBusinessWorkspace(user);
  if (!current) return null;

  const canPublish = canPublishProducts(current);
  return saveWorkspace({
    ...current,
    products: current.products.map((product) =>
      product.id === productId
        ? {
            ...product,
            status: status === 'published' && !canPublish ? 'draft' : normalizeProductStatus(status, product.stock),
            visible_in_marketplace:
              product.visible_in_marketplace &&
              canPublish &&
              status === 'published' &&
              product.stock > 0,
            updated_at: toIso(),
          }
        : product,
    ),
  });
};

export const toggleProductMarketplaceVisibility = (user: User, productId: string, visible: boolean) => {
  const current = getBusinessWorkspace(user);
  if (!current) return null;
  const canPublish = canPublishProducts(current);

  return saveWorkspace({
    ...current,
    products: current.products.map((product) =>
      product.id === productId
        ? {
            ...product,
            visible_in_marketplace: visible && canPublish && product.status === 'published',
            updated_at: toIso(),
          }
        : product,
    ),
  });
};

export const updateOrderStatus = (user: User, orderId: string, status: OrderStatus) => {
  const current = getBusinessWorkspace(user);
  if (!current) return null;

  const paymentStatus: PaymentStatus =
    status === 'cancelled'
      ? 'refunded'
      : status === 'completed' || status === 'accepted' || status === 'preparing' || status === 'in_transit'
        ? 'paid'
        : 'pending';

  return saveWorkspace({
    ...current,
    orders: current.orders.map((order) =>
      order.id === orderId ? { ...order, status, payment_status: paymentStatus } : order,
    ),
  });
};

export const getBusinessStats = (workspace: BusinessWorkspace | null): BusinessStats => {
  if (!workspace) {
    return {
      totalProducts: 0,
      activeListings: 0,
      totalOrders: 0,
      completedOrders: 0,
      revenue: 0,
      storefrontStatus: 'Not started',
    };
  }

  return {
    totalProducts: workspace.products.length,
    activeListings: workspace.products.filter((product) => product.status === 'published').length,
    totalOrders: workspace.orders.length,
    completedOrders: workspace.orders.filter((order) => order.status === 'completed').length,
    revenue: workspace.orders.filter((order) => order.status === 'completed').reduce((sum, order) => sum + order.amount, 0),
    storefrontStatus: workspace.storefront ? workspace.storefront.storefront_status.replace('_', ' ') : 'Not created',
  };
};

export const getOnboardingChecklist = (workspace: BusinessWorkspace | null): OnboardingChecklistItem[] => {
  const registrationComplete = Boolean(workspace?.business.onboarding_complete);
  const storefrontCreated = Boolean(workspace?.storefront);
  const trialStarted =
    workspace?.business.subscription_status === 'trial' ||
    workspace?.business.subscription_status === 'active' ||
    workspace?.business.subscription_status === 'expired';
  const firstProductAdded = Boolean(workspace?.products.length);
  const storefrontPublished = workspace?.storefront?.storefront_status === 'published';
  const firstListingPublished = Boolean(
    workspace?.products.some((product) => product.status === 'published' && product.visible_in_marketplace),
  );

  return [
    {
      id: 'registration',
      label: 'Complete business registration',
      description: 'Add business, owner, and storefront basics.',
      complete: registrationComplete,
    },
    {
      id: 'storefront',
      label: 'Create storefront',
      description: 'Set your name, slug, service area, and visual identity.',
      complete: storefrontCreated,
    },
    {
      id: 'trial',
      label: 'Start free trial',
      description: `Claim your 7-day trial before billing starts at ₦${BUSINESS_MONTHLY_PRICE.toLocaleString()}/month.`,
      complete: trialStarted,
    },
    {
      id: 'product',
      label: 'Add first product',
      description: 'Create the first listing for your campus customers.',
      complete: firstProductAdded,
    },
    {
      id: 'storefront-published',
      label: 'Publish storefront',
      description: "Make your shop visible on Pick'em.",
      complete: storefrontPublished,
    },
    {
      id: 'listing-published',
      label: 'Publish first listing',
      description: 'Go live with at least one marketplace-eligible product.',
      complete: firstListingPublished,
    },
  ];
};

export const getPublicStorefrontBySlug = (slug: string) => {
  const workspace = readWorkspaces()
    .map(withPlanState)
    .find((entry) => entry.storefront?.slug === slug);

  if (!workspace || !workspace.storefront) return null;

  const eligible = getMarketplaceEligibility(workspace);

  return {
    business: workspace.business,
    storefront: workspace.storefront,
    products: workspace.products.filter(
      (product) =>
        workspace.storefront?.storefront_status === 'published' &&
        eligible.eligibleForMarketplace &&
        product.status === 'published' &&
        product.visible_in_marketplace,
    ),
  };
};
