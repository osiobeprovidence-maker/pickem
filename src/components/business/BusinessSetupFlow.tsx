import React from 'react';
import type { BusinessWorkspace, BusinessRegistrationSetupInput } from '../../lib/businessWorkspace';
import type { StorefrontOpenStatus } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { StatusBadge } from './StatusBadge';

type BusinessSetupFlowProps = {
  open: boolean;
  onClose: () => void;
  workspace: BusinessWorkspace | null;
  onSubmit: (input: BusinessRegistrationSetupInput) => void;
};

type SetupStep = 0 | 1 | 2 | 3;
type SetupState = BusinessRegistrationSetupInput;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const toFormState = (workspace: BusinessWorkspace | null): SetupState => ({
  businessName: workspace?.business.business_name ?? '',
  category: workspace?.business.category ?? '',
  businessEmail: workspace?.business.email ?? '',
  businessPhone: workspace?.business.phone ?? '',
  address: workspace?.business.address ?? '',
  cityState: workspace?.business.city_state ?? '',
  description: workspace?.business.description ?? '',
  ownerName: workspace?.business.owner_name ?? '',
  ownerEmail: workspace?.business.owner_email ?? workspace?.business.email ?? '',
  ownerPhone: workspace?.business.owner_phone ?? workspace?.business.phone ?? '',
  storefrontName: workspace?.storefront?.storefront_name ?? workspace?.business.business_name ?? '',
  slug: workspace?.storefront?.slug ?? '',
  logo: workspace?.storefront?.logo,
  banner: workspace?.storefront?.banner,
  tagline: workspace?.storefront?.tagline ?? '',
  serviceArea: workspace?.storefront?.service_area ?? workspace?.business.city_state ?? '',
  openingHours: workspace?.storefront?.opening_hours ?? '',
  deliveryEnabled: workspace?.storefront?.delivery_enabled ?? true,
  pickupEnabled: workspace?.storefront?.pickup_enabled ?? true,
  openStatus: workspace?.storefront?.open_status ?? 'open',
});

export function BusinessSetupFlow({ open, onClose, workspace, onSubmit }: BusinessSetupFlowProps) {
  const [step, setStep] = React.useState<SetupStep>(0);
  const [form, setForm] = React.useState<SetupState>(toFormState(workspace));
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      setStep(0);
      setForm(toFormState(workspace));
      setErrors({});
    }
  }, [open, workspace]);

  const setField = <K extends keyof SetupState>(key: K, value: SetupState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const validateStep = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 0) {
      if (!form.businessName.trim()) nextErrors.businessName = 'Business name is required.';
      if (!form.category.trim()) nextErrors.category = 'Business category is required.';
      if (!form.businessEmail.trim() || !/\S+@\S+\.\S+/.test(form.businessEmail)) nextErrors.businessEmail = 'Enter a valid business email.';
      if (!form.businessPhone.trim()) nextErrors.businessPhone = 'Business phone is required.';
      if (!form.address.trim()) nextErrors.address = 'Business address is required.';
      if (!form.cityState.trim()) nextErrors.cityState = 'City/State is required.';
      if (!form.description.trim()) nextErrors.description = 'Business description is required.';
    }

    if (step === 1) {
      if (!form.ownerName.trim()) nextErrors.ownerName = 'Owner name is required.';
      if (!form.ownerEmail.trim() || !/\S+@\S+\.\S+/.test(form.ownerEmail)) nextErrors.ownerEmail = 'Enter a valid owner email.';
      if (!form.ownerPhone.trim()) nextErrors.ownerPhone = 'Owner phone is required.';
    }

    if (step === 2) {
      if (!form.storefrontName.trim()) nextErrors.storefrontName = 'Storefront name is required.';
      if (!form.slug.trim()) nextErrors.slug = 'Store slug is required.';
      if (!form.tagline.trim()) nextErrors.tagline = 'Tagline is required.';
      if (!form.serviceArea.trim()) nextErrors.serviceArea = 'Service area is required.';
      if (!form.openingHours.trim()) nextErrors.openingHours = 'Opening hours are required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, 3) as SetupStep);
  };

  const handleBack = () => setStep((current) => Math.max(current - 1, 0) as SetupStep);

  const handleAssetUpload = async (key: 'logo' | 'banner', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const value = await fileToDataUrl(file);
    setField(key, value);
    event.target.value = '';
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;
    onSubmit(form);
    onClose();
  };

  const steps = ['Business Info', 'Owner Info', 'Storefront Setup', 'Review'];

  return (
    <Modal open={open} onClose={onClose} title="Business onboarding" className="max-w-5xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-4">
          {steps.map((label, index) => (
            <div key={label} className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Step {index + 1}</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-apple-gray-500">{label}</span>
                <StatusBadge
                  status={index < step ? 'active' : index === step ? 'trial' : 'inactive'}
                  label={index < step ? 'Done' : index === step ? 'Current' : 'Next'}
                />
              </div>
            </div>
          ))}
        </div>

        {step === 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Business Name" value={form.businessName} onChange={(event) => setField('businessName', event.target.value)} error={errors.businessName} />
            <Input label="Category" value={form.category} onChange={(event) => setField('category', event.target.value)} error={errors.category} />
            <Input label="Business Email" type="email" value={form.businessEmail} onChange={(event) => setField('businessEmail', event.target.value)} error={errors.businessEmail} />
            <Input label="Business Phone" value={form.businessPhone} onChange={(event) => setField('businessPhone', event.target.value)} error={errors.businessPhone} />
            <Input label="Business Address" value={form.address} onChange={(event) => setField('address', event.target.value)} error={errors.address} />
            <Input label="City / State" value={form.cityState} onChange={(event) => setField('cityState', event.target.value)} error={errors.cityState} />
            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm font-bold text-apple-gray-500">Business Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all placeholder:text-apple-gray-200 focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
              />
              {errors.description ? <p className="text-sm font-medium text-red-500">{errors.description}</p> : null}
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Owner Name" value={form.ownerName} onChange={(event) => setField('ownerName', event.target.value)} error={errors.ownerName} />
            <Input label="Owner Email" type="email" value={form.ownerEmail} onChange={(event) => setField('ownerEmail', event.target.value)} error={errors.ownerEmail} />
            <Input label="Owner Phone" value={form.ownerPhone} onChange={(event) => setField('ownerPhone', event.target.value)} error={errors.ownerPhone} />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Storefront Name" value={form.storefrontName} onChange={(event) => setField('storefrontName', event.target.value)} error={errors.storefrontName} />
            <Input label="Storefront Slug" value={form.slug} onChange={(event) => setField('slug', event.target.value)} error={errors.slug} hint="Used in your public storefront URL." />
            <Input label="Tagline" value={form.tagline} onChange={(event) => setField('tagline', event.target.value)} error={errors.tagline} />
            <Input label="Service Area" value={form.serviceArea} onChange={(event) => setField('serviceArea', event.target.value)} error={errors.serviceArea} />
            <Input label="Opening Hours" value={form.openingHours} onChange={(event) => setField('openingHours', event.target.value)} error={errors.openingHours} />
            <label className="block space-y-2">
              <span className="text-sm font-bold text-apple-gray-500">Open Status</span>
              <select
                value={form.openStatus}
                onChange={(event) => setField('openStatus', event.target.value as StorefrontOpenStatus)}
                className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-apple-gray-500">Logo Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => void handleAssetUpload('logo', event)}
                className="w-full rounded-2xl border border-dashed border-apple-gray-200 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-apple-gray-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-apple-gray-500">Banner Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => void handleAssetUpload('banner', event)}
                className="w-full rounded-2xl border border-dashed border-apple-gray-200 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-apple-gray-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              />
            </label>
            <div className="grid gap-3 md:col-span-2 sm:grid-cols-2">
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
        ) : null}

        {step === 3 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Business info</div>
              <div className="mt-4 space-y-3 text-sm font-medium text-apple-gray-400">
                <div><span className="font-bold text-apple-gray-500">Name:</span> {form.businessName}</div>
                <div><span className="font-bold text-apple-gray-500">Category:</span> {form.category}</div>
                <div><span className="font-bold text-apple-gray-500">Email:</span> {form.businessEmail}</div>
                <div><span className="font-bold text-apple-gray-500">Phone:</span> {form.businessPhone}</div>
                <div><span className="font-bold text-apple-gray-500">Location:</span> {form.address}, {form.cityState}</div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Storefront setup</div>
              <div className="mt-4 space-y-3 text-sm font-medium text-apple-gray-400">
                <div><span className="font-bold text-apple-gray-500">Storefront:</span> {form.storefrontName}</div>
                <div><span className="font-bold text-apple-gray-500">Slug:</span> {form.slug}</div>
                <div><span className="font-bold text-apple-gray-500">Tagline:</span> {form.tagline}</div>
                <div><span className="font-bold text-apple-gray-500">Service area:</span> {form.serviceArea}</div>
                <div><span className="font-bold text-apple-gray-500">Hours:</span> {form.openingHours}</div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-brand-100 bg-brand-50 p-5 lg:col-span-2">
              <h4 className="text-lg font-bold text-apple-gray-500">Ready to launch</h4>
              <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
                After submission, your business setup will be saved and you can claim your 7-day free trial to unlock publishing.
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="ghost" onClick={step === 0 ? onClose : handleBack}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit">Save Business Setup</Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
