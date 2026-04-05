import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Clock3, MapPin, Package, Search, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getBusinessWorkspace, getPublicStorefrontBySlug } from '../lib/businessWorkspace';
import type { Product } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/business/EmptyState';
import { StatusBadge } from '../components/business/StatusBadge';

export default function Storefront() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [ownWorkspace, setOwnWorkspace] = React.useState(() => getBusinessWorkspace(user));

  const previewMode = searchParams.get('preview') === '1';

  React.useEffect(() => {
    setOwnWorkspace(getBusinessWorkspace(user));
  }, [user]);

  const canPreviewOwnStorefront =
    previewMode && user?.role === 'business' && ownWorkspace?.storefront?.slug === slug;

  const publicData = getPublicStorefrontBySlug(slug);
  const data = canPreviewOwnStorefront
    ? {
        business: ownWorkspace!.business,
        storefront: ownWorkspace!.storefront!,
        products: ownWorkspace!.products.filter((product) => product.status !== 'hidden'),
      }
    : publicData;

  const categories = React.useMemo(
    () => ['all', ...new Set((data?.products ?? []).map((product) => product.category))],
    [data?.products],
  );

  const filteredProducts = React.useMemo(
    () =>
      (data?.products ?? []).filter((product) => {
        const matchesQuery =
          !query.trim() ||
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === 'all' || product.category === category;
        return matchesQuery && matchesCategory;
      }),
    [category, data?.products, query],
  );

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

  const { business, storefront } = data;

  return (
    <div className="min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fa_100%)]">
      <div className="relative">
        <div className="h-[30vh] min-h-[240px] bg-apple-gray-500 sm:h-[38vh]">
          {storefront.banner ? (
            <img src={storefront.banner} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(135deg,#1d1d1f_0%,#2b2b31_40%,#0f5132_100%)]" />
          )}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="-mt-20 pb-8 sm:-mt-24">
            <Card className="overflow-hidden">
              <div className="p-6 sm:p-8">
                {canPreviewOwnStorefront ? (
                  <div className="mb-5 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
                    Preview mode is on. You are viewing your storefront before it is fully public.
                  </div>
                ) : null}

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-6">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] bg-apple-gray-50 text-2xl font-black text-apple-gray-500 shadow-sm sm:h-24 sm:w-24">
                      {storefront.logo ? (
                        <img src={storefront.logo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        storefront.storefront_name.charAt(0)
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={storefront.storefront_status} />
                        <StatusBadge status={storefront.open_status} />
                        <StatusBadge status={storefront.delivery_enabled ? 'yes' : 'no'} label={storefront.delivery_enabled ? 'Delivery' : 'Delivery off'} />
                        <StatusBadge status={storefront.pickup_enabled ? 'yes' : 'no'} label={storefront.pickup_enabled ? 'Pickup' : 'Pickup off'} />
                      </div>
                      <h1 className="mt-4 break-words text-3xl font-black tracking-tight text-apple-gray-500 sm:text-5xl">
                        {storefront.storefront_name}
                      </h1>
                      <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">
                        {storefront.tagline || business.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                    <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">
                        <MapPin className="h-4 w-4" />
                        Service area
                      </div>
                      <div className="mt-2 text-sm font-bold text-apple-gray-500">{storefront.service_area || business.city_state}</div>
                    </div>
                    <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">
                        <Clock3 className="h-4 w-4" />
                        Hours
                      </div>
                      <div className="mt-2 text-sm font-bold text-apple-gray-500">{storefront.opening_hours || 'Contact store'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="rounded-[1.75rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">About this business</div>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-apple-gray-400 sm:text-base">{business.description}</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-apple-gray-100 bg-white p-5">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Category</div>
                    <div className="mt-3 text-lg font-bold text-apple-gray-500">{business.category}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-10">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Marketplace</p>
              <h2 className="mt-2 text-2xl font-black text-apple-gray-500">Browse products</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
                Discover what is available now and place an order through Pick&apos;em.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] lg:w-[540px]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-gray-200" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-full border border-apple-gray-100 bg-apple-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-apple-gray-500 outline-none transition-all focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
                />
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-full border border-apple-gray-100 bg-apple-gray-50 px-4 py-3 text-sm font-medium text-apple-gray-500 outline-none transition-all focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All categories' : option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            {filteredProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No products available"
                description={
                  query || category !== 'all'
                    ? 'Try adjusting your search or filter to find matching products.'
                    : 'This storefront has not published any products yet.'
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="flex h-full flex-col overflow-hidden">
                    <div className="aspect-[1.05] overflow-hidden bg-apple-gray-50">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-apple-gray-200">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={product.status} />
                        {product.featured ? <StatusBadge status="trial" label="Featured" /> : null}
                      </div>
                      <h3 className="mt-4 text-2xl font-black text-apple-gray-500">{product.name}</h3>
                      <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-apple-gray-300">{product.description}</p>
                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-2xl font-black text-apple-gray-500">₦{product.price.toLocaleString()}</div>
                          {product.discount_price ? (
                            <div className="mt-1 text-sm font-medium text-apple-gray-300">
                              Discount ₦{product.discount_price.toLocaleString()}
                            </div>
                          ) : null}
                        </div>
                        <div className="text-right text-xs font-bold uppercase tracking-[0.14em] text-apple-gray-300">
                          Stock
                          <div className="mt-1 text-sm text-apple-gray-500">{product.stock}</div>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button variant="secondary" className="w-full" onClick={() => setSelectedProduct(product)}>
                          View Product
                        </Button>
                        <Link to={`/buy-and-deliver?product=${encodeURIComponent(product.name)}`} className="w-full">
                          <Button className="w-full" disabled={product.status !== 'published' || product.stock <= 0}>
                            Order Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <Modal open={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} title={selectedProduct?.name ?? 'Product'}>
        {selectedProduct ? (
          <div className="space-y-6">
            <div className="aspect-video overflow-hidden rounded-[1.75rem] bg-apple-gray-50">
              {selectedProduct.images[0] ? (
                <img src={selectedProduct.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-apple-gray-200">
                  <Package className="h-10 w-10" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={selectedProduct.status} />
              <span className="rounded-full bg-apple-gray-50 px-3 py-1 text-xs font-bold text-apple-gray-400">
                {selectedProduct.category}
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-apple-gray-400">{selectedProduct.description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Price</div>
                <div className="mt-2 text-2xl font-black text-apple-gray-500">₦{selectedProduct.price.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Availability</div>
                <div className="mt-2 text-2xl font-black text-apple-gray-500">{selectedProduct.stock} in stock</div>
              </Card>
            </div>
            <Link to={`/buy-and-deliver?product=${encodeURIComponent(selectedProduct.name)}`}>
              <Button className="w-full" disabled={selectedProduct.status !== 'published' || selectedProduct.stock <= 0}>
                Order Now
              </Button>
            </Link>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
