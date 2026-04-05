import { cn } from '../../lib/utils';

type StatusBadgeProps = {
  status: string;
  label?: string;
  className?: string;
};

const toneMap: Record<string, string> = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  trial: 'border-brand-100 bg-brand-50 text-brand-700',
  inactive: 'border-apple-gray-100 bg-apple-gray-50 text-apple-gray-400',
  expired: 'border-red-200 bg-red-50 text-red-600',
  published: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  draft: 'border-amber-200 bg-amber-50 text-amber-700',
  hidden: 'border-apple-gray-100 bg-apple-gray-50 text-apple-gray-400',
  out_of_stock: 'border-red-200 bg-red-50 text-red-600',
  open: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  closed: 'border-red-200 bg-red-50 text-red-600',
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  accepted: 'border-brand-100 bg-brand-50 text-brand-700',
  preparing: 'border-indigo-100 bg-indigo-50 text-indigo-700',
  in_transit: 'border-sky-100 bg-sky-50 text-sky-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-red-200 bg-red-50 text-red-600',
  paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  refunded: 'border-apple-gray-100 bg-apple-gray-50 text-apple-gray-400',
  yes: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  no: 'border-red-200 bg-red-50 text-red-600',
};

const toTitleCase = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]',
        toneMap[normalizedStatus] ?? 'border-apple-gray-100 bg-apple-gray-50 text-apple-gray-400',
        className,
      )}
    >
      {label ?? toTitleCase(normalizedStatus)}
    </span>
  );
}
