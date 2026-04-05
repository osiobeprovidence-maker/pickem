import { Package, Pencil, Trash2, EyeOff, Megaphone, PackageOpen } from 'lucide-react';
import type { Product } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';

type ProductListTableProps = {
  products: Product[];
  canPublish: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onPublishProduct: (product: Product) => void;
  onUnpublishProduct: (product: Product) => void;
  onMarkOutOfStock: (product: Product) => void;
  onToggleVisibility: (product: Product, visible: boolean) => void;
};

export function ProductListTable({
  products,
  canPublish,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onPublishProduct,
  onUnpublishProduct,
  onMarkOutOfStock,
  onToggleVisibility,
}: ProductListTableProps) {
  const actionBar = (product: Product) => (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" className="min-h-10 px-4 py-2 text-xs" onClick={() => onEditProduct(product)}>
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      {product.status === 'published' ? (
        <Button variant="ghost" className="min-h-10 px-4 py-2 text-xs" onClick={() => onUnpublishProduct(product)}>
          <EyeOff className="h-4 w-4" />
          Unpublish
        </Button>
      ) : (
        <Button
          className="min-h-10 px-4 py-2 text-xs"
          onClick={() => onPublishProduct(product)}
          disabled={!canPublish || product.stock <= 0}
        >
          <Megaphone className="h-4 w-4" />
          Publish
        </Button>
      )}
      <Button variant="ghost" className="min-h-10 px-4 py-2 text-xs" onClick={() => onMarkOutOfStock(product)}>
        <PackageOpen className="h-4 w-4" />
        Out of stock
      </Button>
      <Button
        variant="ghost"
        className="min-h-10 px-4 py-2 text-xs"
        onClick={() => onToggleVisibility(product, !product.visible_in_marketplace)}
      >
        {product.visible_in_marketplace ? 'Hide from marketplace' : 'Show in marketplace'}
      </Button>
      <Button
        variant="ghost"
        className="min-h-10 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
        onClick={() => onDeleteProduct(product)}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-apple-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Products</p>
          <h3 className="mt-2 text-2xl font-black text-apple-gray-500">Product listings</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
            Add products, keep inventory fresh, and control which listings are visible in the marketplace.
          </p>
        </div>
        <Button onClick={onAddProduct}>Add Product</Button>
      </div>

      {!canPublish ? (
        <div className="border-b border-apple-gray-100 bg-amber-50 px-6 py-4 text-sm font-medium text-amber-700 sm:px-8">
          Your storefront must be published and your subscription must be trial or active before products can go live.
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="p-6 sm:p-8">
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Add your first product to start selling on the marketplace."
            action={<Button onClick={onAddProduct}>Add First Product</Button>}
          />
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-apple-gray-50 text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4">Category</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Stock</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Marketplace</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-2xl bg-apple-gray-50">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-apple-gray-200">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-apple-gray-500">{product.name}</div>
                          <div className="mt-1 line-clamp-2 text-sm font-medium text-apple-gray-300">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-apple-gray-400">{product.category}</td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-apple-gray-500">₦{product.price.toLocaleString()}</div>
                      {product.discount_price ? (
                        <div className="mt-1 text-xs font-medium text-apple-gray-300">
                          Discount ₦{product.discount_price.toLocaleString()}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-apple-gray-500">{product.stock}</td>
                    <td className="px-8 py-6">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge
                        status={product.visible_in_marketplace ? 'yes' : 'no'}
                        label={product.visible_in_marketplace ? 'Visible' : 'Hidden'}
                      />
                    </td>
                    <td className="px-8 py-6">{actionBar(product)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-apple-gray-100 lg:hidden">
            {products.map((product) => (
              <div key={product.id} className="space-y-4 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-apple-gray-50">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-apple-gray-200">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-bold text-apple-gray-500">{product.name}</div>
                    <div className="mt-1 text-sm font-medium text-apple-gray-300">{product.category}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge status={product.status} />
                      <StatusBadge
                        status={product.visible_in_marketplace ? 'yes' : 'no'}
                        label={product.visible_in_marketplace ? 'Visible' : 'Hidden'}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-apple-gray-50 p-4 text-sm font-medium text-apple-gray-400">
                    Price
                    <span className="mt-1 block text-base font-bold text-apple-gray-500">
                      ₦{product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-apple-gray-50 p-4 text-sm font-medium text-apple-gray-400">
                    Stock
                    <span className="mt-1 block text-base font-bold text-apple-gray-500">{product.stock}</span>
                  </div>
                </div>
                {actionBar(product)}
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
