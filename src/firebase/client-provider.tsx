
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
    // API 키가 없어도 앱이 크래시되지 않고 UI를 보여줄 수 있도록 수정
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "") {
      console.warn("Firebase API Key가 설정되지 않았습니다. 로그인 및 데이터 저장 기능이 작동하지 않을 수 있습니다.");
      return { firebaseApp: null, firestore: null, auth: null };
    }

    try {
      const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const firestore = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      return { firebaseApp, firestore, auth };
    } catch (error) {
      console.error("Firebase 초기화 실패:", error);
      return { firebaseApp: null, firestore: null, auth: null };
    }
  }, []);

  // Firebase가 초기화되지 않았더라도 UI(children)를 렌더링하도록 변경 (탭 클릭 가능하게 함)
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
