import { FirebaseError } from 'firebase/app';
import { publicEnv } from './env';

type AuthAction = 'signin' | 'signup' | 'google' | 'apple' | 'reset' | 'password';

const getHostname = () => {
  if (typeof window === 'undefined') return 'localhost';

  return window.location.hostname;
};

const authDomainHint = () => {
  if (!publicEnv.firebase.authDomain) {
    return 'Set `VITE_FIREBASE_AUTH_DOMAIN` to your Firebase auth host, such as `pick-em-6b10a.firebaseapp.com`.';
  }

  return `Current auth domain: \`${publicEnv.firebase.authDomain}\`.`;
};

const socialAuthSetupMessage = (provider: 'Google' | 'Apple') =>
  `${provider} sign-in could not finish. Make sure \`${getHostname()}\` is listed in Firebase Console -> Authentication -> Settings -> Authorized domains, and confirm ${authDomainHint()}`;

export const toFirebaseAuthMessage = (error: unknown, action: AuthAction) => {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : 'Could not continue with authentication.';
  }

  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'The email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email address.';
    case 'auth/weak-password':
      return 'Use a stronger password with at least 8 characters.';
    case 'auth/user-not-found':
      return 'No account was found for that email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts were made. Wait a moment and try again.';
    case 'auth/invalid-api-key':
      return 'The Firebase web API key is invalid. Check `VITE_FIREBASE_API_KEY`.';
    case 'auth/operation-not-allowed':
      if (action === 'google') return 'Google sign-in is not enabled in Firebase Authentication -> Sign-in method.';
      if (action === 'apple') return 'Apple sign-in is not enabled in Firebase Authentication -> Sign-in method.';
      return 'That authentication method is not enabled in Firebase.';
    case 'auth/unauthorized-domain':
      if (action === 'google') return socialAuthSetupMessage('Google');
      if (action === 'apple') return socialAuthSetupMessage('Apple');
      return `This app domain is not authorized for Firebase Auth. Add \`${getHostname()}\` in Firebase Console -> Authentication -> Settings -> Authorized domains.`;
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Allow popups for this site and try again.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before authentication finished.';
    case 'auth/configuration-not-found':
      return `Firebase Auth could not find a valid web configuration. Double-check ${authDomainHint()}`;
    case 'auth/network-request-failed':
      return 'Firebase Auth could not reach Google Identity Toolkit. This is often caused by a VPN, privacy extension, ad blocker, antivirus HTTPS scanning, or a restrictive network/firewall. Disable those temporarily and try again.';
    case 'auth/internal-error':
      if (action === 'google') return socialAuthSetupMessage('Google');
      if (action === 'apple') return socialAuthSetupMessage('Apple');
      return `Firebase Auth hit an internal error. Double-check ${authDomainHint()}`;
    default:
      return error.message || 'Could not continue with authentication.';
  }
};
