import { ExternalLink, MapPin } from 'lucide-react';
import type { Business, Storefront } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StorefrontStatusBadge } from './StorefrontStatusBadge';
import { StatusBadge } from './StatusBadge';

type StorefrontPreviewCardProps = {
  business: Business;
  storefront: Storefront | null;
  productCount: number;
  previewPath?: string | null;
};

export function StorefrontPreviewCard({
  business,
  storefront,
  productCount,
  previewPath,
}: StorefrontPreviewCardProps) {
  if (!storefront) {
    return (
      <Card className="p-6 sm:p-8">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Storefront preview</p>
        <h3 className="mt-3 text-2xl font-black text-apple-gray-500">No storefront configured yet</h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
          Your live storefront preview will appear here as soon as you save your store details.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-[linear-gradient(135deg,#1d1d1f_0%,#2b2b31_40%,#0f5132_100%)]">
        {storefront.banner_url ? <img src={storefront.banner_url} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-apple-gray-50 text-xl font-black text-apple-gray-500 shadow-sm">
            {storefront.logo_url ? (
              <img src={storefront.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              storefront.storefront_name.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <StorefrontStatusBadge status={storefront.storefront_status} />
              <StatusBadge status={storefront.open_status} />
            </div>
            <h3 className="mt-3 break-words text-2xl font-black text-apple-gray-500">{storefront.storefront_name}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
              {storefront.tagline || storefront.description || business.description}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-apple-gray-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">Products</div>
            <div className="mt-2 text-lg font-bold text-apple-gray-500">{productCount}</div>
          </div>
          <div className="rounded-2xl bg-apple-gray-50 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">
              <MapPin className="h-4 w-4" />
              Service area
            </div>
            <div className="mt-2 text-sm font-bold text-apple-gray-500">{storefront.service_area || storefront.campus_location || business.city_state}</div>
          </div>
        </div>

        {previewPath ? (
          <div className="mt-6">
            <Button asChild={false} variant="secondary" onClick={() => window.open(previewPath, '_blank', 'noopener,noreferrer')}>
              <ExternalLink className="h-4 w-4" />
              Preview Storefront
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
