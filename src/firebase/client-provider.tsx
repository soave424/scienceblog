'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseValues = useMemo(() => {
    // API 키가 없으면 null을 반환하여 런타임 에러를 방지합니다.
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "") {
      console.warn("Firebase API Key가 설정되지 않았습니다. 인증 및 데이터베이스 기능이 비활성화됩니다.");
      return { firebaseApp: null, firestore: null, auth: null };
    }

    try {
      const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const firestore = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      return { firebaseApp, firestore, auth };
    } catch (error) {
      console.error("Firebase 초기화 중 오류 발생:", error);
      return { firebaseApp: null, firestore: null, auth: null };
    }
  }, []);

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
