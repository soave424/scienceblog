
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Microscope, Sparkles, ArrowRight, Clock, Star, Trophy, Rocket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";

export default function Home() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 샘플 데이터
  const recentLogs = [
    { 
      id: 1, 
      title: "노란 알에서 깨어난 애벌레", 
      date: "2026-06-02", 
      status: "작성 중", 
      image: PlaceHolderImages?.[1]?.imageUrl || "https://picsum.photos/seed/placeholder-1/400/300" 
    },
    { 
      id: 2, 
      title: "강낭콩이 쑤욱! 자랐어요", 
      date: "2026-05-28", 
      status: "완료", 
      image: PlaceHolderImages?.[4]?.imageUrl || "https://picsum.photos/seed/beans/400/300" 
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <Header />
      <main className="container mx-auto py-8 px-4">
        {/* 상단 환영 영역 */}
        <section className="mb-10">
          <div 
            className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-8 rounded-[3rem] shadow-xl border-4 border-primary/20 animate-in fade-in slide-in-from-top-4 duration-700"
            suppressHydrationWarning
          >
            <div className="flex items-center gap-6" suppressHydrationWarning>
              <div className="h-24 w-24 rounded-full border-4 border-accent overflow-hidden shadow-lg bg-accent/20 animate-bounce-subtle">
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div suppressHydrationWarning>
                <h1 className="font-headline text-3xl font-black text-primary mb-1">
                  안녕, {user?.displayName || '꼬마'} 탐험대원!
                </h1>
                <p className="text-muted-foreground font-bold flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent fill-accent" /> 오늘도 신비한 과학의 세계로 떠나볼까?
                </p>
              </div>
            </div>
            <Link href="/write">
              <Button size="lg" className="rounded-[2rem] px-10 py-10 text-2xl font-black shadow-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-transform btn-kid">
                <PenTool className="mr-3 h-8 w-8" />
                일지 쓰러 가기!
              </Button>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* 최근 기록 */}
            <section suppressHydrationWarning>
              <div className="flex items-center justify-between mb-6 px-4">
                <h2 className="font-headline text-2xl font-black flex items-center gap-2 text-primary">
                  <Clock className="h-7 w-7" /> 나의 탐험 일지
                </h2>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-full">모두 보기 <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" suppressHydrationWarning>
                {recentLogs.map((log) => (
                  <Card key={log.id} className="overflow-hidden group hover:shadow-2xl transition-all border-4 border-white shadow-lg rounded-[3rem] bg-white" suppressHydrationWarning>
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={log.image}
                        alt={log.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        data-ai-hint="butterfly nature"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={cn(
                          "px-5 py-2 rounded-full text-sm font-black shadow-md",
                          log.status === "작성 중" ? "bg-accent text-accent-foreground" : "bg-primary text-white"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-black text-primary group-hover:text-accent transition-colors">{log.title}</CardTitle>
                      <CardDescription className="font-bold">{log.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <Link href="/write">
                        <Button variant="outline" className="w-full rounded-2xl py-6 font-bold border-2 border-primary/20 hover:bg-primary/5 hover:border-primary">다시 열어보기</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 오늘의 미션 */}
            <section 
              className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-[4rem] p-10 shadow-lg border-4 border-accent/20 relative overflow-hidden group"
              suppressHydrationWarning
            >
              <div className="absolute -right-10 -top-10 text-accent/10 group-hover:rotate-45 transition-transform duration-1000">
                <Rocket size={250} />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="p-6 bg-accent rounded-[2.5rem] text-accent-foreground shadow-2xl animate-float">
                  <Rocket className="h-14 w-14" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-headline text-3xl font-black mb-3 text-primary">오늘의 비밀 임무!</h3>
                  <p className="text-xl font-bold text-muted-foreground mb-8">
                    나비 번데기의 색깔을 관찰하고,<br/><span className="text-accent underline decoration-4 underline-offset-4">진짜 사실</span>을 3개만 적어보세요!
                  </p>
                  <Link href="/butterfly">
                    <Button className="rounded-[2rem] px-10 py-8 text-xl font-black bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl hover:scale-105 transition-transform btn-kid">탐험 시작!</Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* 사이드바 */}
          <aside className="space-y-8" suppressHydrationWarning>
            <Card className="border-4 border-primary/10 shadow-xl overflow-hidden rounded-[3rem] bg-white" suppressHydrationWarning>
              <CardHeader className="bg-primary p-8 text-white text-center" suppressHydrationWarning>
                <CardTitle className="text-2xl font-black flex items-center justify-center gap-2">
                  <Trophy className="h-8 w-8 text-accent animate-pulse" /> 훌륭한 탐험가
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-2 bg-muted/50 p-6 rounded-[2.5rem]" suppressHydrationWarning>
                    <span className="font-bold text-muted-foreground">내가 찾은 비밀</span>
                    <span className="font-black text-4xl text-primary">12개</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2" suppressHydrationWarning>
                      <span className="font-bold text-muted-foreground text-lg">성장 에너지</span>
                      <span className="font-black text-2xl text-accent">85%</span>
                    </div>
                    <div className="h-6 w-full bg-muted rounded-full overflow-hidden border-4 border-white shadow-inner">
                      <div className="h-full bg-accent w-[85%] rounded-full transition-all duration-1000" />
                    </div>
                    <p className="text-sm font-bold text-center text-primary mt-4 bg-primary/5 py-3 rounded-2xl border border-primary/10" suppressHydrationWarning>
                      진짜 과학자가 다 되었네요! 👏
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-accent/10 shadow-xl rounded-[3.5rem] bg-white p-4" suppressHydrationWarning>
              <CardHeader className="p-6 pb-2 text-center" suppressHydrationWarning>
                <CardTitle className="text-xl font-black text-primary">비밀 도구 상자</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-4">
                <Link href="/practice" className="flex items-center gap-5 p-6 rounded-[2.5rem] bg-secondary/50 hover:bg-secondary transition-all group border-2 border-transparent hover:border-primary/20">
                  <div className="bg-primary p-4 rounded-2xl text-white group-hover:rotate-12 transition-transform">
                    <Microscope className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-primary">사실 판별기</p>
                    <p className="text-sm font-bold text-muted-foreground">진짜 사실일까?</p>
                  </div>
                </Link>
                <Link href="/butterfly" className="flex items-center gap-5 p-6 rounded-[2.5rem] bg-accent/10 hover:bg-accent/20 transition-all group border-2 border-transparent hover:border-accent/20">
                  <div className="bg-accent p-4 rounded-2xl text-accent-foreground group-hover:rotate-12 transition-transform">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-accent-foreground">나비 탐험관</p>
                    <p className="text-sm font-bold text-muted-foreground">나비의 비밀!</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
