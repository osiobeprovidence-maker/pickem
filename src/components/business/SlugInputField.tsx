import { Link2 } from 'lucide-react';
import { Input } from '../ui/Input';

type SlugValidation = {
  normalized: string;
  available: boolean;
  valid: boolean;
  error?: string;
} | null;

type SlugInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  validation: SlugValidation;
  publicPath?: string | null;
  error?: string;
};

export function SlugInputField({ value, onChange, onBlur, validation, publicPath, error }: SlugInputFieldProps) {
  const helper =
    error ??
    validation?.error ??
    (validation?.normalized
      ? `Public URL: ${publicPath?.replace(/[^/]+$/, validation.normalized) ?? `/store/${validation.normalized}`}`
      : 'Only lowercase letters, numbers, and hyphens are allowed.');

  return (
    <div className="space-y-2">
      <Input
        label="Storefront Slug"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        error={error ?? validation?.error}
        hint={!error && !validation?.error ? helper : undefined}
      />
      {validation?.available && validation.valid ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          <Link2 className="h-4 w-4" />
          Slug available
        </div>
      ) : null}
    </div>
  );
}
