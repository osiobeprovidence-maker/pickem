import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storefrontService } from '../lib/storefrontService';
import { EmptyState } from '../components/business/EmptyState';
import { PublicStorefrontPage } from '../components/business/PublicStorefrontPage';

export default function Storefront() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Awaited<ReturnType<typeof storefrontService.loadPublic>>>(null);

  const previewMode = searchParams.get('preview') === '1';

  React.useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      const next = await storefrontService.loadPublic(slug, user, previewMode);
      if (active) {
        setData(next);
        setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [previewMode, slug, user]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center px-4 py-12 sm:px-6">
        <div className="w-full">
          <EmptyState
            icon={ShoppingBag}
            title="Loading storefront"
            description="We’re fetching the latest published storefront details."
          />
        </div>
      </div>
    );
  }

  if (!data?.storefront) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center px-4 py-12 sm:px-6">
        <div className="w-full">
          <EmptyState
            icon={ShoppingBag}
            title="Storefront not available"
            description="This storefront is not published yet, or the link may be incorrect."
          />
        </div>
      </div>
    );
  }

  return (
    <PublicStorefrontPage
      business={data.business}
      storefront={data.storefront}
      products={data.products}
      publicUrl={storefrontService.getPublicUrl(data.storefront.slug)}
      isPreview={data.isPreview}
    />
  );
}
