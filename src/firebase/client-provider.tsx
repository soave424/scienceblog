'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  // 클라이언트 사이드에서 Firebase를 안전하게 초기화합니다.
  const firebaseValues = useMemo(() => {
    const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const firestore = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    return { firebaseApp, firestore, auth };
  }, []);

  return (
    <FirebaseProvider 
      firebaseApp={firebaseValues.firebaseApp} 
      firestore={firebaseValues.firestore} 
      auth={firebaseValues.auth}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
