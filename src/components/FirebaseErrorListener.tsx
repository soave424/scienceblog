'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error) => {
      // In development, this will be caught by the Next.js error overlay
      // but we also show a toast for better visibility.
      toast({
        variant: "destructive",
        title: "보안 규칙 오류",
        description: "데이터에 접근할 권한이 없습니다. 보안 규칙을 확인해주세요.",
      });
      
      // Throwing the error so it hits the Next.js development overlay
      if (process.env.NODE_ENV === 'development') {
        // We delay the throw slightly to allow the toast to render
        setTimeout(() => {
          throw error;
        }, 100);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  return null;
}
