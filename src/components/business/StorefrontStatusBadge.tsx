import type { StorefrontStatus } from '../../types';
import { StatusBadge } from './StatusBadge';

type StorefrontStatusBadgeProps = {
  status: StorefrontStatus;
};

export function StorefrontStatusBadge({ status }: StorefrontStatusBadgeProps) {
  return <StatusBadge status={status} label={status === 'hidden' ? 'Hidden' : status === 'published' ? 'Published' : 'Draft'} />;
}
