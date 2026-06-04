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
    // API 키가 없는 경우 초기화를 시도하지 않고 더미 객체를 반환하여 크래시를 방지합니다.
    if (!firebaseConfig.apiKey) {
      console.error("Firebase API Key is missing. Please check your .env file.");
      return { firebaseApp: null, firestore: null, auth: null };
    }

    try {
      const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const firestore = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      return { firebaseApp, firestore, auth };
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      return { firebaseApp: null, firestore: null, auth: null };
    }
  }, []);

  // 초기화에 실패한 경우 최소한의 컨텍스트 제공
  if (!firebaseValues.firebaseApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-primary/20 max-w-md">
          <h1 className="text-2xl font-black text-primary mb-4">탐험 준비 중...</h1>
          <p className="text-muted-foreground font-bold mb-6">
            Firebase 설정이 아직 완료되지 않았습니다.<br/>
            잠시 후 다시 시도해주세요!
          </p>
          <div className="animate-bounce text-4xl">🚀</div>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebaseValues.firebaseApp} 
      firestore={firebaseValues.firestore!} 
      auth={firebaseValues.auth!}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
