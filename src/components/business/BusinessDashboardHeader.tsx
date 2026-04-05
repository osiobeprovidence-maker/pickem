import { Link } from 'react-router-dom';
import { Building2, CreditCard, Eye, PackagePlus, PenSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';

type BusinessDashboardHeaderProps = {
  businessName: string;
  subtitle: string;
  category: string;
  storefrontStatus?: string;
  subscriptionStatus: string;
  storefrontHref?: string;
  onAddProduct: () => void;
  onEditStorefront: () => void;
  onManageSubscription: () => void;
};

export function BusinessDashboardHeader({
  businessName,
  subtitle,
  category,
  storefrontStatus,
  subscriptionStatus,
  storefrontHref,
  onAddProduct,
  onEditStorefront,
  onManageSubscription,
}: BusinessDashboardHeaderProps) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-400">
            <Building2 className="h-4 w-4" />
            Business workspace
          </div>
          <div className="space-y-3">
            <h1 className="break-words text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl">
              Welcome back, {businessName}
            </h1>
            <p className="max-w-3xl text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
              {subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={subscriptionStatus} label={`Plan ${subscriptionStatus}`} />
            <StatusBadge status={storefrontStatus ?? 'draft'} label={`Storefront ${storefrontStatus ?? 'draft'}`} />
            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-apple-gray-400 shadow-sm">
              {category}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
          <Button onClick={onAddProduct}>
            <PackagePlus className="h-4 w-4" />
            Add Product
          </Button>
          <Button variant="secondary" onClick={onEditStorefront}>
            <PenSquare className="h-4 w-4" />
            Edit Storefront
          </Button>
          {storefrontHref ? (
            <Link to={storefrontHref}>
              <Button variant="secondary" className="w-full sm:w-auto">
                <Eye className="h-4 w-4" />
                View Storefront
              </Button>
            </Link>
          ) : null}
          <Button variant="ghost" onClick={onManageSubscription}>
            <CreditCard className="h-4 w-4" />
            Manage Subscription
          </Button>
        </div>
      </div>
    </Card>
  );
}
