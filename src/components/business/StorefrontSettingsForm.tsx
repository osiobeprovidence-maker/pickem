import React from 'react';
import type { BusinessWorkspace } from '../../lib/businessWorkspace';
import type { StorefrontSettingsPayload } from '../../lib/storefrontService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { StoreLogoUploader } from './StoreLogoUploader';
import { StoreBannerUploader } from './StoreBannerUploader';
import { SlugInputField } from './SlugInputField';
import { StorefrontStatusBadge } from './StorefrontStatusBadge';

type UploadState = {
  status: 'idle' | 'loading' | 'saving' | 'success' | 'error';
  progress: number;
  message?: string;
};

type SlugValidation = {
  normalized: string;
  available: boolean;
  valid: boolean;
  error?: string;
} | null;

type StorefrontSettingsFormProps = {
  open: boolean;
  onClose: () => void;
  workspace: BusinessWorkspace | null;
  saving: boolean;
  saveMessage: string | null;
  saveError: string | null;
  logoUpload: UploadState;
  bannerUpload: UploadState;
  publicPath?: string | null;
  onSave: (payload: StorefrontSettingsPayload) => Promise<unknown>;
  onUploadLogo: (file: File) => void;
  onUploadBanner: (file: File) => void;
  onValidateSlug: (slug: string) => Promise<SlugValidation>;
};

type FormState = {
  businessName: string;
  category: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  campusLocation: string;
  storefrontName: string;
  slug: string;
  tagline: string;
  serviceArea: string;
  openingHours: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  openStatus: 'open' | 'closed';
  website: string;
  instagram: string;
  whatsapp: string;
};

const getFormState = (workspace: BusinessWorkspace | null): FormState => ({
  businessName: workspace?.business.business_name ?? '',
  category: workspace?.storefront?.category ?? workspace?.business.category ?? '',
  description: workspace?.storefront?.description ?? workspace?.business.description ?? '',
  contactEmail: workspace?.storefront?.contact_email ?? workspace?.business.email ?? '',
  contactPhone: workspace?.storefront?.contact_phone ?? workspace?.business.phone ?? '',
  address: workspace?.storefront?.address ?? workspace?.business.address ?? '',
  campusLocation: workspace?.storefront?.campus_location ?? workspace?.business.city_state ?? '',
  storefrontName: workspace?.storefront?.storefront_name ?? workspace?.business.business_name ?? '',
  slug: workspace?.storefront?.slug ?? '',
  tagline: workspace?.storefront?.tagline ?? '',
  serviceArea: workspace?.storefront?.service_area ?? workspace?.business.city_state ?? '',
  openingHours: workspace?.storefront?.opening_hours ?? '',
  deliveryEnabled: workspace?.storefront?.delivery_enabled ?? true,
  pickupEnabled: workspace?.storefront?.pickup_enabled ?? true,
  openStatus: workspace?.storefront?.open_status ?? 'open',
  website: workspace?.storefront?.social_links?.website ?? '',
  instagram: workspace?.storefront?.social_links?.instagram ?? '',
  whatsapp: workspace?.storefront?.social_links?.whatsapp ?? '',
});

const normalizeSlugValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

export function StorefrontSettingsForm({
  open,
  onClose,
  workspace,
  saving,
  saveMessage,
  saveError,
  logoUpload,
  bannerUpload,
  publicPath,
  onSave,
  onUploadLogo,
  onUploadBanner,
  onValidateSlug,
}: StorefrontSettingsFormProps) {
  const [form, setForm] = React.useState<FormState>(getFormState(workspace));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [slugValidation, setSlugValidation] = React.useState<SlugValidation>(null);
  const wasOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (open && !wasOpenRef.current) {
      setForm(getFormState(workspace));
      setErrors({});
      setSlugValidation(
        workspace?.storefront?.slug
          ? {
              normalized: workspace.storefront.slug,
              available: true,
              valid: true,
            }
          : null,
      );
    }

    wasOpenRef.current = open;
  }, [open, workspace]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const validateLocal = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.businessName.trim()) nextErrors.businessName = 'Business name is required.';
    if (!form.storefrontName.trim()) nextErrors.storefrontName = 'Storefront name is required.';
    if (!form.category.trim()) nextErrors.category = 'Category is required.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    if (!form.contactEmail.trim() || !/\S+@\S+\.\S+/.test(form.contactEmail)) nextErrors.contactEmail = 'Enter a valid email.';
    if (!form.contactPhone.trim()) nextErrors.contactPhone = 'Phone number is required.';
    if (!form.address.trim()) nextErrors.address = 'Address is required.';
    if (!form.slug.trim()) nextErrors.slug = 'Slug is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSlugBlur = async () => {
    const validation = await onValidateSlug(form.slug || form.storefrontName);
    setSlugValidation(validation);
    if (validation?.normalized && validation.normalized !== form.slug) {
      setField('slug', validation.normalized);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateLocal()) return;

    const validation = await onValidateSlug(form.slug || form.storefrontName);
    setSlugValidation(validation);
    if (!validation?.valid || !validation.available) {
      setErrors((current) => ({ ...current, slug: validation?.error ?? 'Slug is invalid.' }));
      return;
    }

    await onSave({
      business: {
        business_name: form.businessName.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        email: form.contactEmail.trim(),
        phone: form.contactPhone.trim(),
        address: form.address.trim(),
        city_state: form.campusLocation.trim(),
        onboarding_complete: true,
      },
      storefront: {
        storefront_name: form.storefrontName.trim(),
        slug: validation.normalized,
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        contact_email: form.contactEmail.trim(),
        contact_phone: form.contactPhone.trim(),
        address: form.address.trim(),
        campus_location: form.campusLocation.trim(),
        service_area: form.serviceArea.trim(),
        opening_hours: form.openingHours.trim(),
        delivery_enabled: form.deliveryEnabled,
        pickup_enabled: form.pickupEnabled,
        open_status: form.openStatus,
        social_links: {
          website: form.website.trim() || undefined,
          instagram: form.instagram.trim() || undefined,
          whatsapp: form.whatsapp.trim() || undefined,
        },
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Storefront settings" className="max-w-6xl">
      <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium leading-relaxed text-apple-gray-300">
              Edit your store details, media, public link, and customer-facing contact information.
            </p>
          </div>
          {workspace?.storefront ? <StorefrontStatusBadge status={workspace.storefront.storefront_status} /> : null}
        </div>

        {saveMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {saveMessage}
          </div>
        ) : null}
        {saveError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {saveError}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Business Name" value={form.businessName} onChange={(event) => setField('businessName', event.target.value)} error={errors.businessName} />
              <Input label="Category" value={form.category} onChange={(event) => setField('category', event.target.value)} error={errors.category} />
              <Input label="Storefront Name" value={form.storefrontName} onChange={(event) => {
                setField('storefrontName', event.target.value);
                if (!form.slug) setField('slug', normalizeSlugValue(event.target.value));
              }} error={errors.storefrontName} />
              <SlugInputField
                value={form.slug}
                onChange={(value) => setField('slug', normalizeSlugValue(value))}
                onBlur={() => void handleSlugBlur()}
                validation={slugValidation}
                publicPath={publicPath}
                error={errors.slug}
              />
              <Input label="Tagline" value={form.tagline} onChange={(event) => setField('tagline', event.target.value)} />
              <Input label="Opening Hours" value={form.openingHours} onChange={(event) => setField('openingHours', event.target.value)} />
              <Input label="Contact Email" type="email" value={form.contactEmail} onChange={(event) => setField('contactEmail', event.target.value)} error={errors.contactEmail} />
              <Input label="Contact Phone" value={form.contactPhone} onChange={(event) => setField('contactPhone', event.target.value)} error={errors.contactPhone} />
              <Input label="Address" value={form.address} onChange={(event) => setField('address', event.target.value)} error={errors.address} />
              <Input label="Campus Location" value={form.campusLocation} onChange={(event) => setField('campusLocation', event.target.value)} />
              <Input label="Service Area" value={form.serviceArea} onChange={(event) => setField('serviceArea', event.target.value)} />
              <label className="block space-y-2">
                <span className="text-sm font-bold text-apple-gray-500">Open Status</span>
                <select
                  value={form.openStatus}
                  onChange={(event) => setField('openStatus', event.target.value as 'open' | 'closed')}
                  className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <Input label="Website (optional)" value={form.website} onChange={(event) => setField('website', event.target.value)} />
              <Input label="Instagram (optional)" value={form.instagram} onChange={(event) => setField('instagram', event.target.value)} />
              <Input label="WhatsApp (optional)" value={form.whatsapp} onChange={(event) => setField('whatsapp', event.target.value)} />
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-apple-gray-500">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all placeholder:text-apple-gray-200 focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
              />
              {errors.description ? <p className="text-sm font-medium text-red-500">{errors.description}</p> : null}
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3">
                <span className="text-sm font-bold text-apple-gray-500">Delivery Enabled</span>
                <input
                  type="checkbox"
                  checked={form.deliveryEnabled}
                  onChange={(event) => setField('deliveryEnabled', event.target.checked)}
                  className="h-4 w-4 rounded border-apple-gray-200 text-brand-600 focus:ring-brand-500"
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3">
                <span className="text-sm font-bold text-apple-gray-500">Pickup Enabled</span>
                <input
                  type="checkbox"
                  checked={form.pickupEnabled}
                  onChange={(event) => setField('pickupEnabled', event.target.checked)}
                  className="h-4 w-4 rounded border-apple-gray-200 text-brand-600 focus:ring-brand-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <StoreLogoUploader
              currentUrl={workspace?.storefront?.logo_url}
              storefrontName={form.storefrontName || form.businessName}
              uploadState={logoUpload}
              onFileSelect={onUploadLogo}
            />
            <StoreBannerUploader
              currentUrl={workspace?.storefront?.banner_url}
              uploadState={bannerUpload}
              onFileSelect={onUploadBanner}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Storefront'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
