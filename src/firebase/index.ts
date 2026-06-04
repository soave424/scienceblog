// 배럴 파일 자체에는 'use client'를 붙이지 않습니다. 
// 내보내는 개별 컴포넌트/훅 파일에 이미 'use client'가 붙어 있습니다.

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

// 이 함수는 클라이언트 사이드에서만 호출되어야 합니다.
export function initializeFirebase(): { firebaseApp: FirebaseApp; firestore: Firestore; auth: Auth } {
  const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  return { firebaseApp, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
