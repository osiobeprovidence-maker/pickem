import React from 'react';
import { cn } from '../../lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-apple-gray-100 bg-white shadow-[0_14px_45px_rgba(29,29,31,0.06)]',
        className,
      )}
      {...props}
    />
  );
}
