import React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark';
type ButtonSize = 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-apple-gray-500 text-white shadow-sm shadow-brand-500/10 hover:bg-black focus-visible:ring-brand-500',
  secondary:
    'border border-brand-100 bg-white text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-500',
  ghost:
    'bg-transparent text-apple-gray-500 hover:bg-apple-gray-50 focus-visible:ring-brand-500',
  dark:
    'bg-apple-gray-500 text-white shadow-sm shadow-brand-500/10 hover:bg-black focus-visible:ring-brand-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  md: 'min-h-12 rounded-full px-5 py-3 text-sm font-bold',
  lg: 'min-h-14 rounded-full px-6 py-4 text-base font-bold',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
