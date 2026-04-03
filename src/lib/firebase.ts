import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate required Firebase config
const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId
  );
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | null = null;

if (!isFirebaseConfigValid()) {
  console.error('Firebase config is invalid. Please check your .env file.');
  console.error('API Key present:', !!firebaseConfig.apiKey);
  console.error('Project ID:', firebaseConfig.projectId);
  // Create dummy objects to prevent crashes
  app = {} as FirebaseApp;
  auth = {
    onAuthStateChanged: () => () => {},
    ...{}
  } as unknown as Auth;
} else {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Analytics is only available in browser
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    app = {} as FirebaseApp;
    auth = {
      onAuthStateChanged: () => () => {},
      ...{}
    } as unknown as Auth;
  }
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export const firebaseConfigured = isFirebaseConfigValid();

export { app, auth, analytics, googleProvider, appleProvider };
