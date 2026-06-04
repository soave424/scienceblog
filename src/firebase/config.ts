/**
 * Firebase configuration object for the client-side SDK.
 * Values are retrieved from environment variables.
 * NEXT_PUBLIC_ prefix is required for Next.js to expose these variables to the client.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Debug helper for development environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (!firebaseConfig.projectId) {
    console.error("Firebase Project ID is missing. Please check your .env file and ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set.");
  }
}
