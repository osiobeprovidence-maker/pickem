import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-dashed border-apple-gray-100 bg-apple-gray-50 px-6 py-12 text-center sm:px-8',
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-apple-gray-300 shadow-sm">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-apple-gray-500">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
