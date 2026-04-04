# Pick'em

Pick'em is a Vite + React app set up to use Firebase Authentication for sign-in and Convex for app data and storage-backed workflows.

## Local Setup

1. Install dependencies with `npm install`.
2. Copy [.env.example](.env.example) to `.env.local`.
3. Fill in your Firebase web app values and Convex deployment URL.
4. Run `npm run dev` and open `http://localhost:3000`.

## Vercel Setup

1. Import this repo into Vercel.
2. Add every variable from [.env.example](.env.example) in Project Settings -> Environment Variables.
3. Deploy. Vercel will use [vercel.json](vercel.json) to build the Vite app and rewrite SPA routes to `index.html`.

## Firebase Auth Setup

1. In Firebase Console -> Authentication -> Settings -> Authorized domains, add `localhost`, `127.0.0.1`, and your Vercel domain.
2. Keep `VITE_FIREBASE_AUTH_DOMAIN` set to your Firebase web app auth domain unless you have configured a custom auth domain in Firebase. Example: `pick-em-6b10a.firebaseapp.com`.
3. Do not set `VITE_FIREBASE_AUTH_DOMAIN` to Google API hosts such as `identitytoolkit.googleapis.com`.
4. Enable the providers you use, such as Email/Password, Google, and Apple.

## Convex Setup

1. Run `npx convex dev` or `npx convex deploy` against the deployment you want this app to use.
2. Copy the deployment URL into `VITE_CONVEX_URL`.
3. If you use Convex site functions, also set `VITE_CONVEX_SITE_URL`.

## Notes

- `firebase` and `convex` are now declared as app dependencies so Vercel installs them during build.
- The auth screen will surface missing stack configuration instead of failing silently.
