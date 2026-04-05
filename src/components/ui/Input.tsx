import React from 'react';
import { cn } from '../../lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return (
      <label htmlFor={inputId} className="block space-y-2">
        <span className="text-sm font-bold text-apple-gray-500">{label}</span>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all placeholder:text-apple-gray-200 focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30',
            error && 'border-red-200 focus:border-red-300 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-sm font-medium text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-xs font-medium text-apple-gray-300">{hint}</p>
        ) : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
