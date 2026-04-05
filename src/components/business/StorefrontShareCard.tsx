import { Copy, ExternalLink, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StorefrontStatusBadge } from './StorefrontStatusBadge';

type StorefrontShareCardProps = {
  publicUrl: string | null;
  publicPath: string | null;
  previewPath: string | null;
  status: 'draft' | 'published' | 'hidden';
  onCopyLink: () => Promise<boolean>;
  onShareLink: () => Promise<boolean>;
};

export function StorefrontShareCard({
  publicUrl,
  publicPath,
  previewPath,
  status,
  onCopyLink,
  onShareLink,
}: StorefrontShareCardProps) {
  const published = status === 'published';

  return (
    <Card className="h-full p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Share storefront</p>
          <h3 className="mt-3 text-2xl font-black text-apple-gray-500">Public storefront link</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
            Share your storefront like a Shopify-style shop page. Only published storefronts are visible to the public.
          </p>
        </div>
        <StorefrontStatusBadge status={status} />
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-apple-gray-100 bg-apple-gray-50 p-4">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">Public URL</div>
        <div className="mt-3 break-all text-sm font-bold text-apple-gray-500">
          {publicUrl ?? 'Save your storefront to generate a shareable link.'}
        </div>
      </div>

      {!published ? (
        <div className="mt-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          Your storefront is not published yet. Preview is available, but public visitors cannot access the link until you publish.
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3">
        <Button type="button" onClick={() => void onCopyLink()} disabled={!publicUrl}>
          <Copy className="h-4 w-4" />
          Copy Link
        </Button>
        <Button type="button" variant="secondary" onClick={() => void onShareLink()} disabled={!publicUrl}>
          <Share2 className="h-4 w-4" />
          Share Storefront
        </Button>
        {previewPath ? (
          <Link to={previewPath}>
            <Button variant="ghost" className="w-full">
              Preview Storefront
            </Button>
          </Link>
        ) : null}
        {published && publicPath ? (
          <Link to={publicPath}>
            <Button variant="ghost" className="w-full">
              <ExternalLink className="h-4 w-4" />
              Open Public Store
            </Button>
          </Link>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-apple-gray-50 px-3 py-1 text-xs font-bold text-apple-gray-400">Instagram share placeholder</span>
        <span className="rounded-full bg-apple-gray-50 px-3 py-1 text-xs font-bold text-apple-gray-400">WhatsApp share placeholder</span>
      </div>
    </Card>
  );
}
