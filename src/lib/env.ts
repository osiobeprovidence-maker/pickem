const readEnv = (value: string | undefined) => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const trimTrailingSlash = (value: string | undefined) => value?.replace(/\/+$/, '');

export const publicEnv = {
  firebase: {
    apiKey: readEnv(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: readEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: readEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: readEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: readEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: readEnv(import.meta.env.VITE_FIREBASE_APP_ID),
    measurementId: readEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
  },
  convex: {
    url: trimTrailingSlash(readEnv(import.meta.env.VITE_CONVEX_URL)),
    siteUrl: trimTrailingSlash(readEnv(import.meta.env.VITE_CONVEX_SITE_URL)),
  },
  appUrl: trimTrailingSlash(readEnv(import.meta.env.VITE_APP_URL)) ?? (typeof window !== 'undefined' ? window.location.origin : undefined),
};

const issues: string[] = [];

if (!publicEnv.firebase.apiKey || !publicEnv.firebase.projectId) {
  issues.push('Firebase is missing `VITE_FIREBASE_API_KEY` or `VITE_FIREBASE_PROJECT_ID`.');
}

if (!publicEnv.convex.url) {
  issues.push('Convex is missing `VITE_CONVEX_URL`.');
}

export const stackConfig = {
  firebaseConfigured: issues.every((issue) => !issue.startsWith('Firebase')),
  convexConfigured: issues.every((issue) => !issue.startsWith('Convex')),
  issues,
};

export const getStackIssue = (service: 'firebase' | 'convex') => {
  const prefix = service === 'firebase' ? 'Firebase' : 'Convex';
  return stackConfig.issues.find((issue) => issue.startsWith(prefix));
};
