
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Sparkles, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "탐험 준비 중...",
        description: "Firebase 설정이 완료되지 않았습니다. 잠시 후 다시 시도해주세요!",
      });
      return;
    }
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: error.message || "구글 로그인 중 문제가 발생했습니다.",
      });
    }
  };

  const handleDemoMode = () => {
    setIsDemoLoading(true);
    toast({
      title: "체험 모드 시작!",
      description: "로그인 없이 탐험을 시작합니다. (저장 기능은 제한될 수 있어요!)",
    });
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden" suppressHydrationWarning>
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-white/20 animate-bounce-subtle">
        <Sparkles size={80} />
      </div>
      <div className="absolute bottom-10 right-10 text-white/20 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
        <BookOpen size={100} />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden" suppressHydrationWarning>
        <CardHeader className="text-center pt-10 pb-6" suppressHydrationWarning>
          <div className="mx-auto h-20 w-20 bg-primary rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl rotate-3 animate-float">
            <BookOpen size={40} />
          </div>
          <CardTitle className="text-3xl font-black text-primary">사이언스 탐험대</CardTitle>
          <CardDescription className="text-lg font-medium text-muted-foreground mt-2">
            오늘도 신비로운 과학의 세계로!<br/>함께 떠나볼까요?
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-12 space-y-4" suppressHydrationWarning>
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full py-8 text-lg font-bold rounded-2xl shadow-lg bg-white text-gray-800 hover:bg-gray-50 border-4 border-gray-100 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            선생님/부모님 계정으로 로그인
          </Button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground font-bold">또는</span></div>
          </div>

          <Button 
            onClick={handleDemoMode}
            disabled={isDemoLoading}
            variant="outline"
            className="w-full py-8 text-lg font-bold rounded-2xl border-4 border-accent/20 bg-accent/5 text-accent hover:bg-accent/10 hover:border-accent transition-transform active:scale-95 flex items-center justify-center gap-3"
          >
            <Rocket className={cn("h-6 w-6", isDemoLoading && "animate-ping")} />
            {isDemoLoading ? "탐험 준비 중..." : "그냥 구경해볼래요!"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-8 font-bold">
            탐험 대원이 되려면 선생님의 도움을 받으세요!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
