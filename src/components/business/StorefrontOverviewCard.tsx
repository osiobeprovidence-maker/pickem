import { Link } from 'react-router-dom';
import { Globe, MapPin, PackageCheck, PenSquare } from 'lucide-react';
import type { Business, Storefront } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';

type StorefrontOverviewCardProps = {
  business: Business;
  storefront: Storefront | null;
  onEdit: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  previewHref?: string;
};

export function StorefrontOverviewCard({
  business,
  storefront,
  onEdit,
  onPublish,
  onUnpublish,
  previewHref,
}: StorefrontOverviewCardProps) {
  if (!storefront) {
    return (
      <Card className="p-6 sm:p-8">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Storefront</p>
        <h3 className="mt-3 text-2xl font-black text-apple-gray-500">Create your public storefront</h3>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-apple-gray-300">
          Set your storefront name, banner, delivery options, and service area so customers can discover your brand.
        </p>
        <div className="mt-6">
          <Button onClick={onEdit}>
            <PenSquare className="h-4 w-4" />
            Set up storefront
          </Button>
        </div>
      </Card>
    );
  }

  const canPublish = storefront.storefront_status !== 'published';

  return (
    <Card className="overflow-hidden">
      <div className="h-44 bg-apple-gray-500 sm:h-52">
        {storefront.banner ? (
          <img src={storefront.banner} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#1d1d1f_0%,#3b3b40_100%)]" />
        )}
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-apple-gray-50 text-xl font-black text-apple-gray-500 shadow-sm">
              {storefront.logo ? (
                <img src={storefront.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                storefront.storefront_name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Storefront</p>
              <h3 className="mt-2 break-words text-2xl font-black text-apple-gray-500">{storefront.storefront_name}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">{storefront.tagline || business.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={storefront.storefront_status} />
                <StatusBadge status={storefront.open_status} />
                <span className="rounded-full bg-apple-gray-50 px-3 py-1 text-xs font-bold text-apple-gray-400">
                  {business.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" onClick={onEdit}>
              <PenSquare className="h-4 w-4" />
              Edit Storefront
            </Button>
            {canPublish ? (
              <Button onClick={onPublish}>
                <Globe className="h-4 w-4" />
                Publish Storefront
              </Button>
            ) : (
              <Button variant="secondary" onClick={onUnpublish}>
                Hide Storefront
              </Button>
            )}
            {previewHref ? (
              <Link to={previewHref}>
                <Button variant="ghost" className="w-full sm:w-auto">
                  Preview Storefront
                </Button>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">
              <MapPin className="h-4 w-4" />
              Service area
            </div>
            <div className="mt-2 text-sm font-bold text-apple-gray-500">{storefront.service_area || business.city_state || 'Not set'}</div>
          </div>
          <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">Opening hours</div>
            <div className="mt-2 text-sm font-bold text-apple-gray-500">{storefront.opening_hours || 'Not set'}</div>
          </div>
          <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">Delivery</div>
            <div className="mt-2">
              <StatusBadge status={storefront.delivery_enabled ? 'yes' : 'no'} label={storefront.delivery_enabled ? 'Enabled' : 'Disabled'} />
            </div>
          </div>
          <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">
              <PackageCheck className="h-4 w-4" />
              Pickup
            </div>
            <div className="mt-2">
              <StatusBadge status={storefront.pickup_enabled ? 'yes' : 'no'} label={storefront.pickup_enabled ? 'Enabled' : 'Disabled'} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
