import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { publicEnv, stackConfig } from './env';

const firebaseConfig = publicEnv.firebase;

// Validate required Firebase config
const isFirebaseConfigValid = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | null = null;

if (!isFirebaseConfigValid()) {
  console.error(stackConfig.issues.find((issue) => issue.startsWith('Firebase')) || 'Firebase config is invalid. Please check your environment variables.');
  console.error('API Key present:', !!firebaseConfig.apiKey);
  console.error('Auth domain:', firebaseConfig.authDomain);
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
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
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
