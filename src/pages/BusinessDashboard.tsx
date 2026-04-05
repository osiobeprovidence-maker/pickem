import React from 'react';
import { format } from 'date-fns';
import { ReceiptText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  completeBusinessRegistration,
  deleteProduct,
  getBusinessStats,
  getBusinessWorkspace,
  getMarketplaceEligibility,
  getOnboardingChecklist,
  setStorefrontStatus,
  toggleProductMarketplaceVisibility,
  updateOrderStatus,
  updateProductStatus,
  upsertProduct,
  type BusinessRegistrationSetupInput,
} from '../lib/businessWorkspace';
import {
  activateBusinessSubscription,
  getBusinessPlanSummary,
  startBusinessTrial,
} from '../lib/businessOnboarding';
import type { Order, Product } from '../types';
import { BusinessDashboardHeader } from '../components/business/BusinessDashboardHeader';
import { SubscriptionStatusCard } from '../components/business/SubscriptionStatusCard';
import { OnboardingChecklist } from '../components/business/OnboardingChecklist';
import { BusinessStatsCards } from '../components/business/BusinessStatsCards';
import { StorefrontOverviewCard } from '../components/business/StorefrontOverviewCard';
import { ProductListTable } from '../components/business/ProductListTable';
import { OrdersTable } from '../components/business/OrdersTable';
import { MarketplaceEligibilityCard } from '../components/business/MarketplaceEligibilityCard';
import { TrialClaimCard } from '../components/business/TrialClaimCard';
import { ProductForm } from '../components/business/ProductForm';
import { BusinessSetupFlow } from '../components/business/BusinessSetupFlow';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/business/StatusBadge';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [workspace, setWorkspace] = React.useState(() => getBusinessWorkspace(user));
  const [planSummary, setPlanSummary] = React.useState(() => getBusinessPlanSummary(user?.email));
  const [isSetupOpen, setIsSetupOpen] = React.useState(false);
  const [isProductOpen, setIsProductOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const subscriptionRef = React.useRef<HTMLDivElement | null>(null);

  const refreshWorkspace = React.useCallback(() => {
    setWorkspace(getBusinessWorkspace(user));
    setPlanSummary(getBusinessPlanSummary(user?.email));
  }, [user]);

  React.useEffect(() => {
    refreshWorkspace();
  }, [refreshWorkspace]);

  const eligibility = getMarketplaceEligibility(workspace);
  const checklist = getOnboardingChecklist(workspace);
  const stats = getBusinessStats(workspace);
  const businessName = workspace?.business.business_name ?? user?.name ?? 'Business';
  const storefrontHref = workspace?.storefront
    ? workspace.storefront.storefront_status === 'published'
      ? `/storefront/${workspace.storefront.slug}`
      : `/storefront/${workspace.storefront.slug}?preview=1`
    : undefined;

  const openSetup = () => setIsSetupOpen(true);
  const openProductForm = (product?: Product | null) => {
    if (!workspace?.business.onboarding_complete || !workspace.storefront) {
      setIsSetupOpen(true);
      return;
    }

    setEditingProduct(product ?? null);
    setIsProductOpen(true);
  };

  const handleSetupSubmit = (input: BusinessRegistrationSetupInput) => {
    if (!user) return;
    completeBusinessRegistration(user, input);
    refreshWorkspace();
  };

  const handleStartTrial = () => {
    if (!user?.email) return;
    startBusinessTrial(user.email);
    refreshWorkspace();
  };

  const handleSubscribe = () => {
    if (!user?.email) return;
    activateBusinessSubscription(user.email);
    refreshWorkspace();
  };

  const handlePublishStorefront = () => {
    if (!user || !workspace?.storefront) return;
    setStorefrontStatus(user, 'published');
    refreshWorkspace();
  };

  const handleUnpublishStorefront = () => {
    if (!user || !workspace?.storefront) return;
    setStorefrontStatus(user, 'hidden');
    refreshWorkspace();
  };

  const handleProductSubmit = (input: Parameters<typeof upsertProduct>[1]) => {
    if (!user) return;
    upsertProduct(user, input, editingProduct?.id);
    setEditingProduct(null);
    refreshWorkspace();
  };

  const handleDeleteProduct = (product: Product) => {
    if (!user) return;
    deleteProduct(user, product.id);
    refreshWorkspace();
  };

  const handlePublishProduct = (product: Product) => {
    if (!user) return;
    updateProductStatus(user, product.id, 'published');
    refreshWorkspace();
  };

  const handleUnpublishProduct = (product: Product) => {
    if (!user) return;
    updateProductStatus(user, product.id, 'hidden');
    refreshWorkspace();
  };

  const handleMarkOutOfStock = (product: Product) => {
    if (!user) return;
    updateProductStatus(user, product.id, 'out_of_stock');
    refreshWorkspace();
  };

  const handleToggleVisibility = (product: Product, visible: boolean) => {
    if (!user) return;
    toggleProductMarketplaceVisibility(user, product.id, visible);
    refreshWorkspace();
  };

  const handleOrderStatusUpdate = (order: Order, status: Order['status']) => {
    if (!user) return;
    updateOrderStatus(user, order.id, status);
    refreshWorkspace();
    if (selectedOrder?.id === order.id) {
      setSelectedOrder((current) => (current ? { ...current, status } : current));
    }
  };

  const handleManageSubscription = () => {
    subscriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6 overflow-x-clip md:space-y-8">
      <BusinessDashboardHeader
        businessName={businessName}
        subtitle="Manage your storefront, products, and campus orders from one place."
        category={workspace?.business.category ?? 'Campus Retail'}
        storefrontStatus={workspace?.storefront?.storefront_status}
        subscriptionStatus={workspace?.business.subscription_status ?? 'inactive'}
        storefrontHref={storefrontHref}
        onAddProduct={() => openProductForm()}
        onEditStorefront={openSetup}
        onManageSubscription={handleManageSubscription}
      />

      {workspace?.business.onboarding_complete && planSummary.status === 'inactive' ? (
        <TrialClaimCard onStartTrial={handleStartTrial} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,380px)]">
        <div ref={subscriptionRef}>
          <SubscriptionStatusCard
            planSummary={planSummary}
            onStartTrial={handleStartTrial}
            onSubscribe={handleSubscribe}
          />
        </div>
        <OnboardingChecklist items={checklist} onOpenSetup={openSetup} />
      </div>

      <BusinessStatsCards stats={stats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,380px)]">
        <StorefrontOverviewCard
          business={workspace?.business ?? {
            id: '',
            business_name: '',
            category: '',
            owner_name: '',
            owner_email: '',
            owner_phone: '',
            email: '',
            phone: '',
            address: '',
            city_state: '',
            description: '',
            onboarding_complete: false,
            subscription_status: 'inactive',
          }}
          storefront={workspace?.storefront ?? null}
          onEdit={openSetup}
          onPublish={handlePublishStorefront}
          onUnpublish={handleUnpublishStorefront}
          previewHref={storefrontHref}
        />
        <MarketplaceEligibilityCard eligibility={eligibility} />
      </div>

      <ProductListTable
        products={workspace?.products ?? []}
        canPublish={eligibility.eligibleForMarketplace}
        onAddProduct={() => openProductForm()}
        onEditProduct={(product) => openProductForm(product)}
        onDeleteProduct={handleDeleteProduct}
        onPublishProduct={handlePublishProduct}
        onUnpublishProduct={handleUnpublishProduct}
        onMarkOutOfStock={handleMarkOutOfStock}
        onToggleVisibility={handleToggleVisibility}
      />

      <OrdersTable
        orders={workspace?.orders ?? []}
        onViewOrder={setSelectedOrder}
        onUpdateStatus={handleOrderStatusUpdate}
      />

      <ProductForm
        open={isProductOpen}
        onClose={() => {
          setIsProductOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleProductSubmit}
        initialProduct={editingProduct}
      />

      <BusinessSetupFlow
        open={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        workspace={workspace}
        onSubmit={handleSetupSubmit}
      />

      <Modal open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} title="Order details" className="max-w-3xl">
        {selectedOrder ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selectedOrder.status} />
              <StatusBadge status={selectedOrder.payment_status} />
              <span className="rounded-full bg-apple-gray-50 px-3 py-1 text-xs font-bold text-apple-gray-400">
                {format(new Date(selectedOrder.created_at), 'MMM d, yyyy · h:mm a')}
              </span>
            </div>

            <Card className="p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Customer</p>
              <h3 className="mt-2 text-2xl font-black text-apple-gray-500">{selectedOrder.customer_name}</h3>
              <p className="mt-2 font-mono text-sm font-bold text-apple-gray-300">#{selectedOrder.id}</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">
                <ReceiptText className="h-4 w-4" />
                Items
              </div>
              <div className="mt-4 space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={`${selectedOrder.id}-${item.product_id}`} className="flex items-center justify-between gap-4 rounded-2xl bg-apple-gray-50 px-4 py-3">
                    <div>
                      <div className="text-sm font-bold text-apple-gray-500">{item.name}</div>
                      <div className="mt-1 text-sm font-medium text-apple-gray-300">Quantity {item.quantity}</div>
                    </div>
                    <div className="text-sm font-bold text-apple-gray-500">₦{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Order total</div>
                <div className="mt-2 text-3xl font-black text-apple-gray-500">₦{selectedOrder.amount.toLocaleString()}</div>
              </Card>
              <Card className="p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Payment status</div>
                <div className="mt-3">
                  <StatusBadge status={selectedOrder.payment_status} />
                </div>
              </Card>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
