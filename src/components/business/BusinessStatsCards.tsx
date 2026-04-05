import { Boxes, CircleCheckBig, Eye, ShoppingBag, Store, Wallet } from 'lucide-react';
import type { BusinessStats } from '../../lib/businessWorkspace';
import { Card } from '../ui/Card';

type BusinessStatsCardsProps = {
  stats: BusinessStats;
};

const statsConfig = (stats: BusinessStats) => [
  { label: 'Total Products', value: stats.totalProducts, icon: Boxes, tone: 'text-brand-700 bg-brand-50' },
  { label: 'Active Listings', value: stats.activeListings, icon: Eye, tone: 'text-emerald-700 bg-emerald-50' },
  { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, tone: 'text-indigo-700 bg-indigo-50' },
  { label: 'Completed Orders', value: stats.completedOrders, icon: CircleCheckBig, tone: 'text-sky-700 bg-sky-50' },
  { label: 'Revenue', value: `₦${stats.revenue.toLocaleString()}`, icon: Wallet, tone: 'text-amber-700 bg-amber-50' },
  { label: 'Storefront Status', value: stats.storefrontStatus, icon: Store, tone: 'text-apple-gray-500 bg-apple-gray-50' },
];

export function BusinessStatsCards({ stats }: BusinessStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {statsConfig(stats).map((stat) => (
        <Card key={stat.label} className="h-full p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div className="mt-5 text-3xl font-black tracking-tight text-apple-gray-500">{stat.value}</div>
          <div className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
}
