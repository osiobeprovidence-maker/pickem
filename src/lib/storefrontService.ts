import type { Business, Storefront, User } from '../types';
import {
  completeBusinessRegistration,
  ensureUniqueStorefrontSlug,
  getBusinessWorkspace,
  getBusinessWorkspaceBySlug,
  getPublicStorefrontBySlug,
  getStorefrontPreviewPath,
  getStorefrontPublicPath,
  getStorefrontPublicUrl,
  isStorefrontSlugAvailable,
  setStorefrontStatus,
  updateStorefront,
  type BusinessRegistrationSetupInput,
} from './businessWorkspace';

export type StorefrontSettingsPayload = {
  business: Partial<Business>;
  storefront: Partial<Omit<Storefront, 'storefront_id' | 'business_id' | 'created_at' | 'updated_at'>>;
};

const requireBusinessUser = (user?: User | null) => {
  if (!user || user.role !== 'business') {
    throw new Error('Only business accounts can manage storefront settings.');
  }
};

export const storefrontService = {
  async loadForOwner(user?: User | null) {
    requireBusinessUser(user);
    return getBusinessWorkspace(user);
  },

  async createOrUpdateRegistration(user: User, input: BusinessRegistrationSetupInput) {
    requireBusinessUser(user);
    return completeBusinessRegistration(user, input);
  },

  async saveSettings(user: User, payload: StorefrontSettingsPayload) {
    requireBusinessUser(user);
    const updated = updateStorefront(user, {
      ...payload.storefront,
      business: payload.business,
    });

    if (!updated) {
      throw new Error('Storefront could not be saved.');
    }

    return updated;
  },

  async setStatus(user: User, status: Storefront['storefront_status']) {
    requireBusinessUser(user);
    const updated = setStorefrontStatus(user, status);
    if (!updated) {
      throw new Error('Storefront status could not be updated.');
    }
    return updated;
  },

  async validateSlug(slug: string, excludeBusinessId?: string) {
    const normalized = ensureUniqueStorefrontSlug(slug, excludeBusinessId);
    const rawNormalized = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!rawNormalized) {
      return {
        normalized: '',
        available: false,
        valid: false,
        error: 'Slug is required.',
      };
    }

    const available = isStorefrontSlugAvailable(rawNormalized, excludeBusinessId);

    return {
      normalized,
      available,
      valid: /^[a-z0-9-]+$/.test(rawNormalized),
      error: available ? undefined : `Slug is already taken. Try ${normalized}.`,
    };
  },

  async loadPublic(slug: string, viewer?: User | null, previewMode = false) {
    if (previewMode && viewer?.role === 'business') {
      const ownerWorkspace = getBusinessWorkspace(viewer);
      if (ownerWorkspace?.storefront?.slug === slug) {
        return {
          business: ownerWorkspace.business,
          storefront: ownerWorkspace.storefront,
          products: ownerWorkspace.products.filter((product) => product.status !== 'hidden'),
          isPreview: true,
        };
      }
    }

    const published = getPublicStorefrontBySlug(slug);
    if (!published) return null;
    return {
      ...published,
      isPreview: false,
    };
  },

  async loadBySlugForOwner(slug: string) {
    return getBusinessWorkspaceBySlug(slug);
  },

  getPublicPath(slug: string) {
    return getStorefrontPublicPath(slug);
  },

  getPreviewPath(slug: string) {
    return getStorefrontPreviewPath(slug);
  },

  getPublicUrl(slug: string) {
    return getStorefrontPublicUrl(slug);
  },
};
