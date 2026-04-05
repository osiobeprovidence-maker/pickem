import { firebaseStorageConfigured, uploadFileToFirebaseStorage } from './firebaseStorage';

export type StorefrontMediaKind = 'logo' | 'banner';

export type StorefrontMediaUploadResult = {
  url: string;
  storagePath: string;
  source: 'firebase' | 'local';
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const validateStorefrontImage = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, WEBP, or GIF image.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be 5MB or smaller.');
  }
};

const fileToDataUrl = (file: File, onProgress?: (progress: number) => void) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (!event.total) return;
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const getFileExtension = (file: File) => {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName) return fromName;
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/gif') return 'gif';
  return 'jpg';
};

export const uploadStorefrontMedia = async ({
  businessId,
  file,
  kind,
  onProgress,
}: {
  businessId: string;
  file: File;
  kind: StorefrontMediaKind;
  onProgress?: (progress: number) => void;
}): Promise<StorefrontMediaUploadResult> => {
  validateStorefrontImage(file);

  const extension = getFileExtension(file);
  const storagePath = `storefronts/${businessId}/${kind}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  if (firebaseStorageConfigured) {
    const uploaded = await uploadFileToFirebaseStorage(storagePath, file, onProgress);
    return {
      url: uploaded.url,
      storagePath,
      source: 'firebase',
    };
  }

  const url = await fileToDataUrl(file, onProgress);
  return {
    url,
    storagePath,
    source: 'local',
  };
};
