
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden" suppressHydrationWarning>
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-white/20 animate-bounce-subtle">
        <Sparkles size={80} />
      </div>
      <div className="absolute bottom-10 right-10 text-white/20 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
        <BookOpen size={100} />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="mx-auto h-20 w-20 bg-primary rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl rotate-3">
            <BookOpen size={40} />
          </div>
          <CardTitle className="text-3xl font-black text-primary">사이언스 탐험대</CardTitle>
          <CardDescription className="text-lg font-medium text-muted-foreground mt-2">
            오늘도 신비로운 과학의 세계로!<br/>함께 떠나볼까요?
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-12">
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full py-8 text-lg font-bold rounded-2xl shadow-lg bg-white text-gray-800 hover:bg-gray-50 border-2 border-gray-100 flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            구글로 시작하기
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-8">
            부모님이나 선생님의 도움을 받아 로그인해주세요!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
