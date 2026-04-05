import React from 'react';
import type { Business, Storefront, User } from '../types';
import { storefrontService, type StorefrontSettingsPayload } from '../lib/storefrontService';
import { uploadStorefrontMedia, type StorefrontMediaKind } from '../lib/storefrontMedia';
import type { BusinessWorkspace } from '../lib/businessWorkspace';

type AsyncState = 'idle' | 'loading' | 'saving' | 'success' | 'error';

type UploadState = {
  status: AsyncState;
  progress: number;
  message?: string;
};

const idleUploadState: UploadState = {
  status: 'idle',
  progress: 0,
};

export function useBusinessStorefront(user?: User | null) {
  const [workspace, setWorkspace] = React.useState<BusinessWorkspace | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [logoUpload, setLogoUpload] = React.useState<UploadState>(idleUploadState);
  const [bannerUpload, setBannerUpload] = React.useState<UploadState>(idleUploadState);

  const clearSaveFeedback = React.useCallback(() => {
    setSaveMessage(null);
    setSaveError(null);
  }, []);

  const showFeedback = React.useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    if (tone === 'success') {
      setSaveMessage(message);
      setSaveError(null);
      return;
    }

    setSaveMessage(null);
    setSaveError(message);
  }, []);

  const load = React.useCallback(async () => {
    if (!user || user.role !== 'business') {
      setWorkspace(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const nextWorkspace = await storefrontService.loadForOwner(user);
      setWorkspace(nextWorkspace);
      setSaveError(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Storefront could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const saveSettings = React.useCallback(
    async (payload: StorefrontSettingsPayload) => {
      if (!user) return null;

      setSaving(true);
      clearSaveFeedback();
      try {
        const updated = await storefrontService.saveSettings(user, payload);
        setWorkspace(updated);
        showFeedback('Storefront settings saved successfully.');
        return updated;
      } catch (error) {
        showFeedback(error instanceof Error ? error.message : 'Storefront could not be saved.', 'error');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [clearSaveFeedback, user],
  );

  const uploadMedia = React.useCallback(
    async (kind: StorefrontMediaKind, file: File) => {
      if (!user || !workspace) return null;

      const setUploadState = kind === 'logo' ? setLogoUpload : setBannerUpload;
      setUploadState({ status: 'loading', progress: 0, message: undefined });
      clearSaveFeedback();

      try {
        const uploaded = await uploadStorefrontMedia({
          businessId: workspace.business.id,
          file,
          kind,
          onProgress: (progress) => {
            setUploadState({ status: 'loading', progress, message: undefined });
          },
        });

        const updated = await storefrontService.saveSettings(user, {
          business: {},
          storefront:
            kind === 'logo'
              ? { logo_url: uploaded.url }
              : { banner_url: uploaded.url },
        });

        setWorkspace(updated);
        setUploadState({
          status: 'success',
          progress: 100,
          message: kind === 'logo' ? 'Store logo updated.' : 'Store banner updated.',
        });
        showFeedback(kind === 'logo' ? 'Store logo updated successfully.' : 'Store banner updated successfully.');
        return uploaded.url;
      } catch (error) {
        setUploadState({
          status: 'error',
          progress: 0,
          message: error instanceof Error ? error.message : 'Upload failed.',
        });
        showFeedback(error instanceof Error ? error.message : 'Upload failed.', 'error');
        return null;
      }
    },
    [clearSaveFeedback, showFeedback, user, workspace],
  );

  const updateStatus = React.useCallback(
    async (status: Storefront['storefront_status']) => {
      if (!user) return null;

      setSaving(true);
      clearSaveFeedback();
      try {
        const updated = await storefrontService.setStatus(user, status);
        setWorkspace(updated);
        showFeedback(`Storefront marked as ${status}.`);
        return updated;
      } catch (error) {
        showFeedback(error instanceof Error ? error.message : 'Storefront status could not be updated.', 'error');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [clearSaveFeedback, showFeedback, user],
  );

  const validateSlug = React.useCallback(
    async (slug: string) => storefrontService.validateSlug(slug, workspace?.business.id),
    [workspace?.business.id],
  );

  const copyPublicUrl = React.useCallback(async () => {
    const slug = workspace?.storefront?.slug;
    if (!slug) return false;

    try {
      await navigator.clipboard.writeText(storefrontService.getPublicUrl(slug));
      showFeedback('Storefront link copied.');
      return true;
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : 'Could not copy storefront link.', 'error');
      return false;
    }
  }, [showFeedback, workspace?.storefront?.slug]);

  const sharePublicUrl = React.useCallback(async () => {
    const slug = workspace?.storefront?.slug;
    const title = workspace?.storefront?.storefront_name ?? workspace?.business.business_name ?? "Pick'em Store";
    if (!slug) return false;

    const url = storefrontService.getPublicUrl(slug);

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Shop ${title} on Pick'em`,
          url,
        });
        return true;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return false;
        }
      }
    }

    return copyPublicUrl();
  }, [copyPublicUrl, workspace?.business.business_name, workspace?.storefront?.slug, workspace?.storefront?.storefront_name]);

  return {
    workspace,
    loading,
    saving,
    saveMessage,
    saveError,
    logoUpload,
    bannerUpload,
    load,
    saveSettings,
    uploadMedia,
    updateStatus,
    validateSlug,
    clearSaveFeedback,
    copyPublicUrl,
    sharePublicUrl,
    showFeedback,
    publicUrl: workspace?.storefront?.slug ? storefrontService.getPublicUrl(workspace.storefront.slug) : null,
    publicPath: workspace?.storefront?.slug ? storefrontService.getPublicPath(workspace.storefront.slug) : null,
    previewPath: workspace?.storefront?.slug ? storefrontService.getPreviewPath(workspace.storefront.slug) : null,
  };
}
