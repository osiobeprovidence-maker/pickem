import { format } from 'date-fns';
import { CreditCard, CalendarDays, LockKeyhole, Sparkles } from 'lucide-react';
import type { BusinessPlanSummary } from '../../lib/businessOnboarding';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';

type SubscriptionStatusCardProps = {
  planSummary: BusinessPlanSummary;
  onStartTrial: () => void;
  onSubscribe: () => void;
};

const formatDate = (value?: string) => (value ? format(new Date(value), 'MMM d, yyyy') : 'Not started');

export function SubscriptionStatusCard({ planSummary, onStartTrial, onSubscribe }: SubscriptionStatusCardProps) {
  const isInactive = planSummary.status === 'inactive' || planSummary.status === 'none';
  const isExpired = planSummary.status === 'expired';
  const showSubscribe = planSummary.status === 'trial' || planSummary.status === 'active' || isExpired;

  return (
    <Card className="h-full p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Subscription</p>
          <h2 className="mt-3 text-3xl font-black text-apple-gray-500">{planSummary.currentPlanLabel}</h2>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <CreditCard className="h-7 w-7" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatusBadge status={planSummary.status === 'none' ? 'inactive' : planSummary.status} />
        <span className="rounded-full bg-apple-gray-50 px-3 py-1 text-xs font-bold text-apple-gray-400">
          ₦3,500/month
        </span>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">
            <CalendarDays className="h-4 w-4" />
            Trial start
          </div>
          <div className="mt-2 text-base font-bold text-apple-gray-500">{formatDate(planSummary.record?.trialStartDate)}</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-apple-gray-100 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">Trial end</div>
            <div className="mt-2 text-base font-bold text-apple-gray-500">{formatDate(planSummary.record?.trialEndDate)}</div>
          </div>
          <div className="rounded-2xl border border-apple-gray-100 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">Days remaining</div>
            <div className="mt-2 text-base font-bold text-apple-gray-500">{planSummary.daysRemaining}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-apple-gray-100 bg-apple-gray-50 p-4">
        <div className="flex items-start gap-3">
          {planSummary.locked ? (
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          ) : (
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
          )}
          <div>
            <p className="text-sm font-bold text-apple-gray-500">{planSummary.nextBillingLabel}</p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-apple-gray-300">
              Only businesses on a trial or active plan can publish products to the marketplace.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {isInactive ? <Button onClick={onStartTrial}>Start 7-Day Trial</Button> : null}
        {showSubscribe ? (
          <Button variant={isExpired ? 'primary' : 'secondary'} onClick={onSubscribe}>
            {isExpired ? 'Renew Plan' : 'Subscribe Now'}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
