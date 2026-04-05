import React from 'react';
import { ImagePlus } from 'lucide-react';
import { Button } from '../ui/Button';

type UploadState = {
  status: 'idle' | 'loading' | 'saving' | 'success' | 'error';
  progress: number;
  message?: string;
};

type StoreBannerUploaderProps = {
  currentUrl?: string;
  uploadState: UploadState;
  onFileSelect: (file: File) => void;
};

export function StoreBannerUploader({ currentUrl, uploadState, onFileSelect }: StoreBannerUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-[1.75rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Store banner</div>
      <div className="mt-4 space-y-4">
        <div className="h-40 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,#1d1d1f_0%,#2b2b31_40%,#0f5132_100%)]">
          {currentUrl ? <img src={currentUrl} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <p className="text-sm font-medium leading-relaxed text-apple-gray-300">
          Upload a wide cover image. The latest saved banner appears immediately in preview and public storefront pages.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onFileSelect(file);
              event.target.value = '';
            }}
          />
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            <ImagePlus className="h-4 w-4" />
            {currentUrl ? 'Replace Banner' : 'Upload Banner'}
          </Button>
          {uploadState.status === 'loading' ? (
            <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-700 shadow-sm">
              Uploading {uploadState.progress}%
            </span>
          ) : null}
        </div>
        {uploadState.message ? (
          <p className={`text-sm font-medium ${uploadState.status === 'error' ? 'text-red-500' : 'text-emerald-700'}`}>
            {uploadState.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
