import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAc8AQ6PIBzvfnmzN_KUEbwJPGXYyyzxX0",
  authDomain: "pick-em-6b10a.firebaseapp.com",
  projectId: "pick-em-6b10a",
  storageBucket: "pick-em-6b10a.firebasestorage.app",
  messagingSenderId: "776489455293",
  appId: "1:776489455293:web:c26dbaeceff6774da271d4",
  measurementId: "G-JHC9QYGDV4"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | null = null;

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
  auth = {} as Auth;
}

const googleProvider = new GoogleAuthProvider();

export { app, auth, analytics, googleProvider };
