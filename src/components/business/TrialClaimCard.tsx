import { Sparkles, ArrowRight } from 'lucide-react';
import { BUSINESS_MONTHLY_PRICE } from '../../lib/businessOnboarding';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type TrialClaimCardProps = {
  onStartTrial: () => void;
};

export function TrialClaimCard({ onStartTrial }: TrialClaimCardProps) {
  return (
    <Card className="overflow-hidden bg-apple-gray-500 p-6 text-white sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-brand-200">
            <Sparkles className="h-4 w-4" />
            Growth unlock
          </div>
          <h3 className="mt-4 text-2xl font-black sm:text-3xl">Claim your 7-day free trial</h3>
          <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-white/70 sm:text-base">
            Go live on the marketplace, publish products, and start receiving campus orders. After your trial, continue
            on the ₦{BUSINESS_MONTHLY_PRICE.toLocaleString()}/month business plan.
          </p>
        </div>
        <Button onClick={onStartTrial} className="bg-white text-apple-gray-500 hover:bg-brand-50">
          Start 7-Day Trial
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
