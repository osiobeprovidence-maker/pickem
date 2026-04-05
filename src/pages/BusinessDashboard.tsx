import React from 'react';
import { format } from 'date-fns';
import { ReceiptText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  deleteProduct,
  getBusinessStats,
  getMarketplaceEligibility,
  getOnboardingChecklist,
  updateOrderStatus,
  updateProductStatus,
  upsertProduct,
  toggleProductMarketplaceVisibility,
  type BusinessRegistrationSetupInput,
} from '../lib/businessWorkspace';
import { storefrontService, type StorefrontSettingsPayload } from '../lib/storefrontService';
import {
  activateBusinessSubscription,
  getBusinessPlanSummary,
  startBusinessTrial,
} from '../lib/businessOnboarding';
import { useBusinessStorefront } from '../hooks/useBusinessStorefront';
import type { Order, Product } from '../types';
import { BusinessDashboardHeader } from '../components/business/BusinessDashboardHeader';
import { SubscriptionStatusCard } from '../components/business/SubscriptionStatusCard';
import { OnboardingChecklist } from '../components/business/OnboardingChecklist';
import { BusinessStatsCards } from '../components/business/BusinessStatsCards';
import { ProductListTable } from '../components/business/ProductListTable';
import { OrdersTable } from '../components/business/OrdersTable';
import { MarketplaceEligibilityCard } from '../components/business/MarketplaceEligibilityCard';
import { TrialClaimCard } from '../components/business/TrialClaimCard';
import { ProductForm } from '../components/business/ProductForm';
import { StorefrontSettingsForm } from '../components/business/StorefrontSettingsForm';
import { StorefrontPreviewCard } from '../components/business/StorefrontPreviewCard';
import { StorefrontShareCard } from '../components/business/StorefrontShareCard';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/business/StatusBadge';

const toRegistrationInput = (
  payload: StorefrontSettingsPayload,
  fallbackEmail: string,
  fallbackOwnerName: string,
): BusinessRegistrationSetupInput => ({
  businessName: payload.business.business_name ?? '',
  category: payload.business.category ?? payload.storefront.category ?? '',
  businessEmail: payload.business.email ?? payload.storefront.contact_email ?? fallbackEmail,
  businessPhone: payload.business.phone ?? payload.storefront.contact_phone ?? '',
  address: payload.business.address ?? payload.storefront.address ?? '',
  cityState: payload.business.city_state ?? payload.storefront.campus_location ?? payload.storefront.service_area ?? '',
  description: payload.business.description ?? payload.storefront.description ?? '',
  ownerName: payload.business.owner_name ?? fallbackOwnerName,
  ownerEmail: payload.business.owner_email ?? payload.business.email ?? payload.storefront.contact_email ?? fallbackEmail,
  ownerPhone: payload.business.owner_phone ?? payload.business.phone ?? payload.storefront.contact_phone ?? '',
  storefrontName: payload.storefront.storefront_name ?? payload.business.business_name ?? '',
  slug: payload.storefront.slug ?? payload.storefront.storefront_name ?? payload.business.business_name ?? '',
  logoUrl: payload.storefront.logo_url,
  bannerUrl: payload.storefront.banner_url,
  tagline: payload.storefront.tagline ?? '',
  serviceArea: payload.storefront.service_area ?? payload.business.city_state ?? '',
  openingHours: payload.storefront.opening_hours ?? '',
  deliveryEnabled: payload.storefront.delivery_enabled ?? true,
  pickupEnabled: payload.storefront.pickup_enabled ?? true,
  openStatus: payload.storefront.open_status ?? 'open',
  socialLinks: payload.storefront.social_links,
});

export default function BusinessDashboard() {
  const { user } = useAuth();
  const {
    workspace,
    loading,
    saving,
    saveMessage,
    saveError,
    logoUpload,
    bannerUpload,
    load,
    saveSettings,
    uploadMedia,
    updateStatus,
    validateSlug,
    copyPublicUrl,
    sharePublicUrl,
    showFeedback,
    publicUrl,
    publicPath,
    previewPath,
  } = useBusinessStorefront(user);

  const [planSummary, setPlanSummary] = React.useState(() => getBusinessPlanSummary(user?.email));
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isProductOpen, setIsProductOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const subscriptionRef = React.useRef<HTMLDivElement | null>(null);

  const refreshPlan = React.useCallback(() => {
    setPlanSummary(getBusinessPlanSummary(user?.email));
  }, [user?.email]);

  React.useEffect(() => {
    refreshPlan();
  }, [refreshPlan, workspace?.business.subscription_status]);

  const refreshAll = React.useCallback(async () => {
    await load();
    refreshPlan();
  }, [load, refreshPlan]);

  const eligibility = getMarketplaceEligibility(workspace);
  const checklist = getOnboardingChecklist(workspace);
  const stats = getBusinessStats(workspace);
  const businessName = workspace?.business.business_name ?? user?.name ?? 'Business';
  const storefrontStatus = workspace?.storefront?.storefront_status ?? 'draft';

  const handleSaveStorefront = async (payload: StorefrontSettingsPayload) => {
    if (!user) return null;

    if (!workspace?.business.onboarding_complete) {
      await storefrontService.createOrUpdateRegistration(
        user,
        toRegistrationInput(payload, user.email, user.name),
      );
      await refreshAll();
      showFeedback('Storefront setup saved successfully.');
      return null;
    }

    await saveSettings(payload);
    refreshPlan();
    return null;
  };

  const openProductForm = (product?: Product | null) => {
    if (!workspace?.business.onboarding_complete || !workspace.storefront) {
      setIsSettingsOpen(true);
      return;
    }

    setEditingProduct(product ?? null);
    setIsProductOpen(true);
  };

  const handleStartTrial = async () => {
    if (!user?.email) return;
    startBusinessTrial(user.email);
    await refreshAll();
  };

  const handleSubscribe = async () => {
    if (!user?.email) return;
    activateBusinessSubscription(user.email);
    await refreshAll();
  };

  const handleProductSubmit = async (input: Parameters<typeof upsertProduct>[1]) => {
    if (!user) return;
    upsertProduct(user, input, editingProduct?.id);
    setEditingProduct(null);
    await refreshAll();
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!user) return;
    deleteProduct(user, product.id);
    await refreshAll();
  };

  const handlePublishProduct = async (product: Product) => {
    if (!user) return;
    updateProductStatus(user, product.id, 'published');
    await refreshAll();
  };

  const handleUnpublishProduct = async (product: Product) => {
    if (!user) return;
    updateProductStatus(user, product.id, 'hidden');
    await refreshAll();
  };

  const handleMarkOutOfStock = async (product: Product) => {
    if (!user) return;
    updateProductStatus(user, product.id, 'out_of_stock');
    await refreshAll();
  };

  const handleToggleVisibility = async (product: Product, visible: boolean) => {
    if (!user) return;
    toggleProductMarketplaceVisibility(user, product.id, visible);
    await refreshAll();
  };

  const handleOrderStatusUpdate = async (order: Order, status: Order['status']) => {
    if (!user) return;
    updateOrderStatus(user, order.id, status);
    await refreshAll();
    if (selectedOrder?.id === order.id) {
      setSelectedOrder((current) => (current ? { ...current, status } : current));
    }
  };

  const handleManageSubscription = () => {
    subscriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading && !workspace) {
    return (
      <Card className="p-8">
        <h1 className="text-2xl font-black text-apple-gray-500">Loading storefront workspace...</h1>
        <p className="mt-2 text-sm font-medium text-apple-gray-300">
          We&apos;re loading your storefront settings, products, and sharing data.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 overflow-x-clip md:space-y-8">
      <BusinessDashboardHeader
        businessName={businessName}
        subtitle="Manage your storefront, products, and campus orders from one place."
        category={workspace?.business.category ?? 'Campus Retail'}
        storefrontStatus={storefrontStatus}
        subscriptionStatus={workspace?.business.subscription_status ?? 'inactive'}
        storefrontHref={previewPath ?? undefined}
        onAddProduct={() => openProductForm()}
        onEditStorefront={() => setIsSettingsOpen(true)}
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
        <OnboardingChecklist items={checklist} onOpenSetup={() => setIsSettingsOpen(true)} />
      </div>

      <BusinessStatsCards stats={stats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <StorefrontPreviewCard
          business={
            workspace?.business ?? {
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
            }
          }
          storefront={workspace?.storefront ?? null}
          productCount={workspace?.products.length ?? 0}
          previewPath={previewPath}
        />
        <StorefrontShareCard
          publicUrl={publicUrl}
          publicPath={publicPath}
          previewPath={previewPath}
          status={storefrontStatus}
          onCopyLink={copyPublicUrl}
          onShareLink={sharePublicUrl}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,380px)]">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Storefront controls</p>
              <h3 className="mt-2 text-2xl font-black text-apple-gray-500">Publishing and visibility</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
                Draft storefronts stay private, published storefronts are public, and hidden storefronts stay off the marketplace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setIsSettingsOpen(true)}>
                Edit Settings
              </Button>
              <Button onClick={() => void updateStatus('published')} disabled={saving}>
                Publish
              </Button>
              <Button variant="ghost" onClick={() => void updateStatus('hidden')} disabled={saving}>
                Hide
              </Button>
              <Button variant="ghost" onClick={() => void updateStatus('draft')} disabled={saving}>
                Save as Draft
              </Button>
            </div>
          </div>
          {saveMessage ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {saveMessage}
            </div>
          ) : null}
          {saveError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {saveError}
            </div>
          ) : null}
        </Card>
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

      <StorefrontSettingsForm
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        workspace={workspace}
        saving={saving}
        saveMessage={saveMessage}
        saveError={saveError}
        logoUpload={logoUpload}
        bannerUpload={bannerUpload}
        publicPath={publicPath}
        onSave={handleSaveStorefront}
        onUploadLogo={(file) => void uploadMedia('logo', file)}
        onUploadBanner={(file) => void uploadMedia('banner', file)}
        onValidateSlug={validateSlug}
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
