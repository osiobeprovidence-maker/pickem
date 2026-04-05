import { CheckCircle2, Circle } from 'lucide-react';
import type { OnboardingChecklistItem } from '../../lib/businessWorkspace';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type OnboardingChecklistProps = {
  items: OnboardingChecklistItem[];
  onOpenSetup: () => void;
};

export function OnboardingChecklist({ items, onOpenSetup }: OnboardingChecklistProps) {
  const completedCount = items.filter((item) => item.complete).length;
  const progress = items.length ? (completedCount / items.length) * 100 : 0;

  return (
    <Card className="h-full p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Setup checklist</p>
          <h3 className="mt-3 text-2xl font-black text-apple-gray-500">Complete your business onboarding</h3>
          <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-apple-gray-300">
            Finish the essentials so your storefront can go live and start receiving marketplace orders.
          </p>
        </div>
        <Button variant="secondary" onClick={onOpenSetup}>
          Continue setup
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">
          <span>Progress</span>
          <span>
            {completedCount}/{items.length} complete
          </span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-apple-gray-100">
          <div className="h-full rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-apple-gray-100 bg-white p-4">
            <div className="mt-0.5 text-brand-700">
              {item.complete ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 text-apple-gray-200" />}
            </div>
            <div>
              <div className="text-sm font-bold text-apple-gray-500">{item.label}</div>
              <div className="mt-1 text-sm font-medium leading-relaxed text-apple-gray-300">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
