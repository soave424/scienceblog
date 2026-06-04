'use client';

import React, { ReactNode, useMemo, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const firebaseValues = useMemo(() => {
    // Check for essential config values
    const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;
    
    if (!hasConfig) {
      if (typeof window !== 'undefined') {
        console.warn("Firebase configuration is incomplete. Authentication and database features will be disabled.");
      }
      return { firebaseApp: null, firestore: null, auth: null };
    }

    try {
      const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const firestore = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      return { firebaseApp, firestore, auth };
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      return { firebaseApp: null, firestore: null, auth: null };
    }
  }, []);

  if (!isMounted) return null;

  return (
    <FirebaseProvider 
      firebaseApp={firebaseValues.firebaseApp as any} 
      firestore={firebaseValues.firestore as any} 
      auth={firebaseValues.auth as any}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
