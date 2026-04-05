import { getDownloadURL, getStorage, ref, uploadBytesResumable, type UploadTask } from 'firebase/storage';
import { app, firebaseConfigured } from './firebase';
import { publicEnv } from './env';

const storageBucketConfigured = Boolean(publicEnv.firebase.storageBucket);

let storage = null as ReturnType<typeof getStorage> | null;

if (firebaseConfigured && storageBucketConfigured) {
  try {
    storage = getStorage(app);
  } catch (error) {
    console.error('Firebase storage initialization error:', error);
  }
}

export const firebaseStorageConfigured = Boolean(storage);

export const uploadFileToFirebaseStorage = (
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
) => {
  if (!storage) {
    throw new Error('Firebase storage is not configured.');
  }

  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    cacheControl: 'public,max-age=31536000,immutable',
  });

  return new Promise<{ url: string; path: string; task: UploadTask }>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.totalBytes
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          : 0;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({ url, path, task });
        } catch (error) {
          reject(error);
        }
      },
    );
  });
};
