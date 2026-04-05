import React from 'react';
import type { Product, ProductStatus } from '../../types';
import type { ProductInput } from '../../lib/businessWorkspace';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

type ProductFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: ProductInput) => void;
  initialProduct?: Product | null;
};

type ProductFormState = {
  name: string;
  category: string;
  description: string;
  price: string;
  discount_price: string;
  images: string[];
  stock: string;
  status: ProductStatus;
  delivery_available: boolean;
  pickup_available: boolean;
  featured: boolean;
  visible_in_marketplace: boolean;
  estimated_preparation_time: string;
  tags: string;
};

const defaultState: ProductFormState = {
  name: '',
  category: '',
  description: '',
  price: '',
  discount_price: '',
  images: [],
  stock: '1',
  status: 'draft',
  delivery_available: true,
  pickup_available: true,
  featured: false,
  visible_in_marketplace: false,
  estimated_preparation_time: '',
  tags: '',
};

const toState = (product?: Product | null): ProductFormState =>
  product
    ? {
        name: product.name,
        category: product.category,
        description: product.description,
        price: String(product.price),
        discount_price: product.discount_price ? String(product.discount_price) : '',
        images: product.images,
        stock: String(product.stock),
        status: product.status,
        delivery_available: product.delivery_available,
        pickup_available: product.pickup_available,
        featured: product.featured,
        visible_in_marketplace: product.visible_in_marketplace,
        estimated_preparation_time: product.estimated_preparation_time ?? '',
        tags: product.tags.join(', '),
      }
    : defaultState;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export function ProductForm({ open, onClose, onSubmit, initialProduct }: ProductFormProps) {
  const [form, setForm] = React.useState<ProductFormState>(toState(initialProduct));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(toState(initialProduct));
      setErrors({});
    }
  }, [initialProduct, open]);

  const setField = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map(fileToDataUrl));
      setForm((current) => ({ ...current, images: [...current.images, ...uploaded].slice(0, 4) }));
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = 'Product name is required.';
    if (!form.category.trim()) nextErrors.category = 'Category is required.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    if (!form.price.trim() || Number.isNaN(Number(form.price))) nextErrors.price = 'Enter a valid price.';
    if (!form.stock.trim() || Number.isNaN(Number(form.stock))) nextErrors.stock = 'Enter a valid stock quantity.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discount_price: form.discount_price.trim() ? Number(form.discount_price) : undefined,
      images: form.images,
      stock: Number(form.stock),
      status: Number(form.stock) <= 0 ? 'out_of_stock' : form.status,
      delivery_available: form.delivery_available,
      pickup_available: form.pickup_available,
      featured: form.featured,
      visible_in_marketplace: form.visible_in_marketplace,
      estimated_preparation_time: form.estimated_preparation_time.trim() || undefined,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initialProduct ? 'Edit Product' : 'Add Product'} className="max-w-5xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Product Name" value={form.name} onChange={(event) => setField('name', event.target.value)} error={errors.name} />
          <Input label="Product Category" value={form.category} onChange={(event) => setField('category', event.target.value)} error={errors.category} />
          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-apple-gray-500">Product Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all placeholder:text-apple-gray-200 focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
            />
            {errors.description ? <p className="text-sm font-medium text-red-500">{errors.description}</p> : null}
          </label>
          <Input label="Product Price" inputMode="decimal" value={form.price} onChange={(event) => setField('price', event.target.value)} error={errors.price} />
          <Input label="Discount Price (optional)" inputMode="decimal" value={form.discount_price} onChange={(event) => setField('discount_price', event.target.value)} />
          <Input label="Stock Quantity" inputMode="numeric" value={form.stock} onChange={(event) => setField('stock', event.target.value)} error={errors.stock} />
          <label className="block space-y-2">
            <span className="text-sm font-bold text-apple-gray-500">Availability Status</span>
            <select
              value={form.status}
              onChange={(event) => setField('status', event.target.value as ProductStatus)}
              className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </label>
          <Input label="Estimated Preparation Time (optional)" value={form.estimated_preparation_time} onChange={(event) => setField('estimated_preparation_time', event.target.value)} hint="Example: 15 mins" />
          <Input label="Tags (optional)" value={form.tags} onChange={(event) => setField('tags', event.target.value)} hint="Comma-separated tags" />
          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-apple-gray-500">Product Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full rounded-2xl border border-dashed border-apple-gray-200 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-apple-gray-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
            <p className="text-xs font-medium text-apple-gray-300">
              Upload up to 4 images. {isUploading ? 'Uploading...' : 'Images are stored locally for now.'}
            </p>
          </label>
        </div>

        {form.images.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {form.images.map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-apple-gray-100 bg-apple-gray-50">
                <img src={image} alt="" className="h-28 w-full object-cover" />
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid gap-3 rounded-[1.75rem] border border-apple-gray-100 bg-apple-gray-50 p-5 sm:grid-cols-2">
          {[
            { key: 'delivery_available', label: 'Delivery Available' },
            { key: 'pickup_available', label: 'Pickup Available' },
            { key: 'featured', label: 'Featured Product' },
            { key: 'visible_in_marketplace', label: 'Visible in Marketplace' },
          ].map((toggle) => (
            <label key={toggle.key} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
              <span className="text-sm font-bold text-apple-gray-500">{toggle.label}</span>
              <input
                type="checkbox"
                checked={Boolean(form[toggle.key as keyof ProductFormState])}
                onChange={(event) =>
                  setField(toggle.key as keyof ProductFormState, event.target.checked as never)
                }
                className="h-4 w-4 rounded border-apple-gray-200 text-brand-600 focus:ring-brand-500"
              />
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialProduct ? 'Save Changes' : 'Add Product'}</Button>
        </div>
      </form>
    </Modal>
  );
}
