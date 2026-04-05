import type { MarketplaceEligibility } from '../../lib/businessWorkspace';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';

type MarketplaceEligibilityCardProps = {
  eligibility: MarketplaceEligibility;
};

const rows = (eligibility: MarketplaceEligibility) => [
  { label: 'Business registration complete', value: eligibility.registrationComplete },
  { label: 'Storefront published', value: eligibility.storefrontPublished },
  { label: 'Subscription active', value: eligibility.subscriptionActive },
  { label: 'Eligible for marketplace', value: eligibility.eligibleForMarketplace },
];

export function MarketplaceEligibilityCard({ eligibility }: MarketplaceEligibilityCardProps) {
  return (
    <Card className="h-full p-6 sm:p-8">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Publishing status</p>
      <h3 className="mt-3 text-2xl font-black text-apple-gray-500">Marketplace eligibility</h3>
      <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
        Products only appear in the marketplace when your setup, storefront, and subscription are all in a live state.
      </p>

      <div className="mt-6 space-y-3">
        {rows(eligibility).map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3">
            <span className="text-sm font-bold text-apple-gray-500">{row.label}</span>
            <StatusBadge status={row.value ? 'yes' : 'no'} label={row.value ? 'Yes' : 'No'} />
          </div>
        ))}
      </div>
    </Card>
  );
}
